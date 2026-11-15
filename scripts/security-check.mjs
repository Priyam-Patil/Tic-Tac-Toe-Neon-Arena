import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import path from 'node:path';

// Report locations and categories only. Never print a possible credential value.
const git = (...args) => execFileSync('git', args, { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 });
const signatures = [
  ['private-key', /-----BEGIN (?:RSA |EC |OPENSSH |DSA |ENCRYPTED )?PRIVATE KEY-----/g],
  ['github-token', /\b(?:gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{40,})\b/g],
  ['cloud-access-key', /\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/g],
  ['provider-secret', /\b(?:sk_live_|sk_test_|sk-proj-|xox[baprs]-)[A-Za-z0-9_-]{20,}\b/g],
  ['embedded-credential-url', /https?:\/\/[^\s/:@]+:[^\s/@]{8,}@[^\s/]+/g],
  ['assigned-secret', /\b(?:api[_-]?key|access[_-]?token|auth[_-]?token|client[_-]?secret|password)\s*[=:]\s*['"]([^'"\r\n]{12,})['"]/gi],
];
const privatePath = /(?:^|\/)(?:\.env(?:\..+)?|\.npmrc|credentials\.json|service-account[^/]*\.json|id_rsa[^/]*|id_ed25519[^/]*|[^/]+\.(?:pem|key|p12|pfx|jks))$/i;
const binary = /\.(?:pdf|png|jpe?g|gif|webp|ico|woff2?|ttf|zip|mp[34])$/i;
const findings = [];
let textFiles = 0;
const inspected = new Set();

function scan(label, contents) {
  if (contents.includes('\0')) return;
  textFiles++;
  for (const [category, expression] of signatures) {
    expression.lastIndex = 0;
    for (const match of contents.matchAll(expression)) {
      const value = match[1] ?? match[0];
      if (/example|placeholder|your[-_ ]|dummy|changeme|<|>|\(\?:|\\[bws]/i.test(value)) continue;
      findings.push({ location: label, line: contents.slice(0, match.index).split('\n').length, category });
    }
  }
}

const stagedOnly = process.argv.includes('--staged');
const files = git(...(stagedOnly ? ['ls-files', '-z'] : ['ls-files', '--cached', '--others', '--exclude-standard', '-z']))
  .split('\0').filter(Boolean);
for (const filename of new Set(files)) {
  const normalized = filename.replaceAll('\\', '/');
  if (normalized === '.env.example') {
    // Examples are allowed, but their contents are still checked.
  } else if (privatePath.test(normalized) || /(?:^|\/)(?:node_modules|\.vercel|\.git)\//.test(normalized)) {
    findings.push({ location: normalized, category: 'private-or-generated-path' });
  }
  if (binary.test(filename)) continue;
  try { scan(normalized, stagedOnly ? git('show', `:${normalized}`) : readFileSync(filename, 'utf8')); }
  catch { findings.push({ location: normalized, category: 'unreadable-file' }); }
}

let commits = [];
try { commits = git('rev-list', '--all').trim().split('\n').filter(Boolean); } catch { /* Unborn repository. */ }
for (const commit of commits) {
  const entries = git('ls-tree', '-r', '-z', commit).split('\0').filter(Boolean);
  for (const entry of entries) {
    const [metadata, filename] = entry.split('\t');
    const objectId = metadata.split(' ')[2];
    if (!filename || binary.test(filename)) continue;
    if (privatePath.test(filename) && path.basename(filename) !== '.env.example') findings.push({ location: `${commit.slice(0, 12)}:${filename}`, category: 'private-path-in-history' });
    if (inspected.has(objectId)) continue;
    inspected.add(objectId);
    scan(`${commit.slice(0, 12)}:${filename}`, git('cat-file', '-p', objectId));
  }
}

console.log(JSON.stringify({ scope: stagedOnly ? 'index-and-all-local-history' : 'worktree-and-all-local-history', files: files.length, textFiles, historyCommits: commits.length, findings }, null, 2));
if (findings.length) process.exitCode = 1;

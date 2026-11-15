import assert from 'node:assert/strict';

const base = new URL(process.argv[2] ?? 'http://127.0.0.1:4173/');
assert(['http:', 'https:'].includes(base.protocol), 'Use an HTTP(S) application URL.');
const response = await fetch(base);
assert.equal(response.status, 200, 'Application document must load.');
const html = await response.text();
assert(html.includes('Tic Tac Toe'), 'Application title must be present.');
assert(html.includes('id="root"'), 'React root must be present.');
const headers = Object.fromEntries(['content-security-policy', 'x-content-type-options', 'x-frame-options', 'referrer-policy', 'permissions-policy'].map(name => [name, response.headers.get(name)]));
assert.equal(headers['x-content-type-options'], 'nosniff');
assert.equal(headers['x-frame-options'], 'DENY');
assert(headers['content-security-policy']?.includes("script-src 'self'"));
assert(headers['content-security-policy']?.includes("object-src 'none'"));
assert(headers['content-security-policy']?.includes("frame-ancestors 'none'"));
assert(headers['referrer-policy']);
assert(headers['permissions-policy']?.includes('microphone=()'));
const paths = [...html.matchAll(/(?:src|href)="([^"#]+)"/g)].map(match => match[1]);
assert(paths.some(path => path.endsWith('.js')), 'A production JavaScript asset is required.');
assert(paths.some(path => path.endsWith('.css')), 'A stylesheet asset is required.');
const assets = [];
for (const path of [...new Set(paths)]) {
  const url = new URL(path, base);
  assert.equal(url.origin, base.origin, 'Application assets must use the same origin.');
  const asset = await fetch(url);
  assert.equal(asset.status, 200, `Asset must load: ${path}`);
  const type = asset.headers.get('content-type');
  if (path.endsWith('.js')) assert(type?.includes('javascript'));
  if (path.endsWith('.css')) assert(type?.includes('css'));
  assets.push({ path, status: asset.status, contentType: type });
}
console.log(JSON.stringify({ url: base.href, documentStatus: response.status, headers, assets, result: 'PASS' }, null, 2));

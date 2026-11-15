import { boardFrom, opposite, outcome, play, undoMoves } from './logic';
import type { Difficulty, Mark, Mode, Move } from './logic';

export const STORAGE_KEY = 'neon-arena:v1';
export interface Preferences {
  names: [string, string]; mode: Mode; difficulty: Difficulty; human: Mark;
  first: Mark; sound: boolean; music: boolean; theme: 'dark' | 'light'; animations: boolean;
}
export interface Result {
  id: string; at: string; winner: Mark | null; names: [string, string];
  mode: Mode; difficulty: Difficulty; human: Mark; moves: Move[];
}
export interface Session {
  id: string; round: number; moves: Move[]; config: Preferences;
  scores: { X: number; O: number; draws: number };
}
export interface Stats { wins: number; losses: number; draws: number; streak: number; best: number }
export interface AppState {
  version: 1; prefs: Preferences; session: Session; stats: Stats; history: Result[];
}
export const defaultPrefs: Preferences = {
  names: ['Player One', 'Player Two'], mode: 'ai', difficulty: 'medium', human: 'X',
  first: 'X', sound: true, music: false, theme: 'light', animations: true,
};
const zeroStats = (): Stats => ({ wins: 0, losses: 0, draws: 0, streak: 0, best: 0 });
export const makeSession = (config: Preferences, id: string): Session => ({
  id, round: 1, moves: [], config: { ...config, names: [...config.names] }, scores: { X: 0, O: 0, draws: 0 },
});
export const initialState = (): AppState => ({
  version: 1, prefs: { ...defaultPrefs, names: [...defaultPrefs.names] },
  session: makeSession(defaultPrefs, 'opening'), stats: zeroStats(), history: [],
});
export function playerName(config: Preferences, mark: Mark): string {
  if (config.mode === 'ai') return mark === config.human ? config.names[0] : 'Neon AI';
  return config.names[mark === 'X' ? 0 : 1];
}
export function turnOf(session: Session): Mark {
  return session.moves.length % 2 === 0 ? session.config.first : opposite(session.config.first);
}
export type Action =
  | { type: 'MOVE'; index: number; mark: Mark; roundId: string; at: string }
  | { type: 'PREFS'; prefs: Partial<Preferences> }
  | { type: 'START'; id: string; quick?: boolean }
  | { type: 'NEXT' }
  | { type: 'RESTART' }
  | { type: 'UNDO' }
  | { type: 'RESET_SCORES'; id: string }
  | { type: 'RESET_STATS' };
export const roundId = (session: Session) => `${session.id}:${session.round}`;
export function reducer(state: AppState, action: Action): AppState {
  const { session } = state;
  switch (action.type) {
    case 'PREFS': return { ...state, prefs: { ...state.prefs, ...action.prefs } };
    case 'START': {
      const prefs = action.quick ? { ...state.prefs, mode: 'ai' as const, human: 'X' as const, first: 'X' as const, difficulty: 'medium' as const } : state.prefs;
      return { ...state, prefs, session: makeSession(prefs, action.id) };
    }
    case 'NEXT':
    case 'RESTART': return { ...state, session: { ...session, moves: [], round: session.round + 1 } };
    case 'RESET_SCORES': return { ...state, session: makeSession(session.config, action.id) };
    case 'RESET_STATS': return { ...state, stats: zeroStats(), history: [] };
    case 'UNDO': {
      const result = outcome(boardFrom(session.moves));
      if (result.winner || result.draw) return state;
      const moves = undoMoves(session.moves, session.config.mode, session.config.human);
      return { ...state, session: { ...session, moves } };
    }
    case 'MOVE': {
      if (action.roundId !== roundId(session) || action.mark !== turnOf(session)) return state;
      const board = play(boardFrom(session.moves), action.index, action.mark);
      if (!board) return state;
      const moves = [...session.moves, { index: action.index, mark: action.mark }];
      const result = outcome(board);
      const updated = { ...session, moves };
      if (!result.winner && !result.draw) return { ...state, session: updated };
      const id = roundId(session);
      if (state.history.some(item => item.id === id)) return state;
      const win = result.winner === (session.config.mode === 'ai' ? session.config.human : 'X');
      const streak = win ? state.stats.streak + 1 : 0;
      const record: Result = {
        id, at: action.at, winner: result.winner,
        names: [playerName(session.config, 'X'), playerName(session.config, 'O')],
        mode: session.config.mode, difficulty: session.config.difficulty, human: session.config.human, moves,
      };
      return {
        ...state,
        session: { ...updated, scores: { ...session.scores, [result.winner ?? 'draws']: session.scores[result.winner ?? 'draws'] + 1 } },
        stats: { wins: state.stats.wins + Number(win), losses: state.stats.losses + Number(Boolean(result.winner) && !win), draws: state.stats.draws + Number(result.draw), streak, best: Math.max(streak, state.stats.best) },
        history: [record, ...state.history].slice(0, 100),
      };
    }
  }
}

const object = (value: unknown): value is Record<string, unknown> => !!value && typeof value === 'object';
const count = (v: unknown): v is number => Number.isSafeInteger(v) && (v as number) >= 0;
const mark = (v: unknown): v is Mark => v === 'X' || v === 'O';
const difficulty = (v: unknown): v is Difficulty => ['easy', 'medium', 'hard'].includes(v as string);
function validPrefs(p: unknown): p is Preferences {
  return object(p) && Array.isArray(p.names) && p.names.length === 2 && p.names.every(n => typeof n === 'string' && n.trim().length > 0 && n.length <= 20)
    && (p.mode === 'ai' || p.mode === 'local') && difficulty(p.difficulty) && mark(p.human) && mark(p.first)
    && typeof p.sound === 'boolean' && typeof p.music === 'boolean' && (p.theme === 'dark' || p.theme === 'light')
    && (p.animations === undefined || typeof p.animations === 'boolean');
}
function validMoves(value: unknown, first: Mark): value is Move[] {
  if (!Array.isArray(value) || value.length > 9) return false;
  let board = boardFrom([]), turn = first;
  for (const move of value) {
    if (!object(move) || move.mark !== turn || typeof move.index !== 'number') return false;
    const next = play(board, move.index, turn);
    if (!next) return false;
    board = next; turn = opposite(turn);
  }
  return true;
}
function validResult(r: unknown): r is Result {
  if (!object(r) || typeof r.id !== 'string' || typeof r.at !== 'string' || !Number.isFinite(Date.parse(r.at))
    || !(r.winner === null || mark(r.winner)) || !Array.isArray(r.names) || r.names.length !== 2
    || !r.names.every(n => typeof n === 'string' && n.length <= 20) || (r.mode !== 'ai' && r.mode !== 'local')
    || !difficulty(r.difficulty) || !mark(r.human) || !Array.isArray(r.moves) || !r.moves.length) return false;
  if (!object(r.moves[0]) || !mark(r.moves[0].mark) || !validMoves(r.moves, r.moves[0].mark)) return false;
  const result = outcome(boardFrom(r.moves));
  return (Boolean(result.winner) || result.draw) && result.winner === r.winner;
}
export function loadState(storage?: Pick<Storage, 'getItem'>): AppState {
  const fallback = initialState();
  try {
    storage ??= window.localStorage;
    const raw: unknown = JSON.parse(storage.getItem(STORAGE_KEY) ?? 'null');
    if (!object(raw) || raw.version !== 1) return fallback;
    // Add new preferences without discarding existing v1 themes, games, or statistics.
    if (validPrefs(raw.prefs)) fallback.prefs = { ...defaultPrefs, ...raw.prefs };
    if (object(raw.stats) && ['wins', 'losses', 'draws', 'streak', 'best'].every(k => count((raw.stats as Record<string, unknown>)[k]))
      && (raw.stats.best as number) >= (raw.stats.streak as number) && (raw.stats.wins as number) >= (raw.stats.best as number)) fallback.stats = raw.stats as unknown as Stats;
    if (Array.isArray(raw.history)) fallback.history = raw.history.filter(validResult).filter((r, i, all) => all.findIndex(item => item.id === r.id) === i).slice(0, 100);
    const s = raw.session;
    if (object(s) && typeof s.id === 'string' && count(s.round) && s.round > 0 && validPrefs(s.config)
      && validMoves(s.moves, s.config.first) && object(s.scores) && ['X', 'O', 'draws'].every(k => count((s.scores as Record<string, unknown>)[k]))) {
      fallback.session = { ...(s as unknown as Session), config: { ...defaultPrefs, ...s.config } };
    }
    else fallback.session = makeSession(fallback.prefs, fallback.history.length ? `recovered-${crypto.randomUUID()}` : 'opening');
    return fallback;
  } catch { return fallback; }
}
export function saveState(state: AppState, storage?: Pick<Storage, 'setItem'>): boolean {
  try { (storage ?? window.localStorage).setItem(STORAGE_KEY, JSON.stringify(state)); return true; } catch { return false; }
}

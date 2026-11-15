import { describe, expect, it } from 'vitest';
import { initialState, loadState, reducer, roundId, saveState, STORAGE_KEY, turnOf } from './store';
import type { AppState } from './store';
import type { Mark } from './logic';

function move(state: AppState, index: number, mark: Mark = turnOf(state.session)) {
  return reducer(state, { type: 'MOVE', index, mark, roundId: roundId(state.session), at: '2026-11-15T07:30:00Z' });
}
function localState() { let state = initialState(); state = reducer(state, { type: 'PREFS', prefs: { mode: 'local' } }); return reducer(state, { type: 'START', id: 'test' }); }
function wonState() { return [0, 3, 1, 4, 2].reduce((s, i) => move(s, i), localState()); }

describe('state and scoring', () => {
  it('switches turns and rejects duplicate or out-of-turn actions', () => {
    const state = localState(); const next = move(state, 0);
    expect(turnOf(next.session)).toBe('O');
    expect(move(next, 1, 'X')).toBe(next); expect(move(next, 0)).toBe(next);
  });
  it('supports O as the first player', () => {
    const state = reducer(reducer(initialState(), { type: 'PREFS', prefs: { first: 'O' } }), { type: 'START', id: 'o-start' });
    expect(turnOf(state.session)).toBe('O'); expect(turnOf(move(state, 0).session)).toBe('X');
  });
  it('scores a completed round exactly once and prevents post-game moves', () => {
    const state = wonState(); expect(state.session.scores.X).toBe(1); expect(state.stats).toEqual({ wins: 1, losses: 0, draws: 0, streak: 1, best: 1 });
    expect(state.history).toHaveLength(1); expect(move(state, 5)).toBe(state);
    expect(reducer(state, { type: 'UNDO' })).toBe(state);
  });
  it('scores draws and tracks losses from the human perspective', () => {
    let state = [0, 1, 2, 4, 3, 5, 7, 6, 8].reduce((s, i) => move(s, i), localState());
    expect(state.stats.draws).toBe(1); expect(state.session.scores.draws).toBe(1); expect(state.stats.streak).toBe(0);
    state = reducer(initialState(), { type: 'PREFS', prefs: { human: 'O' } }); state = reducer(state, { type: 'START', id: 'ai' });
    state = [0, 3, 1, 4, 2].reduce((s, i) => move(s, i), state);
    expect(state.stats.losses).toBe(1); expect(state.stats.wins).toBe(0);
  });
  it('restarts a board, retains scores, and rejects a stale AI response', () => {
    const state = wonState(); const next = reducer(state, { type: 'RESTART' });
    expect(next.session.moves).toEqual([]); expect(next.session.scores.X).toBe(1);
    expect(reducer(next, { type: 'MOVE', index: 5, mark: 'X', roundId: roundId(state.session), at: '' })).toBe(next);
  });
  it('undo cancels the AI turn and rejects a queued response', () => {
    let state = move(initialState(), 0); state = reducer(state, { type: 'UNDO' });
    expect(state.session.moves).toHaveLength(0); expect(move(state, 4, 'O')).toBe(state);
    state = move(move(initialState(), 0), 4); state = reducer(state, { type: 'UNDO' }); expect(state.session.moves).toHaveLength(0);
  });
  it('resets match scores independently from lifetime statistics', () => {
    const state = reducer(wonState(), { type: 'RESET_SCORES', id: 'fresh' });
    expect(state.session.scores).toEqual({ X: 0, O: 0, draws: 0 }); expect(state.stats.wins).toBe(1); expect(state.history).toHaveLength(1);
    const cleared = reducer(state, { type: 'RESET_STATS' }); expect(cleared.history).toEqual([]); expect(cleared.stats.wins).toBe(0);
  });
  it('tracks a streak across rounds and preserves best after a loss', () => {
    let state = wonState(); state = reducer(state, { type: 'NEXT' }); state = [0, 3, 1, 4, 2].reduce((s, i) => move(s, i), state);
    expect(state.stats.streak).toBe(2); state = reducer(state, { type: 'NEXT' }); state = [0, 3, 1, 4, 8, 5].reduce((s, i) => move(s, i), state);
    expect(state.stats.streak).toBe(0); expect(state.stats.best).toBe(2); expect(state.stats.losses).toBe(1);
  });
  it('quick play uses immediate default gameplay settings', () => {
    let state = reducer(initialState(), { type: 'PREFS', prefs: { mode: 'local', human: 'O', first: 'O', difficulty: 'hard' } });
    state = reducer(state, { type: 'START', id: 'quick', quick: true });
    expect(state.session.config).toMatchObject({ mode: 'ai', human: 'X', first: 'X', difficulty: 'medium' });
  });
});

describe('versioned device storage', () => {
  it('round-trips preferences, active board, scores, statistics and history', () => {
    const state = reducer(wonState(), { type: 'PREFS', prefs: { sound: false, music: true, theme: 'light', difficulty: 'hard', names: ['Alex', 'Sam'] } });
    expect(saveState(state)).toBe(true); expect(loadState()).toEqual(state);
    const reloaded = loadState(); expect(move(reloaded, 6)).toBe(reloaded); expect(reloaded.stats.wins).toBe(1);
  });
  it('restores an in-progress round without awarding a result', () => {
    const state = move(initialState(), 0); saveState(state); expect(loadState().session.moves).toEqual(state.session.moves); expect(loadState().history).toEqual([]);
  });
  it('rejects malformed, unsupported and incorrectly typed data', () => {
    for (const raw of ['{bad', 'null', '{"version":9}', '{"version":1,"prefs":{"sound":"true"},"stats":{"wins":-1},"history":[null]}']) {
      localStorage.setItem(STORAGE_KEY, raw); expect(loadState()).toEqual(initialState());
    }
  });
  it('rejects impossible saved boards and invalid result records', () => {
    const bad = initialState(); bad.session.moves = [{ index: 0, mark: 'X' }, { index: 0, mark: 'O' }];
    saveState(bad); expect(loadState().session.moves).toEqual([]);
    const state = wonState(); localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, history: [{ ...state.history[0], winner: 'O' }] }));
    expect(loadState().history).toEqual([]);
  });
  it('handles blocked storage and quota errors gracefully', () => {
    expect(loadState({ getItem: () => { throw Error('blocked'); } })).toEqual(initialState());
    expect(saveState(initialState(), { setItem: () => { throw Error('quota'); } })).toBe(false);
  });
});

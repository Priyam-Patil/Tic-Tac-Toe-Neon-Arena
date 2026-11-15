import { describe, expect, it } from 'vitest';
import { aiMove, available, bestMove, boardFrom, emptyBoard, LINES, opposite, outcome, play, undoMoves } from './logic';
import type { Board, Difficulty, Mark } from './logic';

describe('game rules', () => {
  for (const mark of ['X', 'O'] as Mark[]) {
    LINES.forEach(line => it(`detects ${mark} winning on ${line.join('-')}`, () => {
      const board = emptyBoard(); line.forEach(i => { board[i] = mark; });
      expect(outcome(board)).toEqual({ winner: mark, line, draw: false });
    }));
  }
  it('detects a full-board draw, but does not call a full-board win a draw', () => {
    expect(outcome(['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X']).draw).toBe(true);
    expect(outcome(['X', 'O', 'X', 'O', 'X', 'O', 'X', 'O', 'X'])).toMatchObject({ winner: 'X', draw: false });
  });
  it('does not declare an unfinished board a draw', () => expect(outcome(emptyBoard()).draw).toBe(false));
  it('rejects occupied, out-of-bounds, fractional, and post-game moves', () => {
    const board = emptyBoard(); board[0] = 'X';
    for (const i of [0, -1, 9, NaN, 1.5]) expect(play(board, i, 'O')).toBeNull();
    expect(play(['X', 'X', 'X', null, null, null, null, null, null], 4, 'O')).toBeNull();
    expect(play(['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X'], 0, 'O')).toBeNull();
  });
  it('applies a valid move immutably', () => {
    const board = emptyBoard(); expect(play(board, 4, 'X')?.[4]).toBe('X'); expect(board[4]).toBeNull();
  });
  it('undoes one local move or a complete human-and-AI turn', () => {
    const moves = [{ index: 0, mark: 'X' as Mark }, { index: 4, mark: 'O' as Mark }];
    expect(undoMoves(moves, 'local', 'X')).toEqual(moves.slice(0, 1));
    expect(undoMoves(moves, 'ai', 'X')).toEqual([]);
    expect(undoMoves(moves.slice(0, 1), 'ai', 'X')).toEqual([]);
    expect(undoMoves(moves.slice(0, 1), 'ai', 'O')).toEqual(moves.slice(0, 1));
  });
});

describe('AI opponents', () => {
  for (const level of ['easy', 'medium', 'hard'] as Difficulty[]) {
    it(`${level} returns only legal moves on every reachable board`, () => {
      const seen = new Set<string>();
      const visit = (board: Board, turn: Mark) => {
        const key = board.map(c => c ?? '-').join('') + turn; if (seen.has(key)) return; seen.add(key);
        const result = outcome(board);
        const next = aiMove(board, turn, level, () => 0.7);
        if (result.winner || result.draw) { expect(next).toBeNull(); return; }
        expect(next).not.toBeNull(); expect(board[next!]).toBeNull();
        for (const i of available(board)) visit(play(board, i, turn)!, opposite(turn));
      };
      visit(emptyBoard(), 'X');
    }, 30000);
  }
  it('medium takes a win before blocking and blocks immediate threats', () => {
    expect(aiMove(['O', 'O', null, 'X', 'X', null, null, null, null], 'O', 'medium')).toBe(2);
    expect(aiMove(['X', 'X', null, null, 'O', null, null, null, null], 'O', 'medium')).toBe(2);
  });
  for (const first of ['X', 'O'] as Mark[]) for (const human of ['X', 'O'] as Mark[]) {
    it(`hard never loses against any human sequence (first ${first}, human ${human})`, () => {
      let terminals = 0;
      const visit = (board: Board, turn: Mark) => {
        const result = outcome(board);
        if (result.winner || result.draw) { expect(result.winner).not.toBe(human); terminals++; return; }
        const moves = turn === human ? available(board) : [bestMove(board, turn)!];
        for (const index of moves) visit(play(board, index, turn)!, opposite(turn));
      };
      visit(emptyBoard(), first); expect(terminals).toBeGreaterThan(0);
    }, 30000);
  }
  it('builds a board from recorded moves', () => expect(boardFrom([{ index: 8, mark: 'O' }])[8]).toBe('O'));
});

export type Mark = 'X' | 'O';
export type Board = (Mark | null)[];
export type Difficulty = 'easy' | 'medium' | 'hard';
export type Mode = 'ai' | 'local';
export interface Move { index: number; mark: Mark }
export const LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6],
];
export const opposite = (mark: Mark): Mark => mark === 'X' ? 'O' : 'X';
export const emptyBoard = (): Board => Array<null>(9).fill(null);
export function outcome(board: Board): { winner: Mark | null; line: number[]; draw: boolean } {
  for (const line of LINES) {
    const mark = board[line[0]];
    if (mark && line.every(i => board[i] === mark)) return { winner: mark, line, draw: false };
  }
  return { winner: null, line: [], draw: board.every(Boolean) };
}
export function boardFrom(moves: Move[]): Board {
  const board = emptyBoard();
  moves.forEach(move => { board[move.index] = move.mark; });
  return board;
}
export function play(board: Board, index: number, mark: Mark): Board | null {
  if (!Number.isInteger(index) || index < 0 || index > 8 || board[index] || outcome(board).winner || outcome(board).draw) return null;
  return board.map((cell, i) => i === index ? mark : cell);
}
export const available = (board: Board) => board.flatMap((cell, i) => cell === null ? [i] : []);

// Negamax uses symmetry-independent board caching. Scores are relative to the current player.
function solve(board: Board, turn: Mark, cache: Map<string, number>): number {
  const result = outcome(board);
  if (result.winner) return result.winner === turn ? 10 + available(board).length : -10 - available(board).length;
  if (result.draw) return 0;
  const key = board.map(c => c ?? '-').join('') + turn;
  const cached = cache.get(key);
  if (cached !== undefined) return cached;
  let best = -Infinity;
  for (const i of available(board)) {
    const next = [...board]; next[i] = turn;
    best = Math.max(best, -solve(next, opposite(turn), cache));
  }
  cache.set(key, best);
  return best;
}
export function bestMove(board: Board, turn: Mark): number | null {
  if (outcome(board).winner || outcome(board).draw) return null;
  const cache = new Map<string, number>();
  let best = -Infinity, chosen: number | null = null;
  // Prefer the center, then corners when several moves have equal value.
  for (const i of [4, 0, 2, 6, 8, 1, 3, 5, 7].filter(i => !board[i])) {
    const next = [...board]; next[i] = turn;
    const score = -solve(next, opposite(turn), cache);
    if (score > best) { best = score; chosen = i; }
  }
  return chosen;
}
export function aiMove(board: Board, turn: Mark, difficulty: Difficulty, random = Math.random): number | null {
  if (outcome(board).winner || outcome(board).draw) return null;
  const moves = available(board);
  const randomMove = () => moves[Math.min(moves.length - 1, Math.floor(Math.max(0, random()) * moves.length))];
  if (difficulty === 'easy') return randomMove();
  if (difficulty === 'medium') {
    for (const target of [turn, opposite(turn)]) {
      for (const i of moves) {
        const next = [...board]; next[i] = target;
        if (outcome(next).winner === target) return i;
      }
    }
    return random() < 0.55 ? bestMove(board, turn) : randomMove();
  }
  return bestMove(board, turn);
}
export function undoMoves(moves: Move[], mode: Mode, human: Mark): Move[] {
  if (mode === 'local') return moves.slice(0, -1);
  const lastHuman = moves.findLastIndex(move => move.mark === human);
  return lastHuman < 0 ? moves : moves.slice(0, lastHuman);
}

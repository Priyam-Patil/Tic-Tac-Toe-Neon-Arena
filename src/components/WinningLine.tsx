import { motion } from 'motion/react';
import type { Mark } from '../game/logic';
import { useMinimalMotion } from './AnimationContext';

export function WinningLine({ cells, winner }: { cells: number[]; winner: Mark }) {
  const minimal = useMinimalMotion();
  if (cells.length !== 3) return null;
  const point = (index: number) => ({ x: index % 3 * 100 + 50, y: Math.floor(index / 3) * 100 + 50 });
  const start = point(cells[0]), end = point(cells[2]);
  return <svg className={`winning-line line-${winner.toLowerCase()}`} viewBox="0 0 300 300" aria-hidden="true" data-testid="winning-line">
    <motion.line x1={start.x} y1={start.y} x2={end.x} y2={end.y}
      initial={minimal ? false : { pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: minimal ? 0 : 0.5, delay: minimal ? 0 : 0.18 }} />
  </svg>;
}

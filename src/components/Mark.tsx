import { motion } from 'motion/react';
import type { Mark as MarkType } from '../game/logic';
import { useMinimalMotion } from './AnimationContext';

export function Mark({ value, small = false }: { value: MarkType; small?: boolean }) {
  const minimal = useMinimalMotion();
  return <svg viewBox="0 0 80 80" fill="none" className={`mark mark-${value.toLowerCase()} ${small ? 'mark-small' : ''}`} aria-hidden="true">
    {value === 'X' ? <>
      <motion.path d="M23 23L57 57" initial={minimal ? false : { pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: minimal ? 0 : 0.23 }} />
      <motion.path d="M57 23L23 57" initial={minimal ? false : { pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: minimal ? 0 : 0.23, delay: minimal ? 0 : 0.08 }} />
    </> : <motion.circle cx="40" cy="40" r="24" initial={minimal ? false : { pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: minimal ? 0 : 0.35 }} />}
  </svg>;
}

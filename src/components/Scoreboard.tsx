import { AnimatePresence, motion } from 'motion/react';
import { Equal } from 'lucide-react';
import type { Mark as MarkType } from '../game/logic';
import { playerName } from '../game/store';
import type { Session } from '../game/store';
import { Mark } from './Mark';
import { useMinimalMotion } from './AnimationContext';

const initials = (name: string) => name.trim().split(/\s+/).slice(0, 2).map(word => [...word][0]).join('').toLocaleUpperCase();

export function Scoreboard({ session, turn, finished, thinking }: { session: Session; turn: MarkType; finished: boolean; thinking: boolean }) {
  const minimal = useMinimalMotion();
  return <div className="scoreboard" aria-label="Match scoreboard">
    {(['X', 'draws', 'O'] as const).map(key => {
      const name = key === 'draws' ? 'Draws' : playerName(session.config, key);
      const active = key !== 'draws' && turn === key && !finished;
      const human = session.config.mode === 'ai' && key === session.config.human;
      return <div key={key} className={`score-card ${key === 'draws' ? 'draw-score' : `player-score player-${key.toLowerCase()}`} ${active ? `score-active-${key.toLowerCase()}` : ''}`}>
        {key === 'draws' ? <span className="draw-avatar"><Equal size={19} /></span> : <span className="player-avatar" aria-hidden="true">{initials(name)}<span><Mark value={key} small /></span></span>}
        <div className="score-label" title={name}><span>{name}</span>{human && <small>YOU</small>}</div>
        <AnimatePresence mode="popLayout"><motion.strong key={session.scores[key]} initial={minimal ? false : { y: -8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: minimal ? 0 : 0.2 }}>{String(session.scores[key]).padStart(2, '0')}</motion.strong></AnimatePresence>
        {key !== 'draws' && <span className={`player-state ${active ? 'is-active' : ''}`}>{active ? thinking ? 'Thinking…' : 'Your turn' : finished ? 'Round complete' : 'Up next'}</span>}
      </div>;
    })}
  </div>;
}

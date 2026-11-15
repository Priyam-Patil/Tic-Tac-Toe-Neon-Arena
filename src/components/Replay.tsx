import { useEffect, useState } from 'react';
import { Pause, Play, RotateCcw } from 'lucide-react';
import { boardFrom, outcome } from '../game/logic';
import type { Result } from '../game/store';
import { Mark } from './Mark';
import { useMinimalMotion } from './AnimationContext';

export function Replay({ result }: { result: Result }) {
  const minimal = useMinimalMotion();
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(!minimal);
  const complete = step === result.moves.length;
  useEffect(() => {
    if (!playing || complete) return;
    const timer = setTimeout(() => setStep(s => s + 1), 650);
    return () => clearTimeout(timer);
  }, [playing, complete, step]);
  const board = boardFrom(result.moves.slice(0, step));
  const win = outcome(board);
  return <div className="replay">
    <p className="muted">{result.names[0]} <span className="vs">vs</span> {result.names[1]}</p>
    <div className="replay-board">{board.map((cell, i) => <div key={i} className={win.line.includes(i) ? 'won' : ''}>{cell && <Mark value={cell} />}</div>)}</div>
    <label className="range-label">Move {step} of {result.moves.length}<input aria-label="Replay move" type="range" min="0" max={result.moves.length} value={step} onChange={e => { setPlaying(false); setStep(Number(e.target.value)); }} /></label>
    <div className="replay-actions"><button className="button secondary" disabled={complete} onClick={() => setPlaying(p => !p)}>{playing && !complete ? <Pause size={16} /> : <Play size={16} />}{playing && !complete ? 'Pause replay' : 'Resume replay'}</button><button className="button primary" onClick={() => { setStep(0); setPlaying(true); }}><RotateCcw size={16} /> Replay again</button></div>
  </div>;
}

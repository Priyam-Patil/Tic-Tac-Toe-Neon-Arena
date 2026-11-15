import { useEffect, useReducer, useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';
import { AnimatePresence, motion, MotionConfig, useReducedMotion } from 'motion/react';
import { ArrowDownLeft, ArrowLeft, ArrowRight, AudioLines, BarChart3, Bot, Check, CircleHelp, Crown, Flame, Gamepad2, History, House, Lightbulb, Maximize2, Moon, Music2, Play, RotateCcw, Settings2, ShieldCheck, Sparkles, Sun, Swords, Target, Trophy, Undo2, Users, Volume2, VolumeX, X, Zap } from 'lucide-react';
import { aiMove, bestMove, boardFrom, outcome, undoMoves } from './game/logic';
import type { Difficulty, Mark as MarkType } from './game/logic';
import { loadState, playerName, reducer, roundId, saveState, turnOf } from './game/store';
import type { Action, Result } from './game/store';
import { useAudio } from './hooks/useAudio';
import { Mark } from './components/Mark';
import { Modal } from './components/Modal';
import { AnimationContext } from './components/AnimationContext';
import { Scoreboard } from './components/Scoreboard';
import { WinningLine } from './components/WinningLine';
import { Replay } from './components/Replay';

type Dialog = 'help' | 'settings' | 'result' | 'history' | null;
interface Confirmation { title: string; description: string; action: Action }
const uid = () => crypto.randomUUID();
const difficultyText = { easy: 'A relaxed warm-up. Find your rhythm.', medium: 'A little strategy. A little surprise.', hard: 'Perfect strategy. Can you force a draw?' };
const dateLabel = (date: string) => new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }).format(new Date(date));

function SectionTitle({ icon, children, aside }: { icon: ReactNode; children: ReactNode; aside?: ReactNode }) {
  return <div className="section-title"><span>{icon}{children}</span>{aside}</div>;
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, undefined, () => loadState());
  const { prefs, session, stats, history } = state;
  const [page, setPage] = useState<'arena' | 'stats'>('arena');
  const [welcome, setWelcome] = useState(true);
  const [dialog, setDialog] = useState<Dialog>(null);
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);
  const [replay, setReplay] = useState<Result | null>(null);
  const [hint, setHint] = useState<number | null>(null);
  const [notice, setNotice] = useState('');
  const [storageFailed, setStorageFailed] = useState(false);
  const [celebrating, setCelebrating] = useState(false);
  const [dismissedRound, setDismissedRound] = useState('');
  const cells = useRef<(HTMLButtonElement | null)[]>([]);
  const arena = useRef<HTMLElement | null>(null);
  const previousSession = useRef(session.id);
  const sound = useAudio(prefs.sound, prefs.music);
  const systemReducedMotion = useReducedMotion();
  const reducedMotion = !prefs.animations || Boolean(systemReducedMotion);
  const board = boardFrom(session.moves);
  const result = outcome(board);
  const finished = Boolean(result.winner) || result.draw;
  const turn = turnOf(session);
  const isAI = session.config.mode === 'ai' && turn !== session.config.human && !finished;
  const id = roundId(session);
  const canUndo = !finished && undoMoves(session.moves, session.config.mode, session.config.human).length !== session.moves.length;
  const played = stats.wins + stats.losses + stats.draws;
  const winRate = played ? Math.round(stats.wins / played * 100) : 0;
  const winnerName = result.winner ? playerName(session.config, result.winner) : '';
  const status = finished ? result.draw ? 'A perfect stalemate.' : `${winnerName} wins!` : isAI ? 'Neon AI is thinking' : `${playerName(session.config, turn)}’s turn`;

  useEffect(() => {
    document.documentElement.dataset.theme = prefs.theme;
    document.documentElement.dataset.motion = reducedMotion ? 'reduced' : 'full';
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', prefs.theme === 'light' ? '#f5f6fd' : '#10182b');
  }, [prefs.theme, reducedMotion]);
  useEffect(() => {
    if (previousSession.current !== session.id) {
      arena.current?.scrollIntoView({ behavior: reducedMotion ? 'instant' : 'smooth', block: 'start' });
      previousSession.current = session.id;
    }
  }, [session.id, reducedMotion]);
  useEffect(() => { setStorageFailed(!saveState(state)); }, [state]);
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, [page]);
  useEffect(() => {
    if (!isAI) return;
    const timer = setTimeout(() => {
      const index = aiMove(boardFrom(session.moves), turnOf(session), session.config.difficulty);
      if (index !== null) { dispatch({ type: 'MOVE', index, mark: turnOf(session), roundId: roundId(session), at: new Date().toISOString() }); sound(turnOf(session)); }
    }, 580);
    return () => clearTimeout(timer);
  }, [isAI, session, sound]);
  useEffect(() => { setHint(null); }, [session.moves]);
  useEffect(() => {
    if (!finished || dismissedRound === id) return;
    sound(result.draw ? 'draw' : 'win');
    setCelebrating(!result.draw);
    const timer = setTimeout(() => setDialog('result'), 950);
    const celebration = setTimeout(() => setCelebrating(false), 3600);
    return () => { clearTimeout(timer); clearTimeout(celebration); setCelebrating(false); };
  }, [finished, id, dismissedRound, result.draw, sound]);
  useEffect(() => { if (notice) { const timer = setTimeout(() => setNotice(''), 3200); return () => clearTimeout(timer); } }, [notice]);

  function move(index: number) {
    if (isAI || finished || board[index] || dialog || confirmation || replay) return;
    dispatch({ type: 'MOVE', index, mark: turn, roundId: id, at: new Date().toISOString() }); sound(turn);
    setHint(null);
  }
  function boardKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const directions: Record<string, number> = { ArrowRight: 1, ArrowLeft: -1, ArrowUp: -3, ArrowDown: 3 };
    if (directions[event.key]) { event.preventDefault(); cells.current[(index + directions[event.key] + 9) % 9]?.focus(); }
    if (/^[1-9]$/.test(event.key)) { event.preventDefault(); const next = Number(event.key) - 1; cells.current[next]?.focus(); move(next); }
    if (event.key === 'Home') { event.preventDefault(); cells.current[0]?.focus(); }
    if (event.key === 'End') { event.preventDefault(); cells.current[8]?.focus(); }
  }
  function start(quick = false) {
    sound('click');
    const action: Action = { type: 'START', id: uid(), quick };
    if (session.moves.length && !finished) setConfirmation({ title: 'Start a new match?', description: 'The current round will be discarded. Your completed games and lifetime statistics will be kept.', action });
    else { dispatch(action); setPage('arena'); setWelcome(false); setNotice(quick ? 'Quick play ready. You’re X — make your move.' : 'New match ready. Let’s play.'); }
  }
  function goHome() {
    closeDialog();
    setPage('arena');
    setWelcome(true);
    window.scrollTo({ top: 0, behavior: reducedMotion ? 'instant' : 'smooth' });
    requestAnimationFrame(() => document.querySelector<HTMLButtonElement>('.quick-play')?.focus({ preventScroll: true }));
  }
  function enterArena() { setPage('arena'); setWelcome(false); window.scrollTo({ top: 0, behavior: reducedMotion ? 'instant' : 'smooth' }); }
  function nextRound() { dispatch({ type: 'NEXT' }); setDialog(null); sound('click'); }
  function closeDialog() { if (dialog === 'result') setDismissedRound(id); setDialog(null); }
  function showHint() {
    const index = bestMove(board, turn); setHint(index); sound('click');
    if (index !== null) setNotice(`Try row ${Math.floor(index / 3) + 1}, column ${index % 3 + 1}.`);
  }

  const setupPanel = <section className="panel setup-panel" aria-label="Match setup">
    <SectionTitle icon={<Settings2 size={16} />}>Make it your game</SectionTitle>
    <div className="field-label">GAME MODE</div>
    <button className={`mode-card ${prefs.mode === 'ai' ? 'selected' : ''}`} onClick={() => dispatch({ type: 'PREFS', prefs: { mode: 'ai' } })} aria-pressed={prefs.mode === 'ai'}>
      <span className="mode-icon"><Bot size={22} /></span><span><strong>Vs Computer</strong><small>Meet your digital rival</small></span><span className="radio-dot">{prefs.mode === 'ai' && <span />}</span>
    </button>
    <button className={`mode-card ${prefs.mode === 'local' ? 'selected' : ''}`} onClick={() => dispatch({ type: 'PREFS', prefs: { mode: 'local' } })} aria-pressed={prefs.mode === 'local'}>
      <span className="mode-icon"><Users size={22} /></span><span><strong>Local Multiplayer</strong><small>One screen. Two rivals.</small></span><span className="radio-dot">{prefs.mode === 'local' && <span />}</span>
    </button>
    {prefs.mode === 'ai' && <>
      <div className="field-label">DIFFICULTY <span>{prefs.difficulty === 'hard' ? <Flame size={12} /> : <Target size={12} />}</span></div>
      <div className="segmented" aria-label="AI difficulty">{(['easy', 'medium', 'hard'] as Difficulty[]).map(level => <button key={level} className={prefs.difficulty === level ? 'active' : ''} aria-pressed={prefs.difficulty === level} onClick={() => dispatch({ type: 'PREFS', prefs: { difficulty: level } })}>{level}</button>)}</div>
      <p className="field-hint">{difficultyText[prefs.difficulty]}</p>
      <div className="field-label">PICK YOUR SIDE</div>
      <div className="side-picker">{(['X', 'O'] as MarkType[]).map(mark => <button key={mark} className={prefs.human === mark ? `chosen-${mark.toLowerCase()}` : ''} aria-pressed={prefs.human === mark} onClick={() => dispatch({ type: 'PREFS', prefs: { human: mark } })}><Mark value={mark} small /><span>Play as {mark}</span>{prefs.human === mark && <Check size={13} />}</button>)}</div>
    </>}
    <div className="setup-divider" />
    <div className="player-fields">
      <label>{prefs.mode === 'ai' ? 'YOUR NAME' : 'PLAYER X'}<input aria-label={prefs.mode === 'ai' ? 'Your name' : 'Player X name'} value={prefs.names[0]} maxLength={20} onChange={e => dispatch({ type: 'PREFS', prefs: { names: [e.target.value, prefs.names[1]] } })} onBlur={() => { if (!prefs.names[0].trim()) dispatch({ type: 'PREFS', prefs: { names: ['Player One', prefs.names[1]] } }); }} /></label>
      {prefs.mode === 'local' && <label>PLAYER O<input aria-label="Player O name" maxLength={20} value={prefs.names[1]} onChange={e => dispatch({ type: 'PREFS', prefs: { names: [prefs.names[0], e.target.value] } })} onBlur={() => { if (!prefs.names[1].trim()) dispatch({ type: 'PREFS', prefs: { names: [prefs.names[0], 'Player Two'] } }); }} /></label>}
    </div>
    <div className="first-player"><label htmlFor="first-player">First move</label><select id="first-player" value={prefs.first} onChange={e => dispatch({ type: 'PREFS', prefs: { first: e.target.value as MarkType } })}><option value="X">X starts</option><option value="O">O starts</option></select></div>
    <button className="button primary full" disabled={prefs.names.some(n => !n.trim())} onClick={() => start()}><Swords size={17} /> Start match <ArrowRight size={16} /></button>
    <p className="setup-footnote">New settings apply when you start a match.</p>
    <button className="appearance-link" onClick={() => setDialog('settings')}><Settings2 size={15} /> Sound &amp; appearance <ArrowRight size={14} /></button>
  </section>;

  function historyRows(items: Result[], compact = false) {
    if (!items.length) return <div className="empty-history"><History size={25} /><strong>A fresh start.</strong><p>Your finished games will appear here.<br />Make the first one a good one.</p></div>;
    return <div className={`history-list ${compact ? 'compact' : ''}`}>{items.map(item => {
      const perspective = item.mode === 'ai' ? item.human : 'X';
      const label = item.winner ? item.winner === perspective ? 'Victory' : 'Defeat' : 'Draw';
      return <button key={item.id} className="history-row" onClick={() => setReplay(item)} aria-label={`Replay ${label}, ${dateLabel(item.at)}`}>
        <span className={`result-icon result-${label.toLowerCase()}`}>{item.winner ? <Trophy size={15} /> : <span>—</span>}</span>
        <span><strong>{label}</strong><small>{compact ? item.mode === 'ai' ? `vs Neon AI · ${item.difficulty}` : 'Local multiplayer' : `${item.names[0]} vs ${item.names[1]}`}</small>{!compact && <small>{dateLabel(item.at)} · {item.moves.length} moves</small>}</span>
        <Play size={13} className="replay-icon" />
      </button>;
    })}</div>;
  }

  return <AnimationContext.Provider value={reducedMotion}><MotionConfig reducedMotion={reducedMotion ? 'always' : 'user'} transition={{ duration: reducedMotion ? 0 : 0.25 }}><div className="app-shell" data-motion={reducedMotion ? 'reduced' : 'full'}>
    <div className="ambient ambient-one" /><div className="ambient ambient-two" />
    <header className="site-header">
      <a className="brand" href="#" onClick={e => { e.preventDefault(); goHome(); }} aria-label="Neon Arena home"><span className="brand-logo"><X /><span className="logo-circle" /><span className="logo-circle" /><X /></span><span>NEON<span className="brand-light">ARENA</span><small>TIC TAC TOE, REIMAGINED.</small></span></a>
      <nav aria-label="Main navigation"><button className={page === 'arena' ? 'nav-active' : ''} onClick={enterArena}><Gamepad2 size={16} /> Play</button><button className={page === 'stats' ? 'nav-active' : ''} onClick={() => setPage('stats')}><BarChart3 size={16} /> Statistics</button><button onClick={() => setDialog('help')}><CircleHelp size={16} /> How to play</button></nav>
      <div className="header-actions"><span className="local-status"><i /> Made for a little rivalry</span><div className="header-separator" /><button className={`icon-button ${prefs.music ? 'enabled' : ''}`} aria-label={prefs.music ? 'Turn music off' : 'Turn music on'} aria-pressed={prefs.music} title="Ambient music" onClick={() => dispatch({ type: 'PREFS', prefs: { music: !prefs.music } })}><Music2 size={17} /></button><button className="icon-button" aria-label={prefs.sound ? 'Mute sound' : 'Enable sound'} aria-pressed={prefs.sound} title={prefs.sound ? 'Mute sound effects' : 'Enable sound effects'} onClick={() => dispatch({ type: 'PREFS', prefs: { sound: !prefs.sound } })}>{prefs.sound ? <Volume2 size={18} /> : <VolumeX size={18} />}</button><button className="icon-button" aria-label={`Switch to ${prefs.theme === 'dark' ? 'light' : 'dark'} theme`} title={`Switch to ${prefs.theme === 'dark' ? 'light' : 'dark'} theme`} onClick={() => dispatch({ type: 'PREFS', prefs: { theme: prefs.theme === 'dark' ? 'light' : 'dark' } })}>{prefs.theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}</button></div>
    </header>

    <main className="main-content">
      {page === 'arena' ? <motion.div key="arena" initial={reducedMotion ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reducedMotion ? 0 : 0.35 }}>
        {welcome ? <section className="hero">
          <div className="hero-copy"><div className="eyebrow"><span /> YOUR FIVE-MINUTE HAPPY PLACE</div><h1>A little rivalry.<br /><span>A lot of fun.</span><span className="title-spark" aria-hidden="true">✳</span></h1><p>Nine squares. Endless “just one more.” Challenge a friend<br className="desktop-break" /> or find your match with three levels of clever AI.</p><button className="quick-play" onClick={() => start(true)}><Zap size={15} fill="currentColor" /> Quick play <ArrowRight size={16} /></button><span className="quick-caption">One click. Game on.</span></div>
          <div className="hero-art" aria-hidden="true"><div className="orbit orbit-one" /><div className="orbit orbit-two" /><span className="orbit-star star-one">✦</span><span className="orbit-star star-two">+</span><div className="floating-symbol floating-x"><Mark value="X" /></div><div className="floating-symbol floating-o"><Mark value="O" /></div><div className="art-label"><span className="live-dot" /> ENDLESS POSSIBILITIES. NINE SQUARES.</div><div className="art-coordinate">03 × 03<br /><span>EST. TIME: 2 MIN</span></div></div>
        </section> : <div className="arena-intro"><div><span className="eyebrow">TIC TAC TOE · NEON ARENA</span><h1>Good game. Great company.</h1><p>Pick a square. Find your rhythm.</p></div><button className="button secondary" onClick={goHome}><ArrowLeft size={16} /> Back to home</button></div>}

        <div className="arena-layout">
          {setupPanel}
          <section className="arena-panel" ref={arena} aria-label="Tic Tac Toe game">
            <div className="arena-heading"><div><span className="eyebrow">YOUR NEXT MOVE STARTS HERE</span><h2>Let’s play<span>.</span></h2></div><span className="round-badge"><span /> ROUND {String(session.round).padStart(2, '0')}</span></div>
            <div className="active-match-mode" aria-label="Current game mode">{session.config.mode === 'ai' ? <Bot size={14} /> : <Users size={14} />}<span>{session.config.mode === 'ai' ? `Vs Computer · ${session.config.difficulty} AI` : 'Local Multiplayer · Two players'}</span></div>
            <Scoreboard session={session} turn={turn} finished={finished} thinking={isAI} />
            <div className={`game-status ${finished ? 'status-finished' : ''}`} role="status" aria-live="polite">{finished ? result.draw ? <span className="status-draw">=</span> : <Trophy size={16} /> : isAI ? <span className="thinking-dots"><i /><i /><i /></span> : <Mark value={turn} small />}<span>{status}</span>{!finished && !isAI && <span className="status-sub">Make your move</span>}</div>
            <div className={`board-frame ${finished && result.draw ? 'draw-board' : ''}`}><div className="board" role="group" aria-label="Game board. Use arrow keys to navigate and Enter to play. Keys 1 to 9 select a cell.">
              {board.map((cell, index) => <motion.button key={index} ref={el => { cells.current[index] = el; }} className={`cell ${cell ? `occupied cell-${cell.toLowerCase()}` : ''} ${result.line.includes(index) ? 'winning-cell' : ''} ${hint === index ? 'hint-cell' : ''}`} aria-label={`Row ${Math.floor(index / 3) + 1}, column ${index % 3 + 1}: ${cell ?? 'empty'}${result.line.includes(index) ? ', winning cell' : ''}`} aria-disabled={Boolean(cell) || finished || isAI} onClick={() => move(index)} onKeyDown={e => boardKey(e, index)} whileTap={!cell && !finished && !isAI ? { scale: 0.95 } : undefined}>
                {cell ? <Mark value={cell} /> : <>{!finished && !isAI && <span className="cell-preview"><Mark value={turn} /></span>}<span className="cell-number">{index + 1}</span>{hint === index && <Lightbulb size={18} className="hint-bulb" />}</>}
              </motion.button>)}
              {result.winner && <WinningLine cells={result.line} winner={result.winner} />}
            </div><span className="board-corner corner-tl" /><span className="board-corner corner-tr" /><span className="board-corner corner-bl" /><span className="board-corner corner-br" /></div>
            <div className="board-controls"><button disabled={!canUndo} title="Take back your last turn (completed rounds are final)" onClick={() => { dispatch({ type: 'UNDO' }); sound('click'); }}><Undo2 size={16} /> Undo</button><button disabled={finished || isAI} title="Highlight an optimal move without placing it" onClick={showHint}><Lightbulb size={16} /> Hint</button><span /><button title="Clear this board and keep the match scores" onClick={() => { sound('click'); setConfirmation({ title: 'Restart this round?', description: 'The current board will be cleared. Match scores and completed games will be kept.', action: { type: 'RESTART' } }); }}><RotateCcw size={15} /> Restart</button></div>
            {finished ? <button className="button primary full next-round" onClick={nextRound}><Play size={16} /> Next round <ArrowRight size={16} /></button> : <p className="board-footnote"><ShieldCheck size={13} /> {session.config.mode === 'ai' ? `${session.config.difficulty.charAt(0).toUpperCase() + session.config.difficulty.slice(1)} AI · ` : 'Local multiplayer · '}Good games. Friendly rivalries.</p>}
            <button className="reset-scores" onClick={() => setConfirmation({ title: 'Reset match scores?', description: 'Start a fresh match with the same players and settings. Lifetime statistics and history will be kept.', action: { type: 'RESET_SCORES', id: uid() } })}>Reset scores</button>
          </section>

          <aside className="right-column">
            <section className="panel momentum-panel"><SectionTitle icon={<AudioLines size={17} />}>Your momentum<ArrowDownLeft size={15} className="muted" /></SectionTitle>
              <div className="win-rate"><div><span className="field-label">LIFETIME WIN RATE</span><strong>{winRate}<span>%</span></strong><p>{played ? `${stats.wins} ${stats.wins === 1 ? 'win' : 'wins'}. Keep the momentum.` : 'Your next great run starts here.'}</p></div><div className="rate-ring"><svg viewBox="0 0 80 80"><circle cx="40" cy="40" r="33" /><circle cx="40" cy="40" r="33" strokeDasharray={`${winRate * 2.073} 207.3`} /></svg><Target size={25} /></div></div>
              <div className="momentum-stats"><div><span><Gamepad2 size={15} /> Games played</span><strong>{played}</strong></div><div><span><Flame size={15} className="orange" /> Current streak</span><strong>{stats.streak}<small> {stats.streak === 1 ? 'win' : 'wins'}</small></strong></div><div><span><Crown size={15} className="yellow" /> Best streak</span><strong>{stats.best}<small> {stats.best === 1 ? 'win' : 'wins'}</small></strong></div></div>
              <button className="text-link" onClick={() => setPage('stats')}>View all statistics <ArrowRight size={14} /></button>
            </section>
            <section className="panel recent-panel"><SectionTitle icon={<History size={16} />}>Recent games<button className="tiny-link" onClick={() => setDialog('history')}>View all</button></SectionTitle>{historyRows(history.slice(0, 3), true)}</section>
            <div className="rival-card"><span className="rival-icon"><Sparkles size={21} /></span><div><strong>A worthy opponent.</strong><p>{session.config.mode === 'ai' ? session.config.difficulty === 'hard' ? 'Unbeatable AI. Unforgettable draws.' : 'Three AI levels. One perfect challenge.' : 'Grab a friend. Settle the score.'}</p></div><span className="rival-decoration">✧</span></div>
          </aside>
        </div>
        <div className="under-arena"><span><span className="live-dot" /> Built for a little friendly competition.</span><span><Users size={13} /> Local play <i /> <ShieldCheck size={13} /> No account needed <i /> <Zap size={13} /> Instant fun</span></div>
      </motion.div> : <motion.section className="stats-page" initial={reducedMotion ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="stats-heading"><div><span className="eyebrow">EVERY MOVE TELLS A STORY</span><h1>Your arena.<br /><span>Your legacy.</span></h1><p className="muted">Your lifetime performance, one round at a time.</p></div><button className="button primary" onClick={enterArena}><Gamepad2 size={17} /> Back to the arena</button></div>
        <div className="stats-grid">{[{ label: 'Games played', value: played, icon: <Gamepad2 />, color: 'purple' }, { label: 'Victories', value: stats.wins, icon: <Trophy />, color: 'cyan' }, { label: 'Defeats', value: stats.losses, icon: <Swords />, color: 'pink' }, { label: 'Draws', value: stats.draws, icon: <span>=</span>, color: 'purple' }].map(stat => <div className={`panel stat-tile ${stat.color}`} key={stat.label}><span>{stat.icon}</span><strong>{stat.value}</strong><p>{stat.label}</p></div>)}</div>
        <div className="stats-detail"><section className="panel"><SectionTitle icon={<Flame size={18} />}>The long game</SectionTitle><div className="streak-display"><div><strong>{stats.streak}</strong><span>Current streak</span></div><div><strong>{stats.best}</strong><span>Personal best</span></div><div><strong>{winRate}<small>%</small></strong><span>Win rate</span></div></div><p className="stats-explanation">In AI games, statistics follow your chosen side. In local multiplayer, victories and streaks follow Player X. A draw or defeat ends the streak. Match scores always track both players.</p></section><section className="panel"><SectionTitle icon={<History size={18} />}>Match history<span className="muted">{history.length} saved</span></SectionTitle>{historyRows(history)}<p className="stats-explanation">Select a game to replay it. The latest 100 games are saved on this device; lifetime totals include all games.</p></section></div>
        <button className="danger-link" onClick={() => setConfirmation({ title: 'Clear lifetime statistics?', description: 'This permanently removes all saved wins, losses, draws, streaks, and match history from this device. Current match scores will be kept.', action: { type: 'RESET_STATS' } })}><RotateCcw size={14} /> Reset lifetime statistics</button>
      </motion.section>}
    </main>

    <footer className="site-footer"><span className="footer-brand">NEON ARENA <span>© {new Date().getFullYear()}</span></span><p>Three in a row. One more game.</p><button onClick={() => setDialog('settings')}><Settings2 size={14} /> Preferences</button></footer>
    {storageFailed && <div className="storage-warning" role="alert">Device storage is unavailable. Progress will last for this visit only.</div>}
    <AnimatePresence>{notice && <motion.div className="toast" role="status" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}><Check size={16} />{notice}</motion.div>}</AnimatePresence>
    {celebrating && !reducedMotion && <div className="confetti" aria-hidden="true">{Array.from({ length: 42 }, (_, i) => <span key={i} style={{ left: `${(i * 29) % 100}%`, background: ['#aa95ff', '#6be7d8', '#f7c87a', '#ec8dbe'][i % 4], animationDelay: `${i % 8 * 0.07}s`, transform: `rotate(${i * 17}deg)` }} />)}</div>}

    {confirmation && <Modal title={confirmation.title} close={() => setConfirmation(null)}><div className="dialog-emblem"><RotateCcw size={28} /></div><p className="dialog-copy">{confirmation.description}</p><div className="dialog-actions"><button className="button secondary" onClick={() => setConfirmation(null)}>Keep playing</button><button className="button primary" onClick={() => { dispatch(confirmation.action); if (confirmation.action.type === 'START') { setPage('arena'); setWelcome(false); } setConfirmation(null); setDialog(null); sound('click'); setNotice('All set. A fresh start.'); }}>Confirm reset</button></div></Modal>}
    {dialog === 'result' && !confirmation && <Modal title={result.draw ? 'Great minds think alike.' : 'That’s a winning move.'} close={closeDialog}><div className={`result-emblem ${result.draw ? 'draw-emblem' : ''}`}>{result.draw ? <span>=</span> : <Trophy size={42} />}</div><div className="result-copy"><span className="eyebrow">ROUND {session.round} COMPLETE</span><h3>{result.draw ? 'It’s a draw!' : `${winnerName} wins!`}</h3><p>{result.draw ? 'Nine squares. No surrender. Ready for a rematch?' : 'Three in a row. Beautifully played. Keep the rivalry going.'}</p></div><div className="result-score"><span>{playerName(session.config, 'X')}<strong>{session.scores.X}</strong></span><span className="vs">VS</span><span>{playerName(session.config, 'O')}<strong>{session.scores.O}</strong></span></div><button className="button primary full" onClick={nextRound}><Play size={17} /> Play again <ArrowRight size={16} /></button><div className="result-links"><button className="button ghost" onClick={closeDialog}>View the board</button><button className="button ghost" onClick={goHome}><House size={14} /> Back to home</button></div></Modal>}
    {dialog === 'help' && <Modal title="Nine squares. Endless rivalry." close={closeDialog}><div className="help-intro"><div className="help-marks"><Mark value="X" /><Mark value="O" /></div><p>Take turns placing a mark. Connect three horizontally, vertically, or diagonally to win. Fill the board with no winner and it’s a draw.</p></div><div className="help-items"><div><Bot /><span><strong>Meet your match</strong><p>Easy plays randomly. Medium spots wins and blocks. Hard plays perfectly — a draw is a victory in its own way.</p></span></div><div><Undo2 /><span><strong>A second chance</strong><p>Undo takes back your last turn, including the AI’s response. In local play it removes one move. Completed rounds are final.</p></span></div><div><Lightbulb /><span><strong>A nudge in the right direction</strong><p>Hint highlights an optimal move without playing it for you.</p></span></div><div><Maximize2 /><span><strong>Keyboard ready</strong><p>Tab to the board, use arrow keys to navigate, then Enter or Space to play. Keys 1–9 select cells. Escape closes dialogs.</p></span></div></div><button className="button primary full" onClick={closeDialog}>Got it. Let’s play <ArrowRight size={16} /></button></Modal>}
    {dialog === 'settings' && <Modal title="Set the atmosphere." close={closeDialog}><p className="dialog-copy">A little more you. Preferences are saved on this device.</p><div className="preference-rows">{[{ icon: <Volume2 />, title: 'Sound effects', description: 'Soft clicks and satisfying victories', value: prefs.sound, action: () => dispatch({ type: 'PREFS', prefs: { sound: !prefs.sound } }) }, { icon: <Music2 />, title: 'Ambient music', description: 'An original, softly looping synth', value: prefs.music, action: () => dispatch({ type: 'PREFS', prefs: { music: !prefs.music } }) }, { icon: <Moon />, title: 'Dark mode', description: 'Deep navy, cool cyan, and a little glow.', value: prefs.theme === 'dark', action: () => dispatch({ type: 'PREFS', prefs: { theme: prefs.theme === 'dark' ? 'light' : 'dark' } }) }, { icon: <Sparkles />, title: 'Animations', description: systemReducedMotion ? 'Your system requests reduced motion.' : 'Smooth moves, glows, and celebrations', value: prefs.animations, action: () => dispatch({ type: 'PREFS', prefs: { animations: !prefs.animations } }) }].map(setting => <div key={setting.title}>{setting.icon}<span><strong>{setting.title}</strong><small>{setting.description}</small></span><button className={`toggle ${setting.value ? 'on' : ''}`} role="switch" aria-checked={setting.value} aria-label={setting.title} onClick={setting.action}><span /></button></div>)}</div><p className="stats-explanation">Audio begins after you interact. Your system’s reduced-motion preference is respected automatically. Everything stays in your browser.</p><button className="button secondary full settings-match-link" onClick={() => { setDialog(null); setPage('arena'); setTimeout(() => document.querySelector<HTMLElement>('.setup-panel input')?.focus(), 0); }}><Settings2 size={16} /> Edit players &amp; match settings <ArrowRight size={15} /></button></Modal>}
    {dialog === 'history' && !replay && <Modal title="Your recent rivalries." close={closeDialog} wide>{historyRows(history)}<p className="stats-explanation">The most recent 100 completed games. Select any game to replay every move.</p></Modal>}
    {replay && <Modal title="Run it back." close={() => setReplay(null)}><Replay key={replay.id} result={replay} /></Modal>}
  </div></MotionConfig></AnimationContext.Provider>;
}

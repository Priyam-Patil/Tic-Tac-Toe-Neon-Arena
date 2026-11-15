import { useCallback, useEffect, useRef } from 'react';

type Sound = 'click' | 'X' | 'O' | 'win' | 'draw';
export function useAudio(enabled: boolean, music: boolean) {
  const context = useRef<AudioContext | null>(null);
  const musicTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const activated = useRef(false);
  const enabledRef = useRef(enabled); enabledRef.current = enabled;
  const musicRef = useRef(music); musicRef.current = music;
  const getContext = useCallback(() => {
    try {
      context.current ??= new AudioContext();
      if (context.current.state === 'suspended') void context.current.resume().catch(() => {});
      return context.current;
    } catch { return null; }
  }, []);
  const tone = useCallback((frequency: number, time: number, duration: number, volume: number, type: OscillatorType = 'sine') => {
    const ctx = getContext(); if (!ctx) return;
    const oscillator = ctx.createOscillator(), gain = ctx.createGain();
    oscillator.type = type; oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0, ctx.currentTime + time);
    gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + time + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + time + duration);
    oscillator.connect(gain); gain.connect(ctx.destination);
    oscillator.start(ctx.currentTime + time); oscillator.stop(ctx.currentTime + time + duration + 0.02);
  }, [getContext]);
  const sound = useCallback((kind: Sound) => {
    if (!activated.current || !enabledRef.current) return;
    if (kind === 'win') [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone(f, i * 0.10, 0.35, 0.065));
    else if (kind === 'draw') [392, 329.63, 293.66].forEach((f, i) => tone(f, i * 0.12, 0.3, 0.045));
    else tone(kind === 'X' ? 660 : kind === 'O' ? 440 : 880, 0, kind === 'click' ? 0.06 : 0.2, 0.035);
  }, [tone]);
  useEffect(() => {
    const start = () => { activated.current = true; getContext(); };
    window.addEventListener('pointerdown', start, { once: true });
    window.addEventListener('keydown', start, { once: true });
    return () => { window.removeEventListener('pointerdown', start); window.removeEventListener('keydown', start); };
  }, [getContext]);
  useEffect(() => {
    const notes = [130.81, 164.81, 196, 164.81, 110, 164.81, 220, 196]; let step = 0;
    const tick = () => { if (activated.current && musicRef.current && document.visibilityState === 'visible') { tone(notes[step++ % notes.length], 0, 1.7, 0.018); } };
    if (music) { tick(); musicTimer.current = setInterval(tick, 850); }
    return () => { if (musicTimer.current) clearInterval(musicTimer.current); };
  }, [music, tone]);
  useEffect(() => () => { void context.current?.close().catch(() => {}); }, []);
  return sound;
}

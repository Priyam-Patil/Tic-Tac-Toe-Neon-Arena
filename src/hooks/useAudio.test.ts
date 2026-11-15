import { act, fireEvent, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useAudio } from './useAudio';

const oscillator = () => ({ type: 'sine', frequency: { value: 0 }, connect: vi.fn(), start: vi.fn(), stop: vi.fn() });
const gain = () => ({ gain: { setValueAtTime: vi.fn(), linearRampToValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() }, connect: vi.fn() });
const createOscillator = vi.fn(oscillator);
const close = vi.fn(() => Promise.resolve());
class FakeContext {
  currentTime = 0;
  state = 'running';
  destination = {};
  createOscillator = createOscillator;
  createGain = vi.fn(gain);
  resume = vi.fn(() => Promise.resolve());
  close = close;
}
afterEach(() => { vi.unstubAllGlobals(); vi.clearAllMocks(); vi.useRealTimers(); });
describe('original synthesized audio', () => {
  it('does not autoplay; produces placement, victory and draw tones after interaction', () => {
    const constructor = vi.fn(FakeContext); vi.stubGlobal('AudioContext', constructor);
    const { result, unmount } = renderHook(() => useAudio(true, false));
    act(() => result.current('X')); expect(constructor).not.toHaveBeenCalled();
    fireEvent.pointerDown(window); act(() => result.current('X')); expect(createOscillator).toHaveBeenCalledTimes(1);
    act(() => result.current('O')); expect(createOscillator).toHaveBeenCalledTimes(2);
    act(() => result.current('win')); expect(createOscillator).toHaveBeenCalledTimes(6);
    act(() => result.current('draw')); expect(createOscillator).toHaveBeenCalledTimes(9);
    unmount(); expect(close).toHaveBeenCalledOnce();
  });
  it('keeps effects muted while allowing independently enabled music and stops its timer', () => {
    vi.useFakeTimers(); vi.stubGlobal('AudioContext', FakeContext);
    const { result, rerender, unmount } = renderHook(({ music }) => useAudio(false, music), { initialProps: { music: true } });
    act(() => { vi.advanceTimersByTime(1800); }); expect(createOscillator).not.toHaveBeenCalled();
    fireEvent.keyDown(window, { key: 'Tab' }); act(() => result.current('win')); expect(createOscillator).not.toHaveBeenCalled();
    act(() => { vi.advanceTimersByTime(900); }); expect(createOscillator).toHaveBeenCalled();
    rerender({ music: false }); const calls = createOscillator.mock.calls.length;
    act(() => { vi.advanceTimersByTime(2000); }); expect(createOscillator).toHaveBeenCalledTimes(calls); unmount();
  });
});

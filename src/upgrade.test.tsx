import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import App from './App';
import { initialState, loadState, saveState, STORAGE_KEY } from './game/store';

afterEach(() => vi.useRealTimers());
const cell = (index: number) => screen.getByRole('button', { name: new RegExp(`Row ${Math.floor(index / 3) + 1}, column ${index % 3 + 1}:`) });
function startLocal() {
  fireEvent.click(screen.getByRole('button', { name: /Local Multiplayer One screen/ }));
  fireEvent.click(screen.getByRole('button', { name: 'Start match' }));
}
function completeLocalWin() {
  startLocal(); [0, 3, 1, 4, 2].forEach(index => fireEvent.click(cell(index)));
  act(() => vi.advanceTimersByTime(1000));
}

describe('premium interface controls', () => {
  it('Quick play enters a focused game, and Home preserves an unfinished board', () => {
    vi.useFakeTimers();
    render(<App />); expect(screen.getByText('A little rivalry.')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Quick play' }));
    expect(screen.queryByText('A little rivalry.')).not.toBeInTheDocument();
    expect(screen.getByLabelText('Current game mode')).toHaveTextContent('Vs Computer · medium AI');
    fireEvent.click(cell(0)); fireEvent.click(screen.getByRole('button', { name: 'Back to home' }));
    act(() => vi.advanceTimersByTime(30));
    expect(screen.getByText('A little rivalry.')).toBeInTheDocument(); expect(cell(0)).toHaveAccessibleName(/X/);
    expect(screen.getByRole('button', { name: 'Quick play' })).toHaveFocus();
    fireEvent.click(screen.getByRole('button', { name: 'Play' })); expect(cell(0)).toHaveAccessibleName(/X/);
  });
  it('edits names, mark, difficulty, and first player, and starts the AI automatically', () => {
    vi.useFakeTimers(); render(<App />);
    fireEvent.change(screen.getByRole('textbox', { name: 'Your name' }), { target: { value: 'Taylor' } });
    fireEvent.click(screen.getByRole('button', { name: 'hard' }));
    fireEvent.click(screen.getByRole('button', { name: 'Play as O' }));
    fireEvent.click(screen.getByRole('button', { name: 'Start match' }));
    expect(screen.getByLabelText('Current game mode')).toHaveTextContent('hard AI');
    act(() => vi.advanceTimersByTime(650));
    expect(cell(4)).toHaveAccessibleName(/X/); expect(screen.getByText('Taylor’s turn')).toBeInTheDocument();
    fireEvent.change(screen.getByRole('combobox', { name: 'First move' }), { target: { value: 'O' } });
    fireEvent.click(screen.getByRole('button', { name: 'Start match' }));
    expect(screen.getByRole('dialog')).toHaveTextContent('Start a new match?');
    fireEvent.click(screen.getByRole('button', { name: 'Confirm reset' }));
    expect(cell(4)).toHaveAccessibleName(/empty/); fireEvent.click(cell(0)); expect(cell(0)).toHaveAccessibleName(/O/);
  });
  it('saves animation and music preferences and gives access to match settings', async () => {
    const view = render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'Sound & appearance' }));
    fireEvent.click(screen.getByRole('switch', { name: 'Animations' }));
    expect(document.documentElement.dataset.motion).toBe('reduced');
    fireEvent.click(screen.getByRole('switch', { name: 'Ambient music' }));
    fireEvent.click(screen.getByRole('button', { name: /Edit players & match settings/ }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument(); await waitFor(() => expect(screen.getByRole('textbox', { name: 'Your name' })).toHaveFocus());
    view.unmount(); render(<App />);
    expect(document.documentElement.dataset.motion).toBe('reduced');
    fireEvent.click(screen.getByRole('button', { name: 'Preferences' }));
    expect(screen.getByRole('switch', { name: 'Animations' })).not.toBeChecked();
    expect(screen.getByRole('switch', { name: 'Ambient music' })).toBeChecked();
  });
  it('can cancel or confirm a score reset without removing lifetime history', () => {
    vi.useFakeTimers(); render(<App />); completeLocalWin();
    fireEvent.click(screen.getByRole('button', { name: 'View the board' }));
    fireEvent.click(screen.getByRole('button', { name: 'Reset scores' }));
    fireEvent.click(screen.getByRole('button', { name: 'Keep playing' }));
    expect(cell(0)).toHaveAccessibleName(/winning cell/);
    fireEvent.click(screen.getByRole('button', { name: 'Reset scores' }));
    fireEvent.click(screen.getByRole('button', { name: 'Confirm reset' }));
    expect(cell(0)).toHaveAccessibleName(/empty/);
    expect(loadState().session.scores).toEqual({ X: 0, O: 0, draws: 0 });
    expect(loadState().stats.wins).toBe(1); expect(loadState().history).toHaveLength(1);
  });
  it('confirms lifetime-statistics reset separately from match scores', () => {
    vi.useFakeTimers(); render(<App />); completeLocalWin();
    fireEvent.click(screen.getByRole('button', { name: 'Close dialog' }));
    fireEvent.click(screen.getByRole('button', { name: 'Statistics' }));
    fireEvent.click(screen.getByRole('button', { name: 'Reset lifetime statistics' }));
    fireEvent.click(screen.getByRole('button', { name: 'Keep playing' })); expect(loadState().stats.wins).toBe(1);
    fireEvent.click(screen.getByRole('button', { name: 'Reset lifetime statistics' }));
    fireEvent.click(screen.getByRole('button', { name: 'Confirm reset' }));
    expect(loadState().stats.wins).toBe(0); expect(loadState().history).toHaveLength(0);
    expect(loadState().session.scores.X).toBe(1); expect(screen.getByText('A fresh start.')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Back to the arena' })); expect(cell(0)).toHaveAccessibleName(/X/);
  });
  it('opens history, pauses and resumes replay, scrubs moves, and restarts replay', () => {
    vi.useFakeTimers(); render(<App />); completeLocalWin();
    fireEvent.click(screen.getByRole('button', { name: 'View the board' }));
    fireEvent.click(screen.getByRole('button', { name: 'View all' }));
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: /Replay Victory/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Pause replay' }));
    act(() => vi.advanceTimersByTime(1500)); expect(screen.getByRole('slider', { name: 'Replay move' })).toHaveValue('0');
    fireEvent.click(screen.getByRole('button', { name: 'Resume replay' }));
    act(() => vi.advanceTimersByTime(700)); expect(screen.getByRole('slider')).toHaveValue('1');
    fireEvent.change(screen.getByRole('slider'), { target: { value: '5' } }); expect(screen.getByRole('slider')).toHaveValue('5');
    fireEvent.click(screen.getByRole('button', { name: 'Replay again' })); expect(screen.getByRole('slider')).toHaveValue('0');
    fireEvent.click(screen.getByRole('button', { name: 'Close dialog' })); expect(screen.getByRole('dialog')).toHaveTextContent('Your recent rivalries.');
  });
  it('offers a Home action in the result dialog without losing the result', () => {
    vi.useFakeTimers(); render(<App />); completeLocalWin();
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Back to home' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument(); expect(screen.getByText('A little rivalry.')).toBeInTheDocument();
    expect(loadState().stats.wins).toBe(1); expect(cell(0)).toHaveAccessibleName(/winning cell/);
  });
});

describe('upgrade storage compatibility', () => {
  it('retains legacy preferences and a saved game while defaulting the new animation preference', () => {
    const state = initialState(); state.prefs.theme = 'dark';
    const legacy = JSON.parse(JSON.stringify(state)); delete legacy.prefs.animations; delete legacy.session.config.animations;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(legacy));
    const loaded = loadState(); expect(loaded.prefs.theme).toBe('dark'); expect(loaded.prefs.animations).toBe(true);
    expect(loaded.session.config.animations).toBe(true); expect(loaded.session.moves).toEqual([]);
  });
  it('round-trips both themes and animation settings without changing lifetime statistics', () => {
    for (const theme of ['light', 'dark'] as const) {
      const state = initialState(); state.prefs = { ...state.prefs, theme, animations: false };
      saveState(state); expect(loadState().prefs).toMatchObject({ theme, animations: false }); expect(loadState().stats).toEqual(state.stats);
    }
  });
});

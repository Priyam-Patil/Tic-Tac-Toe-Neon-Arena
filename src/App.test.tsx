import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import App from './App';

afterEach(() => vi.useRealTimers());
const cell = (row: number, column: number) => screen.getByRole('button', { name: new RegExp(`Row ${row}, column ${column}:`) });
function localGame() {
  fireEvent.click(screen.getByRole('button', { name: /Local Multiplayer One screen/ }));
  fireEvent.click(screen.getByRole('button', { name: 'Start match' }));
}
describe('playable arena', () => {
  it('plays a local match, announces the winner, saves a result and starts another round', () => {
    vi.useFakeTimers(); render(<App />); localGame();
    for (const [r,c] of [[1,1],[2,1],[1,2],[2,2],[1,3]]) fireEvent.click(cell(r,c));
    expect(screen.getByText('Player One wins!')).toBeInTheDocument();
    expect(cell(1, 1)).toHaveAccessibleName(/winning cell/);
    expect(screen.getByTestId('winning-line')).toBeInTheDocument();
    act(() => { vi.advanceTimersByTime(1000); });
    const dialog = screen.getByRole('dialog'); expect(within(dialog).getByText('Player One wins!')).toBeInTheDocument();
    fireEvent.click(within(dialog).getByRole('button', { name: /Play again/ }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument(); expect(cell(1,1)).toHaveAccessibleName(/empty/);
    fireEvent.click(screen.getByRole('button', { name: 'Statistics' })); expect(screen.getByText('Your legacy.')).toBeInTheDocument(); expect(screen.getByRole('button', { name: /Replay Victory/ })).toBeInTheDocument();
  });
  it('responds automatically with AI and undoes the whole turn', () => {
    vi.useFakeTimers(); render(<App />); fireEvent.click(cell(1,1));
    expect(screen.getByText('Neon AI is thinking')).toBeInTheDocument();
    fireEvent.click(cell(1,2)); expect(cell(1,2)).toHaveAccessibleName(/empty/);
    act(() => { vi.advanceTimersByTime(700); });
    expect(screen.getAllByRole('button', { name: /Row .*: [XO]/ })).toHaveLength(2);
    fireEvent.click(screen.getByRole('button', { name: 'Undo' }));
    expect(screen.getAllByRole('button', { name: /Row .*empty/ })).toHaveLength(9);
  });
  it('shows a hint, supports keyboard navigation, and confirms restart', () => {
    render(<App />); localGame(); fireEvent.click(screen.getByRole('button', { name: 'Hint' }));
    expect(screen.getByText(/Try row/)).toBeInTheDocument();
    cell(1,1).focus(); fireEvent.keyDown(cell(1,1), { key: 'ArrowRight' }); expect(cell(1,2)).toHaveFocus();
    fireEvent.keyDown(cell(1,2), { key: '5' }); expect(cell(2,2)).toHaveAccessibleName(/X/);
    fireEvent.click(screen.getByRole('button', { name: 'Restart' })); const dialog = screen.getByRole('dialog');
    fireEvent.click(within(dialog).getByRole('button', { name: 'Keep playing' })); expect(cell(2,2)).toHaveAccessibleName(/X/);
    fireEvent.click(screen.getByRole('button', { name: 'Restart' })); fireEvent.click(screen.getByRole('button', { name: 'Confirm reset' })); expect(cell(2,2)).toHaveAccessibleName(/empty/);
  });
  it('persists theme and audio preferences and opens help', () => {
    const { unmount } = render(<App />); expect(document.documentElement.dataset.theme).toBe('light');
    fireEvent.click(screen.getByRole('button', { name: 'Switch to dark theme' }));
    expect(document.documentElement.dataset.theme).toBe('dark'); fireEvent.click(screen.getByRole('button', { name: 'Mute sound' })); unmount(); render(<App />);
    expect(screen.getByRole('button', { name: 'Enable sound' })).toBeInTheDocument(); expect(screen.getByRole('button', { name: 'Switch to light theme' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'How to play' })); expect(screen.getByRole('dialog')).toHaveTextContent('Keyboard ready');
    fireEvent.click(screen.getByRole('button', { name: 'Close dialog' })); expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});

import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { App } from '../src/App';

afterEach(cleanup);

function toHandScreen() {
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: 'Get started' }));
}

describe('Welcome → Hand selection', () => {
  it('shows the brand and approved tagline', () => {
    render(<App />);
    expect(screen.getByRole('img', { name: 'K’ab' })).toBeTruthy();
    expect(screen.getByRole('heading', { level: 1, name: 'A more reachable interface' })).toBeTruthy();
  });

  it('keeps Continue disabled until a hand is chosen explicitly', () => {
    toHandScreen();
    const cont = screen.getByRole('button', { name: 'Continue' }) as HTMLButtonElement;
    expect(cont.disabled).toBe(true);
    fireEvent.click(screen.getByRole('radio', { name: 'Right' }));
    expect(screen.getByRole('radio', { name: 'Right' }).getAttribute('aria-checked')).toBe('true');
    expect(screen.getByRole('radio', { name: 'Left' }).getAttribute('aria-checked')).toBe('false');
    expect(cont.disabled).toBe(false);
  });

  it('supports arrow-key selection in the radio group', () => {
    toHandScreen();
    fireEvent.click(screen.getByRole('radio', { name: 'Left' }));
    fireEvent.keyDown(screen.getByRole('radio', { name: 'Left' }), { key: 'ArrowRight' });
    expect(screen.getByRole('radio', { name: 'Right' }).getAttribute('aria-checked')).toBe('true');
  });

  it('remembers the selection when going back and forward', () => {
    toHandScreen();
    fireEvent.click(screen.getByRole('radio', { name: 'Left' }));
    fireEvent.click(screen.getByRole('button', { name: 'Back' }));
    fireEvent.click(screen.getByRole('button', { name: 'Get started' }));
    expect(screen.getByRole('radio', { name: 'Left' }).getAttribute('aria-checked')).toBe('true');
  });
});

describe('Skip path and placement demo', () => {
  function toDemo(hand: 'Left' | 'Right') {
    toHandScreen();
    fireEvent.click(screen.getByRole('radio', { name: hand }));
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
    fireEvent.click(screen.getByRole('button', { name: 'Preview without touch calibration' }));
  }

  it('labels a skipped calibration honestly — nothing measured', () => {
    toDemo('Right');
    expect(screen.getByText(/You skipped calibration, so nothing was measured/)).toBeTruthy();
  });

  it('switches Back/Bag between header and hand-side rail without losing state', () => {
    toDemo('Right');
    fireEvent.click(screen.getByRole('button', { name: 'Try the layout demo' }));

    const header = () => document.querySelector('.app-header') as HTMLElement;
    const rail = () => document.querySelector('.app-rail') as HTMLElement | null;

    // Standard: both controls in header, no rail
    expect(within(header()).getByRole('button', { name: 'Back' })).toBeTruthy();
    expect(rail()).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: 'Add to bag' }));
    fireEvent.click(screen.getByRole('radio', { name: 'With K’ab' }));

    // K’ab: same labelled controls, now in a right-side rail; bag count persisted
    expect(within(header()).queryByRole('button', { name: 'Back' })).toBeNull();
    expect(rail()!.className).toMatch(/app-rail--right/);
    const bag = within(rail()!).getByRole('button', { name: 'Bag, 1 item' });
    fireEvent.click(bag);
    expect(screen.getByText(/Bag pressed 1×/)).toBeTruthy();

    // Change hand → rail moves left, state still there
    fireEvent.click(screen.getByRole('button', { name: 'Switch to left hand' }));
    expect(rail()!.className).toMatch(/app-rail--left/);

    // Revert to Standard instantly
    fireEvent.click(screen.getByRole('radio', { name: 'Standard' }));
    expect(rail()).toBeNull();
    expect(within(header()).getByRole('button', { name: 'Bag, 1 item' })).toBeTruthy();
  });
});

describe('No hidden network or storage', () => {
  it('makes no fetch calls and writes no storage during the flow', () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal('fetch', fetchSpy);
    const setItem = vi.spyOn(Storage.prototype, 'setItem');
    toHandScreen();
    fireEvent.click(screen.getByRole('radio', { name: 'Left' }));
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
    fireEvent.click(screen.getByRole('button', { name: 'Preview without touch calibration' }));
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(setItem).not.toHaveBeenCalled();
    expect(document.cookie).toBe('');
    vi.unstubAllGlobals();
  });
});

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
    expect(screen.getByRole('img', { name: 'snerta' })).toBeTruthy();
    expect(screen.getByRole('heading', { level: 1, name: 'Every tap, within reach.' })).toBeTruthy();
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

  it('supports arrow-key selection across all three options', () => {
    toHandScreen();
    fireEvent.click(screen.getByRole('radio', { name: 'Left' }));
    fireEvent.keyDown(screen.getByRole('radio', { name: 'Left' }), { key: 'ArrowRight' });
    expect(screen.getByRole('radio', { name: 'Right' }).getAttribute('aria-checked')).toBe('true');
    fireEvent.keyDown(screen.getByRole('radio', { name: 'Right' }), { key: 'ArrowRight' });
    expect(screen.getByRole('radio', { name: 'I switch between hands' }).getAttribute('aria-checked')).toBe('true');
    // wraps back round to the first card
    fireEvent.keyDown(screen.getByRole('radio', { name: 'I switch between hands' }), { key: 'ArrowRight' });
    expect(screen.getByRole('radio', { name: 'Left' }).getAttribute('aria-checked')).toBe('true');
  });

  it('offers the switch-hands option and selects it', () => {
    toHandScreen();
    fireEvent.click(screen.getByRole('radio', { name: 'I switch between hands' }));
    expect(screen.getByRole('radio', { name: 'I switch between hands' }).getAttribute('aria-checked')).toBe('true');
    expect((screen.getByRole('button', { name: 'Continue' }) as HTMLButtonElement).disabled).toBe(false);
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
    fireEvent.click(screen.getByRole('button', { name: 'Skip — just show me the demo' }));
  }

  it('a skipped calibration goes straight to the demo, with nothing to report on', () => {
    toDemo('Right');
    // No comfort question and no map: there is nothing measured to label.
    expect(screen.queryByText(/How did each area feel/)).toBeNull();
    expect(screen.queryByText(/Your reach map/)).toBeNull();
    expect(document.querySelector('.demo')).toBeTruthy();
  });

  it('moves the same controls between header and rail, reversibly, keeping state', () => {
    toDemo('Right');

    const header = () => document.querySelector('.fake-header') as HTMLElement;
    const rail = () => document.querySelector('.app-rail') as HTMLElement | null;
    const names = (el: HTMLElement) =>
      within(el)
        .getAllByRole('button')
        .map((b) => b.getAttribute('aria-label'))
        .sort();

    // Original: all three in the header, no rail
    expect(names(header())).toEqual(['Back', 'More', 'Search']);
    expect(rail()).toBeNull();

    fireEvent.click(screen.getByRole('radio', { name: 'With snerta.' }));

    // snerta: the SAME three controls, now in a right-side rail and gone from the header
    expect(rail()!.className).toMatch(/app-rail--right/);
    expect(names(rail()!)).toEqual(['Back', 'More', 'Search']);
    expect(within(header()).queryByRole('button')).toBeNull();

    fireEvent.click(within(rail()!).getByRole('button', { name: 'Back' }));
    expect(screen.getByText(/Back pressed — snerta\. layout\./)).toBeTruthy();

    // Hand cycles right → left → both, and the rail follows
    fireEvent.click(screen.getByRole('button', { name: /Switch hand/ }));
    expect(rail()!.className).toMatch(/app-rail--left/);
    fireEvent.click(screen.getByRole('button', { name: /Switch hand/ }));
    expect(rail()!.className).toMatch(/app-rail--center/);

    // Reverting is instant and the press count survives
    fireEvent.click(screen.getByRole('radio', { name: 'Original' }));
    expect(rail()).toBeNull();
    expect(names(header())).toEqual(['Back', 'More', 'Search']);
    expect(screen.getByText(/1 press ·/)).toBeTruthy();
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
    fireEvent.click(screen.getByRole('button', { name: 'Skip — just show me the demo' }));
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(setItem).not.toHaveBeenCalled();
    expect(document.cookie).toBe('');
    vi.unstubAllGlobals();
  });
});

describe('Comparison stability', () => {
  /**
   * Controls must never move because of a layout switch other than the intended one.
   * jsdom has no layout engine, so this guards the structural cause: the boxes above
   * and below the device are fixed-size and the device itself is the only flexible one.
   * The pixel-level check lives in scripts/smoke-touch.cjs, which runs in a real engine.
   */
  it('keeps the copy that changes with mode below the device, never above it', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'Get started' }));
    fireEvent.click(screen.getByRole('radio', { name: 'Right' }));
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
    fireEvent.click(screen.getByRole('button', { name: 'Skip — just show me the demo' }));

    const children = Array.from(document.querySelector('.demo')!.children);
    const deviceAt = children.findIndex((c) => c.classList.contains('device'));
    const logAt = children.findIndex((c) => c.classList.contains('log'));
    expect(deviceAt).toBeGreaterThanOrEqual(0);
    expect(logAt).toBeGreaterThan(deviceAt);

    // Nothing above the device may carry mode-dependent text.
    const above = children.slice(0, deviceAt).map((c) => c.textContent).join(' ');
    fireEvent.click(screen.getByRole('radio', { name: 'With snerta.' }));
    const aboveAfter = Array.from(document.querySelector('.demo')!.children)
      .slice(0, deviceAt)
      .map((c) => c.textContent)
      .join(' ');
    expect(aboveAfter).toBe(above);
  });
});

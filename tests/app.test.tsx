import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { App } from '../src/App';
import { Trial } from '../src/screens/Trial';

afterEach(cleanup);

function toHandScreen() {
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: 'Get started' }));
}

/** The handle names where the controls are going, not where they are. */
const handle = () => screen.getByRole('button', { name: /Move the controls/ });
/** Tap path — also the keyboard and screen-reader path. */
const tapHandle = () => fireEvent.click(handle());
/** Drag path: press, move far enough to commit, release. */
const dragHandle = (deltaY: number) => {
  const el = handle();
  el.setPointerCapture = () => {};
  fireEvent.pointerDown(el, { clientY: 200, isPrimary: true, pointerId: 1 });
  fireEvent.pointerMove(el, { clientY: 200 + deltaY, isPrimary: true, pointerId: 1 });
  fireEvent.pointerUp(el, { clientY: 200 + deltaY, isPrimary: true, pointerId: 1 });
};

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

  it('moves every control to the rail and reverts cleanly', () => {
    toDemo('Right');

    const header = () => document.querySelector('.fake-header') as HTMLElement;
    const rail = () => document.querySelector('.app-rail') as HTMLElement | null;
    const names = (el: HTMLElement) =>
      within(el).getAllByRole('button').map((b) => b.getAttribute('aria-label')).sort();

    // Original: all three up top, no rail.
    expect(names(header())).toEqual(['Back', 'More', 'Search']);
    expect(rail()).toBeNull();

    dragHandle(60); // pull the controls down to the thumb

    // snerta: all three move, so the person never reaches up during the task.
    expect(rail()!.className).toMatch(/app-rail--right/);
    expect(names(rail()!)).toEqual(['Back', 'More', 'Search']);
    expect(within(header()).queryByRole('button')).toBeNull();

    // The rail's controls really drive the app: open a message, then Back returns.
    fireEvent.click(screen.getByRole('button', { name: /Priya Nair/ }));
    expect(screen.getByRole('heading', { name: 'Priya Nair' })).toBeTruthy();
    fireEvent.click(within(rail()!).getByRole('button', { name: 'Back' }));
    expect(screen.queryByRole('heading', { name: 'Priya Nair' })).toBeNull();

    // Hand cycles right → left → both, and the rail follows.
    fireEvent.click(screen.getByRole('button', { name: /Switch hand/ }));
    expect(rail()!.className).toMatch(/app-rail--left/);
    fireEvent.click(screen.getByRole('button', { name: /Switch hand/ }));
    expect(rail()!.className).toMatch(/app-rail--center/);

    // Reverting is instant, nothing is lost, and the press count survives.
    dragHandle(-60); // push them back up
    expect(rail()).toBeNull();
    expect(names(header())).toEqual(['Back', 'More', 'Search']);
  });

  it('reserves room below the list so the last row clears the rail', () => {
    toDemo('Right');
    const screenEl = () => document.querySelector('.inbox') as HTMLElement;
    expect(screenEl().classList.contains('has-rail')).toBe(false);
    expect(document.querySelector('.fake-edge--bottom')).toBeNull();

    tapHandle();
    // The class is what carries the extra bottom padding in CSS; the fade sits with it.
    expect(screenEl().classList.contains('has-rail')).toBe(true);
    expect(document.querySelector('.fake-edge--bottom')).toBeTruthy();

    tapHandle();
    expect(screenEl().classList.contains('has-rail')).toBe(false);
    expect(document.querySelector('.fake-edge--bottom')).toBeNull();
  });

  it('fades the top edge in both layouts, so neither looks chopped', () => {
    toDemo('Right');
    expect(document.querySelector('.fake-edge--top')).toBeTruthy();
    tapHandle();
    expect(document.querySelector('.fake-edge--top')).toBeTruthy();
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
    tapHandle();
    const aboveAfter = Array.from(document.querySelector('.demo')!.children)
      .slice(0, deviceAt)
      .map((c) => c.textContent)
      .join(' ');
    expect(aboveAfter).toBe(above);
  });
});

describe('the grip, as a control someone has to be able to find and undo', () => {
  function toDemo(hand: 'Left' | 'Right') {
    toHandScreen();
    fireEvent.click(screen.getByRole('radio', { name: hand }));
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
    fireEvent.click(screen.getByRole('button', { name: 'Skip — just show me the demo' }));
  }
  const rail = () => document.querySelector('.app-rail');

  it('works from a tap alone, so it is operable without a pointer drag', () => {
    toDemo('Right');
    expect(rail()).toBeNull();
    tapHandle();
    expect(rail()).toBeTruthy();
    tapHandle();
    expect(rail()).toBeNull();
  });

  it('is a real button, so the keyboard reaches it', () => {
    toDemo('Right');
    const el = handle();
    expect(el.tagName).toBe('BUTTON');
    expect(el.getAttribute('disabled')).toBeNull();
  });

  it('says which way it will move the controls, and that a tap also works', () => {
    toDemo('Right');
    expect(handle().getAttribute('aria-label')).toMatch(/down within reach.*activate/i);
    tapHandle();
    expect(handle().getAttribute('aria-label')).toMatch(/back to the top.*activate/i);
  });

  it('ignores a drag too short to be meant', () => {
    toDemo('Right');
    dragHandle(10);
    expect(rail()).toBeNull();
  });

  it('does not move the controls twice when a drag is followed by the click event', () => {
    toDemo('Right');
    dragHandle(60);
    expect(rail()).toBeTruthy();
    fireEvent.click(handle()); // the click browsers fire after a drag
    expect(rail()).toBeTruthy(); // still down, not toggled back
  });

  it('goes back up as readily as it came down', () => {
    toDemo('Right');
    dragHandle(60);
    expect(rail()).toBeTruthy();
    dragHandle(-60);
    expect(rail()).toBeNull();
  });

  it('does not appear during a timed trial, where the layout is the condition', () => {
    render(<Trial mode="kab" position={1} targetId="m2" hand="right" onDone={() => {}} />);
    expect(screen.queryByRole('button', { name: /Move the controls/ })).toBeNull();
  });
});

describe('the grip after a drag', () => {
  function toDemo() {
    toHandScreen();
    fireEvent.click(screen.getByRole('radio', { name: 'Right' }));
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
    fireEvent.click(screen.getByRole('button', { name: 'Skip — just show me the demo' }));
  }
  const rail = () => document.querySelector('.app-rail');

  it('still answers a tap once a drag has happened', () => {
    // Caught in a real browser, invisible to jsdom until written down: the
    // after-drag guard was never cleared, so every tap and every keyboard Enter
    // after the first drag did nothing at all.
    toDemo();
    dragHandle(60);
    expect(rail()).toBeTruthy();
    fireEvent.click(handle()); // the browser's own post-drag click, swallowed
    tapHandle(); // a real tap, which must work
    expect(rail()).toBeNull();
    tapHandle();
    expect(rail()).toBeTruthy();
  });
});

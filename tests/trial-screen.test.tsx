import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { Trial } from '../src/screens/Trial';
import { Results } from '../src/screens/Results';
import { MESSAGES, TARGETS, messageById, type TrialResult } from '../src/lib/trial';

afterEach(cleanup);

const target = messageById(TARGETS.a)!;
const other = MESSAGES.find((m) => m.id !== TARGETS.a)!;

function renderTrial(mode: 'standard' | 'kab' = 'kab') {
  const onDone = vi.fn();
  render(<Trial mode={mode} position={1} targetId={TARGETS.a} hand="right" onDone={onDone} />);
  return onDone;
}

const rail = () => document.querySelector('.app-rail') as HTMLElement | null;
const ctrl = (name: string) => screen.getAllByRole('button', { name }).at(-1)!;

describe('a trial does not start until Start', () => {
  it('shows the task and names the message to find', () => {
    renderTrial();
    expect(screen.getByRole('heading', { name: new RegExp(target.from) })).toBeTruthy();
    expect(screen.getByText(/clock starts when you tap Start/)).toBeTruthy();
  });

  it('does not respond to the app before Start', () => {
    renderTrial();
    fireEvent.click(screen.getByRole('button', { name: new RegExp(other.from) }));
    // Still on the brief; nothing opened.
    expect(screen.getByRole('button', { name: 'Start' })).toBeTruthy();
    expect(screen.queryByRole('heading', { name: other.from })).toBeNull();
  });
});

describe('finishing the task', () => {
  const play = () => {
    fireEvent.click(screen.getByRole('button', { name: 'Start' }));
    fireEvent.click(ctrl('Search'));
    fireEvent.click(screen.getByRole('button', { name: new RegExp(target.from) }));
    fireEvent.click(ctrl('More'));
    fireEvent.click(screen.getByRole('menuitem', { name: /Archive/ }));
    fireEvent.click(ctrl('Back'));
  };

  it('asks for comfort only once the task is done, and says the time is already fixed', () => {
    renderTrial();
    fireEvent.click(screen.getByRole('button', { name: 'Start' }));
    expect(screen.queryByText(/How comfortable was that/)).toBeNull();
    fireEvent.click(ctrl('Search'));
    fireEvent.click(screen.getByRole('button', { name: new RegExp(target.from) }));
    fireEvent.click(ctrl('More'));
    fireEvent.click(screen.getByRole('menuitem', { name: /Archive/ }));
    fireEvent.click(ctrl('Back'));
    expect(screen.getByRole('heading', { name: /How comfortable was that/ })).toBeTruthy();
    expect(screen.getByText(/time is already recorded and this answer does not change it/)).toBeTruthy();
  });

  it('reports a completed trial with a duration and the rating given', () => {
    const onDone = renderTrial();
    play();
    fireEvent.click(screen.getByRole('radio', { name: /^4 —/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
    const r = onDone.mock.calls[0][0] as TrialResult;
    expect(r.completed).toBe(true);
    expect(r.comfort).toBe(4);
    expect(r.mode).toBe('kab');
    expect(r.durationMs).not.toBeNull();
  });

  it('lets the rating be skipped without losing the trial', () => {
    const onDone = renderTrial();
    play();
    fireEvent.click(screen.getByRole('button', { name: 'Skip the rating' }));
    const r = onDone.mock.calls[0][0] as TrialResult;
    expect(r.completed).toBe(true);
    expect(r.comfort).toBeNull();
  });

  it('puts the controls in the rail for snerta and in the header for Original', () => {
    renderTrial('kab');
    fireEvent.click(screen.getByRole('button', { name: 'Start' }));
    expect(rail()).toBeTruthy();
    expect(within(rail()!).getAllByRole('button')).toHaveLength(3);
    cleanup();
    renderTrial('standard');
    fireEvent.click(screen.getByRole('button', { name: 'Start' }));
    expect(rail()).toBeNull();
  });
});

describe('stopping and interruptions', () => {
  it('records a stopped trial as incomplete rather than dropping it', () => {
    const onDone = renderTrial();
    fireEvent.click(screen.getByRole('button', { name: 'Start' }));
    fireEvent.click(ctrl('Search'));
    fireEvent.click(screen.getByRole('button', { name: 'Stop' }));
    const r = onDone.mock.calls[0][0] as TrialResult;
    expect(r.completed).toBe(false);
    expect(r.durationMs).toBeNull();
  });

  it('voids a trial the person navigated away from, and says why', () => {
    renderTrial();
    fireEvent.click(screen.getByRole('button', { name: 'Start' }));
    Object.defineProperty(document, 'hidden', { value: true, configurable: true });
    fireEvent(document, new Event('visibilitychange'));
    expect(screen.getByRole('heading', { name: /set aside/ })).toBeTruthy();
    expect(screen.getByText(/recorded as\s+incomplete rather than dropped/)).toBeTruthy();
    Object.defineProperty(document, 'hidden', { value: false, configurable: true });
  });
});

describe('Results', () => {
  const res = (over: Partial<TrialResult>): TrialResult => ({
    mode: 'standard', position: 1, targetId: TARGETS.a, durationMs: 8000,
    comfort: 4, offTaskTaps: 0, completed: true, ...over,
  });

  const show = (trials: TrialResult[]) =>
    render(
      <Results hand="right" calibration={null} comfort={null} trials={trials} onBack={() => {}} onRestart={() => {}} />,
    );

  it('reports snerta being slower in plain words, without softening it', () => {
    show([res({ mode: 'standard', durationMs: 8000 }), res({ mode: 'kab', position: 2, durationMs: 11000 })]);
    expect(screen.getByText('With snerta the task took 3.0s longer.')).toBeTruthy();
  });

  it('refuses to compare when a trial was not finished, and says why', () => {
    show([res({ mode: 'standard' }), res({ mode: 'kab', position: 2, completed: false })]);
    expect(screen.getByRole('heading', { name: 'No comparison to show' })).toBeTruthy();
    expect(screen.getByText(/putting the two side by side would be misleading/)).toBeTruthy();
  });

  it('names which layout went first, since practice favours the other', () => {
    show([res({ mode: 'standard', position: 2 }), res({ mode: 'kab', position: 1 })]);
    expect(screen.getByText(/snerta\. layout went first/)).toBeTruthy();
  });

  it('offers a no-preference answer, not just the two layouts', () => {
    show([res({ mode: 'standard' }), res({ mode: 'kab', position: 2 })]);
    expect(screen.getByRole('radio', { name: /No preference/ })).toBeTruthy();
  });

  it('calls off-task taps observations rather than mistakes', () => {
    show([res({ mode: 'standard' }), res({ mode: 'kab', position: 2 })]);
    expect(screen.getByText(/Counted, not called mistakes/)).toBeTruthy();
  });
});

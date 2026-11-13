import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { ComfortReport } from '../src/screens/ComfortReport';
import { ReachMap } from '../src/screens/ReachMap';
import { TARGET_COUNT } from '../src/lib/calibration';
import { emptyReport } from '../src/lib/reach';
import type { ReachLabel, TapSample } from '../src/types';

afterEach(cleanup);

const cells = () => Array.from(document.querySelectorAll<HTMLElement>('.label-cell'));

describe('ComfortReport', () => {
  it('offers every zone, all starting unlabelled', () => {
    render(<ComfortReport onBack={() => {}} onComplete={() => {}} />);
    expect(cells()).toHaveLength(TARGET_COUNT);
    expect(cells().every((c) => c.classList.contains('is-unknown'))).toBe(true);
    expect(screen.getByText(/0 easy · 0 stretch · 0 hard · 15 not\s*sure/)).toBeTruthy();
  });

  it('lets the person continue without labelling anything, and says so', () => {
    const onComplete = vi.fn();
    render(<ComfortReport onBack={() => {}} onComplete={onComplete} />);
    expect(screen.getByRole('button', { name: 'Skip this' })).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Skip this' }));
    expect(onComplete).toHaveBeenCalledWith({ labels: emptyReport(), grip: null });
  });

  it('cycles a zone through the four labels and back', () => {
    render(<ComfortReport onBack={() => {}} onComplete={() => {}} />);
    const cell = cells()[0];
    for (const expected of ['is-easy', 'is-stretch', 'is-hard', 'is-unknown']) {
      fireEvent.click(cell);
      expect(cells()[0].classList.contains(expected)).toBe(true);
    }
  });

  it('changes only the zone that was tapped', () => {
    render(<ComfortReport onBack={() => {}} onComplete={() => {}} />);
    fireEvent.click(cells()[4]);
    expect(cells()[4].classList.contains('is-easy')).toBe(true);
    expect(cells().filter((c) => !c.classList.contains('is-unknown'))).toHaveLength(1);
  });

  it('records the grip answer, and lets it be unset again', () => {
    const onComplete = vi.fn();
    render(<ComfortReport onBack={() => {}} onComplete={onComplete} />);
    const yes = screen.getByRole('radio', { name: /shifted my grip/ });
    fireEvent.click(yes);
    expect(yes.getAttribute('aria-checked')).toBe('true');
    fireEvent.click(yes);
    expect(yes.getAttribute('aria-checked')).toBe('false');
    fireEvent.click(screen.getByRole('radio', { name: /Prefer not to say/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Skip this' }));
    expect(onComplete.mock.calls[0][0].grip).toBe('declined');
  });

  it('names each zone in words, so it is usable without sight', () => {
    render(<ComfortReport onBack={() => {}} onComplete={() => {}} />);
    expect(screen.getByRole('button', { name: /^top left: Not sure/ })).toBeTruthy();
    expect(screen.getByRole('button', { name: /^bottom right: Not sure/ })).toBeTruthy();
  });
});

describe('ReachMap', () => {
  const sample = (targetId: number, latencyMs: number): TapSample => ({
    index: 0, targetId, pointerType: 'touch', targetX: 0, targetY: 0, pointerX: 0, pointerY: 0,
    latencyMs, promptRestarted: false, viewportW: 393, viewportH: 695, panelW: 393, panelH: 631,
    occurredAtIso: '2026-11-13T00:00:00.000Z',
  });

  const calibration = (spec: Partial<Record<number, number>> = {}) => ({
    samples: Array.from({ length: TARGET_COUNT }, (_, i) => sample(i, spec[i] ?? 600)),
    observations: [],
    hiddenCount: 0,
    skipped: false,
  });

  const labelled = (spec: Partial<Record<number, ReachLabel>>): ReachLabel[] =>
    Array.from({ length: TARGET_COUNT }, (_, i) => spec[i] ?? 'unknown');

  const show = (labels: ReachLabel[], spec?: Partial<Record<number, number>>, grip: 'yes' | null = null) =>
    render(
      <ReachMap
        hand="right"
        calibration={calibration(spec)}
        comfort={{ labels, grip }}
        onBack={() => {}}
        onContinue={() => {}}
      />,
    );

  it('says the map comes from the test and the person, not from hand size', () => {
    show(labelled({ 0: 'hard' }));
    expect(screen.getByText(/how each area felt to you/)).toBeTruthy();
    expect(screen.getByText(/Not on your hand size/)).toBeTruthy();
  });

  it('keeps what was said and what was timed in separate sections', () => {
    show(labelled({ 0: 'hard' }));
    expect(screen.getByRole('heading', { name: 'What you reported' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'What the clock recorded' })).toBeTruthy();
    expect(screen.getByText(/includes noticing the dot, so a\s+slow spot is not necessarily a hard one/)).toBeTruthy();
  });

  it('draws no map at all when every zone was left unknown', () => {
    show(emptyReport());
    expect(screen.getByText(/there is no map to draw/)).toBeTruthy();
    expect(screen.getByText(/legitimate result, not a missing one/)).toBeTruthy();
    expect(document.querySelectorAll('.label-grid:not(.label-grid--time)')).toHaveLength(0);
  });

  it('surfaces a zone called easy that was slow, and explains it without overriding the label', () => {
    show(labelled({ 0: 'easy' }), { 0: 1800 });
    const section = screen.getByRole('heading', { name: 'Where the two disagree' }).closest('section')!;
    expect(within(section).getByText(/top left/)).toBeTruthy();
    expect(within(section).getByText(/time to spot a dot away from where you were looking/)).toBeTruthy();
    expect(screen.getByText(/Neither account is wrong/)).toBeTruthy();
  });

  it('shows no disagreement section when the two accounts line up', () => {
    show(labelled({ 0: 'hard', 7: 'easy' }), { 0: 1800, 7: 500 });
    expect(screen.queryByRole('heading', { name: 'Where the two disagree' })).toBeNull();
  });

  it('declines to mark a quickest or slowest zone when the spread is flat', () => {
    show(labelled({ 0: 'easy' }));
    expect(screen.getByText(/too close together to call any spot quickest or slowest/)).toBeTruthy();
    expect(document.querySelectorAll('.time-cell.is-slowest')).toHaveLength(0);
  });

  it('states plainly what the map is not', () => {
    show(labelled({ 0: 'easy' }));
    const section = screen.getByRole('heading', { name: 'What this map is not' }).closest('section')!;
    expect(within(section).getByText(/Not a measurement of your hand/)).toBeTruthy();
    expect(within(section).getByText(/Not proof that moving controls will help/)).toBeTruthy();
  });

  it('reports the grip answer as the person gave it', () => {
    show(labelled({ 0: 'easy' }), undefined, 'yes');
    expect(screen.getByText(/shifted at least once/)).toBeTruthy();
  });
});

import { describe, expect, it } from 'vitest';
import {
  MESSAGES,
  TARGETS,
  compare,
  describeComfort,
  describeDuration,
  durationMs,
  initialTrial,
  pickFirstMode,
  stepsDone,
  trialPlan,
  trialReducer,
  type Comfort,
  type TrialAction,
  type TrialResult,
  type TrialState,
} from '../src/lib/trial';
import type { Mode } from '../src/types';

const run = (s: TrialState, ...actions: TrialAction[]) => actions.reduce(trialReducer, s);
const ready = (mode: Mode = 'standard') => initialTrial(mode, TARGETS[0]);
const started = (mode: Mode = 'standard', at = 1000) => run(ready(mode), { type: 'start', at });

/** The intended path: search, open the right message, menu, archive, back. */
const finish = (s: TrialState, endAt = 9000) =>
  run(
    s,
    { type: 'tapSearch' },
    { type: 'openMessage', id: TARGETS[0], at: 3000 },
    { type: 'tapMenu' },
    { type: 'tapArchive', at: 5000 },
    { type: 'tapBack', at: endAt },
  );

describe('the clock only ever covers the task', () => {
  it('does not run before Start', () => {
    const s = run(ready(), { type: 'tapSearch' }, { type: 'tapMenu' });
    expect(s.status).toBe('ready');
    expect(s.startedAt).toBeNull();
    expect(s.view).toBe('inbox'); // nothing happened at all
  });

  it('starts on Start and stops on the action that finishes the task', () => {
    const s = finish(started('standard', 1000), 9000);
    expect(s.status).toBe('complete');
    expect(durationMs(s)).toBe(8000);
  });

  it('ignores everything after the task is finished, so a rating cannot extend it', () => {
    const done = finish(started('standard', 1000), 9000);
    const after = run(done, { type: 'tapSearch' }, { type: 'tapMenu' }, { type: 'tapBack', at: 50_000 });
    expect(after).toBe(done);
    expect(durationMs(after)).toBe(8000);
  });

  it('has no duration for a trial that was abandoned', () => {
    const s = run(started(), { type: 'tapSearch' }, { type: 'abandon' });
    expect(s.status).toBe('abandoned');
    expect(durationMs(s)).toBeNull();
  });
});

describe('the task needs every control that moves', () => {
  it('is not finished by archiving alone — the inbox has to come back', () => {
    const s = run(
      started(),
      { type: 'tapSearch' },
      { type: 'openMessage', id: TARGETS[0], at: 2000 },
      { type: 'tapMenu' },
      { type: 'tapArchive', at: 3000 },
    );
    expect(s.archived).toBe(true);
    expect(s.status).toBe('running');
  });

  it('is not finished by going back without archiving', () => {
    const s = run(
      started(),
      { type: 'tapSearch' },
      { type: 'openMessage', id: TARGETS[0], at: 2000 },
      { type: 'tapBack', at: 3000 },
    );
    expect(s.status).toBe('running');
    expect(s.view).toBe('inbox');
  });

  it('reports progress as thirds, in order', () => {
    let s = started();
    expect(stepsDone(s)).toBe(0);
    s = run(s, { type: 'tapSearch' }, { type: 'openMessage', id: TARGETS[0], at: 2000 });
    expect(stepsDone(s)).toBe(1);
    s = run(s, { type: 'tapMenu' }, { type: 'tapArchive', at: 3000 });
    expect(stepsDone(s)).toBe(2);
    s = run(s, { type: 'tapBack', at: 4000 });
    expect(stepsDone(s)).toBe(3);
  });
});

describe('taps that do not advance the task are counted, not called errors', () => {
  it('counts opening the wrong message, and still lets the person recover', () => {
    const wrong = MESSAGES.find((m) => m.id !== TARGETS[0])!;
    let s = run(started(), { type: 'tapSearch' }, { type: 'openMessage', id: wrong.id, at: 2000 });
    expect(s.offTaskTaps).toBe(1);
    expect(s.view).toBe('message'); // it really did open; the person is not blocked
    s = run(s, { type: 'tapBack', at: 2500 });
    s = finish(s, 6000);
    expect(s.status).toBe('complete');
    expect(s.offTaskTaps).toBe(1);
  });

  it('counts archiving the wrong message without marking the task done', () => {
    const wrong = MESSAGES.find((m) => m.id !== TARGETS[0])!;
    const s = run(
      started(),
      { type: 'tapSearch' },
      { type: 'openMessage', id: wrong.id, at: 2000 },
      { type: 'tapMenu' },
      { type: 'tapArchive', at: 3000 },
    );
    expect(s.archived).toBe(false);
    expect(s.offTaskTaps).toBe(2); // the wrong open, then the wrong archive
  });

  it('counts back from the inbox, which goes nowhere', () => {
    expect(run(started(), { type: 'tapBack', at: 2000 }).offTaskTaps).toBe(1);
  });

  it('treats back as closing an open menu first, which is not an off-task tap', () => {
    const s = run(
      started(),
      { type: 'tapSearch' },
      { type: 'openMessage', id: TARGETS[0], at: 2000 },
      { type: 'tapMenu' },
      { type: 'tapBack', at: 2500 },
    );
    expect(s.menuOpen).toBe(false);
    expect(s.view).toBe('message');
    expect(s.offTaskTaps).toBe(0);
  });
});

describe('counterbalancing', () => {
  it('gives each layout the first slot about half the time', () => {
    let n = 0;
    for (let i = 0; i < 1000; i++) n += pickFirstMode(() => i / 1000) === 'standard' ? 1 : 0;
    expect(n).toBe(500);
  });

  it('runs ABBA, so each layout averages the same position', () => {
    for (const first of ['standard', 'kab'] as Mode[]) {
      const other: Mode = first === 'standard' ? 'kab' : 'standard';
      const plan = trialPlan(first);
      expect(plan.map((p) => p.mode)).toEqual([first, other, other, first]);
      expect(plan.map((p) => p.position)).toEqual([1, 2, 3, 4]);
      const mean = (m: Mode) => {
        const ps = plan.filter((p) => p.mode === m).map((p) => p.position);
        return ps.reduce((a, b) => a + b, 0) / ps.length;
      };
      expect(mean(first)).toBe(2.5);
      expect(mean(other)).toBe(2.5);
    }
  });

  it('gives every trial its own target, so none is a memory test of an earlier one', () => {
    const ids = trialPlan('standard').map((p) => p.targetId);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(MESSAGES.some((m) => m.id === id)).toBe(true);
  });
});

describe('compare — from completed trials, with the balance stated', () => {
  const result = (over: Partial<TrialResult> = {}): TrialResult => ({
    mode: 'standard', position: 1, targetId: TARGETS[0], durationMs: 8000,
    comfort: 4, offTaskTaps: 0, completed: true, ...over,
  });

  /** A full ABBA set: Original at 1 and 4, snerta at 2 and 3. */
  const abba = (std: number[], kab: number[], stdC: number[] = [4, 4], kabC: number[] = [3, 3]) => [
    result({ mode: 'standard', position: 1, durationMs: std[0], comfort: stdC[0] as 1 | 2 | 3 | 4 | 5 }),
    result({ mode: 'kab', position: 2, durationMs: kab[0], comfort: kabC[0] as 1 | 2 | 3 | 4 | 5 }),
    result({ mode: 'kab', position: 3, durationMs: kab[1], comfort: kabC[1] as 1 | 2 | 3 | 4 | 5 }),
    result({ mode: 'standard', position: 4, durationMs: std[1], comfort: stdC[1] as 1 | 2 | 3 | 4 | 5 }),
  ];

  it('takes the median of each layout runs and reports snerta as the subject', () => {
    const c = compare(abba([10000, 8000], [9000, 11000]))!;
    expect(c.standard.durationMs).toBe(9000);
    expect(c.kab.durationMs).toBe(10000);
    expect(c.durationDeltaMs).toBe(1000); // positive: snerta took longer
    expect(c.comfortDelta).toBe(-1);
  });

  it('calls a full ABBA set balanced, with both layouts at the same mean position', () => {
    const c = compare(abba([10000, 8000], [9000, 11000]))!;
    expect(c.balanced).toBe(true);
    expect(c.standard.meanPosition).toBe(2.5);
    expect(c.kab.meanPosition).toBe(2.5);
    expect(c.completedCount).toBe(4);
  });

  it('still compares when a run is lost, but marks it unbalanced', () => {
    const set = abba([10000, 8000], [9000, 11000]);
    set[2] = { ...set[2], completed: false };
    const c = compare(set)!;
    expect(c.balanced).toBe(false);
    expect(c.completedCount).toBe(3);
    expect(c.kab.meanPosition).toBe(2); // snerta now sits earlier than Original on average
  });

  it('refuses to compare when a layout has no completed run at all', () => {
    const set = abba([10000, 8000], [9000, 11000]);
    set[1] = { ...set[1], completed: false };
    set[2] = { ...set[2], completed: false };
    expect(compare(set)).toBeNull();
  });

  it('ignores incomplete runs rather than counting them as zero', () => {
    const set = abba([10000, 8000], [9000, 11000]);
    set[3] = { ...set[3], completed: false, durationMs: null };
    const c = compare(set)!;
    expect(c.standard.durationMs).toBe(10000); // the one completed Original run
    expect(c.standard.runs).toHaveLength(1);
  });

  it('still compares durations when a comfort rating was skipped', () => {
    const set = abba([8000, 8000], [8000, 8000]);
    set[1] = { ...set[1], comfort: null };
    set[2] = { ...set[2], comfort: null };
    const c = compare(set)!;
    expect(c.durationDeltaMs).toBe(0);
    expect(c.comfortDelta).toBeNull();
  });

  it('records which layout ran first', () => {
    expect(compare(abba([8000, 8000], [8000, 8000]))!.firstMode).toBe('standard');
    const kabFirst = abba([8000, 8000], [8000, 8000]).map((r) =>
      r.mode === 'standard' ? { ...r, position: (r.position === 1 ? 2 : 3) as 1 | 2 | 3 | 4 } : { ...r, position: (r.position === 2 ? 1 : 4) as 1 | 2 | 3 | 4 },
    );
    expect(compare(kabFirst)!.firstMode).toBe('kab');
  });

  it('averages comfort across a layout runs rather than taking one', () => {
    const c = compare(abba([8000, 8000], [8000, 8000], [5, 3], [4, 4]))!;
    expect(c.standard.comfort).toBe(4);
    expect(c.kab.comfort).toBe(4);
    expect(c.comfortDelta).toBe(0);
  });
});

describe('plain wording, with no spin either way', () => {
  it('says plainly when snerta was slower', () => {
    expect(describeDuration(1500)).toBe('With snerta the task took 1.5s longer.');
  });
  it('says plainly when snerta was quicker', () => {
    expect(describeDuration(-2300)).toBe('With snerta the task took 2.3s less.');
  });
  it('does not dress up a difference too small to mean anything', () => {
    expect(describeDuration(120)).toBe('About the same time in both layouts.');
    expect(describeDuration(-120)).toBe('About the same time in both layouts.');
  });
  it('reports comfort in both directions and when it is level', () => {
    expect(describeComfort(-2)).toMatch(/2 points less comfortable/);
    expect(describeComfort(1)).toMatch(/1 point more comfortable/);
    expect(describeComfort(0)).toMatch(/equally comfortable/);
  });
  it('handles a half-point average without pretending to whole numbers', () => {
    expect(describeComfort(1.5)).toMatch(/1\.5 points more comfortable/);
  });
});

describe('the fictional inbox', () => {
  it('has four distinct targets, all real entries in the list', () => {
    expect(new Set(TARGETS).size).toBe(4);
    for (const id of TARGETS) expect(MESSAGES.some((m) => m.id === id)).toBe(true);
  });

  it('carries nothing that looks like a real account, address or amount', () => {
    const text = JSON.stringify(MESSAGES);
    expect(text).not.toMatch(/@|https?:|[£$€]\d|\d{4}\s?\d{4}/);
  });
});

describe('comfort ratings', () => {
  it('accepts the full 1-5 range', () => {
    const all: Comfort[] = [1, 2, 3, 4, 5];
    expect(all).toHaveLength(5);
  });
});

describe('a difference smaller than the person’s own variation is not a reading', () => {
  const r = (mode: Mode, position: 1 | 2 | 3 | 4, durationMs: number): TrialResult => ({
    mode, position, targetId: TARGETS[position - 1], durationMs,
    comfort: 4, offTaskTaps: 0, completed: true,
  });

  it('records each layout’s own run-to-run spread', () => {
    const c = compare([
      r('standard', 1, 8000), r('kab', 2, 9000), r('kab', 3, 12500), r('standard', 4, 10100),
    ])!;
    expect(c.standard.spreadMs).toBe(2100);
    expect(c.kab.spreadMs).toBe(3500);
    expect(c.withinSpreadMs).toBe(3500);
  });

  it('flags a layout gap that is smaller than that spread', () => {
    // The real n=2 session: 1.2s between layouts, 3.5s within one of them.
    const c = compare([
      r('kab', 1, 9368), r('standard', 2, 12431), r('standard', 3, 7338), r('kab', 4, 12866),
    ])!;
    expect(Math.abs(c.durationDeltaMs!)).toBeLessThan(c.withinSpreadMs!);
    expect(c.insideNoise).toBe(true);
  });

  it('does not flag a gap that clears the spread', () => {
    const c = compare([
      r('standard', 1, 12000), r('kab', 2, 6000), r('kab', 3, 6200), r('standard', 4, 12200),
    ])!;
    expect(c.insideNoise).toBe(false);
  });

  it('cannot judge noise from one run per layout, and says so by not claiming it', () => {
    const c = compare([r('standard', 1, 8000), r('kab', 2, 11000)])!;
    expect(c.withinSpreadMs).toBeNull();
    expect(c.insideNoise).toBe(false);
  });
});

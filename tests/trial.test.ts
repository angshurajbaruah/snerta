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
const ready = (mode: Mode = 'standard') => initialTrial(mode, TARGETS.a);
const started = (mode: Mode = 'standard', at = 1000) => run(ready(mode), { type: 'start', at });

/** The intended path: search, open the right message, menu, archive, back. */
const finish = (s: TrialState, endAt = 9000) =>
  run(
    s,
    { type: 'tapSearch' },
    { type: 'openMessage', id: TARGETS.a, at: 3000 },
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
      { type: 'openMessage', id: TARGETS.a, at: 2000 },
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
      { type: 'openMessage', id: TARGETS.a, at: 2000 },
      { type: 'tapBack', at: 3000 },
    );
    expect(s.status).toBe('running');
    expect(s.view).toBe('inbox');
  });

  it('reports progress as thirds, in order', () => {
    let s = started();
    expect(stepsDone(s)).toBe(0);
    s = run(s, { type: 'tapSearch' }, { type: 'openMessage', id: TARGETS.a, at: 2000 });
    expect(stepsDone(s)).toBe(1);
    s = run(s, { type: 'tapMenu' }, { type: 'tapArchive', at: 3000 });
    expect(stepsDone(s)).toBe(2);
    s = run(s, { type: 'tapBack', at: 4000 });
    expect(stepsDone(s)).toBe(3);
  });
});

describe('taps that do not advance the task are counted, not called errors', () => {
  it('counts opening the wrong message, and still lets the person recover', () => {
    const wrong = MESSAGES.find((m) => m.id !== TARGETS.a)!;
    let s = run(started(), { type: 'tapSearch' }, { type: 'openMessage', id: wrong.id, at: 2000 });
    expect(s.offTaskTaps).toBe(1);
    expect(s.view).toBe('message'); // it really did open; the person is not blocked
    s = run(s, { type: 'tapBack', at: 2500 });
    s = finish(s, 6000);
    expect(s.status).toBe('complete');
    expect(s.offTaskTaps).toBe(1);
  });

  it('counts archiving the wrong message without marking the task done', () => {
    const wrong = MESSAGES.find((m) => m.id !== TARGETS.a)!;
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
      { type: 'openMessage', id: TARGETS.a, at: 2000 },
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

  it('runs both layouts, in order, on two different messages', () => {
    for (const first of ['standard', 'kab'] as Mode[]) {
      const plan = trialPlan(first);
      expect(plan.map((p) => p.mode)).toEqual([first, first === 'standard' ? 'kab' : 'standard']);
      expect(plan.map((p) => p.position)).toEqual([1, 2]);
      expect(plan[0].targetId).not.toBe(plan[1].targetId);
    }
  });
});

describe('compare — only from two finished, comparable trials', () => {
  const result = (over: Partial<TrialResult> = {}): TrialResult => ({
    mode: 'standard', position: 1, targetId: TARGETS.a, durationMs: 8000,
    comfort: 4, offTaskTaps: 0, completed: true, ...over,
  });

  it('reports both deltas with snerta as the subject', () => {
    const c = compare([
      result({ mode: 'standard', position: 1, durationMs: 8000, comfort: 4 }),
      result({ mode: 'kab', position: 2, durationMs: 9500, comfort: 3 }),
    ])!;
    expect(c.durationDeltaMs).toBe(1500); // positive: snerta took longer
    expect(c.comfortDelta).toBe(-1); // negative: snerta felt worse
    expect(c.firstMode).toBe('standard');
  });

  it('refuses to compare when a trial was not completed', () => {
    expect(compare([result({ mode: 'standard' }), result({ mode: 'kab', completed: false })])).toBeNull();
  });

  it('refuses to compare when a trial is missing', () => {
    expect(compare([result({ mode: 'standard' })])).toBeNull();
  });

  it('refuses to compare when a duration was never recorded', () => {
    expect(compare([result({ mode: 'standard' }), result({ mode: 'kab', durationMs: null })])).toBeNull();
  });

  it('still compares durations when a comfort rating was skipped', () => {
    const c = compare([result({ mode: 'standard' }), result({ mode: 'kab', comfort: null })])!;
    expect(c.durationDeltaMs).toBe(0);
    expect(c.comfortDelta).toBeNull();
  });

  it('records which layout ran first, since practice favours the second', () => {
    const c = compare([
      result({ mode: 'standard', position: 2 }),
      result({ mode: 'kab', position: 1 }),
    ])!;
    expect(c.firstMode).toBe('kab');
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
});

describe('the fictional inbox', () => {
  it('has two matched targets, both real entries in the list', () => {
    expect(TARGETS.a).not.toBe(TARGETS.b);
    for (const id of Object.values(TARGETS)) {
      expect(MESSAGES.some((m) => m.id === id)).toBe(true);
    }
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

import { describe, expect, it } from 'vitest';
import { TARGET_COUNT } from '../src/lib/calibration';
import * as reach from '../src/lib/reach';
import {
  emptyReport,
  findMismatches,
  isReportEmpty,
  latencyByZone,
  nextLabel,
  rankZones,
  reportCounts,
  samplesByZone,
  zoneName,
} from '../src/lib/reach';
import type { ReachLabel, TapSample } from '../src/types';

function sample(targetId: number, latencyMs: number, promptRestarted = false): TapSample {
  return {
    index: 0, targetId, pointerType: 'touch', targetX: 0, targetY: 0, pointerX: 0, pointerY: 0,
    latencyMs, promptRestarted, viewportW: 393, viewportH: 695, panelW: 393, panelH: 631,
    occurredAtIso: '2026-11-13T00:00:00.000Z',
  };
}

describe('self-report', () => {
  it('starts every zone unknown, and an untouched report stays empty', () => {
    const r = emptyReport();
    expect(r).toHaveLength(TARGET_COUNT);
    expect(r.every((l) => l === 'unknown')).toBe(true);
    expect(isReportEmpty(r)).toBe(true);
  });

  it('cycles through all four labels and back to unknown, so nothing is a trap', () => {
    let l: ReachLabel = 'unknown';
    const seen: ReachLabel[] = [];
    for (let i = 0; i < 4; i++) {
      l = nextLabel(l);
      seen.push(l);
    }
    expect(seen).toEqual(['easy', 'stretch', 'hard', 'unknown']);
  });

  it('counts labels without quietly reclassifying unknowns', () => {
    const labels: ReachLabel[] = ['easy', 'easy', 'unknown', 'hard', 'stretch', 'unknown'];
    expect(reportCounts(labels)).toEqual({ easy: 2, stretch: 1, hard: 1, unknown: 2 });
  });

  it('names zones in words for screen readers', () => {
    expect(zoneName(0)).toBe('top left');
    expect(zoneName(1)).toBe('top centre');
    expect(zoneName(7)).toBe('middle centre');
    expect(zoneName(TARGET_COUNT - 1)).toBe('bottom right');
  });
});

describe('latencyByZone', () => {
  it('takes the median per zone and ignores samples whose clock was restarted', () => {
    const got = latencyByZone([sample(0, 500), sample(0, 700), sample(0, 9999, true), sample(4, 300)]);
    expect(got[0]).toBe(600);
    expect(got[4]).toBe(300);
    expect(got[1]).toBeNull();
  });

  it('is null everywhere when there are no samples, rather than zero', () => {
    expect(latencyByZone([]).every((v) => v === null)).toBe(true);
  });
});

describe('rankZones', () => {
  const full = (values: number[]) => values;

  it('marks nothing when the spread is too narrow to mean anything', () => {
    const flat = full(Array.from({ length: TARGET_COUNT }, (_, i) => 600 + i)); // 600..614
    expect(rankZones(flat).every((r) => r === null)).toBe(true);
  });

  it('marks only the extremes once the spread is wide', () => {
    const v = full(Array.from({ length: TARGET_COUNT }, () => 600));
    v[0] = 2000;
    v[5] = 400;
    const ranks = rankZones(v);
    expect(ranks[0]).toBe('slowest');
    expect(ranks[5]).toBe('quickest');
    expect(ranks.filter(Boolean)).toHaveLength(2);
  });

  it('marks nothing while any zone is missing data', () => {
    const v: (number | null)[] = Array.from({ length: TARGET_COUNT }, () => 600);
    v[0] = 3000;
    v[1] = null;
    expect(rankZones(v).every((r) => r === null)).toBe(true);
  });
});

describe('findMismatches — the point of asking at all', () => {
  const labels = (spec: Partial<Record<number, ReachLabel>>): ReachLabel[] =>
    Array.from({ length: TARGET_COUNT }, (_, i) => spec[i] ?? 'unknown');

  const latency = (spec: Partial<Record<number, number>>): (number | null)[] =>
    Array.from({ length: TARGET_COUNT }, (_, i) => spec[i] ?? 600);

  it('flags a zone the person called easy that took far longer than typical', () => {
    const m = findMismatches(labels({ 0: 'easy' }), latency({ 0: 1800 }));
    expect(m).toHaveLength(1);
    expect(m[0]).toMatchObject({ zoneId: 0, label: 'easy', kind: 'slow-but-easy' });
    expect(m[0].ratio).toBeCloseTo(3, 1);
  });

  it('flags a zone the person called hard that was tapped as fast as anywhere', () => {
    const m = findMismatches(labels({ 3: 'hard' }), latency({ 3: 480 }));
    expect(m).toHaveLength(1);
    expect(m[0]).toMatchObject({ zoneId: 3, label: 'hard', kind: 'quick-but-hard' });
  });

  it('flags nothing when the labels and the timings agree', () => {
    expect(findMismatches(labels({ 0: 'hard', 7: 'easy' }), latency({ 0: 1800, 7: 500 }))).toEqual([]);
  });

  it('never flags an unknown — a zone the person did not label cannot disagree', () => {
    expect(findMismatches(labels({ 0: 'unknown' }), latency({ 0: 5000 }))).toEqual([]);
  });

  it('is silent when there are no timings to compare against', () => {
    expect(findMismatches(labels({ 0: 'easy' }), Array(TARGET_COUNT).fill(null))).toEqual([]);
  });

  it('orders the strongest disagreement first', () => {
    const m = findMismatches(labels({ 0: 'easy', 1: 'easy' }), latency({ 0: 1100, 1: 2400 }));
    expect(m.map((x) => x.zoneId)).toEqual([1, 0]);
  });
});

describe('comfort is never inferred from timing', () => {
  it('the module exposes nothing that turns a timing into a label', () => {
    // The brief forbids deriving comfort from speed. Keeping that true is a matter of
    // there being no such function to call, so this asserts on the real export surface.
    const suspicious = Object.keys(reach).filter((k) => /infer|derive|classif|labelFrom|fromLatency/i.test(k));
    expect(suspicious).toEqual([]);
  });

  it('a report full of unknowns stays full of unknowns however extreme the timings', () => {
    const labels = emptyReport();
    const wild = Array.from({ length: TARGET_COUNT }, (_, i) => (i === 0 ? 9000 : 300));
    expect(findMismatches(labels, wild)).toEqual([]);
    expect(reportCounts(labels).unknown).toBe(TARGET_COUNT);
    expect(isReportEmpty(labels)).toBe(true);
  });
});

describe('a disagreement has to hold across every tap in the zone', () => {
  const labels = (spec: Partial<Record<number, ReachLabel>>): ReachLabel[] =>
    Array.from({ length: TARGET_COUNT }, (_, i) => spec[i] ?? 'unknown');
  const latency = (spec: Partial<Record<number, number>>): (number | null)[] =>
    Array.from({ length: TARGET_COUNT }, (_, i) => spec[i] ?? 600);
  const perZone = (spec: Partial<Record<number, number[]>>): number[][] =>
    Array.from({ length: TARGET_COUNT }, (_, i) => spec[i] ?? [600, 600]);

  it('ignores a zone carried over the line by one slow tap', () => {
    // Real case, 2026-11-13: lower-middle-right averaged 1.62x off taps of 743 and 1639 ms.
    const found = findMismatches(
      labels({ 11: 'easy' }),
      latency({ 11: 1191 }),
      { perZone: perZone({ 11: [743, 1639] }) },
    );
    expect(found).toEqual([]);
  });

  it('still reports a zone that was slow on every tap', () => {
    const found = findMismatches(
      labels({ 0: 'easy' }),
      latency({ 0: 1800 }),
      { perZone: perZone({ 0: [1700, 1900] }) },
    );
    expect(found).toHaveLength(1);
    expect(found[0].zoneId).toBe(0);
  });

  it('falls back to the zone median when the individual taps are not supplied', () => {
    expect(findMismatches(labels({ 0: 'easy' }), latency({ 0: 1800 }))).toHaveLength(1);
  });
});

describe('samplesByZone', () => {
  it('keeps every usable tap per zone and drops restarted ones', () => {
    const by = samplesByZone([sample(0, 500), sample(0, 900), sample(0, 4000, true), sample(2, 700)]);
    expect(by[0]).toEqual([500, 900]);
    expect(by[2]).toEqual([700]);
    expect(by[1]).toEqual([]);
  });
});

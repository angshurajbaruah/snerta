import { describe, expect, it } from 'vitest';
import { nearestToThumb, placementFor } from '../src/lib/layout';
import type { Hand } from '../src/types';
import { buildSessionExport, SCHEMA_VERSION } from '../src/lib/export';
import type { ReachLabel } from '../src/types';

describe('placementFor', () => {
  const HANDS: Hand[] = ['left', 'right', 'both'];

  it('Original keeps every control in the header and has no rail at all', () => {
    for (const h of HANDS) {
      const p = placementFor('standard', h);
      expect(p.rail).toEqual([]);
      expect([...p.header].sort()).toEqual(['back', 'menu', 'search']);
    }
    expect(placementFor('standard', 'left')).toEqual(placementFor('standard', 'both'));
  });

  it('moves every control into the rail, leaving nothing behind in the header', () => {
    // An earlier build held `menu` back. That made the snerta condition a hybrid and
    // would have made a null result impossible to attribute.
    for (const h of HANDS) {
      const p = placementFor('kab', h);
      expect([...p.rail].sort()).toEqual(['back', 'menu', 'search']);
      expect(p.header).toEqual([]);
    }
  });

  it('never loses or duplicates a control between the two layouts', () => {
    for (const h of HANDS) {
      for (const m of ['standard', 'kab'] as const) {
        const p = placementFor(m, h);
        expect([...p.rail, ...p.header].sort()).toEqual(['back', 'menu', 'search']);
      }
    }
  });

  it('sends the rail to the chosen side, and to the centre when the hand varies', () => {
    expect(placementFor('kab', 'right').side).toBe('right');
    expect(placementFor('kab', 'left').side).toBe('left');
    expect(placementFor('kab', 'both').side).toBe('center');
  });

  it('puts Back nearest the resting thumb on either side, mirroring the order', () => {
    expect(nearestToThumb(placementFor('kab', 'right'))).toBe('back');
    expect(nearestToThumb(placementFor('kab', 'left'))).toBe('back');
    expect(placementFor('kab', 'left').rail).toEqual([...placementFor('kab', 'right').rail].reverse());
  });

  it('has no nearest-thumb control when nothing moved', () => {
    expect(nearestToThumb(placementFor('standard', 'right'))).toBeNull();
  });
});

describe('buildSessionExport', () => {
  const base = { hand: 'left' as const, samples: [], observations: [], hiddenCount: 0, now: new Date('2026-11-12T10:00:00Z') };

  it('reflects real state, includes limitations and carries no identifiers', () => {
    const out = buildSessionExport({ ...base, skipped: true });
    expect(out.schemaVersion).toBe(SCHEMA_VERSION);
    expect(out.evidence).toBe('preview');
    expect(out.calibrationSkipped).toBe(true);
    expect(out.limitations.length).toBeGreaterThan(0);
    const text = JSON.stringify(out);
    expect(text).not.toMatch(/userAgent|deviceId|email|name"/i);
  });

  it('carries the self-report as the person gave it, with unknowns intact', () => {
    const labels: ReachLabel[] = ['easy', 'unknown', 'hard'];
    const out = buildSessionExport({ ...base, skipped: false, labels, grip: 'yes' });
    expect(out.selfReport).toEqual([
      { zoneId: 0, label: 'easy' },
      { zoneId: 1, label: 'unknown' },
      { zoneId: 2, label: 'hard' },
    ]);
    expect(out.gripChanged).toBe('yes');
  });

  it('keeps the labels and the timings as separate fields', () => {
    const out = buildSessionExport({ ...base, skipped: false, labels: ['easy'] });
    expect(out).toHaveProperty('selfReport');
    expect(out).toHaveProperty('latencyByZoneMs');
    // No sample data, so every zone's timing is null and nothing was inferred from a label.
    expect(out.latencyByZoneMs.every((v) => v === null)).toBe(true);
  });

  it('records no self-report at all when none was given', () => {
    const out = buildSessionExport({ ...base, skipped: true });
    expect(out.selfReport).toBeNull();
    expect(out.gripChanged).toBeNull();
  });
});

import { describe, expect, it } from 'vitest';
import { nearestToThumb, placementFor } from '../src/lib/layout';
import type { Hand } from '../src/types';
import { buildSpikeExport, SCHEMA_VERSION } from '../src/lib/export';

describe('placementFor', () => {
  const HANDS: Hand[] = ['left', 'right', 'both'];

  it('Original keeps every control in the header, whichever hand', () => {
    for (const h of HANDS) expect(placementFor('standard', h)).toMatchObject({ region: 'header' });
    expect(placementFor('standard', 'left')).toEqual(placementFor('standard', 'both'));
  });

  it('moves the same three controls, never a different set', () => {
    for (const h of HANDS) {
      for (const m of ['standard', 'kab'] as const) {
        expect([...placementFor(m, h).order].sort()).toEqual(['back', 'menu', 'search']);
      }
    }
  });

  it('snerta sends the rail to the chosen side, and to the centre when the hand varies', () => {
    expect(placementFor('kab', 'right')).toMatchObject({ region: 'rail', side: 'right' });
    expect(placementFor('kab', 'left')).toMatchObject({ region: 'rail', side: 'left' });
    expect(placementFor('kab', 'both')).toMatchObject({ region: 'rail', side: 'center' });
  });

  it('puts Back nearest the thumb on either side, and mirrors the order', () => {
    expect(nearestToThumb(placementFor('kab', 'right'))).toBe('back');
    expect(nearestToThumb(placementFor('kab', 'left'))).toBe('back');
    expect(placementFor('kab', 'left').order).toEqual([...placementFor('kab', 'right').order].reverse());
  });

  it('has no nearest-thumb control in the header layout', () => {
    expect(nearestToThumb(placementFor('standard', 'right'))).toBeNull();
  });
});

describe('buildSpikeExport', () => {
  it('reflects real state, includes limitations and carries no identifiers', () => {
    const out = buildSpikeExport({ hand: 'left', samples: [], observations: [], hiddenCount: 0, skipped: true, now: new Date('2026-11-12T10:00:00Z') });
    expect(out.schemaVersion).toBe(SCHEMA_VERSION);
    expect(out.evidence).toBe('preview');
    expect(out.calibrationSkipped).toBe(true);
    expect(out.limitations.length).toBeGreaterThan(0);
    const text = JSON.stringify(out);
    expect(text).not.toMatch(/userAgent|deviceId|email|name"/i);
  });
});

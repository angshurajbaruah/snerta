import { describe, expect, it } from 'vitest';
import { placementFor } from '../src/lib/layout';
import { buildSpikeExport, SCHEMA_VERSION } from '../src/lib/export';

describe('placementFor', () => {
  it('Standard keeps Back and Bag in the header regardless of hand', () => {
    expect(placementFor('standard', 'left')).toEqual(placementFor('standard', 'right'));
    expect(placementFor('standard', 'right').region).toBe('header');
  });

  it('K’ab moves the same two controls to a lower rail on the chosen side', () => {
    const r = placementFor('kab', 'right');
    const l = placementFor('kab', 'left');
    expect(r).toMatchObject({ region: 'rail', side: 'right' });
    expect(l).toMatchObject({ region: 'rail', side: 'left' });
    expect([...r.order].sort()).toEqual(['back', 'bag']);
    expect([...l.order].sort()).toEqual(['back', 'bag']);
    // Bag sits at the outer edge on each side
    expect(r.order[r.order.length - 1]).toBe('bag');
    expect(l.order[0]).toBe('bag');
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

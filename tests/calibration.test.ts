import { describe, expect, it } from 'vitest';
import {
  SEQUENCE_LENGTH,
  calibrationReducer,
  classifyPointerDown,
  evidenceKind,
  initialCalibration,
  isGeometryCompatible,
  makeSequence,
  median,
  normalizePoint,
  targetCenterClient,
  type CalibrationEvent,
  type CalibrationState,
  type GeometrySnapshot,
} from '../src/lib/calibration';
import type { PanelRect, TapSample } from '../src/types';

const RECT: PanelRect = { left: 20, top: 100, width: 300, height: 450 };
const GEO: GeometrySnapshot = { viewportW: 390, orientation: 'portrait', scale: 1 };

/** Deterministic PRNG so tests are repeatable. */
function seeded(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 2 ** 32;
  };
}

function tapOn(state: CalibrationState, opts: Partial<{ dx: number; dy: number; pointerType: string; isPrimary: boolean; button: number; at: number }> = {}): CalibrationEvent {
  const id = state.sequence[state.step];
  const c = targetCenterClient(id, RECT);
  return {
    type: 'pointerdown',
    input: {
      clientX: c.x + (opts.dx ?? 0),
      clientY: c.y + (opts.dy ?? 0),
      pointerType: opts.pointerType ?? 'touch',
      isPrimary: opts.isPrimary ?? true,
      button: opts.button ?? 0,
    },
    rect: RECT,
    at: opts.at ?? 1000,
    viewportW: 390,
    viewportH: 844,
    iso: '2026-11-12T00:00:00.000Z',
  };
}

function prompted(state: CalibrationState, at = 500) {
  return calibrationReducer(state, { type: 'prompted', at });
}

function fresh(seed = 1) {
  return initialCalibration(makeSequence(seeded(seed)), GEO);
}

describe('makeSequence', () => {
  it('contains each of the 9 positions exactly twice, as two full passes', () => {
    for (let seed = 1; seed < 300; seed++) {
      const seq = makeSequence(seeded(seed));
      expect(seq).toHaveLength(18);
      expect(seq.slice(0, 9).sort()).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8]);
      expect(seq.slice(9).sort()).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8]);
    }
  });

  it('never prompts the same position twice in a row (including across the pass boundary)', () => {
    for (let seed = 1; seed < 2000; seed++) {
      const seq = makeSequence(seeded(seed));
      for (let i = 1; i < seq.length; i++) expect(seq[i]).not.toBe(seq[i - 1]);
    }
  });
});

describe('normalizePoint', () => {
  it('maps panel corners and centre into [0,1]', () => {
    expect(normalizePoint(20, 100, RECT)).toEqual({ x: 0, y: 0 });
    expect(normalizePoint(320, 550, RECT)).toEqual({ x: 1, y: 1 });
    expect(normalizePoint(170, 325, RECT)).toEqual({ x: 0.5, y: 0.5 });
  });

  it('rejects zero, negative and non-finite geometry', () => {
    expect(normalizePoint(10, 10, { left: 0, top: 0, width: 0, height: 100 })).toBeNull();
    expect(normalizePoint(10, 10, { left: 0, top: 0, width: 100, height: -5 })).toBeNull();
    expect(normalizePoint(NaN, 10, RECT)).toBeNull();
    expect(normalizePoint(10, 10, { left: 0, top: Infinity, width: 100, height: 100 })).toBeNull();
  });
});

describe('classifyPointerDown', () => {
  const c = targetCenterClient(4, RECT);
  const base = { clientX: c.x, clientY: c.y, pointerType: 'touch', isPrimary: true, button: 0 };

  it('accepts inside the 52px square and nothing beyond it', () => {
    expect(classifyPointerDown({ ...base, clientX: c.x + 26, clientY: c.y - 26 }, 4, RECT)).toBe('hit');
    expect(classifyPointerDown({ ...base, clientX: c.x + 27 }, 4, RECT)).toBe('observation');
  });

  it('treats secondary buttons and non-primary pointers as observations, never hits', () => {
    expect(classifyPointerDown({ ...base, button: 2, pointerType: 'mouse' }, 4, RECT)).toBe('observation');
    expect(classifyPointerDown({ ...base, isPrimary: false }, 4, RECT)).toBe('observation');
  });

  it('ignores events when the panel has no usable size', () => {
    expect(classifyPointerDown(base, 4, { left: 0, top: 0, width: 0, height: 0 })).toBe('ignore');
  });
});

describe('calibrationReducer', () => {
  it('ignores taps before the target has been painted', () => {
    const s = fresh();
    expect(calibrationReducer(s, tapOn(s))).toBe(s);
  });

  it('one pointerdown on the active target produces exactly one sample', () => {
    let s = prompted(fresh());
    s = calibrationReducer(s, tapOn(s));
    expect(s.samples).toHaveLength(1);
    expect(s.step).toBe(1);
    // A second pointerdown before the next prompt paints (e.g. a lingering contact) does nothing.
    const again = calibrationReducer(s, tapOn(s));
    expect(again.samples).toHaveLength(1);
  });

  it('records normalized target and pointer in the same panel frame, and latency from prompt', () => {
    let s = prompted(fresh(), 400);
    const id = s.sequence[0];
    s = calibrationReducer(s, tapOn(s, { dx: 6, dy: -9, at: 1234.6 }));
    const t = s.samples[0];
    expect(t.targetId).toBe(id);
    expect(t.pointerX).toBeCloseTo(t.targetX + 6 / RECT.width, 3);
    expect(t.pointerY).toBeCloseTo(t.targetY - 9 / RECT.height, 3);
    expect(t.latencyMs).toBe(835);
    expect(t.panelW).toBe(300);
    expect(t.pointerType).toBe('touch');
  });

  it('wrong-position taps, secondary buttons and second fingers do not advance', () => {
    let s = prompted(fresh());
    s = calibrationReducer(s, tapOn(s, { dx: 80 }));
    s = calibrationReducer(s, tapOn(s, { button: 2, pointerType: 'mouse' }));
    s = calibrationReducer(s, tapOn(s, { isPrimary: false }));
    expect(s.samples).toHaveLength(0);
    expect(s.step).toBe(0);
    expect(s.observations).toHaveLength(3);
  });

  it('completes after exactly 18 accepted taps and then ignores further input', () => {
    let s = fresh(7);
    for (let i = 0; i < SEQUENCE_LENGTH; i++) {
      s = prompted(s, i * 1000);
      s = calibrationReducer(s, tapOn(s, { at: i * 1000 + 600 }));
    }
    expect(s.status).toBe('complete');
    expect(s.samples).toHaveLength(18);
    expect(s.samples.map((x) => x.targetId)).toEqual(s.sequence);
    const after = calibrationReducer(s, { type: 'prompted', at: 99999 });
    expect(after).toBe(s);
  });

  it('pauses while hidden and restarts the prompt clock on return (time away is not counted)', () => {
    let s = prompted(fresh(), 100);
    s = calibrationReducer(s, { type: 'hidden' });
    expect(calibrationReducer(s, tapOn(s)).samples).toHaveLength(0); // taps ignored while hidden
    s = calibrationReducer(s, { type: 'visible' });
    expect(s.promptAt).toBeNull();
    s = prompted(s, 50_000);
    s = calibrationReducer(s, tapOn(s, { at: 50_700 }));
    expect(s.samples[0].latencyMs).toBe(700);
    expect(s.samples[0].promptRestarted).toBe(true);
    expect(s.hiddenCount).toBe(1);
  });

  it('interrupts on rotation, width change or zoom, but tolerates height-only toolbar changes', () => {
    const s = prompted(fresh());
    expect(calibrationReducer(s, { type: 'geometry', now: { ...GEO } }).status).toBe('running');
    expect(calibrationReducer(s, { type: 'geometry', now: { ...GEO, orientation: 'landscape' } }).status).toBe('interrupted');
    expect(calibrationReducer(s, { type: 'geometry', now: { ...GEO, viewportW: 844 } }).status).toBe('interrupted');
    const zoomed = calibrationReducer(s, { type: 'geometry', now: { ...GEO, scale: 2 } });
    expect(zoomed.status).toBe('interrupted');
    expect(zoomed.interruptionReason).toMatch(/zoom/);
    // once interrupted, further taps never add to the set-aside run
    expect(calibrationReducer(zoomed, tapOn(zoomed)).samples).toHaveLength(0);
  });

  it('isGeometryCompatible ignores viewport height entirely', () => {
    expect(isGeometryCompatible(GEO, { ...GEO })).toBe(true);
  });
});

describe('evidenceKind', () => {
  const sample = (pointerType: string): TapSample => ({
    index: 0, targetId: 0, pointerType, targetX: 0, targetY: 0, pointerX: 0, pointerY: 0,
    latencyMs: 1, promptRestarted: false, viewportW: 1, viewportH: 1, panelW: 1, panelH: 1, occurredAtIso: '',
  });

  it('labels touch only when all 18 samples are browser-reported touch', () => {
    expect(evidenceKind(Array(18).fill(sample('touch')))).toBe('touch');
    expect(evidenceKind([...Array(17).fill(sample('touch')), sample('mouse')])).toBe('preview');
    expect(evidenceKind(Array(18).fill(sample('pen')))).toBe('preview');
    expect(evidenceKind(Array(5).fill(sample('touch')))).toBe('incomplete');
  });
});

describe('median', () => {
  it('handles empty, odd and even inputs', () => {
    expect(median([])).toBeNull();
    expect(median([3, 1, 2])).toBe(2);
    expect(median([4, 1, 3, 2])).toBe(2.5);
  });
});

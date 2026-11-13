import type { PanelObservation, PanelRect, TapSample } from '../types';

/** Grid, row-major from the top-left: COLS wide by ROWS tall. */
export const COLS = 3;
export const ROWS = 5;
export const TARGET_COUNT = COLS * ROWS;
/** How many times each position is prompted. Two passes give a repeat measure per position. */
export const PASSES = 2;
export const MEASURED_COUNT = TARGET_COUNT * PASSES;
/** Unrecorded taps at the start, so nobody is still working out the task on real data. */
export const PRACTICE_COUNT = 3;
export const SEQUENCE_LENGTH = PRACTICE_COUNT + MEASURED_COUNT;
/** Hit area is a 52×52 CSS px square around each target centre. */
export const HIT_HALF_SIZE_PX = 26;

/**
 * Target centres as fractions of the tray, which now spans the whole screen.
 *
 * The first build put a 3×3 grid inside a card in the middle of the page, so every
 * target sat between 34% and 69% down the screen — the comfortable band. The top of
 * the screen, which is the part one-handed reach actually fails at, was never sampled,
 * and the resulting latencies were predictably flat. Found on a real phone, 2026-11-13.
 *
 * The insets are the smallest that keep every 52px hit square fully on the tray at the
 * narrowest supported size; `hit squares stay on the tray` in the tests pins this.
 */
export const COL_FRACTIONS = [0.12, 0.5, 0.88];
export const ROW_FRACTIONS = [0.06, 0.28, 0.5, 0.72, 0.94];

export type Rng = () => number;

function shuffle<T>(items: readonly T[], rng: Rng): T[] {
  const out = items.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/**
 * Two independent random passes over the nine positions.
 * The first target of pass two never repeats the last target of pass one,
 * so no position is ever prompted twice in a row.
 */
export function makeSequence(rng: Rng = Math.random): number[] {
  const ids = Array.from({ length: TARGET_COUNT }, (_, i) => i);
  const sequence: number[] = [];
  // Practice taps come from the middle rows, so the task is learned on easy targets
  // rather than on a stretch, and they are never recorded.
  const easy = ids.filter((id) => {
    const row = Math.floor(id / COLS);
    return row >= 1 && row <= ROWS - 2;
  });
  for (let i = 0; i < PRACTICE_COUNT; i++) {
    const pool = shuffle(easy, rng).filter((id) => id !== sequence[sequence.length - 1]);
    sequence.push(pool[0]);
  }
  for (let p = 0; p < PASSES; p++) {
    const pass = shuffle(ids, rng);
    const prev = sequence[sequence.length - 1];
    if (prev !== undefined && pass[0] === prev) {
      // swap the clash with a random later element
      const k = 1 + Math.floor(rng() * (pass.length - 1));
      [pass[0], pass[k]] = [pass[k], pass[0]];
    }
    sequence.push(...pass);
  }
  return sequence;
}

export function isValidRect(rect: PanelRect | null | undefined): rect is PanelRect {
  return (
    !!rect &&
    [rect.left, rect.top, rect.width, rect.height].every(Number.isFinite) &&
    rect.width > 0 &&
    rect.height > 0
  );
}

/** Normalize a client-space point into [0,1] panel space. Returns null for unusable geometry. */
export function normalizePoint(
  clientX: number,
  clientY: number,
  rect: PanelRect,
): { x: number; y: number } | null {
  if (!isValidRect(rect) || !Number.isFinite(clientX) || !Number.isFinite(clientY)) return null;
  return { x: (clientX - rect.left) / rect.width, y: (clientY - rect.top) / rect.height };
}

export function targetFraction(targetId: number): { x: number; y: number } {
  if (!Number.isInteger(targetId) || targetId < 0 || targetId >= TARGET_COUNT) {
    throw new RangeError(`targetId out of range: ${targetId}`);
  }
  return {
    x: COL_FRACTIONS[targetId % COLS],
    y: ROW_FRACTIONS[Math.floor(targetId / COLS)],
  };
}

export function targetCenterClient(targetId: number, rect: PanelRect): { x: number; y: number } {
  const f = targetFraction(targetId);
  return { x: rect.left + f.x * rect.width, y: rect.top + f.y * rect.height };
}

export type PointerInput = {
  clientX: number;
  clientY: number;
  pointerType: string;
  isPrimary: boolean;
  /** 0 = primary button / touch contact. */
  button: number;
};

export type PointerVerdict = 'hit' | 'observation' | 'ignore';

/**
 * Decide what a single pointerdown means. Only a primary-button, primary-pointer
 * press inside the 52px square of the active target is a hit. Anything else inside
 * the panel is an observation (not assumed to be an error).
 */
export function classifyPointerDown(
  input: PointerInput,
  activeTargetId: number,
  rect: PanelRect,
): PointerVerdict {
  if (!isValidRect(rect)) return 'ignore';
  if (!input.isPrimary || input.button !== 0) return 'observation';
  const c = targetCenterClient(activeTargetId, rect);
  const inside =
    Math.abs(input.clientX - c.x) <= HIT_HALF_SIZE_PX &&
    Math.abs(input.clientY - c.y) <= HIT_HALF_SIZE_PX;
  return inside ? 'hit' : 'observation';
}

/* ------------------------------------------------------------------ */
/* Geometry guard                                                      */
/* ------------------------------------------------------------------ */

export type GeometrySnapshot = {
  viewportW: number;
  orientation: 'portrait' | 'landscape';
  /** visualViewport.scale, 1 when unavailable. */
  scale: number;
};

/**
 * Height-only changes (mobile browser toolbars showing/hiding) are tolerated because
 * every coordinate is normalized to the panel. Width, orientation or zoom changes are not.
 */
export function isGeometryCompatible(start: GeometrySnapshot, now: GeometrySnapshot): boolean {
  return (
    Math.abs(start.viewportW - now.viewportW) <= 1 &&
    start.orientation === now.orientation &&
    Math.abs(start.scale - now.scale) < 0.01
  );
}

/* ------------------------------------------------------------------ */
/* Calibration state machine (pure)                                    */
/* ------------------------------------------------------------------ */

export type CalibrationStatus = 'running' | 'complete' | 'interrupted';

export type CalibrationState = {
  sequence: number[];
  step: number;
  samples: TapSample[];
  observations: PanelObservation[];
  /** performance.now()-based time the active target was painted; null until painted. */
  promptAt: number | null;
  promptRestarted: boolean;
  /** True while the page is hidden; taps are ignored and the prompt clock restarts on return. */
  paused: boolean;
  status: CalibrationStatus;
  interruptionReason: string | null;
  hiddenCount: number;
  geometry: GeometrySnapshot | null;
};

export function initialCalibration(sequence: number[], geometry: GeometrySnapshot | null): CalibrationState {
  if (sequence.length !== SEQUENCE_LENGTH) {
    throw new Error(`sequence must have ${SEQUENCE_LENGTH} entries, got ${sequence.length}`);
  }
  return {
    sequence,
    step: 0,
    samples: [],
    observations: [],
    promptAt: null,
    promptRestarted: false,
    paused: false,
    status: 'running',
    interruptionReason: null,
    hiddenCount: 0,
    geometry,
  };
}

export type CalibrationEvent =
  | { type: 'prompted'; at: number }
  | {
      type: 'pointerdown';
      input: PointerInput;
      rect: PanelRect;
      at: number;
      viewportW: number;
      viewportH: number;
      iso: string;
    }
  | { type: 'hidden' }
  | { type: 'visible' }
  | { type: 'geometry'; now: GeometrySnapshot };

export function activeTarget(state: CalibrationState): number | null {
  return state.status === 'running' ? state.sequence[state.step] : null;
}

export function calibrationReducer(state: CalibrationState, ev: CalibrationEvent): CalibrationState {
  if (state.status !== 'running') return state;

  switch (ev.type) {
    case 'prompted':
      // Only the first paint of a given target starts its clock.
      if (state.promptAt !== null || state.paused) return state;
      return { ...state, promptAt: ev.at };

    case 'hidden':
      if (state.paused) return state;
      return { ...state, paused: true, hiddenCount: state.hiddenCount + 1 };

    case 'visible':
      if (!state.paused) return state;
      // Restart the prompt clock for the current target; time away is not reach time.
      return { ...state, paused: false, promptAt: null, promptRestarted: true };

    case 'geometry':
      if (!state.geometry || isGeometryCompatible(state.geometry, ev.now)) return state;
      return {
        ...state,
        status: 'interrupted',
        interruptionReason:
          ev.now.orientation !== state.geometry.orientation
            ? 'The screen rotated.'
            : Math.abs(ev.now.scale - state.geometry.scale) >= 0.01
              ? 'The page was zoomed.'
              : 'The screen width changed.',
      };

    case 'pointerdown': {
      if (state.paused || state.promptAt === null) return state; // target not yet visible
      const target = state.sequence[state.step];
      const verdict = classifyPointerDown(ev.input, target, ev.rect);
      if (verdict === 'ignore') return state;
      const p = normalizePoint(ev.input.clientX, ev.input.clientY, ev.rect);
      if (!p) return state;

      if (verdict === 'observation') {
        return {
          ...state,
          observations: [
            ...state.observations,
            {
              activeTargetId: target,
              pointerType: ev.input.pointerType || 'unknown',
              pointerX: round4(p.x),
              pointerY: round4(p.y),
              isPrimary: ev.input.isPrimary,
              button: ev.input.button,
              occurredAtIso: ev.iso,
            },
          ],
        };
      }

      const step = state.step + 1;
      if (state.step < PRACTICE_COUNT) {
        // Practice tap: advances the run, recorded nowhere.
        return { ...state, step, promptAt: null, promptRestarted: false };
      }

      const f = targetFraction(target);
      const sample: TapSample = {
        index: state.step - PRACTICE_COUNT,
        targetId: target,
        pointerType: ev.input.pointerType || 'unknown',
        targetX: round4(f.x),
        targetY: round4(f.y),
        pointerX: round4(p.x),
        pointerY: round4(p.y),
        latencyMs: Math.max(0, Math.round(ev.at - state.promptAt)),
        promptRestarted: state.promptRestarted,
        viewportW: Math.round(ev.viewportW),
        viewportH: Math.round(ev.viewportH),
        panelW: Math.round(ev.rect.width),
        panelH: Math.round(ev.rect.height),
        occurredAtIso: ev.iso,
      };
      return {
        ...state,
        samples: [...state.samples, sample],
        step,
        promptAt: null,
        promptRestarted: false,
        status: step >= SEQUENCE_LENGTH ? 'complete' : 'running',
      };
    }
  }
}

function round4(n: number): number {
  return Math.round(n * 10000) / 10000;
}

/* ------------------------------------------------------------------ */
/* Honest labelling of what kind of data we have                       */
/* ------------------------------------------------------------------ */

export type EvidenceKind = 'touch' | 'preview' | 'incomplete';

/**
 * 'touch' only when every measured sample was browser-reported as touch.
 * Even then it is browser-reported touch — not proof a thumb was used.
 */
export function evidenceKind(samples: TapSample[]): EvidenceKind {
  if (samples.length < MEASURED_COUNT) return 'incomplete';
  return samples.every((s) => s.pointerType === 'touch') ? 'touch' : 'preview';
}

export function median(values: number[]): number | null {
  if (values.length === 0) return null;
  const s = values.slice().sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

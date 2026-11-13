import { COLS, ROWS, TARGET_COUNT, median } from './calibration';
import type { ReachLabel, TapSample } from '../types';

/** What the person was asked, and what they may answer about shifting their grip. */
export type GripAnswer = 'no' | 'yes' | 'unsure' | 'declined' | null;

export const REACH_LABELS: readonly ReachLabel[] = ['unknown', 'easy', 'stretch', 'hard'];

/** Shown to the person. Never a colour on its own — the text is the label. */
export const REACH_LABEL_TEXT: Record<ReachLabel, string> = {
  unknown: 'Not sure',
  easy: 'Easy',
  stretch: 'Stretch',
  hard: 'Hard',
};

export const GRIP_TEXT: Record<Exclude<GripAnswer, null>, string> = {
  no: 'No, my grip stayed the same',
  yes: 'Yes, I shifted my grip at least once',
  unsure: 'I’m not sure',
  declined: 'Prefer not to say',
};

/** Tapping a zone cycles it. Unknown is the start, and cycling can always return to it. */
export function nextLabel(current: ReachLabel): ReachLabel {
  const i = REACH_LABELS.indexOf(current);
  return REACH_LABELS[(i + 1) % REACH_LABELS.length];
}

export function emptyReport(): ReachLabel[] {
  return Array.from({ length: TARGET_COUNT }, () => 'unknown' as ReachLabel);
}

export function reportCounts(labels: readonly ReachLabel[]): Record<ReachLabel, number> {
  const out: Record<ReachLabel, number> = { unknown: 0, easy: 0, stretch: 0, hard: 0 };
  for (const l of labels) out[l] += 1;
  return out;
}

/** True when the person labelled nothing at all. Still a valid state to continue from. */
export function isReportEmpty(labels: readonly ReachLabel[]): boolean {
  return labels.every((l) => l === 'unknown');
}

/* ------------------------------------------------------------------ */
/* Timing, kept strictly separate from what the person said             */
/* ------------------------------------------------------------------ */

/**
 * Median prompt-to-tap time per zone, from samples whose clock was not restarted.
 * This is NOT comfort and NOT reach: it includes noticing the target and deciding
 * to move. It exists so the person can see it next to what they reported, never
 * so that a label can be derived from it.
 */
export function latencyByZone(samples: readonly TapSample[]): (number | null)[] {
  return Array.from({ length: TARGET_COUNT }, (_, id) =>
    median(samples.filter((s) => s.targetId === id && !s.promptRestarted).map((s) => s.latencyMs)),
  );
}

export type ZoneRank = 'quickest' | 'slowest' | null;

/**
 * Marks only the extremes, and only when there is enough spread to be worth showing.
 * Below a 1.5x ratio between fastest and slowest zone, nothing is marked: a flat set
 * of numbers should not be dressed up as a pattern.
 */
export function rankZones(latency: readonly (number | null)[]): ZoneRank[] {
  const known = latency.filter((v): v is number => v !== null);
  if (known.length < TARGET_COUNT) return latency.map(() => null);
  const lo = Math.min(...known);
  const hi = Math.max(...known);
  if (lo <= 0 || hi / lo < 1.5) return latency.map(() => null);
  return latency.map((v) => (v === hi ? 'slowest' : v === lo ? 'quickest' : null));
}

/* ------------------------------------------------------------------ */
/* Where the two accounts disagree                                      */
/* ------------------------------------------------------------------ */

export type Mismatch = {
  zoneId: number;
  label: ReachLabel;
  latencyMs: number;
  /** How many times the zone's median exceeds the median of all zones. */
  ratio: number;
  kind: 'slow-but-easy' | 'quick-but-hard';
};

/**
 * Zones where the person's own label and the recorded timing point different ways.
 *
 * This is the point of asking at all. A zone called Easy that took three times as long
 * tells us the timing is picking up something other than difficulty — most likely the
 * time to notice a target far from where the eyes were resting. A zone called Hard that
 * was tapped quickly tells us speed and effort are not the same thing.
 *
 * Neither is an error, and neither overrides the other. They are reported as observations.
 */
export function findMismatches(
  labels: readonly ReachLabel[],
  latency: readonly (number | null)[],
  { slowRatio = 1.6, quickRatio = 0.9 } = {},
): Mismatch[] {
  const known = latency.filter((v): v is number => v !== null);
  const mid = median(known);
  if (mid === null || mid <= 0) return [];
  const out: Mismatch[] = [];
  for (let id = 0; id < labels.length; id++) {
    const v = latency[id];
    if (v === null) continue;
    const ratio = v / mid;
    if (labels[id] === 'easy' && ratio >= slowRatio) {
      out.push({ zoneId: id, label: 'easy', latencyMs: v, ratio, kind: 'slow-but-easy' });
    } else if (labels[id] === 'hard' && ratio <= quickRatio) {
      out.push({ zoneId: id, label: 'hard', latencyMs: v, ratio, kind: 'quick-but-hard' });
    }
  }
  return out.sort((a, b) => Math.abs(b.ratio - 1) - Math.abs(a.ratio - 1));
}

/* ------------------------------------------------------------------ */
/* Naming zones in words, for screen readers and for the export         */
/* ------------------------------------------------------------------ */

const ROW_NAMES = ['top', 'upper middle', 'middle', 'lower middle', 'bottom'];
const COL_NAMES = ['left', 'centre', 'right'];

export function zoneName(id: number): string {
  const row = ROW_NAMES[Math.floor(id / COLS)] ?? `row ${Math.floor(id / COLS) + 1}`;
  const col = COL_NAMES[id % COLS] ?? `column ${(id % COLS) + 1}`;
  return `${row} ${col}`;
}

export { COLS, ROWS };

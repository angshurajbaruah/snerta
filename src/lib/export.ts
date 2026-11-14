import type { Hand, PanelObservation, ReachLabel, TapSample } from '../types';
import { evidenceKind, type EvidenceKind } from './calibration';
import { latencyByZone, type GripAnswer } from './reach';
import { compare, type Preference, type TrialResult } from './trial';

export const SCHEMA_VERSION = 'snerta-0.3';

export type SessionExport = {
  schemaVersion: string;
  build: string;
  exportedAtIso: string;
  hand: Hand | null;
  evidence: EvidenceKind;
  calibrationSkipped: boolean;
  sampleCount: number;
  samples: TapSample[];
  nonTargetObservations: PanelObservation[];
  pageHiddenCount: number;
  /** What the person said, per zone. Never derived from the samples. */
  selfReport: { zoneId: number; label: ReachLabel }[] | null;
  gripChanged: GripAnswer;
  /** Median prompt-to-tap time per zone, kept separate from selfReport on purpose. */
  latencyByZoneMs: (number | null)[];
  /** Every trial attempted, including ones that were stopped. */
  trials: TrialResult[];
  /** Which layout ran first. Practice favours whichever came second. */
  firstMode: 'standard' | 'kab' | null;
  /**
   * Filled only when each layout has at least one completed run; null otherwise,
   * never a half-comparison. `balanced` is false when the runs did not come out
   * even, which means practice is still mixed into the difference.
   */
  comparison: {
    durationDeltaMs: number;
    comfortDelta: number | null;
    balanced: boolean;
    completedCount: number;
    standard: { durationMs: number | null; comfort: number | null; meanPosition: number | null };
    kab: { durationMs: number | null; comfort: number | null; meanPosition: number | null };
  } | null;
  preference: Preference;
  limitations: string[];
};

export const LIMITATIONS = [
  'Browser-reported pointer type is not proof that a thumb was used.',
  'Latency runs from target paint to pointerdown; it includes seeing and deciding, not just movement.',
  'Speed is not comfort. Nothing here measures hand size, anatomy or pain.',
  'selfReport is what the person said; latencyByZoneMs is what the clock recorded. Neither was derived from the other, and labels left as unknown were left unknown.',
  'Non-target observations are touches inside the tray away from the active target; they are not confirmed errors.',
  'Trial durations cover the task only: from Start to the action that finished it, never the rating.',
  'offTaskTaps counts taps that did not advance the task. They are observations, not confirmed mistakes.',
  'comparison is null unless both trials were completed. Two trials cannot separate the layout from practice.',
  'One short session on one device cannot establish a general result.',
];

export function buildSessionExport(args: {
  hand: Hand | null;
  samples: TapSample[];
  observations: PanelObservation[];
  hiddenCount: number;
  skipped: boolean;
  labels?: readonly ReachLabel[] | null;
  grip?: GripAnswer;
  trials?: readonly TrialResult[];
  preference?: Preference;
  now?: Date;
}): SessionExport {
  const trials = [...(args.trials ?? [])];
  const c = compare(trials);
  return {
    schemaVersion: SCHEMA_VERSION,
    build: 'milestone-5-abba',
    exportedAtIso: (args.now ?? new Date()).toISOString(),
    hand: args.hand,
    evidence: args.skipped ? 'preview' : evidenceKind(args.samples),
    calibrationSkipped: args.skipped,
    sampleCount: args.samples.length,
    samples: args.samples,
    nonTargetObservations: args.observations,
    pageHiddenCount: args.hiddenCount,
    selfReport: args.labels ? args.labels.map((label, zoneId) => ({ zoneId, label })) : null,
    gripChanged: args.grip ?? null,
    latencyByZoneMs: latencyByZone(args.samples),
    trials,
    firstMode: trials.find((t) => t.position === 1)?.mode ?? null,
    comparison: c
      ? {
          durationDeltaMs: c.durationDeltaMs!,
          comfortDelta: c.comfortDelta,
          balanced: c.balanced,
          completedCount: c.completedCount,
          standard: {
            durationMs: c.standard.durationMs,
            comfort: c.standard.comfort,
            meanPosition: c.standard.meanPosition,
          },
          kab: {
            durationMs: c.kab.durationMs,
            comfort: c.kab.comfort,
            meanPosition: c.kab.meanPosition,
          },
        }
      : null,
    preference: args.preference ?? null,
    limitations: LIMITATIONS,
  };
}

/** Explicit, user-initiated local download. Nothing is sent anywhere. */
export function downloadJson(data: unknown, filename: string): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

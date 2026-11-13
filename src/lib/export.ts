import type { Hand, PanelObservation, TapSample } from '../types';
import { evidenceKind, type EvidenceKind } from './calibration';

export const SCHEMA_VERSION = 'kab-spike-0.1';

export type SpikeExport = {
  schemaVersion: string;
  build: 'milestone-1-spike';
  exportedAtIso: string;
  hand: Hand | null;
  evidence: EvidenceKind;
  calibrationSkipped: boolean;
  sampleCount: number;
  samples: TapSample[];
  nonTargetObservations: PanelObservation[];
  pageHiddenCount: number;
  limitations: string[];
};

export const LIMITATIONS = [
  'Browser-reported pointer type is not proof that a thumb was used.',
  'Latency runs from target paint to pointerdown; it includes seeing and deciding, not just movement.',
  'Speed is not comfort. Nothing here measures hand size, anatomy or pain.',
  'Non-target observations are touches inside the panel away from the active target; they are not confirmed errors.',
  'One short session on one device cannot establish a general result.',
];

export function buildSpikeExport(args: {
  hand: Hand | null;
  samples: TapSample[];
  observations: PanelObservation[];
  hiddenCount: number;
  skipped: boolean;
  now?: Date;
}): SpikeExport {
  return {
    schemaVersion: SCHEMA_VERSION,
    build: 'milestone-1-spike',
    exportedAtIso: (args.now ?? new Date()).toISOString(),
    hand: args.hand,
    evidence: args.skipped ? 'preview' : evidenceKind(args.samples),
    calibrationSkipped: args.skipped,
    sampleCount: args.samples.length,
    samples: args.samples,
    nonTargetObservations: args.observations,
    pageHiddenCount: args.hiddenCount,
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

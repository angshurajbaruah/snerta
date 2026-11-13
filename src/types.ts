export type Hand = 'left' | 'right';
export type Mode = 'standard' | 'kab';
export type ReachLabel = 'unknown' | 'easy' | 'stretch' | 'hard';

/** One accepted activation of the currently prompted calibration target. */
export type TapSample = {
  /** Sequence index 0..17. */
  index: number;
  /** Grid position 0..8, row-major from top-left. */
  targetId: number;
  /** Browser-reported pointer type ('touch', 'mouse', 'pen', ...). Not proof of a thumb. */
  pointerType: string;
  /** Rendered target centre, normalized [0,1] to the touch panel. */
  targetX: number;
  targetY: number;
  /** Pointer position, normalized [0,1] to the same panel. */
  pointerX: number;
  pointerY: number;
  /** Prompt paint → pointerdown. Includes seeing, deciding and moving; not pure movement time. */
  latencyMs: number;
  /** True if the page was hidden while this target was prompted (prompt clock was restarted). */
  promptRestarted: boolean;
  viewportW: number;
  viewportH: number;
  panelW: number;
  panelH: number;
  occurredAtIso: string;
};

/** A pointerdown inside the panel that did not land on the active target. Not assumed to be a miss. */
export type PanelObservation = {
  activeTargetId: number;
  pointerType: string;
  pointerX: number;
  pointerY: number;
  isPrimary: boolean;
  button: number;
  occurredAtIso: string;
};

export type PanelRect = { left: number; top: number; width: number; height: number };

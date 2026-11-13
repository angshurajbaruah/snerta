import type { Hand, Mode } from '../types';

export type ControlId = 'back' | 'search' | 'menu';
export type Side = 'left' | 'right' | 'center' | 'split';

export type Placement = {
  /** Controls sitting in the bottom rail. Empty in the Original layout. */
  rail: ControlId[];
  /** Controls sitting in the top header. */
  header: ControlId[];
  side: Side;
};

/**
 * Only the frequent actions move. `menu` stays in the header in both layouts.
 *
 * Moving every control into the thumb zone makes the rail wide enough to cover a
 * meaningful slice of the content, which is a cost the person would feel and would
 * reasonably hold against the layout — a confound that has nothing to do with reach.
 * Keeping the secondary action anchored also matches the claim actually being
 * tested: that a *few* frequent controls are worth moving.
 */
export const MOVABLE: ControlId[] = ['back', 'search'];
export const ANCHORED: ControlId[] = ['menu'];
export const CONTROLS: ControlId[] = [...MOVABLE, ...ANCHORED];

export const CONTROL_LABELS: Record<ControlId, string> = {
  back: 'Back',
  search: 'Search',
  menu: 'More',
};

/**
 * Deterministic prototype rule — a candidate layout to test, not a measured optimum.
 *
 * Original: everything in the header, Back at the left, the rest at the right.
 * snerta:   back and search move to a bottom rail on the chosen side, with Back at
 *           the outer edge nearest the resting thumb. 'both' centres the rail, since
 *           no side is reliably nearer for someone who switches hands.
 */
export function placementFor(mode: Mode, hand: Hand): Placement {
  if (mode === 'standard') return { rail: [], header: CONTROLS, side: 'split' };
  const rail = hand === 'right' ? [...MOVABLE].reverse() : [...MOVABLE];
  return { rail, header: ANCHORED, side: hand === 'both' ? 'center' : hand };
}

/** Which rail control sits closest to where the thumb rests. */
export function nearestToThumb(placement: Placement): ControlId | null {
  if (placement.rail.length === 0) return null;
  if (placement.side === 'left') return placement.rail[0];
  if (placement.side === 'right') return placement.rail[placement.rail.length - 1];
  return placement.rail[Math.floor(placement.rail.length / 2)];
}

export const HAND_LABELS: Record<Hand, string> = {
  left: 'Left',
  right: 'Right',
  both: 'Both',
};

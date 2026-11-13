import type { Hand, Mode } from '../types';

export type ControlId = 'back' | 'search' | 'menu';
export type Region = 'header' | 'rail';
export type Side = 'left' | 'right' | 'center' | 'split';

export type Placement = {
  region: Region;
  /** Visual order inside the region, left to right. */
  order: ControlId[];
  side: Side;
};

/** The three controls the demo app moves. Same controls, same actions, in both layouts. */
export const CONTROLS: ControlId[] = ['back', 'search', 'menu'];

export const CONTROL_LABELS: Record<ControlId, string> = {
  back: 'Back',
  search: 'Search',
  menu: 'More',
};

/**
 * Deterministic prototype rule — a candidate layout to test, not a measured or optimised fit.
 *
 * Standard: Back at the top-left, Search and More at the top-right (the common convention).
 * snerta:   the same three controls move to a bottom rail.
 *             right hand → rail on the right, primary action nearest the outer edge
 *             left hand  → mirrored
 *             both       → rail centred, because no single side is reliably nearer
 *
 * The 'both' arm is deliberately conservative: a centred rail is still in the lower
 * thumb arc for either hand, without betting on a side the person did not claim.
 */
export function placementFor(mode: Mode, hand: Hand): Placement {
  if (mode === 'standard') return { region: 'header', order: CONTROLS, side: 'split' };
  switch (hand) {
    // Back is the most-used control, so it takes the slot nearest the resting thumb:
    // the outer edge of the rail. The other two mirror around it.
    case 'right':
      return { region: 'rail', order: ['menu', 'search', 'back'], side: 'right' };
    case 'left':
      return { region: 'rail', order: ['back', 'search', 'menu'], side: 'left' };
    case 'both':
      return { region: 'rail', order: ['back', 'search', 'menu'], side: 'center' };
  }
}

/** Which control sits closest to where the thumb rests, for the rail layouts. */
export function nearestToThumb(placement: Placement): ControlId | null {
  if (placement.region !== 'rail') return null;
  if (placement.side === 'left') return placement.order[0];
  if (placement.side === 'right') return placement.order[placement.order.length - 1];
  return placement.order[Math.floor(placement.order.length / 2)];
}

export const HAND_LABELS: Record<Hand, string> = {
  left: 'Left',
  right: 'Right',
  both: 'Both',
};

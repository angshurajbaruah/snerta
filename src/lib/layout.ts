import type { Hand, Mode } from '../types';

export type ControlId = 'back' | 'bag';
export type Region = 'header' | 'rail';

export type Placement = {
  region: Region;
  /** Visual order inside the region. */
  order: ControlId[];
  /** Horizontal side of the region the controls cluster on. */
  side: 'left' | 'right' | 'split';
};

/**
 * Deterministic MVP rule — a candidate layout, not an optimized or measured fit.
 * Standard: Back top-left, Bag top-right (the common header convention).
 * K’ab: the same two controls move to a lower rail on the chosen hand's side,
 * with the more frequent action (Bag) nearest the outer edge where the thumb rests.
 */
export function placementFor(mode: Mode, hand: Hand): Placement {
  if (mode === 'standard') return { region: 'header', order: ['back', 'bag'], side: 'split' };
  return hand === 'right'
    ? { region: 'rail', order: ['back', 'bag'], side: 'right' }
    : { region: 'rail', order: ['bag', 'back'], side: 'left' };
}

export const CONTROL_LABELS: Record<ControlId, string> = { back: 'Back', bag: 'Bag' };

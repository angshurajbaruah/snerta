import type { Mode } from '../types';

/**
 * Dragging the controls between the header and the thumb rail.
 *
 * This replaces the two-option toggle. The thing you grab is the thing that moves,
 * which is the clearest possible statement that the move is yours and reversible —
 * the lesson from Apple's iOS 15 Safari change, where the move shipped without an
 * obvious way back and a visible setting had to be retrofitted (docs/EVIDENCE_BASE.md §4).
 *
 * Kept pure and out of React so the decision can be tested without a DOM, and so the
 * gesture cannot quietly acquire state that the trial screen would then inherit.
 */

/** How far the handle must travel before the move commits. */
export const DRAG_THRESHOLD_PX = 44;

/** How far the handle is allowed to visibly travel while dragging. */
export const DRAG_MAX_PX = 96;

export type DragAxis = 'down' | 'up' | 'none';

/** Which way the drag is going, ignoring travel too small to be intentional. */
export function dragAxis(deltaY: number, deadZonePx = 4): DragAxis {
  if (Math.abs(deltaY) < deadZonePx) return 'none';
  return deltaY > 0 ? 'down' : 'up';
}

/**
 * Where the controls end up when the finger lifts.
 *
 * Down moves them towards the thumb, up sends them back to the header. A drag that
 * does not clear the threshold snaps back, and a drag in the direction they already
 * sit changes nothing — there is nowhere further to go.
 */
export function resolveDrag(
  from: Mode,
  deltaY: number,
  threshold = DRAG_THRESHOLD_PX,
): Mode {
  if (Math.abs(deltaY) < threshold) return from;
  const towardsThumb = deltaY > 0;
  if (towardsThumb) return 'kab';
  return 'standard';
}

/**
 * How far to visibly offset the controls mid-drag.
 *
 * Travel against the available direction is resisted rather than blocked: the handle
 * still moves a little, so the gesture is acknowledged, but it is obvious that there
 * is nothing that way. Resistance is a third of the travel.
 */
export function dragOffset(from: Mode, deltaY: number, max = DRAG_MAX_PX): number {
  const available = from === 'standard' ? deltaY > 0 : deltaY < 0;
  const travel = available ? deltaY : deltaY / 3;
  return Math.max(-max, Math.min(max, travel));
}

/** True once the drag has gone far enough that letting go would move the controls. */
export function wouldCommit(from: Mode, deltaY: number, threshold = DRAG_THRESHOLD_PX): boolean {
  return resolveDrag(from, deltaY, threshold) !== from;
}

/** The other mode, for a tap on the handle — the keyboard and screen-reader path. */
export function toggleMode(from: Mode): Mode {
  return from === 'standard' ? 'kab' : 'standard';
}

/**
 * What the handle tells someone who cannot see it move. Describes where the controls
 * will go, not where they are, because that is what activating it does.
 */
export function handleLabel(from: Mode): string {
  return from === 'standard'
    ? 'Move the controls down within reach. Drag down, or activate.'
    : 'Move the controls back to the top. Drag up, or activate.';
}

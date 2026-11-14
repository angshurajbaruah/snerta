import { useRef, useState } from 'react';
import {
  dragOffset,
  handleLabel,
  resolveDrag,
  toggleMode,
  wouldCommit,
} from '../lib/drag';
import type { Mode } from '../types';

/**
 * The grip that moves the controls between the header and the thumb rail.
 *
 * Drag it down and the controls come to the thumb; drag it up and they go back. It
 * is a real button as well as a drag target, because a drag-only control is operable
 * by neither a keyboard nor a screen reader, and the brief requires both everywhere
 * except the measurement itself.
 *
 * Deliberately visible. A hidden gesture would reproduce exactly the failure in
 * docs/EVIDENCE_BASE.md §4 — a layout change people could not find the way back from.
 */
export function DragHandle({
  mode,
  onChange,
  disabled = false,
}: {
  mode: Mode;
  onChange: (m: Mode) => void;
  /** Locked during a timed trial: the condition has to stay fixed for the run. */
  disabled?: boolean;
}) {
  const startY = useRef<number | null>(null);
  const moved = useRef(false);
  const [offset, setOffset] = useState(0);
  const [armed, setArmed] = useState(false);

  const end = (deltaY: number) => {
    startY.current = null;
    setOffset(0);
    setArmed(false);
    const next = resolveDrag(mode, deltaY);
    if (next !== mode) onChange(next);
  };

  return (
    <button
      type="button"
      className={`drag-handle ${armed ? 'is-armed' : ''} drag-handle--${mode}`}
      style={offset ? { transform: `translateY(${offset}px)` } : undefined}
      aria-label={handleLabel(mode)}
      disabled={disabled}
      onPointerDown={(e) => {
        if (disabled || !e.isPrimary) return;
        startY.current = e.clientY;
        moved.current = false;
        e.currentTarget.setPointerCapture(e.pointerId);
      }}
      onPointerMove={(e) => {
        if (startY.current === null) return;
        const d = e.clientY - startY.current;
        if (Math.abs(d) > 4) moved.current = true;
        setOffset(dragOffset(mode, d));
        setArmed(wouldCommit(mode, d));
      }}
      onPointerUp={(e) => {
        if (startY.current === null) return;
        end(e.clientY - startY.current);
      }}
      onPointerCancel={() => {
        if (startY.current !== null) end(0);
      }}
      onClick={() => {
        // The browser fires a click after a drag; that one has already been handled on
        // pointerup and must not toggle again. The flag is cleared as it is read, or a
        // keyboard Enter after any drag would be swallowed for the rest of the session —
        // which is how this went out the first time, invisible to jsdom.
        const afterDrag = moved.current;
        moved.current = false;
        if (disabled || afterDrag) return;
        onChange(toggleMode(mode));
      }}
    >
      <span className="drag-handle__grip" aria-hidden="true" />
      <span className="drag-handle__text" aria-hidden="true">
        {mode === 'standard' ? 'Pull down within reach' : 'Push back to the top'}
      </span>
    </button>
  );
}

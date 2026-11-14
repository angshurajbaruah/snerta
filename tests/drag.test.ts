import { describe, expect, it } from 'vitest';
import {
  DRAG_MAX_PX,
  DRAG_THRESHOLD_PX,
  dragAxis,
  dragOffset,
  handleLabel,
  resolveDrag,
  toggleMode,
  wouldCommit,
} from '../src/lib/drag';

describe('which way the drag is going', () => {
  it('ignores travel too small to be meant', () => {
    expect(dragAxis(0)).toBe('none');
    expect(dragAxis(3)).toBe('none');
    expect(dragAxis(-3)).toBe('none');
  });

  it('reads down as down and up as up', () => {
    expect(dragAxis(20)).toBe('down');
    expect(dragAxis(-20)).toBe('up');
  });
});

describe('where the controls land', () => {
  it('needs a deliberate distance, not a twitch', () => {
    expect(resolveDrag('standard', DRAG_THRESHOLD_PX - 1)).toBe('standard');
    expect(resolveDrag('standard', DRAG_THRESHOLD_PX)).toBe('kab');
  });

  it('sends them to the thumb on a drag down, and back to the top on a drag up', () => {
    expect(resolveDrag('standard', 60)).toBe('kab');
    expect(resolveDrag('kab', -60)).toBe('standard');
  });

  it('changes nothing when dragged the way they already sit', () => {
    expect(resolveDrag('kab', 60)).toBe('kab');
    expect(resolveDrag('standard', -60)).toBe('standard');
  });

  it('is reversible: down then up returns to where it started', () => {
    const moved = resolveDrag('standard', 60);
    expect(resolveDrag(moved, -60)).toBe('standard');
  });
});

describe('what the handle does while the finger is still down', () => {
  it('follows the finger in the direction there is somewhere to go', () => {
    expect(dragOffset('standard', 40)).toBe(40);
    expect(dragOffset('kab', -40)).toBe(-40);
  });

  it('resists, rather than freezes, when there is nowhere that way', () => {
    const resisted = dragOffset('kab', 60);
    expect(resisted).toBeGreaterThan(0); // it still acknowledges the gesture
    expect(resisted).toBeLessThan(60); // but it is obviously not going anywhere
  });

  it('never runs away further than the cap', () => {
    expect(dragOffset('standard', 5000)).toBe(DRAG_MAX_PX);
    expect(dragOffset('kab', -5000)).toBe(-DRAG_MAX_PX);
  });

  it('says when letting go would actually move them', () => {
    expect(wouldCommit('standard', 10)).toBe(false);
    expect(wouldCommit('standard', 60)).toBe(true);
    expect(wouldCommit('kab', 60)).toBe(false); // already there
  });
});

describe('the paths that are not a drag', () => {
  it('toggles on a tap, so it works from a keyboard', () => {
    expect(toggleMode('standard')).toBe('kab');
    expect(toggleMode('kab')).toBe('standard');
  });

  it('describes where the controls will go, not where they are', () => {
    expect(handleLabel('standard')).toMatch(/down within reach/);
    expect(handleLabel('kab')).toMatch(/back to the top/);
  });

  it('tells someone who cannot see it that dragging is not the only way', () => {
    for (const m of ['standard', 'kab'] as const) {
      expect(handleLabel(m)).toMatch(/activate/i);
    }
  });
});

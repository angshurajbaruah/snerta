import { useState, type ReactElement } from 'react';
import { ArrowLeft, BrandBar, MenuIcon, SearchIcon } from '../components/ui';
import { CONTROL_LABELS, nearestToThumb, placementFor, type ControlId } from '../lib/layout';
import type { Hand, Mode } from '../types';

const ICONS: Record<ControlId, (p: { size?: number }) => ReactElement> = {
  back: ArrowLeft,
  search: SearchIcon,
  menu: MenuIcon,
};

/**
 * Milestone-2 placement demo: the SAME three working controls render either in the
 * header (Original) or in a bottom rail on the chosen side (snerta.). Switching is
 * explicit, reversible, and never happens mid-action. State survives every switch.
 *
 * This is a candidate layout for testing. Nothing here has been shown to be faster,
 * easier or better — that is what the timed trials in the next milestone are for.
 */
export function PlacementDemo({
  hand,
  onHandChange,
  onExit,
}: {
  hand: Hand;
  onHandChange: (h: Hand) => void;
  onExit: () => void;
}) {
  const [mode, setMode] = useState<Mode>('standard');
  const [log, setLog] = useState<string>('Nothing pressed yet.');
  const [presses, setPresses] = useState(0);
  const placement = placementFor(mode, hand);
  const modeName = mode === 'kab' ? 'snerta.' : 'Original';

  const press = (id: ControlId) => {
    setPresses((n) => n + 1);
    setLog(`${CONTROL_LABELS[id]} pressed — ${modeName} layout.`);
  };

  const control = (id: ControlId, primary = false) => {
    const Icon = ICONS[id];
    return (
      <button
        key={id}
        type="button"
        className={`app-ctrl ${primary ? 'app-ctrl--primary' : ''}`}
        onClick={() => press(id)}
        aria-label={CONTROL_LABELS[id]}
      >
        <Icon size={20} />
      </button>
    );
  };

  const inRail = placement.rail.length > 0;
  const thumbLead = nearestToThumb(placement);

  return (
    <main className="demo" aria-label="Layout demo">
      <BrandBar>
        <span className="chip">Before / after</span>
      </BrandBar>

      <div className="device">
        <div className={`device__screen ${inRail ? 'has-rail' : ''}`}>
          <div className="fake-header">
            <div className="fake-header__left">
              {placement.header.includes('back') && control('back')}
              <span className="fake-header__title">Inbox</span>
            </div>
            <div className="fake-header__right">
              {placement.header.filter((id) => id !== 'back').map((id) => control(id))}
            </div>
          </div>

          <div className="fake-list" aria-hidden="true">
            {[62, 48, 70, 55, 66, 51, 73, 59, 64].map((w, i) => (
              <div className="fake-row" key={i}>
                <span className="fake-row__av" />
                <span className="fake-row__lines">
                  <span style={{ width: `${w}%` }} />
                  <span style={{ width: `${Math.min(w + 18, 96)}%` }} />
                </span>
              </div>
            ))}
          </div>

          {/* The list scrolls under the chrome at both ends, so it is faded into the
              page rather than chopped off. Present the whole time, not only at rest. */}
          <span className="fake-edge fake-edge--top" aria-hidden="true" />
          {inRail && <span className="fake-edge fake-edge--bottom" aria-hidden="true" />}

          {inRail && (
            <nav className={`app-rail app-rail--${placement.side}`} aria-label="snerta controls">
              {placement.rail.map((id) => control(id, id === thumbLead))}
            </nav>
          )}
        </div>
      </div>

      <section className="bento log">
        <div className="tile__name">
          {mode === 'standard' ? 'Controls in the header' : `Controls moved ${sideWord(placement.side)}`}
        </div>
        <p className="note note--wrap">Which is easier for you has not been tested yet.</p>
        <p className="note" aria-live="polite">
          {log} · {presses} press{presses === 1 ? '' : 'es'} · hand set to {hand}
        </p>
      </section>

      <div className="dock" style={{ flexDirection: 'column', gap: 10 }}>
        <div role="radiogroup" aria-label="Compare layouts" className="segmented">
          {(['standard', 'kab'] as Mode[]).map((m) => (
            <button
              key={m}
              type="button"
              role="radio"
              aria-checked={mode === m}
              className={`segmented__opt ${mode === m ? 'is-on' : ''}`}
              onClick={() => setMode(m)}
            >
              {m === 'standard' ? 'Original' : 'With snerta.'}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
          <button
            type="button"
            className="text-btn"
            style={{ color: 'var(--silver)', textDecorationColor: 'var(--graphite)' }}
            onClick={() => onHandChange(nextHand(hand))}
          >
            Switch hand ({hand})
          </button>
          <button
            type="button"
            className="text-btn"
            style={{ color: 'var(--silver)', textDecorationColor: 'var(--graphite)' }}
            onClick={onExit}
          >
            Start over
          </button>
        </div>
      </div>
    </main>
  );
}

function sideWord(side: string): string {
  return side === 'center' ? 'to the centre' : `to the ${side}`;
}

function nextHand(h: Hand): Hand {
  return h === 'right' ? 'left' : h === 'left' ? 'both' : 'right';
}

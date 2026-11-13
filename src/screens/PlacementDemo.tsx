import { useState, type ReactElement } from 'react';
import { ArrowLeft, BrandBar, MenuIcon, SearchIcon } from '../components/ui';
import { CONTROL_LABELS, placementFor, type ControlId } from '../lib/layout';
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

  const inRail = placement.region === 'rail';
  const railLead = placement.side === 'left' ? placement.order[0] : placement.order[placement.order.length - 1];

  return (
    <main className="demo" aria-label="Layout demo">
      <BrandBar>
        <span className="chip">Before / after</span>
      </BrandBar>

      <div className="device">
        <div className="device__screen">
          <div className="fake-header">
            {inRail ? (
              <span className="fake-header__title">Inbox</span>
            ) : (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  {control('back')}
                  <span className="fake-header__title">Inbox</span>
                </div>
                <div style={{ display: 'flex', gap: 2 }}>
                  {control('search')}
                  {control('menu')}
                </div>
              </>
            )}
          </div>

          <div className="fake-list" aria-hidden="true">
            {[62, 48, 70, 55, 66].map((w, i) => (
              <div className="fake-row" key={i}>
                <span className="fake-row__av" />
                <span className="fake-row__lines">
                  <span style={{ width: `${w}%` }} />
                  <span style={{ width: `${w + 18}%` }} />
                </span>
              </div>
            ))}
          </div>

          {inRail && (
            <nav className={`app-rail app-rail--${placement.side}`} aria-label="snerta controls">
              {placement.order.map((id) => control(id, id === railLead))}
            </nav>
          )}
        </div>
      </div>

      <section className="bento log">
        <div className="tile__name">
          {mode === 'standard' ? 'Controls in the header' : `Controls moved ${sideWord(placement.side)}`}
        </div>
        <p className="note">Which is easier for you has not been tested yet.</p>
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

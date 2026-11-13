import { useState } from 'react';
import { BagIcon, ChevronLeft } from '../components/ui';
import { CONTROL_LABELS, placementFor, type ControlId } from '../lib/layout';
import type { Hand, Mode } from '../types';

/**
 * Milestone-1 placement spike: the SAME two working controls (Back, Bag) render either in
 * the header (Standard) or in a lower rail on the chosen-hand side (K’ab). Switching is
 * explicit and reversible; demo state survives every switch.
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
  const [bagCount, setBagCount] = useState(0);
  const [presses, setPresses] = useState<Record<ControlId, number>>({ back: 0, bag: 0 });
  const [lastAction, setLastAction] = useState('Nothing pressed yet.');
  const placement = placementFor(mode, hand);

  const press = (id: ControlId) => {
    setPresses((p) => ({ ...p, [id]: p[id] + 1 }));
    setLastAction(
      id === 'back'
        ? `Back pressed (${mode === 'kab' ? 'K’ab' : 'Standard'} layout). In the full demo this returns to the previous page.`
        : `Bag opened (${mode === 'kab' ? 'K’ab' : 'Standard'} layout) — ${bagCount} item${bagCount === 1 ? '' : 's'}.`,
    );
  };

  const control = (id: ControlId) => (
    <button
      key={id}
      type="button"
      className={`app-ctrl app-ctrl--${id}`}
      onClick={() => press(id)}
      aria-label={id === 'bag' ? `${CONTROL_LABELS.bag}, ${bagCount} item${bagCount === 1 ? '' : 's'}` : CONTROL_LABELS.back}
    >
      {id === 'back' ? <ChevronLeft /> : <BagIcon />}
      <span className="app-ctrl__label">{CONTROL_LABELS[id]}</span>
      {id === 'bag' && bagCount > 0 && (
        <span className="app-ctrl__badge" aria-hidden="true">
          {bagCount}
        </span>
      )}
    </button>
  );

  return (
    <main className={`demo demo--${mode} demo--${hand}`} aria-label="Layout demo">
      <header className="app-header">
        {placement.region === 'header' ? control('back') : <span className="app-ctrl-slot" />}
        <span className="app-header__title">Shop</span>
        {placement.region === 'header' ? control('bag') : <span className="app-ctrl-slot" />}
      </header>

      <div className="demo__body">
        <div className="segmented" role="radiogroup" aria-label="Layout">
          {(['standard', 'kab'] as Mode[]).map((m) => (
            <button
              key={m}
              type="button"
              role="radio"
              aria-checked={mode === m}
              className={`segmented__opt ${mode === m ? 'is-on' : ''}`}
              onClick={() => setMode(m)}
            >
              {m === 'standard' ? 'Standard' : 'With K’ab'}
            </button>
          ))}
        </div>
        <p className="card__note demo__explain">
          {mode === 'standard'
            ? 'Back and Bag sit in the header, where most apps put them.'
            : `The same Back and Bag controls move to a lower rail on the ${hand} side. This is a fixed candidate layout for testing, not a measured fit.`}
        </p>

        <article className="product">
          <div className="product__img" aria-hidden="true" />
          <div className="product__meta">
            <h2 className="product__name">Linen tote</h2>
            <p className="product__price">Fictional item · no real purchase</p>
          </div>
          <button type="button" className="pill pill--primary pill--compact" onClick={() => setBagCount((n) => n + 1)}>
            <span className="pill__label">Add to bag</span>
          </button>
        </article>

        <section className="card" aria-live="polite">
          <h2 className="card__title">Demo log</h2>
          <p className="card__note">{lastAction}</p>
          <p className="card__note">
            Back pressed {presses.back}× · Bag pressed {presses.bag}× · {bagCount} in bag
          </p>
        </section>

        <div className="demo__links">
          <button type="button" className="text-btn" onClick={() => onHandChange(hand === 'right' ? 'left' : 'right')}>
            Switch to {hand === 'right' ? 'left' : 'right'} hand
          </button>
          <button type="button" className="text-btn" onClick={onExit}>
            Back to start
          </button>
        </div>
      </div>

      {placement.region === 'rail' && (
        <nav className={`app-rail app-rail--${placement.side}`} aria-label="K’ab controls">
          {placement.order.map(control)}
        </nav>
      )}
    </main>
  );
}

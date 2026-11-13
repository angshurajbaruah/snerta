import { useRef, type KeyboardEvent } from 'react';
import { BackButton, BrandBar, Check, HandIcon, PillButton, Screen, StepChip, SwapIcon } from '../components/ui';
import type { Hand } from '../types';

const CARDS: { value: Hand; name: string; sub: string }[] = [
  { value: 'left', name: 'Left', sub: 'Left thumb leads' },
  { value: 'right', name: 'Right', sub: 'Right thumb leads' },
];

export function HandSelect({
  hand,
  onSelect,
  onBack,
  onContinue,
}: {
  hand: Hand | null;
  onSelect: (h: Hand) => void;
  onBack: () => void;
  onContinue: () => void;
}) {
  const order: Hand[] = ['left', 'right', 'both'];
  const refs = useRef<Partial<Record<Hand, HTMLButtonElement | null>>>({});

  const onKeyDown = (e: KeyboardEvent, value: Hand) => {
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) return;
    e.preventDefault();
    const i = order.indexOf(value);
    const next = order[(i + (e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 1) + order.length) % order.length];
    onSelect(next);
    refs.current[next]?.focus();
  };

  const tabIndexFor = (v: Hand) => (hand === v || (!hand && v === 'left') ? 0 : -1);

  return (
    <Screen
      label="Choose your hand"
      dock={
        <>
          <BackButton onClick={onBack} />
          <PillButton onClick={onContinue} disabled={!hand} aria-describedby={!hand ? 'hand-hint' : undefined}>
            Continue
          </PillButton>
        </>
      }
    >
      <BrandBar>
        <StepChip step={1} />
      </BrandBar>

      <div className="intro">
        <h1 className="title" id="hand-q">
          Which hand do you use most?
        </h1>
        <p className="lede">This decides which side the controls move to. You can change it at any point.</p>
      </div>

      <div className="scroller" role="radiogroup" aria-labelledby="hand-q">
        <div className="hand-grid">
          {CARDS.map((c) => {
            const on = hand === c.value;
            return (
              <button
                key={c.value}
                ref={(el) => {
                  refs.current[c.value] = el;
                }}
                type="button"
                role="radio"
                aria-checked={on}
                tabIndex={tabIndexFor(c.value)}
                aria-label={c.name}
                className={`hand-card ${on ? 'is-on' : ''}`}
                onClick={() => onSelect(c.value)}
                onKeyDown={(e) => onKeyDown(e, c.value)}
              >
                {on && (
                  <span className="hand-card__check" aria-hidden="true">
                    <Check />
                  </span>
                )}
                <span className={`well well--round ${on ? 'well--on' : ''}`} aria-hidden="true">
                  <HandIcon hand={c.value === 'left' ? 'left' : 'right'} />
                </span>
                <span>
                  <span className="hand-card__name">{c.name}</span>
                  <br />
                  <span className="hand-card__sub">{c.sub}</span>
                </span>
              </button>
            );
          })}
        </div>

        <button
          ref={(el) => {
            refs.current.both = el;
          }}
          type="button"
          role="radio"
          aria-checked={hand === 'both'}
          tabIndex={tabIndexFor('both')}
          aria-label="I switch between hands"
          className={`hand-row ${hand === 'both' ? 'is-on' : ''}`}
          onClick={() => onSelect('both')}
          onKeyDown={(e) => onKeyDown(e, 'both')}
        >
          <span className="hand-row__left">
            <span className="well" aria-hidden="true">
              <SwapIcon size={20} />
            </span>
            <span>
              <span className="tile__name">I switch between hands</span>
              <br />
              <span className="hand-card__sub">Keep controls near the centre</span>
            </span>
          </span>
          <span className="radio" aria-hidden="true">
            <span className="radio__dot" />
          </span>
        </button>

        {!hand && (
          <p id="hand-hint" className="note" style={{ textAlign: 'center' }}>
            Choose one to continue.
          </p>
        )}
      </div>
    </Screen>
  );
}

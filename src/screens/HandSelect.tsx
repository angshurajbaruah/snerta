import { useRef, type KeyboardEvent } from 'react';
import { Check, HandIcon, PillButton, Screen, TopBar } from '../components/ui';
import type { Hand } from '../types';

const OPTIONS: { value: Hand; label: string }[] = [
  { value: 'left', label: 'Left' },
  { value: 'right', label: 'Right' },
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
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  // Radio-group arrow-key behaviour.
  const onKeyDown = (e: KeyboardEvent, i: number) => {
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) return;
    e.preventDefault();
    const next = (i + (e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 1) + OPTIONS.length) % OPTIONS.length;
    onSelect(OPTIONS[next].value);
    refs.current[next]?.focus();
  };

  return (
    <Screen
      label="Choose your hand"
      footer={
        <PillButton onClick={onContinue} disabled={!hand} aria-describedby={!hand ? 'hand-hint' : undefined}>
          Continue
        </PillButton>
      }
    >
      <TopBar onBack={onBack} step={1} />
      <div className="intro">
        <h1 className="title" id="hand-q">Which hand do you usually use?</h1>
        <p className="lede">
          This decides which side a few controls move to in the demo. You can change it later.
        </p>
      </div>
      <div className="hand-grid" role="radiogroup" aria-labelledby="hand-q">
        {OPTIONS.map((o, i) => {
          const selected = hand === o.value;
          const tabbable = selected || (!hand && i === 0);
          return (
            <button
              key={o.value}
              ref={(el) => {
                refs.current[i] = el;
              }}
              type="button"
              role="radio"
              aria-checked={selected}
              tabIndex={tabbable ? 0 : -1}
              className={`hand-card ${selected ? 'is-selected' : ''}`}
              onClick={() => onSelect(o.value)}
              onKeyDown={(e) => onKeyDown(e, i)}
            >
              {selected && (
                <span className="hand-card__check" aria-hidden="true">
                  <Check />
                </span>
              )}
              <HandIcon hand={o.value} />
              <span className="hand-card__label">{o.label}</span>
            </button>
          );
        })}
      </div>
      {!hand && (
        <p id="hand-hint" className="hint">
          Choose one to continue.
        </p>
      )}
    </Screen>
  );
}

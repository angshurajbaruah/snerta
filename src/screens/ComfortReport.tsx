import { useState } from 'react';
import { BackButton, BrandBar, PillButton, Screen, StepChip } from '../components/ui';
import { COLS, ROWS, TARGET_COUNT } from '../lib/calibration';
import {
  GRIP_TEXT,
  REACH_LABEL_TEXT,
  emptyReport,
  isReportEmpty,
  nextLabel,
  reportCounts,
  zoneName,
  type GripAnswer,
} from '../lib/reach';
import type { ReachLabel } from '../types';

export type ComfortResult = { labels: ReachLabel[]; grip: GripAnswer };

const GRIP_OPTIONS: Exclude<GripAnswer, null>[] = ['no', 'yes', 'unsure', 'declined'];

/**
 * The only place comfort is ever established. Nothing here is derived from timing,
 * and nothing is required: every zone starts at "Not sure" and staying there is a
 * real answer, not a gap to be filled in.
 */
export function ComfortReport({
  onBack,
  onComplete,
}: {
  onBack: () => void;
  onComplete: (r: ComfortResult) => void;
}) {
  const [labels, setLabels] = useState<ReachLabel[]>(emptyReport);
  const [grip, setGrip] = useState<GripAnswer>(null);
  const counts = reportCounts(labels);

  const cycle = (id: number) =>
    setLabels((prev) => prev.map((l, i) => (i === id ? nextLabel(l) : l)));

  return (
    <Screen
      label="How each area felt"
      dock={
        <>
          <BackButton onClick={onBack} />
          <PillButton onClick={() => onComplete({ labels, grip })}>
            {isReportEmpty(labels) ? 'Skip this' : 'See my reach map'}
          </PillButton>
        </>
      }
    >
      <BrandBar>
        <StepChip step={3} />
      </BrandBar>

      <div className="intro">
        <h1 className="title">How did each area feel?</h1>
        <p className="lede">
          This is the only part that records comfort — the taps measured time, not effort. Tap a
          square to change it. Leaving one as <em>Not sure</em> is a real answer.
        </p>
      </div>

      <div className="scroller">
        <section className="bento" aria-labelledby="zones-h">
          <h2 className="tile__name" id="zones-h">
            The same {TARGET_COUNT} spots, in the same places
          </h2>
          <p className="note">Each square sits where its dot was on the screen.</p>
          <div
            className="label-grid"
            role="group"
            aria-labelledby="zones-h"
            style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))`, gridTemplateRows: `repeat(${ROWS}, minmax(0, 1fr))` }}
          >
            {labels.map((l, id) => (
              <button
                key={id}
                type="button"
                className={`label-cell is-${l}`}
                onClick={() => cycle(id)}
                aria-label={`${zoneName(id)}: ${REACH_LABEL_TEXT[l]}. Activate to change.`}
              >
                <span aria-hidden="true">{l === 'unknown' ? '–' : REACH_LABEL_TEXT[l]}</span>
              </button>
            ))}
          </div>
          <p className="note" aria-live="polite">
            {counts.easy} easy · {counts.stretch} stretch · {counts.hard} hard · {counts.unknown} not
            sure
          </p>
        </section>

        <section className="bento" aria-labelledby="grip-h">
          <h2 className="tile__name" id="grip-h">
            Did you shift your grip?
          </h2>
          <p className="note">Optional. Moving the phone in your hand to reach something counts.</p>
          <div className="choice-list" role="radiogroup" aria-labelledby="grip-h">
            {GRIP_OPTIONS.map((g) => (
              <button
                key={g}
                type="button"
                role="radio"
                aria-checked={grip === g}
                className={`choice ${grip === g ? 'is-on' : ''}`}
                onClick={() => setGrip(grip === g ? null : g)}
              >
                <span className="radio" aria-hidden="true">
                  <span className="radio__dot" />
                </span>
                {GRIP_TEXT[g]}
              </button>
            ))}
          </div>
        </section>
      </div>
    </Screen>
  );
}

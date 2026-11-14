import { useState } from 'react';
import { BackButton, BrandBar, PillButton, Screen } from '../components/ui';
import {
  COMFORT_TEXT,
  compare,
  type Comfort,
  describeComfort,
  describeDuration,
  type Preference,
  type TrialResult,
} from '../lib/trial';
import { buildSessionExport, downloadJson } from '../lib/export';
import type { Hand } from '../types';
import type { CalibrationResult } from './Calibrate';
import type { ComfortResult } from './ComfortReport';

/** Averages are shown to one decimal; a whole number keeps its word label. */
function fmt(v: number | null): string {
  if (v === null) return '—';
  return v % 1 === 0 ? String(v) : v.toFixed(1);
}
function comfortWord(v: number | null): string {
  if (v === null) return 'Not rated';
  return v % 1 === 0 ? COMFORT_TEXT[v as Comfort] : 'Average of both runs';
}

export function Results({
  hand,
  calibration,
  comfort,
  trials,
  onBack,
  onRestart,
}: {
  hand: Hand | null;
  calibration: CalibrationResult | null;
  comfort: ComfortResult | null;
  trials: TrialResult[];
  onBack: () => void;
  onRestart: () => void;
}) {
  const [preference, setPreference] = useState<Preference>(null);
  const c = compare(trials);
  const secs = (ms: number | null) => (ms === null ? '—' : `${(ms / 1000).toFixed(1)}s`);

  const exportNow = () =>
    downloadJson(
      buildSessionExport({
        hand,
        samples: calibration?.samples ?? [],
        observations: calibration?.observations ?? [],
        hiddenCount: calibration?.hiddenCount ?? 0,
        skipped: calibration?.skipped ?? true,
        labels: comfort?.labels ?? null,
        grip: comfort?.grip ?? null,
        trials,
        preference,
      }),
      `snerta-session-${new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-')}.json`,
    );

  return (
    <Screen
      label="Your results"
      dock={
        <>
          <BackButton onClick={onBack} />
          <PillButton onClick={onRestart} icon="none">
            Start over
          </PillButton>
        </>
      }
    >
      <BrandBar>
        <span className="chip">Your results</span>
      </BrandBar>

      <div className="intro">
        <h1 className="title">What happened</h1>
        <p className="lede">
          Four tasks, two in each layout. Each number below is the middle of two runs.
          Whatever they say.
        </p>
      </div>

      <div className="scroller">
        {c ? (
          <>
            <section className="bento" aria-labelledby="t-h">
              <h2 className="tile__name" id="t-h">
                Time to finish
              </h2>
              <div className="versus">
                <div className="versus__side">
                  <span className="versus__n">{secs(c.standard.durationMs)}</span>
                  <span className="versus__l">Original</span>
                </div>
                <div className="versus__side">
                  <span className="versus__n">{secs(c.kab.durationMs)}</span>
                  <span className="versus__l">With snerta.</span>
                </div>
              </div>
              <p className="note">{describeDuration(c.durationDeltaMs!)}</p>
            </section>

            <section className="bento" aria-labelledby="c-h">
              <h2 className="tile__name" id="c-h">
                How comfortable it felt
              </h2>
              <div className="versus">
                <div className="versus__side">
                  <span className="versus__n">{fmt(c.standard.comfort)}</span>
                  <span className="versus__l">{comfortWord(c.standard.comfort)}</span>
                </div>
                <div className="versus__side">
                  <span className="versus__n">{fmt(c.kab.comfort)}</span>
                  <span className="versus__l">{comfortWord(c.kab.comfort)}</span>
                </div>
              </div>
              <p className="note">
                {c.comfortDelta === null
                  ? 'One of the two was not rated, so there is nothing to compare here.'
                  : describeComfort(c.comfortDelta)}
              </p>
            </section>

            <section className="bento" aria-labelledby="o-h">
              <h2 className="tile__name" id="o-h">
                Taps that did not move the task on
              </h2>
              <div className="versus">
                <div className="versus__side">
                  <span className="versus__n">{c.standard.offTaskTaps}</span>
                  <span className="versus__l">Original</span>
                </div>
                <div className="versus__side">
                  <span className="versus__n">{c.kab.offTaskTaps}</span>
                  <span className="versus__l">With snerta.</span>
                </div>
              </div>
              <p className="note">
                Counted, not called mistakes. Looking in the wrong place is information about the
                layout, not about you.
              </p>
            </section>

            <section className="bento" aria-labelledby="p-h">
              <h2 className="tile__name" id="p-h">
                Which did you prefer?
              </h2>
              <div className="choice-list" role="radiogroup" aria-labelledby="p-h">
                {([
                  ['standard', 'Original — controls at the top'],
                  ['kab', 'snerta. — controls near my thumb'],
                  ['none', 'No preference'],
                ] as [Preference, string][]).map(([v, text]) => (
                  <button
                    key={String(v)}
                    type="button"
                    role="radio"
                    aria-checked={preference === v}
                    className={`choice ${preference === v ? 'is-on' : ''}`}
                    onClick={() => setPreference(preference === v ? null : v)}
                  >
                    <span className="radio" aria-hidden="true">
                      <span className="radio__dot" />
                    </span>
                    {text}
                  </button>
                ))}
              </div>
            </section>
          </>
        ) : (
          <section className="bento">
            <h2 className="tile__name">No comparison to show</h2>
            <p className="note">
              A comparison needs both tasks finished. One of them was stopped or interrupted, so
              putting the two side by side would be misleading. What was recorded is still in the
              export below.
            </p>
          </section>
        )}

        <section className="bento bento--dark" aria-labelledby="l-h">
          <h2 className="tile__name" id="l-h">
            What this does not tell you
          </h2>
          <ul className="mismatch">
            <li>
              Four tasks on one phone, by one person. It says nothing about anyone else, or about
              you on another day.
            </li>
            <li>
              {c && c.balanced
                ? `The ${c.firstMode === 'kab' ? 'snerta.' : 'Original'} layout went first and last, so both layouts sat at the same average point in the order. Practice is spread evenly between them rather than landing on one — which is not the same as it being gone.`
                : c
                  ? `The runs did not come out even, so practice is still mixed into the difference above. The ${c.firstMode === 'kab' ? 'snerta.' : 'Original'} layout went first.`
                  : 'Whichever layout went first, practice favours what comes after it.'}
            </li>
            <li>A difference of a second or two is well inside normal variation between attempts.</li>
            <li>Nothing here was measured about your hand, and nothing was uploaded.</li>
          </ul>
        </section>

        <div className="bento switch-row" style={{ padding: 16 }}>
          <div>
            <div className="tile__name">Download this session</div>
            <div className="tile__sub">Everything recorded, including what went wrong.</div>
          </div>
          <button type="button" className="dock-btn" style={{ minHeight: 48, padding: '0 18px' }} onClick={exportNow}>
            JSON
          </button>
        </div>
      </div>
    </Screen>
  );
}

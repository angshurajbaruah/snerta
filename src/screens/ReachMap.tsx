import { BackButton, BrandBar, PillButton, Screen } from '../components/ui';
import { buildSessionExport, downloadJson } from '../lib/export';
import { COLS, ROWS } from '../lib/calibration';
import {
  REACH_LABEL_TEXT,
  findMismatches,
  isReportEmpty,
  latencyByZone,
  rankZones,
  reportCounts,
  zoneName,
} from '../lib/reach';
import type { Hand, ReachLabel } from '../types';
import type { CalibrationResult } from './Calibrate';
import type { ComfortResult } from './ComfortReport';

/**
 * Two accounts of the same fifteen spots, kept apart on purpose: what the person
 * said, and what the clock recorded. The map is the first one. The second is shown
 * as a diagnostic, with its limits stated, and never folded into the labels.
 */
export function ReachMap({
  hand,
  calibration,
  comfort,
  onBack,
  onContinue,
}: {
  hand: Hand | null;
  calibration: CalibrationResult;
  comfort: ComfortResult;
  onBack: () => void;
  onContinue: () => void;
}) {
  const { labels, grip } = comfort;
  const latency = latencyByZone(calibration.samples);
  const ranks = rankZones(latency);
  const mismatches = findMismatches(labels, latency);
  const counts = reportCounts(labels);
  const nothingSaid = isReportEmpty(labels);

  const exportNow = () =>
    downloadJson(
      buildSessionExport({
        hand,
        samples: calibration.samples,
        observations: calibration.observations,
        hiddenCount: calibration.hiddenCount,
        skipped: calibration.skipped,
        labels,
        grip,
      }),
      `snerta-session-${new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-')}.json`,
    );

  return (
    <Screen
      label="Your reach map"
      dock={
        <>
          <BackButton onClick={onBack} />
          <PillButton onClick={onContinue}>Try the layouts</PillButton>
        </>
      }
    >
      <BrandBar>
        <span className="chip">Your reach map</span>
      </BrandBar>

      <div className="intro">
        <h1 className="title">Your reach map</h1>
        <p className="lede">
          Based on this short test and how each area felt to you. Not on your hand size — nothing
          here measured that.
        </p>
      </div>

      <div className="scroller">
        <section className="bento" aria-labelledby="map-h">
          <h2 className="tile__name" id="map-h">
            What you reported
          </h2>
          {nothingSaid ? (
            <p className="note">
              You left every area as <em>Not sure</em>, so there is no map to draw. That is a
              legitimate result, not a missing one — the layouts below still work.
            </p>
          ) : (
            <>
              <div
                className="label-grid label-grid--static"
                style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))`, gridTemplateRows: `repeat(${ROWS}, minmax(0, 1fr))` }}
              >
                {labels.map((l, id) => (
                  <div key={id} className={`label-cell is-${l}`} aria-label={`${zoneName(id)}: ${REACH_LABEL_TEXT[l]}`}>
                    <span aria-hidden="true">{l === 'unknown' ? '–' : REACH_LABEL_TEXT[l]}</span>
                  </div>
                ))}
              </div>
              <div className="legend" aria-hidden="true">
                {(['easy', 'stretch', 'hard', 'unknown'] as ReachLabel[]).map((l) => (
                  <span key={l} className="legend__item">
                    <span className={`legend__swatch is-${l}`} />
                    {REACH_LABEL_TEXT[l]} · {counts[l]}
                  </span>
                ))}
              </div>
            </>
          )}
          {grip && (
            <p className="note">
              Grip: <strong>{grip === 'yes' ? 'shifted at least once' : grip === 'no' ? 'stayed the same' : grip === 'unsure' ? 'not sure' : 'not answered'}</strong>
            </p>
          )}
        </section>

        <section className="bento bento--dark" aria-labelledby="time-h">
          <h2 className="tile__name" id="time-h">
            What the clock recorded
          </h2>
          <p className="note" style={{ color: 'var(--silver)' }}>
            Median time from each dot appearing to your tap. It includes noticing the dot, so a
            slow spot is not necessarily a hard one. This is shown beside your labels, not mixed
            into them.
          </p>
          <div
            className="label-grid label-grid--static label-grid--time"
            style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))`, gridTemplateRows: `repeat(${ROWS}, minmax(0, 1fr))` }}
          >
            {latency.map((v, id) => (
              <div
                key={id}
                className={`time-cell ${ranks[id] ? `is-${ranks[id]}` : ''}`}
                aria-label={`${zoneName(id)}: ${v === null ? 'no data' : `${Math.round(v)} milliseconds`}${ranks[id] ? `, ${ranks[id]}` : ''}`}
              >
                <span aria-hidden="true">{v === null ? '–' : Math.round(v)}</span>
              </div>
            ))}
          </div>
          {ranks.some(Boolean) ? (
            <p className="note" style={{ color: 'var(--silver)' }}>
              Outlined: quickest and slowest. Marked only because the spread was wide enough to
              see; a flat set would be left unmarked.
            </p>
          ) : (
            <p className="note" style={{ color: 'var(--silver)' }}>
              The times were too close together to call any spot quickest or slowest.
            </p>
          )}
        </section>

        {mismatches.length > 0 && (
          <section className="bento" aria-labelledby="mm-h">
            <h2 className="tile__name" id="mm-h">
              Where the two disagree
            </h2>
            <p className="note">
              Neither account is wrong, and neither overrules the other. This is the interesting
              part, so it is shown rather than smoothed away.
            </p>
            <ul className="mismatch">
              {mismatches.slice(0, 3).map((m) => (
                <li key={m.zoneId}>
                  <strong>{zoneName(m.zoneId)}</strong>
                  {m.kind === 'slow-but-easy' ? (
                    <>
                      {' '}
                      — you called it easy, and it took {m.ratio.toFixed(1)}× the typical time.
                      Likely the time to spot a dot away from where you were looking, rather than
                      effort.
                    </>
                  ) : (
                    <>
                      {' '}
                      — you called it hard, and you tapped it as quickly as anywhere else. Speed
                      and effort are not the same thing.
                    </>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="bento switch-row" style={{ padding: 16 }}>
          <div>
            <div className="tile__name">Download this session</div>
            <div className="tile__sub">Your labels and the raw taps. This device only — nothing is uploaded.</div>
          </div>
          <button type="button" className="dock-btn" style={{ minHeight: 48, padding: '0 18px' }} onClick={exportNow}>
            JSON
          </button>
        </div>

        <section className="bento" aria-labelledby="lim-h">
          <h2 className="tile__name" id="lim-h">
            What this map is not
          </h2>
          <ul className="mismatch">
            <li>Not a measurement of your hand, your anatomy or your ability.</li>
            <li>Not a medical or accessibility assessment.</li>
            <li>
              One session on one phone{hand ? `, with your ${hand === 'both' ? 'hands switching' : `${hand} hand`}` : ''} — it says nothing about anyone
              else, or about you on another day.
            </li>
            <li>Not proof that moving controls will help. That is what comes next.</li>
          </ul>
        </section>
      </div>
    </Screen>
  );
}

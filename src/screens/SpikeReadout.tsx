import { TARGET_COUNT, evidenceKind, median } from '../lib/calibration';
import { buildSpikeExport, downloadJson } from '../lib/export';
import { BackButton, BrandBar, PillButton, Screen, StepChip } from '../components/ui';
import type { Hand } from '../types';
import type { CalibrationResult } from './Calibrate';

/**
 * Milestone-2 interim screen. This is NOT yet the reach map: a reach map needs the
 * comfort self-report, which is the next piece of work. Until then this screen shows
 * only what the browser actually recorded, with no comfort labels inferred from timing.
 */
export function SpikeReadout({
  hand,
  result,
  onBack,
  onContinue,
}: {
  hand: Hand | null;
  result: CalibrationResult;
  onBack: () => void;
  onContinue: () => void;
}) {
  const { samples, observations, skipped } = result;
  const kind = skipped ? 'skipped' : evidenceKind(samples);
  const otherTypes = Array.from(new Set(samples.map((s) => s.pointerType))).filter((t) => t !== 'touch');
  const perZone = Array.from({ length: TARGET_COUNT }, (_, id) =>
    median(samples.filter((s) => s.targetId === id && !s.promptRestarted).map((s) => s.latencyMs)),
  );

  const exportNow = () =>
    downloadJson(
      buildSpikeExport({ hand, samples, observations, hiddenCount: result.hiddenCount, skipped }),
      `snerta-session-${new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-')}.json`,
    );

  return (
    <Screen
      label="What was recorded"
      dock={
        <>
          <BackButton onClick={onBack} />
          <PillButton onClick={onContinue}>See the layouts</PillButton>
        </>
      }
    >
      <BrandBar>
        <StepChip step={3} />
      </BrandBar>

      <div className="intro">
        <span className="eyebrow">Build check · interim screen</span>
        <h1 className="title">What was recorded</h1>
        <p className="lede">
          {kind === 'skipped' && 'You skipped calibration, so nothing was measured. The layout demo still works.'}
          {kind === 'touch' &&
            'Your browser reported every tap as touch. That is browser-reported touch — it does not prove which finger you used.'}
          {kind === 'preview' &&
            `Some taps came from a ${otherTypes.join(' / ')}, so this counts as a preview rather than thumb data.`}
          {kind === 'incomplete' && 'This run did not finish, so there is no complete set to show.'}
        </p>
      </div>

      <div className="scroller">
        {!skipped && (
          <>
            <section className="bento" aria-labelledby="lat-h">
              <h2 className="tile__name" id="lat-h">
                Time from dot appearing to tap
              </h2>
              <p className="note">
                Median of the two taps at each position, in milliseconds. This includes noticing the
                dot and deciding to move, so it is not a measure of comfort or of effort.
              </p>
              <div className="zone-grid" role="group" aria-label="Median time by position">
                {perZone.map((v, i) => (
                  <div
                    key={i}
                    className="zone-grid__cell"
                    aria-label={`Position ${i + 1}: ${v === null ? 'no data' : `${Math.round(v)} milliseconds`}`}
                  >
                    {v === null ? '—' : Math.round(v)}
                  </div>
                ))}
              </div>
            </section>

            <div className="grid-3">
              <div className="bento stat">
                <span className="stat__n">{samples.length}</span>
                <span className="stat__l">taps counted</span>
              </div>
              <div className="bento stat">
                <span className="stat__n">{observations.length}</span>
                <span className="stat__l">other touches in the tray</span>
              </div>
              <div className="bento stat">
                <span className="stat__n">{result.hiddenCount}</span>
                <span className="stat__l">times the page was hidden</span>
              </div>
            </div>

            <section className="bento bento--dark">
              <h2 className="tile__name">Not shown here, on purpose</h2>
              <p className="note" style={{ color: 'var(--silver)' }}>
                No reach map yet. Labelling a zone easy or hard needs you to tell us how it felt —
                that question is the next thing to build. Guessing comfort from how fast you tapped
                would not be honest.
              </p>
            </section>

            <details className="bento raw">
              <summary>Raw samples</summary>
              <div className="raw__scroll">
                <table>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Pos</th>
                      <th>Type</th>
                      <th>Target x,y</th>
                      <th>Tap x,y</th>
                      <th>ms</th>
                    </tr>
                  </thead>
                  <tbody>
                    {samples.map((s) => (
                      <tr key={s.index}>
                        <td>{s.index + 1}</td>
                        <td>{s.targetId + 1}</td>
                        <td>{s.pointerType}</td>
                        <td>
                          {s.targetX.toFixed(2)}, {s.targetY.toFixed(2)}
                        </td>
                        <td>
                          {s.pointerX.toFixed(2)}, {s.pointerY.toFixed(2)}
                        </td>
                        <td>
                          {s.latencyMs}
                          {s.promptRestarted ? '*' : ''}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="note">
                Coordinates are fractions of the tray (0–1). * = the clock restarted after the page
                was hidden.
              </p>
            </details>
          </>
        )}

        <div className="bento switch-row" style={{ padding: 16 }}>
          <div>
            <div className="tile__name">Download what was recorded</div>
            <div className="tile__sub">Saved to this device only. Nothing is uploaded.</div>
          </div>
          <button type="button" className="dock-btn" style={{ minHeight: 48, padding: '0 18px' }} onClick={exportNow}>
            JSON
          </button>
        </div>
      </div>
    </Screen>
  );
}

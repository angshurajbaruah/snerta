import { TARGET_COUNT, evidenceKind, median } from '../lib/calibration';
import { buildSpikeExport, downloadJson } from '../lib/export';
import { PillButton, Screen, TopBar } from '../components/ui';
import type { Hand } from '../types';
import type { CalibrationResult } from './Calibrate';

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
  const types = Array.from(new Set(samples.map((s) => s.pointerType)));
  const perZone = Array.from({ length: TARGET_COUNT }, (_, id) =>
    median(samples.filter((s) => s.targetId === id && !s.promptRestarted).map((s) => s.latencyMs)),
  );

  const exportNow = () =>
    downloadJson(
      buildSpikeExport({ hand, samples, observations, hiddenCount: result.hiddenCount, skipped }),
      `kab-session-${new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-')}.json`,
    );

  return (
    <Screen label="Calibration readout" footer={<PillButton onClick={onContinue}>Try the layout demo</PillButton>}>
      <TopBar onBack={onBack} step={3} />
      <div className="intro">
        <p className="eyebrow">Build check · temporary screen</p>
        <h1 className="title">What the browser recorded</h1>
        <p className="lede">
          {kind === 'skipped' && 'You skipped calibration, so nothing was measured. The demo still works.'}
          {kind === 'touch' &&
            'All 18 taps were reported by your browser as touch. That’s browser-reported touch, not proof of which finger you used.'}
          {kind === 'preview' &&
            `Some taps came from a ${types.filter((t) => t !== 'touch').join(' / ')}, so this run counts as a preview, not thumb data.`}
          {kind === 'incomplete' && 'This run is incomplete.'}
        </p>
      </div>

      {!skipped && (
        <>
          <section className="card" aria-labelledby="lat-h">
            <h2 className="card__title" id="lat-h">
              Time from dot appearing to tap
            </h2>
            <p className="card__note">
              Median of two taps per position, in milliseconds. It includes noticing the dot, so it is
              not a measure of comfort or effort.
            </p>
            <div className="zone-grid" role="table" aria-label="Median latency by position">
              {perZone.map((v, i) => (
                <div key={i} className="zone-grid__cell" role="cell" aria-label={`Position ${i + 1}: ${v === null ? 'no data' : `${Math.round(v)} ms`}`}>
                  {v === null ? '—' : Math.round(v)}
                </div>
              ))}
            </div>
          </section>

          <section className="card stats">
            <div>
              <span className="stats__n">{samples.length}</span>
              <span className="stats__l">accepted taps</span>
            </div>
            <div>
              <span className="stats__n">{observations.length}</span>
              <span className="stats__l">other touches in panel</span>
            </div>
            <div>
              <span className="stats__n">{result.hiddenCount}</span>
              <span className="stats__l">times page was hidden</span>
            </div>
          </section>

          <details className="card raw">
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
            <p className="card__note">Coordinates are fractions of the tap panel (0–1). * = clock restarted after the page was hidden.</p>
          </details>
        </>
      )}

      <div className="row-actions">
        <PillButton variant="secondary" arrow={false} onClick={exportNow}>
          Download my data (JSON)
        </PillButton>
        <p className="card__note">Saved only to this device. Nothing is uploaded.</p>
      </div>
    </Screen>
  );
}

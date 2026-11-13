import { useCallback, useEffect, useReducer, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import {
  MEASURED_COUNT,
  PRACTICE_COUNT,
  TARGET_COUNT,
  activeTarget,
  calibrationReducer,
  initialCalibration,
  makeSequence,
  targetFraction,
  type GeometrySnapshot,
} from '../lib/calibration';
import { ArrowLeft, PillButton, Wordmark } from '../components/ui';
import type { PanelObservation, TapSample } from '../types';

export type CalibrationResult = {
  samples: TapSample[];
  observations: PanelObservation[];
  hiddenCount: number;
  skipped: boolean;
};

export function readGeometry(): GeometrySnapshot {
  const vv = typeof window !== 'undefined' ? window.visualViewport : null;
  const portrait =
    typeof window !== 'undefined' && window.matchMedia ? window.matchMedia('(orientation: portrait)').matches : true;
  return {
    viewportW: document.documentElement.clientWidth || window.innerWidth,
    orientation: portrait ? 'portrait' : 'landscape',
    scale: vv?.scale ?? 1,
  };
}

/** Some engines report an epoch-based timeStamp; fall back to performance.now() then. */
function eventTime(e: { timeStamp: number }): number {
  const now = performance.now();
  return e.timeStamp > 0 && Math.abs(now - e.timeStamp) < 10_000 ? e.timeStamp : now;
}

/**
 * The tray spans the whole screen, including the top, because that is the part
 * one-handed reach actually fails at. The dots are laid out once and never move:
 * the brief forbids repositioning a target mid-task, and on the first real-phone
 * run a layout shift at Start made every dot jump and cost the participant eight
 * seconds of confusion.
 */
export function Calibrate({ onBack, onComplete }: { onBack: () => void; onComplete: (r: CalibrationResult) => void }) {
  const [started, setStarted] = useState(false);
  const [run, setRun] = useState(0);

  const restart = useCallback(() => {
    setRun((r) => r + 1);
    setStarted(false);
  }, []);

  return (
    <CalibrationSurface
      key={run}
      started={started}
      onStart={() => setStarted(true)}
      onBack={onBack}
      onRestart={restart}
      onComplete={onComplete}
    />
  );
}

function CalibrationSurface({
  started,
  onStart,
  onBack,
  onRestart,
  onComplete,
}: {
  started: boolean;
  onStart: () => void;
  onBack: () => void;
  onRestart: () => void;
  onComplete: (r: CalibrationResult) => void;
}) {
  const [state, dispatch] = useReducer(calibrationReducer, undefined, () =>
    initialCalibration(makeSequence(), readGeometry()),
  );
  const trayRef = useRef<HTMLDivElement>(null);
  const target = activeTarget(state);
  const done = state.status === 'complete';
  const interrupted = state.status === 'interrupted';
  const live = started && !done && !interrupted;
  const practising = state.step < PRACTICE_COUNT;
  const measured = Math.max(0, state.step - PRACTICE_COUNT);

  useEffect(() => {
    if (!started || state.status !== 'running' || state.paused || state.promptAt !== null) return;
    let r2 = 0;
    const r1 = requestAnimationFrame(() => {
      r2 = requestAnimationFrame(() => dispatch({ type: 'prompted', at: performance.now() }));
    });
    return () => {
      cancelAnimationFrame(r1);
      cancelAnimationFrame(r2);
    };
  }, [started, state.step, state.status, state.paused, state.promptAt]);

  useEffect(() => {
    const onVis = () => dispatch({ type: document.hidden ? 'hidden' : 'visible' });
    const onGeo = () => dispatch({ type: 'geometry', now: readGeometry() });
    document.addEventListener('visibilitychange', onVis);
    window.addEventListener('resize', onGeo);
    window.addEventListener('orientationchange', onGeo);
    window.visualViewport?.addEventListener('resize', onGeo);
    return () => {
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('resize', onGeo);
      window.removeEventListener('orientationchange', onGeo);
      window.visualViewport?.removeEventListener('resize', onGeo);
    };
  }, []);

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.cancelable) e.preventDefault();
    const el = trayRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    dispatch({
      type: 'pointerdown',
      input: { clientX: e.clientX, clientY: e.clientY, pointerType: e.pointerType, isPrimary: e.isPrimary, button: e.button },
      rect: { left: r.left, top: r.top, width: r.width, height: r.height },
      at: eventTime(e),
      viewportW: window.innerWidth,
      viewportH: window.innerHeight,
      iso: new Date().toISOString(),
    });
  };

  return (
    <main className="cal" aria-label="Find your reach">
      <div
        ref={trayRef}
        className={`cal__tray ${interrupted ? 'is-dimmed' : ''}`}
        onPointerDown={live ? onPointerDown : undefined}
        onContextMenu={(e) => e.preventDefault()}
        data-testid="tray-field"
      >
        {Array.from({ length: TARGET_COUNT }, (_, id) => {
          const f = targetFraction(id);
          return (
            <span
              key={id}
              className={`bead ${live && target === id ? 'is-active' : ''}`}
              style={{ left: `${f.x * 100}%`, top: `${f.y * 100}%` }}
              data-target={id}
              aria-hidden="true"
            />
          );
        })}
      </div>


      {!started && (
        <div className="cal__card">
          {/* The wordmark lives in the card, not floating at the top, because at the
              top it would sit on the first row of targets once the safe-area inset
              pushes them down on a notched phone. */}
          <Wordmark />
          <h1 className="title">Find your natural reach.</h1>
          <p className="lede">
            Hold your phone the way you normally would in one hand. Tap each dot as it darkens —
            every one, whether or not it feels easy. Don’t shift your grip to reach.
          </p>
          <p className="note">
            Three practice taps first, then {MEASURED_COUNT} that count. Stop at any point.
          </p>
          <div className="cal__card-actions">
            <button type="button" className="round-btn" onClick={onBack} aria-label="Back">
              <ArrowLeft />
            </button>
            <PillButton onClick={onStart}>Start</PillButton>
          </div>
          <button
            type="button"
            className="text-btn"
            onClick={() => onComplete({ samples: [], observations: [], hiddenCount: 0, skipped: true })}
          >
            Skip — just show me the demo
          </button>
        </div>
      )}

      {live && (
        <div className="cal__bar">
          <span className="cal__count" aria-live="polite">
            {state.paused
              ? 'Paused'
              : practising
                ? `Practice ${state.step + 1} of ${PRACTICE_COUNT}`
                : `${measured + 1} of ${MEASURED_COUNT}`}
          </span>
          <button type="button" className="cal__stop" onClick={onRestart}>
            Stop
          </button>
        </div>
      )}

      {(done || interrupted) && (
        <div className="cal__card">
          {interrupted ? (
            <>
              <h1 className="title">Let’s start that again.</h1>
              <p className="lede">
                {state.interruptionReason} Taps from different screen shapes can’t be mixed, so this
                run was set aside.
              </p>
              <div className="cal__card-actions">
                <PillButton onClick={onRestart}>Start again</PillButton>
              </div>
            </>
          ) : (
            <>
              <h1 className="title">That’s all {MEASURED_COUNT}.</h1>
              <p className="lede">Thanks. Next you’ll see exactly what was recorded.</p>
              <div className="cal__card-actions">
                <button type="button" className="round-btn" onClick={onRestart} aria-label="Do it again">
                  <ArrowLeft />
                </button>
                <PillButton
                  onClick={() =>
                    onComplete({
                      samples: state.samples,
                      observations: state.observations,
                      hiddenCount: state.hiddenCount,
                      skipped: false,
                    })
                  }
                >
                  Continue
                </PillButton>
              </div>
            </>
          )}
        </div>
      )}
    </main>
  );
}

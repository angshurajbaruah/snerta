import { useCallback, useEffect, useReducer, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import {
  SEQUENCE_LENGTH,
  TARGET_COUNT,
  activeTarget,
  calibrationReducer,
  initialCalibration,
  makeSequence,
  targetFraction,
  type GeometrySnapshot,
} from '../lib/calibration';
import { PillButton, Screen, TopBar } from '../components/ui';
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
    typeof window !== 'undefined' && window.matchMedia
      ? window.matchMedia('(orientation: portrait)').matches
      : true;
  return {
    viewportW: document.documentElement.clientWidth || window.innerWidth,
    orientation: portrait ? 'portrait' : 'landscape',
    scale: vv?.scale ?? 1,
  };
}

/** Some engines historically reported epoch-based timeStamp; fall back to performance.now() then. */
function eventTime(e: { timeStamp: number }): number {
  const now = performance.now();
  return e.timeStamp > 0 && Math.abs(now - e.timeStamp) < 10_000 ? e.timeStamp : now;
}

export function Calibrate({
  onBack,
  onComplete,
}: {
  onBack: () => void;
  onComplete: (r: CalibrationResult) => void;
}) {
  const [phase, setPhase] = useState<'intro' | 'active'>('intro');
  // Each start mounts a fresh run (new random sequence, new geometry baseline).
  const [run, setRun] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);

  const start = useCallback(() => {
    setRun((r) => r + 1);
    setPhase('active');
  }, []);

  return phase === 'intro' ? (
    <Screen
      label="Calibration"
      className="screen--fit"
      footer={
        <div className="footer-stack">
          <PillButton onClick={start}>Start</PillButton>
          <button type="button" className="text-btn" onClick={() => onComplete({ samples: [], observations: [], hiddenCount: 0, skipped: true })}>
            Preview without touch calibration
          </button>
        </div>
      }
    >
      <TopBar onBack={onBack} step={2} />
      <CalibrationIntro />
      <TouchPanel panelRef={panelRef} active={null} />
    </Screen>
  ) : (
    <CalibrationRun key={run} onExit={() => setPhase('intro')} onComplete={onComplete} />
  );
}

function CalibrationIntro() {
  return (
    <div className="intro">
      <h1 className="title">Let’s find your natural reach.</h1>
      <p className="lede">
        Hold your phone as you normally would in one hand. Tap each dot as it darkens. 18 taps, no
        rush, stop anytime.
      </p>
    </div>
  );
}

function CalibrationRun({ onExit, onComplete }: { onExit: () => void; onComplete: (r: CalibrationResult) => void }) {
  const [state, dispatch] = useReducer(calibrationReducer, undefined, () =>
    initialCalibration(makeSequence(), readGeometry()),
  );
  const panelRef = useRef<HTMLDivElement>(null);
  const target = activeTarget(state);

  // Start the prompt clock after the active target has been painted (double rAF).
  useEffect(() => {
    if (state.status !== 'running' || state.paused || state.promptAt !== null) return;
    let r2 = 0;
    const r1 = requestAnimationFrame(() => {
      r2 = requestAnimationFrame(() => dispatch({ type: 'prompted', at: performance.now() }));
    });
    return () => {
      cancelAnimationFrame(r1);
      cancelAnimationFrame(r2);
    };
  }, [state.step, state.status, state.paused, state.promptAt]);

  // Page hidden → pause; geometry change → interrupt.
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
    // Suppress compatibility mouse events / double-tap zoom; we never listen to click.
    if (e.cancelable) e.preventDefault();
    const el = panelRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    dispatch({
      type: 'pointerdown',
      input: {
        clientX: e.clientX,
        clientY: e.clientY,
        pointerType: e.pointerType,
        isPrimary: e.isPrimary,
        button: e.button,
      },
      rect: { left: r.left, top: r.top, width: r.width, height: r.height },
      at: eventTime(e),
      viewportW: window.innerWidth,
      viewportH: window.innerHeight,
      iso: new Date().toISOString(),
    });
  };

  const done = state.status === 'complete';
  const interrupted = state.status === 'interrupted';

  return (
    <Screen
      label="Calibration"
      className="screen--fit"
      footer={
        done ? (
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
        ) : interrupted ? (
          <PillButton onClick={onExit}>Restart calibration</PillButton>
        ) : (
          <button type="button" className="text-btn text-btn--block" onClick={onExit}>
            Stop and start over
          </button>
        )
      }
    >
      <TopBar onBack={onExit} step={2} />
      <h1 className="title title--compact">Tap each dot as it darkens</h1>
      <p className="counter" aria-live="polite">
        {done
          ? 'All 18 done. Thank you.'
          : interrupted
            ? 'Paused'
            : state.paused
              ? 'Paused while the page was hidden'
              : `${state.step + 1} of ${SEQUENCE_LENGTH}`}
      </p>
      {interrupted && (
        <p className="notice" role="alert">
          <strong>Calibration stopped.</strong> {state.interruptionReason} Taps from different screen
          shapes can’t be mixed, so this run was set aside. Hold the phone upright and restart.
        </p>
      )}
      <TouchPanel
        panelRef={panelRef}
        active={done || interrupted ? null : target}
        onPointerDown={done || interrupted ? undefined : onPointerDown}
        dimmed={interrupted}
      />
    </Screen>
  );
}

function TouchPanel({
  panelRef,
  active,
  onPointerDown,
  dimmed = false,
}: {
  panelRef: React.RefObject<HTMLDivElement | null>;
  active: number | null;
  onPointerDown?: (e: ReactPointerEvent<HTMLDivElement>) => void;
  dimmed?: boolean;
}) {
  return (
    <div
      ref={panelRef}
      className={`touch-panel ${dimmed ? 'is-dimmed' : ''} ${onPointerDown ? 'is-live' : ''}`}
      onPointerDown={onPointerDown}
      onContextMenu={(e) => e.preventDefault()}
      aria-hidden="true"
      data-testid="touch-panel"
    >
      {Array.from({ length: TARGET_COUNT }, (_, id) => {
        const f = targetFraction(id);
        return (
          <span
            key={id}
            className={`dot ${active === id ? 'is-active' : ''}`}
            style={{ left: `${f.x * 100}%`, top: `${f.y * 100}%` }}
            data-target={id}
          />
        );
      })}
    </div>
  );
}

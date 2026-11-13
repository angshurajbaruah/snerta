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
import { BackButton, BrandBar, PillButton, Screen, StepChip } from '../components/ui';
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

export function Calibrate({ onBack, onComplete }: { onBack: () => void; onComplete: (r: CalibrationResult) => void }) {
  const [phase, setPhase] = useState<'intro' | 'active'>('intro');
  const [run, setRun] = useState(0);

  const start = useCallback(() => {
    setRun((r) => r + 1);
    setPhase('active');
  }, []);

  if (phase === 'active') return <CalibrationRun key={run} onExit={() => setPhase('intro')} onComplete={onComplete} />;

  return (
    <Screen
      label="Find your reach"
      fit
      dock={
        <>
          <BackButton onClick={onBack} />
          <PillButton onClick={start}>Start</PillButton>
        </>
      }
    >
      <BrandBar>
        <StepChip step={2} />
      </BrandBar>
      <div className="intro">
        <h1 className="title">Find your natural reach.</h1>
        <p className="lede">
          Hold your phone the way you normally would in one hand. Tap each dot as it darkens — every
          one, whether or not it feels easy. {SEQUENCE_LENGTH} taps. You can stop at any point.
        </p>
      </div>
      <Tray active={null} />
      <button
        type="button"
        className="text-btn"
        style={{ alignSelf: 'center' }}
        onClick={() => onComplete({ samples: [], observations: [], hiddenCount: 0, skipped: true })}
      >
        Skip — just show me the demo
      </button>
    </Screen>
  );
}

function CalibrationRun({ onExit, onComplete }: { onExit: () => void; onComplete: (r: CalibrationResult) => void }) {
  const [state, dispatch] = useReducer(calibrationReducer, undefined, () =>
    initialCalibration(makeSequence(), readGeometry()),
  );
  const trayRef = useRef<HTMLDivElement>(null);
  const target = activeTarget(state);
  const done = state.status === 'complete';
  const interrupted = state.status === 'interrupted';

  // Start the prompt clock only once the active bead has actually been painted.
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
    if (e.cancelable) e.preventDefault(); // suppress compat mouse events and double-tap zoom
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
    <Screen
      label="Find your reach"
      fit
      dock={
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
            Build my reach map
          </PillButton>
        ) : interrupted ? (
          <PillButton onClick={onExit}>Start again</PillButton>
        ) : (
          <>
            <BackButton onClick={onExit} label="Stop and start over" />
            <span className="pill" style={{ opacity: 0.45, pointerEvents: 'none' }} aria-hidden="true">
              Keep tapping
            </span>
          </>
        )
      }
    >
      <BrandBar>
        <StepChip step={2} />
      </BrandBar>
      <div className="intro">
        <h1 className="title">Tap each dot as it darkens.</h1>
      </div>
      <Tray
        trayRef={trayRef}
        active={done || interrupted ? null : target}
        donePositions={new Set(state.samples.map((s) => s.targetId))}
        onPointerDown={done || interrupted ? undefined : onPointerDown}
        dimmed={interrupted}
        status={
          done
            ? `All ${SEQUENCE_LENGTH} done`
            : interrupted
              ? 'Stopped'
              : state.paused
                ? 'Paused'
                : `${state.step + 1} of ${SEQUENCE_LENGTH}`
        }
      />
      {interrupted && (
        <p className="alert" role="alert">
          <strong>Calibration stopped.</strong> {state.interruptionReason} Taps from different screen
          shapes can’t be mixed, so this run was set aside. Hold the phone upright and start again.
        </p>
      )}
    </Screen>
  );
}

function Tray({
  trayRef,
  active,
  donePositions,
  onPointerDown,
  dimmed = false,
  status,
}: {
  trayRef?: React.RefObject<HTMLDivElement | null>;
  active: number | null;
  donePositions?: Set<number>;
  onPointerDown?: (e: ReactPointerEvent<HTMLDivElement>) => void;
  dimmed?: boolean;
  status?: string;
}) {
  return (
    <div className={`tray ${dimmed ? 'is-dimmed' : ''}`} onContextMenu={(e) => e.preventDefault()}>
      <span className="tray__glow" aria-hidden="true" />
      {status && (
        <div className="tray__head">
          <span className="count-chip" aria-live="polite">
            {status}
          </span>
        </div>
      )}
      {/* The field alone is the measured surface, so the status chip never eats a tap. */}
      <div ref={trayRef} className="tray__field" onPointerDown={onPointerDown} aria-hidden="true" data-testid="tray-field">
        {Array.from({ length: TARGET_COUNT }, (_, id) => {
          const f = targetFraction(id);
          return (
            <span
              key={id}
              className={`bead ${active === id ? 'is-active' : donePositions?.has(id) ? 'is-done' : ''}`}
              style={{ left: `${f.x * 100}%`, top: `${f.y * 100}%` }}
              data-target={id}
            />
          );
        })}
      </div>
    </div>
  );
}

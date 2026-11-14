import { useEffect, useReducer, useState } from 'react';
import { InboxApp } from '../components/InboxApp';
import { PillButton } from '../components/ui';
import { placementFor } from '../lib/layout';
import {
  COMFORT_TEXT,
  TOTAL_STEPS,
  durationMs,
  initialTrial,
  messageById,
  stepsDone,
  trialReducer,
  type Comfort,
  type TrialPosition,
  type TrialResult,
} from '../lib/trial';
import type { Hand, Mode } from '../types';

/**
 * One timed trial, full screen.
 *
 * Full screen is not a styling choice. Inside a preview card the bottom rail is not
 * at the bottom of the phone, so the reach it is supposed to test does not exist and
 * the comparison would measure nothing.
 */
export function Trial({
  mode,
  position,
  targetId,
  hand,
  onDone,
}: {
  mode: Mode;
  position: TrialPosition;
  targetId: string;
  hand: Hand;
  onDone: (r: TrialResult) => void;
}) {
  const [state, dispatch] = useReducer(trialReducer, undefined, () => initialTrial(mode, targetId));
  const [comfort, setComfort] = useState<Comfort | null>(null);
  const placement = placementFor(mode, hand);
  const target = messageById(targetId)!;
  const modeName = mode === 'kab' ? 'snerta.' : 'Original';
  const phase = state.status;

  // Leaving the page mid-trial makes the duration meaningless, so the run is void.
  useEffect(() => {
    const onHide = () => {
      if (document.hidden) dispatch({ type: 'abandon' });
    };
    document.addEventListener('visibilitychange', onHide);
    return () => document.removeEventListener('visibilitychange', onHide);
  }, []);

  const finish = (completed: boolean) =>
    onDone({
      mode,
      position,
      targetId,
      durationMs: durationMs(state),
      comfort,
      offTaskTaps: state.offTaskTaps,
      completed,
    });

  const handlers = {
    onControl: (id: 'back' | 'search' | 'menu') => {
      if (id === 'search') dispatch({ type: 'tapSearch' });
      else if (id === 'menu') dispatch({ type: 'tapMenu' });
      else dispatch({ type: 'tapBack', at: performance.now() });
    },
    onOpen: (id: string) => dispatch({ type: 'openMessage', id, at: performance.now() }),
    onArchive: () => dispatch({ type: 'tapArchive', at: performance.now() }),
    onCloseMenu: () => dispatch({ type: 'closeMenu' }),
  };

  return (
    <main className="trial" aria-label={`Task ${position} of 4`}>
      <div className="trial__app">
        <InboxApp
          placement={placement}
          view={state.view}
          openId={state.openId}
          menuOpen={state.menuOpen}
          archivedIds={state.archived ? [targetId] : []}
          handlers={handlers}
          inert={phase !== 'running'}
        />
      </div>

      {phase === 'running' && (
        <div className="trial__task" role="status">
          <span className="trial__step">
            {stepsDone(state)} of {TOTAL_STEPS}
          </span>
          <span className="trial__what">
            Find <strong>{target.from}</strong>, archive it, come back
          </span>
          <button type="button" className="trial__quit" onClick={() => finish(false)}>
            Stop
          </button>
        </div>
      )}

      {phase === 'ready' && (
        <div className="cal__card">
          <span className="eyebrow">
            Task {position} of 4 · {modeName} layout
          </span>
          <h1 className="title">Find {target.from}, archive it, come back.</h1>
          <p className="lede">
            Three steps: search for the message, archive it from the menu, then return to the
            inbox. Hold the phone the way you normally would in one hand.
          </p>
          <p className="note">
            The clock starts when you tap Start and stops the moment you are back. Take it at a
            normal pace — it is the two layouts being compared, not you.
          </p>
          <div className="cal__card-actions">
            <PillButton onClick={() => dispatch({ type: 'start', at: performance.now() })}>Start</PillButton>
          </div>
        </div>
      )}

      {phase === 'abandoned' && (
        <div className="cal__card">
          <h1 className="title">That run was set aside.</h1>
          <p className="lede">
            The task was interrupted, so its time would not mean anything. It is recorded as
            incomplete rather than dropped.
          </p>
          <div className="cal__card-actions">
            <PillButton onClick={() => finish(false)}>Carry on</PillButton>
          </div>
        </div>
      )}

      {phase === 'complete' && (
        <div className="cal__card">
          <span className="eyebrow">Task {position} of 4 · done</span>
          <h1 className="title">How comfortable was that?</h1>
          <p className="note">
            About the reaching, not about whether you got it right. The time is already recorded
            and this answer does not change it.
          </p>
          <div className="scale" role="radiogroup" aria-label="How comfortable was that?">
            {([1, 2, 3, 4, 5] as Comfort[]).map((n) => (
              <button
                key={n}
                type="button"
                role="radio"
                aria-checked={comfort === n}
                aria-label={`${n} — ${COMFORT_TEXT[n]}`}
                className={`scale__dot ${comfort === n ? 'is-on' : ''}`}
                onClick={() => setComfort(n)}
              >
                {n}
              </button>
            ))}
          </div>
          <div className="scale__ends" aria-hidden="true">
            <span>Very uncomfortable</span>
            <span>Very comfortable</span>
          </div>
          <div className="cal__card-actions">
            <PillButton onClick={() => finish(true)}>
              {comfort === null ? 'Skip the rating' : 'Continue'}
            </PillButton>
          </div>
        </div>
      )}
    </main>
  );
}

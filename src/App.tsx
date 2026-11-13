import { useEffect, useRef, useState } from 'react';
import { Welcome } from './screens/Welcome';
import { HandSelect } from './screens/HandSelect';
import { Calibrate, type CalibrationResult } from './screens/Calibrate';
import { ComfortReport, type ComfortResult } from './screens/ComfortReport';
import { ReachMap } from './screens/ReachMap';
import { PlacementDemo } from './screens/PlacementDemo';
import type { Hand } from './types';

type Route = 'welcome' | 'hand' | 'calibrate' | 'comfort' | 'map' | 'demo';

/** All session state lives in memory. Refreshing the page clears it — by design. */
export function App() {
  const [route, setRoute] = useState<Route>('welcome');
  const [hand, setHand] = useState<Hand | null>(null);
  const [calibration, setCalibration] = useState<CalibrationResult | null>(null);
  const [comfort, setComfort] = useState<ComfortResult | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  // Move focus to the new screen's heading for screen-reader and keyboard users.
  useEffect(() => {
    window.scrollTo(0, 0);
    const h = rootRef.current?.querySelector<HTMLElement>('h1, h2');
    if (h) {
      h.setAttribute('tabindex', '-1');
      h.focus({ preventScroll: true });
    }
  }, [route]);

  return (
    <div className="app" ref={rootRef}>
      {route === 'welcome' && <Welcome onStart={() => setRoute('hand')} />}
      {route === 'hand' && (
        <HandSelect hand={hand} onSelect={setHand} onBack={() => setRoute('welcome')} onContinue={() => hand && setRoute('calibrate')} />
      )}
      {route === 'calibrate' && (
        <Calibrate
          onBack={() => setRoute('hand')}
          onComplete={(r) => {
            setCalibration(r);
            // Nothing was measured on a skip, so there is nothing to report on.
            setRoute(r.skipped ? 'demo' : 'comfort');
          }}
        />
      )}
      {route === 'comfort' && (
        <ComfortReport
          onBack={() => setRoute('calibrate')}
          onComplete={(r) => {
            setComfort(r);
            setRoute('map');
          }}
        />
      )}
      {route === 'map' && calibration && comfort && (
        <ReachMap
          hand={hand}
          calibration={calibration}
          comfort={comfort}
          onBack={() => setRoute('comfort')}
          onContinue={() => setRoute('demo')}
        />
      )}
      {route === 'demo' && hand && (
        <PlacementDemo hand={hand} onHandChange={setHand} onExit={() => setRoute('welcome')} />
      )}
    </div>
  );
}

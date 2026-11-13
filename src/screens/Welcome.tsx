import { Mark, PillButton, Screen, Wordmark } from '../components/ui';

export function Welcome({ onStart }: { onStart: () => void }) {
  return (
    <Screen
      label="Welcome"
      className="welcome"
      footer={<PillButton onClick={onStart} className="pill--start">Get started</PillButton>}
    >
      <div className="welcome__brand">
        <Wordmark />
      </div>
      <div className="welcome__hero" aria-hidden="true">
        <Mark className="welcome__mark" />
      </div>
      <div className="welcome__copy">
        <h1 className="display">A more reachable interface</h1>
        <p className="lede">
          A short experiment: try moving a few controls toward where your hand already is, and see
          whether it actually feels easier.
        </p>
      </div>
    </Screen>
  );
}

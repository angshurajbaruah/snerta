import { BrandBar, NoAccountIcon, PillButton, Screen, UndoIcon } from '../components/ui';

export function Welcome({ onStart }: { onStart: () => void }) {
  return (
    <Screen label="Welcome" dock={<PillButton icon="knob" onClick={onStart}>Get started</PillButton>}>
      <BrandBar>
        <span className="chip">Beta</span>
      </BrandBar>

      <section className="bento--hero">
        <div className="orbit" aria-hidden="true">
          <span className="orbit__ring" />
          <span className="orbit__sphere" />
          <span className="orbit__glint" />
          <span className="orbit__moon" />
        </div>
        <div className="bento__copy">
          <h1 className="title title--hero">Every tap, within reach.</h1>
          <p className="lede lede--on-dark">
            A short experiment: move a few controls toward your thumb, then judge for yourself
            whether it helped.
          </p>
        </div>
      </section>

      <div className="grid-2">
        <div className="bento tile">
          <span className="well" aria-hidden="true">
            <NoAccountIcon size={18} />
          </span>
          <div>
            <div className="tile__name">No sign-up</div>
            <div className="tile__sub">Nothing is stored or sent</div>
          </div>
        </div>
        <div className="bento tile">
          <span className="well" aria-hidden="true">
            <UndoIcon size={18} />
          </span>
          <div>
            <div className="tile__name">Undo anytime</div>
            <div className="tile__sub">One tap restores</div>
          </div>
        </div>
      </div>
    </Screen>
  );
}

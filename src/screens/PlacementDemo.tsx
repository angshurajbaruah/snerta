import { useState } from 'react';
import { BrandBar, PillButton } from '../components/ui';
import { DragHandle } from '../components/DragHandle';
import { InboxApp } from '../components/InboxApp';
import { placementFor, type ControlId } from '../lib/layout';
import type { AppView } from '../lib/trial';
import type { Hand, Mode } from '../types';

/**
 * A free look at both layouts before anything is timed.
 *
 * It renders the same inbox component the trials use, so the first timed task is not
 * also the first sight of the screen. It sits in a device frame rather than filling
 * the display, which the task brief says plainly — the trials themselves are full
 * screen, because that is where the rail has to be for the reach to be real.
 */
export function PlacementDemo({
  hand,
  onHandChange,
  onExit,
}: {
  hand: Hand;
  onHandChange: (h: Hand) => void;
  onExit: () => void;
}) {
  const [mode, setMode] = useState<Mode>('standard');
  const [view, setView] = useState<AppView>('inbox');
  const [openId, setOpenId] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [archived, setArchived] = useState<string[]>([]);
  const placement = placementFor(mode, hand);

  const handlers = {
    onControl: (id: ControlId) => {
      if (id === 'search') {
        if (view === 'inbox') setView('search');
        setMenuOpen(false);
      } else if (id === 'menu') {
        if (view === 'message') setMenuOpen(!menuOpen);
      } else if (menuOpen) {
        setMenuOpen(false);
      } else {
        setView('inbox');
        setOpenId(null);
      }
    },
    onOpen: (id: string) => {
      setOpenId(id);
      setView('message');
      setMenuOpen(false);
    },
    onArchive: () => {
      if (openId) setArchived((a) => (a.includes(openId) ? a : [...a, openId]));
      setMenuOpen(false);
      setView('inbox');
      setOpenId(null);
    },
    onCloseMenu: () => setMenuOpen(false),
  };

  return (
    <main className="demo" aria-label="Layout preview">
      <BrandBar>
        <span className="chip">Before / after</span>
      </BrandBar>

      <div className="device">
        <div className="device__screen">
          <InboxApp
            placement={placement}
            view={view}
            openId={openId}
            menuOpen={menuOpen}
            archivedIds={archived}
            handlers={handlers}
          />
        </div>
      </div>

      <section className="bento log">
        <div className="tile__name">
          {mode === 'standard' ? 'Controls in the header' : `Controls moved ${sideWord(placement.side)}`}
        </div>
        <p className="note note--wrap">
          Drag the grip to move them, either way, as often as you like. Which is easier for
          you has not been tested yet.
        </p>
      </section>

      <div className="dock" style={{ flexDirection: 'column', gap: 10 }}>
        <DragHandle
          mode={mode}
          onChange={(m) => {
            setMode(m);
            setMenuOpen(false);
          }}
        />
        <PillButton onClick={onExit}>Start the comparison</PillButton>
        <button
          type="button"
          className="text-btn"
          style={{ color: 'var(--silver)', textDecorationColor: 'var(--graphite)' }}
          onClick={() => onHandChange(nextHand(hand))}
        >
          Switch hand ({hand})
        </button>
      </div>
    </main>
  );
}

function sideWord(side: string): string {
  return side === 'center' ? 'to the centre' : `to the ${side}`;
}

function nextHand(h: Hand): Hand {
  return h === 'right' ? 'left' : h === 'left' ? 'both' : 'right';
}

import { ArrowLeft, MenuIcon, SearchIcon } from './ui';
import { CONTROL_LABELS, nearestToThumb, type ControlId, type Placement } from '../lib/layout';
import { MESSAGES, type AppView } from '../lib/trial';

const ICONS: Record<ControlId, (p: { size?: number }) => React.ReactElement> = {
  back: ArrowLeft,
  search: SearchIcon,
  menu: MenuIcon,
};

export type InboxHandlers = {
  onControl: (id: ControlId) => void;
  onOpen: (messageId: string) => void;
  onArchive: () => void;
  onCloseMenu: () => void;
};

/**
 * The fictional inbox, rendered identically wherever it appears. The preview and
 * the timed trial must look and behave the same, or the trial measures the novelty
 * of a screen the person has not seen rather than the layout.
 */
export function InboxApp({
  placement,
  view,
  openId,
  menuOpen,
  archivedIds,
  handlers,
  inert = false,
}: {
  placement: Placement;
  view: AppView;
  openId: string | null;
  menuOpen: boolean;
  archivedIds: readonly string[];
  handlers: InboxHandlers;
  /** Preview mode before Start: visible, but nothing responds. */
  inert?: boolean;
}) {
  const inRail = placement.rail.length > 0;
  const thumbLead = nearestToThumb(placement);
  const open = MESSAGES.find((m) => m.id === openId);

  const control = (id: ControlId, primary = false) => {
    const Icon = ICONS[id];
    return (
      <button
        key={id}
        type="button"
        className={`app-ctrl ${primary ? 'app-ctrl--primary' : ''}`}
        onClick={() => !inert && handlers.onControl(id)}
        aria-label={CONTROL_LABELS[id]}
        tabIndex={inert ? -1 : 0}
      >
        <Icon size={20} />
      </button>
    );
  };

  const title = view === 'search' ? 'Search' : view === 'message' ? '' : 'Inbox';

  return (
    <div className={`inbox ${inRail ? 'has-rail' : ''}`}>
      <div className="fake-header">
        <div className="fake-header__left">
          {placement.header.includes('back') && control('back')}
          <span className="fake-header__title">{title}</span>
        </div>
        <div className="fake-header__right">
          {placement.header.filter((id) => id !== 'back').map((id) => control(id))}
        </div>
      </div>

      {view === 'message' && open ? (
        <div className="fake-list fake-list--message">
          <h2 className="msg__from">{open.from}</h2>
          <p className="msg__subject">{open.subject}</p>
          <div className="msg__body" aria-hidden="true">
            {[96, 88, 92, 70, 90, 84, 60].map((w, i) => (
              <span key={i} style={{ width: `${w}%` }} />
            ))}
          </div>
        </div>
      ) : (
        <div className="fake-list">
          {view === 'search' && <p className="fake-list__hint">Tap the message you were asked to find.</p>}
          {MESSAGES.map((m) => {
            const archived = archivedIds.includes(m.id);
            return (
              <button
                key={m.id}
                type="button"
                className={`msg-row ${archived ? 'is-archived' : ''}`}
                onClick={() => !inert && !archived && handlers.onOpen(m.id)}
                tabIndex={inert ? -1 : 0}
              >
                <span className="msg-row__av" aria-hidden="true" />
                <span className="msg-row__text">
                  <span className="msg-row__from">{m.from}</span>
                  <span className="msg-row__subject">{m.subject}</span>
                </span>
                {archived && <span className="msg-row__tag">Archived</span>}
              </button>
            );
          })}
        </div>
      )}

      <span className="fake-edge fake-edge--top" aria-hidden="true" />
      {inRail && <span className="fake-edge fake-edge--bottom" aria-hidden="true" />}

      {inRail && (
        <nav className={`app-rail app-rail--${placement.side}`} aria-label="snerta controls">
          {placement.rail.map((id) => control(id, id === thumbLead))}
        </nav>
      )}

      {menuOpen && (
        <>
          <button type="button" className="menu-scrim" aria-label="Close menu" onClick={handlers.onCloseMenu} />
          <div className={`menu menu--${inRail ? placement.side : 'top'}`} role="menu">
            <button type="button" role="menuitem" className="menu__item" onClick={handlers.onArchive}>
              Archive this message
            </button>
            <button type="button" role="menuitem" className="menu__item is-muted" onClick={handlers.onCloseMenu}>
              Cancel
            </button>
          </div>
        </>
      )}
    </div>
  );
}

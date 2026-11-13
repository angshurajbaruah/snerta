import type { ButtonHTMLAttributes, ReactNode } from 'react';

/* ---------- Icons (inline, stroke-based, grayscale via currentColor) ---------- */

export function ArrowRight() {
  return (
    <svg className="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M4 12h15M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ChevronLeft() {
  return (
    <svg className="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Check({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function BagIcon() {
  return (
    <svg className="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M5 8h14l-1.2 12H6.2L5 8z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M9 8V6.5a3 3 0 016 0V8" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Open-hand line art. Shape adapted from the Lucide "hand" icon (ISC licence, see NOTICE.md).
 * Drawn as the back of a left hand (thumb on the right); mirrored for the right hand.
 */
export function HandIcon({ hand }: { hand: 'left' | 'right' }) {
  return (
    <svg
      className="hand-icon"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      style={hand === 'right' ? { transform: 'scaleX(-1)' } : undefined}
    >
      <g fill="none" stroke="currentColor" strokeWidth="1.15" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 11V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2" />
        <path d="M14 10V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v2" />
        <path d="M10 10.5V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2v8" />
        <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
      </g>
    </svg>
  );
}

/* ---------- Brand ---------- */

/** The approved sculpted mark (raster crop from the approved board). */
export function Mark({ className = '', size }: { className?: string; size?: number }) {
  return (
    <img
      className={`mark ${className}`}
      src="./brand/kab-mark.png"
      alt=""
      aria-hidden="true"
      width={size}
      draggable={false}
    />
  );
}

/** Wordmark: K + sculpted apostrophe + ab. Screen readers hear “K’ab”. */
export function Wordmark({ size = 'sm' }: { size?: 'sm' | 'lg' }) {
  return (
    <span className={`wordmark wordmark--${size}`} role="img" aria-label="K’ab">
      <span aria-hidden="true">K</span>
      <img className="wordmark__mark" src="./brand/kab-mark-tight.png" alt="" aria-hidden="true" draggable={false} />
      <span aria-hidden="true">ab</span>
    </span>
  );
}

/* ---------- Layout primitives ---------- */

export function PillButton({
  children,
  arrow = true,
  variant = 'primary',
  className = '',
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { arrow?: boolean; variant?: 'primary' | 'secondary' }) {
  return (
    <button type="button" className={`pill pill--${variant} ${className}`} {...rest}>
      <span className="pill__label">{children}</span>
      {arrow && <ArrowRight />}
    </button>
  );
}

export function TopBar({ onBack, step }: { onBack?: () => void; step?: 1 | 2 | 3 }) {
  return (
    <header className="topbar">
      {onBack ? (
        <button type="button" className="icon-btn" onClick={onBack} aria-label="Back">
          <ChevronLeft />
        </button>
      ) : (
        <span className="icon-btn icon-btn--ghost" aria-hidden="true" />
      )}
      {step && (
        <div className="progress" role="progressbar" aria-label="Setup progress" aria-valuemin={1} aria-valuemax={3} aria-valuenow={step} aria-valuetext={`Step ${step} of 3`}>
          {[1, 2, 3].map((n) => (
            <span key={n} className={`progress__seg ${n <= step ? 'is-on' : ''}`} />
          ))}
        </div>
      )}
      <span className="icon-btn icon-btn--ghost" aria-hidden="true" />
    </header>
  );
}

export function Screen({
  children,
  footer,
  className = '',
  label,
}: {
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
  label: string;
}) {
  return (
    <main className={`screen ${className}`} aria-label={label}>
      <div className="screen__body">{children}</div>
      {footer && <div className="screen__footer">{footer}</div>}
    </main>
  );
}

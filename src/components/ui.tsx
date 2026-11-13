import type { ButtonHTMLAttributes, ReactNode } from 'react';

/* ---------- Icons: inline stroke SVG, colour from currentColor ---------- */

type IconProps = { size?: number };

function Svg({ size = 20, children }: IconProps & { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
      style={{ fill: 'none', stroke: 'currentColor', strokeWidth: 2.2, strokeLinecap: 'round', strokeLinejoin: 'round' }}
    >
      {children}
    </svg>
  );
}

export const ArrowRight = (p: IconProps) => (
  <Svg {...p}>
    <path d="M5 12h14" />
    <path d="M12 5l7 7-7 7" />
  </Svg>
);

export const ArrowLeft = (p: IconProps) => (
  <Svg {...p}>
    <path d="M19 12H5" />
    <path d="M12 19l-7-7 7-7" />
  </Svg>
);

export const Check = ({ size = 14 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false" style={{ fill: 'none', stroke: 'currentColor', strokeWidth: 3, strokeLinecap: 'round', strokeLinejoin: 'round' }}>
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

export const SearchIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="M20 20l-3.5-3.5" />
  </Svg>
);

export const MenuIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="5" r="1" />
    <circle cx="12" cy="12" r="1" />
    <circle cx="12" cy="19" r="1" />
  </Svg>
);

export const NoAccountIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21a8 8 0 0 1 16 0" />
    <path d="M3 3l18 18" />
  </Svg>
);

export const UndoIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3 12a9 9 0 1 0 3-6.7" />
    <path d="M3 4v5h5" />
  </Svg>
);

export const SwapIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M7 7h11l-3-3" />
    <path d="M17 17H6l3 3" />
  </Svg>
);

/** Open-hand outline, adapted from the Lucide "hand" icon (ISC — see NOTICE.md). */
export function HandIcon({ hand, size = 36 }: { hand: 'left' | 'right'; size?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
      style={{
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 1.6,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        transform: hand === 'left' ? 'scaleX(-1)' : undefined,
      }}
    >
      <path d="M18 11V6a2 2 0 0 0-4 0" />
      <path d="M14 10V4a2 2 0 0 0-4 0v2" />
      <path d="M10 10.5V6a2 2 0 0 0-4 0v8" />
      <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
    </svg>
  );
}

/* ---------- Brand ---------- */

/**
 * The wordmark is the logo. Lowercase, always with the full stop.
 * Extra optical space between r and t; screen readers hear "snerta".
 */
export function Wordmark({ size = 'sm', onDark = false }: { size?: 'sm' | 'lg'; onDark?: boolean }) {
  return (
    <span className={`wordmark wordmark--${size} ${onDark ? 'wordmark--on-dark' : ''}`} role="img" aria-label="snerta">
      <span aria-hidden="true">
        sne<span className="wordmark__r">r</span>ta.
      </span>
    </span>
  );
}

/* ---------- Layout primitives ---------- */

export function BrandBar({ children }: { children?: ReactNode }) {
  return (
    <div className="brandbar">
      <Wordmark />
      {children}
    </div>
  );
}

export function StepChip({ step, total = 3 }: { step: number; total?: number }) {
  return (
    <span className="chip">
      <span className="steps" aria-hidden="true">
        {Array.from({ length: total }, (_, i) => (
          <span key={i} className={`steps__bar ${i < step ? 'is-on' : ''}`} />
        ))}
      </span>
      Step {step} of {total}
    </span>
  );
}

export function Screen({
  children,
  dock,
  fit = false,
  label,
}: {
  children: ReactNode;
  dock?: ReactNode;
  fit?: boolean;
  label: string;
}) {
  return (
    <main className={`screen ${fit ? 'screen--fit' : ''}`} aria-label={label}>
      {children}
      {dock && <div className="dock">{dock}</div>}
    </main>
  );
}

export function PillButton({
  children,
  icon = 'arrow',
  className = '',
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { icon?: 'arrow' | 'knob' | 'none' }) {
  return (
    <button type="button" className={`pill ${icon === 'knob' ? 'pill--lead' : ''} ${className}`} {...rest}>
      <span>{children}</span>
      {icon === 'arrow' && <ArrowRight size={18} />}
      {icon === 'knob' && (
        <span className="pill__knob" aria-hidden="true">
          <ArrowRight />
        </span>
      )}
    </button>
  );
}

export function BackButton({ onClick, label = 'Back' }: { onClick: () => void; label?: string }) {
  return (
    <button type="button" className="round-btn" onClick={onClick} aria-label={label}>
      <ArrowLeft />
    </button>
  );
}

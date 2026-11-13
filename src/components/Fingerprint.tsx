import { useId } from 'react';
import { FINGERPRINT_RIDGES, FINGERPRINT_VIEWBOX } from './fingerprintPaths';

/**
 * The snerta symbol: an embossed fingerprint that pairs with the `snerta.` wordmark.
 *
 * The emboss is three passes of the same ridges — a shadow nudged down-right, a
 * highlight nudged up-left, then the tone on top — so the whorls read as pressed
 * into the surface rather than drawn on it. Lit from the top-left, matching the
 * hero gradient. Greyscale only.
 *
 * `tone="light"` is for dark surfaces (the hero), `tone="dark"` for light ones.
 */
export function Fingerprint({
  size = 196,
  tone = 'light',
  className = '',
}: {
  size?: number;
  tone?: 'light' | 'dark';
  className?: string;
}) {
  // Gradient ids must be unique per instance or a second one re-uses the first's paint.
  const uid = useId().replace(/:/g, '');
  const id = (n: string) => `fp-${n}-${uid}`;
  const [x1, y1, x2, y2] = [10, 0, 210, 260];

  const ridgeTone =
    tone === 'light'
      ? [
          ['0', '#c5c6cb'],
          ['0.5', '#6b6c72'],
          ['1', '#26272b'],
        ]
      : [
          ['0', '#8a8b91'],
          ['0.5', '#4a4b50'],
          ['1', '#141416'],
        ];

  return (
    <svg
      className={className}
      viewBox={FINGERPRINT_VIEWBOX}
      width={size}
      height={Math.round((size * 260) / 220)}
      aria-hidden="true"
      focusable="false"
      style={{ overflow: 'visible' }}
    >
      <defs>
        <linearGradient id={id('tone')} gradientUnits="userSpaceOnUse" x1={x1} y1={y1} x2={x2} y2={y2}>
          {ridgeTone.map(([offset, color]) => (
            <stop key={offset} offset={offset} stopColor={color} />
          ))}
        </linearGradient>
        <linearGradient id={id('shade')} gradientUnits="userSpaceOnUse" x1={x1} y1={y1} x2={x2} y2={y2}>
          <stop offset="0" stopColor="#0a0a0b" stopOpacity="0.5" />
          <stop offset="1" stopColor="#0a0a0b" stopOpacity="0.85" />
        </linearGradient>
        <linearGradient id={id('light')} gradientUnits="userSpaceOnUse" x1={x1} y1={y1} x2={x2} y2={y2}>
          <stop offset="0" stopColor="#ffffff" stopOpacity={tone === 'light' ? 0.9 : 0.95} />
          <stop offset="0.55" stopColor="#ffffff" stopOpacity={tone === 'light' ? 0.35 : 0.6} />
          <stop offset="1" stopColor="#ffffff" stopOpacity={tone === 'light' ? 0.22 : 0.4} />
        </linearGradient>
        <g id={id('ridges')}>
          {FINGERPRINT_RIDGES.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </g>
      </defs>
      {/* shadow, then highlight, then the ridge itself: the order makes the emboss */}
      <use href={`#${id('ridges')}`} transform="translate(1.1 1.6)" fill="none" strokeLinecap="round" strokeWidth="2.8" stroke={`url(#${id('shade')})`} />
      <use href={`#${id('ridges')}`} transform="translate(-0.7 -1)" fill="none" strokeLinecap="round" strokeWidth="2.8" stroke={`url(#${id('light')})`} />
      <use href={`#${id('ridges')}`} fill="none" strokeLinecap="round" strokeWidth="2.8" stroke={`url(#${id('tone')})`} />
    </svg>
  );
}

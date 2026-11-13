# build status

**Updated:** 2026-11-13 · **Milestone:** 0 (baseline) + 1 (feasibility spike) + 2a (rebrand to snerta)
**Git:** `angshurajbaruah/snerta`, branch `main`.

## Toolchain (actual)
Node 22.23.4 · npm 10.9.9 · React 19 · Vite 8.3 · Vitest 5.1 · TypeScript 5.9 · Montserrat Variable (self-hosted, SIL OFL)

## What exists
- Welcome → Hand selection (left / right / switches) → calibration (9 positions × 2 randomized
  passes = 18 prompted taps) → "What was recorded" → Original / With snerta. placement demo.
- Skip path, clearly labelled as measuring nothing.
- Opt-in local JSON download (`schemaVersion: kab-spike-0.1`).
- No backend, storage, cookies, analytics, fonts-from-CDN or any network call.

## Verified (cloud sandbox, not a phone)
- `npm test` → 3 files, 32 tests passed.
- `npm run build` → typecheck + production build pass (JS 245 kB / 76 kB gzip, CSS 19 kB).
- `scripts/smoke-touch.cjs`, headless Chromium with iPhone 13 emulation → 18 accepted touch
  taps, 1 stray in-tray touch logged as an observation, readout reports touch. **Emulated.**
- `scripts/contrast-audit.cjs` → no text below WCAG AA on any screen.
- `scripts/hero-contrast.cjs` → hero copy ≥ 8.4:1 at 320×568, 360×640, 390×664, 390×720,
  412×915 and 430×932.
- Comparison area measured as pixel-stable across a layout switch on three device profiles.

## Not yet verified
- **Any physical phone (iOS Safari, Android Chrome). This remains the main gap.**
- Real rotation, browser-toolbar and pinch-zoom behaviour during calibration.
- VoiceOver / TalkBack, 200% browser zoom, notched safe areas.

## Not built yet (by plan)
Comfort self-report, reach map, Your setup screen, the task flow, counterbalanced timed
trials, results, full export/reset.

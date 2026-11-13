# build status

> **Rename pending.** The product was renamed **snerta** on 2026-11-13, with a new
> Brand Identity 2.0 (lowercase "snerta." wordmark, Montserrat, bento layout, six screens).
> The code in this commit is the Milestone 1 build and still carries the **K’ab**
> identity throughout. The measurement logic is brand-neutral and unaffected; the view
> layer, copy and assets are rebranded in the next milestone. Pushed as-is so the
> working spike is preserved rather than discarded.

**Updated:** 2026-11-12 · **Milestone:** 0 (baseline) + 1 (feasibility spike) · **Git:** first commit, pushed to `angshurajbaruah/snerta` (private).

## Toolchain (actual)
Node 22.23.4 · npm 10.9.9 · React 19.x · Vite 8.3.x · Vitest 5.1.0 · TypeScript ~5.9

## What exists
- Welcome → Hand selection → Calibration (2 randomized passes × 9 = 18 targets) → temporary readout → Standard/K’ab placement demo.
- Skip path: "Preview without touch calibration" (labelled preview, nothing measured).
- Opt-in local JSON download of the spike session (`schemaVersion: kab-spike-0.1`).
- No backend, storage, cookies, analytics or network calls.

## Verified (in a cloud sandbox, not a phone)
- `npm test` → 3 files, 27 tests passed.
- `npm run build` → typecheck + production build pass (JS 241 kB / 75.6 kB gzip).
- `scripts/smoke-touch.cjs` in headless Chromium with iPhone 13 emulation → 18 accepted touch taps, 1 stray in-panel touch recorded as an observation, readout says touch. **Emulated, not physical.**
- Screenshots reviewed at 320×568, 390×844 (iPhone 13), 430×932.

## Not yet verified
- Any physical phone (iOS Safari, Android Chrome). **Primary gap.**
- Real rotation / toolbar / zoom behaviour during calibration.
- VoiceOver / TalkBack, 200% zoom, safe-area insets on notched devices.

## Not built yet (by plan)
Comfort self-report, reach map, Ready screen, shopping checkout flow, timed trials, results, full export/reset.

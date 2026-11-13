# build status

**Updated:** 2026-11-13 · **Milestone:** 0 (baseline) + 1 (feasibility spike) + 2a (rebrand to snerta)
**Git:** `angshurajbaruah/snerta`, branch `main`.

## Toolchain (actual)
Node 22.23.4 · npm 10.9.9 · React 19 · Vite 8.3 · Vitest 5.1 · TypeScript 5.9 · Montserrat Variable (self-hosted, SIL OFL)

## What exists
- Welcome → Hand selection (left / right / switches) → calibration (full-screen tray, 15
  positions × 2 randomized passes = 30 prompted taps, after 3 unrecorded practice taps) →
  "What was recorded" → Original / With snerta. placement demo.
- Skip path, clearly labelled as measuring nothing.
- Opt-in local JSON download (`schemaVersion: kab-spike-0.1`).
- No backend, storage, cookies, analytics, fonts-from-CDN or any network call.

## Verified (cloud sandbox, not a phone)
- `npm test` → 3 files, 38 tests passed.
- `npm run build` → typecheck + production build pass (JS 245 kB / 76 kB gzip, CSS 19 kB).
- `scripts/smoke-touch.cjs`, headless Chromium with iPhone 13 emulation → 18 accepted touch
  taps, 1 stray in-tray touch logged as an observation, readout reports touch. **Emulated.**
- `scripts/contrast-audit.cjs` → no text below WCAG AA on any screen.
- `scripts/hero-contrast.cjs` → hero copy ≥ 8.4:1 at 320×568, 360×640, 390×664, 390×720,
  412×915 and 430×932.
- Comparison area measured as pixel-stable across a layout switch on three device profiles.

## Verified on a physical phone (2026-11-13, n = 1)
Founder's iPhone, Safari, right hand. 18/18 taps registered as touch; 17.8 s total; worst
offset 17.8 px against a 26 px allowance; no false interrupt from the Safari toolbar.
**Two blocking failures found and since fixed (milestone 2b):** the tray only covered
34–69% of the screen so the hard zone was never sampled, and the layout shifted at Start so
every dot jumped. See `docs/QA_FINDINGS.md`. Session data in `docs/sessions/`.
**The fixed build has not yet been run on a phone.**

## Not yet verified
- Android Chrome; left-handed use; any second participant.
- Rotation and pinch-zoom interrupts (not triggered in the run).
- VoiceOver / TalkBack, 200% browser zoom.

## Next
Re-run the fixed calibration on a phone, then build the comfort self-report.

## Not built yet (by plan)
Comfort self-report, reach map, Your setup screen, the task flow, counterbalanced timed
trials, results, full export/reset.

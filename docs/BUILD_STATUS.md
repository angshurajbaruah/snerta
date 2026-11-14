# build status

**Updated:** 2026-11-14 · **Milestone:** 0–1 (spike) + 2a–2c (rebrand, calibration, symbol) + 3 (self-report and reach map) + 4 (the experiment) + 5 (ABBA trials and the study kit)
**Git:** `angshurajbaruah/snerta`, branch `main`.

## Toolchain (actual)
Node 22.23.4 · npm 10.9.9 · React 19 · Vite 8.3 · Vitest 5.1 · TypeScript 5.9 · Montserrat Variable (self-hosted, SIL OFL)

## What exists
- Welcome → Hand selection (left / right / switches) → calibration (full-screen tray, 15
  positions × 2 randomized passes = 30 prompted taps, after 3 unrecorded practice taps) →
  comfort self-report (15 zones, Unknown by default, plus an optional grip question) →
  reach map → free preview of both layouts → **four timed trials run ABBA** (first
  layout, other, other, first) with a comfort rating after each → results, preference
  and export.
- Study kit: `docs/SESSION_SCRIPT.md` (what to say, and the words not to say),
  `docs/OBSERVATION_SHEET.md` (what the app cannot see), `scripts/analyse-sessions.cjs`
  (per-session and pooled, and it refuses to pool an unbalanced run).
- Skip path, clearly labelled as measuring nothing.
- Opt-in local JSON download (`schemaVersion: kab-spike-0.1`).
- No backend, storage, cookies, analytics, fonts-from-CDN or any network call.

## Verified (cloud sandbox, not a phone)
- `npm test` → 122 tests passed.
- `npm run build` → typecheck + production build pass (JS 245 kB / 76 kB gzip, CSS 19 kB).
- `scripts/smoke-touch.cjs`, headless Chromium with iPhone 13 emulation → 33 prompted taps,
  30 recorded, 1 stray in-tray touch kept as an observation, no practice tap in the measured
  samples, untouched labels still unknown. Asserted against the downloaded export.
  **Emulated touch, not a device test.**
- `scripts/trial-smoke.cjs` → all four trials completed, every `.app-ctrl` top-most at its
  own centre in both layouts. **Emulated.**
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
**The fixed build was re-run on the phone on 2026-11-13 and the fixes hold:** the tray now
covers 91% of the screen, the practice round removed the learning effect entirely (pass 1 and
pass 2 medians 738/739 ms), and a reach gradient appeared — top row 1226 ms against 634 ms in
the middle, top-left 1993 ms. See `docs/QA_FINDINGS.md`.

## Not yet verified
- Android Chrome; left-handed use; any second participant.
- Rotation and pinch-zoom interrupts (not triggered in the run).
- VoiceOver / TalkBack, 200% browser zoom.

## Next
Run the **four-trial ABBA version** on a phone, end to end, and get real durations — the
emulated ones are automation speed and mean nothing. The one real trial run on file
(2026-11-14, v4) is the old two-trial design: snerta came out 7.1 s quicker, which is also
what a second attempt looks like, and `scripts/analyse-sessions.cjs` correctly refuses to
pool it. It is kept as a record, not as a finding. After a clean ABBA run on the phone, the
five-person study, using `docs/SESSION_SCRIPT.md` and `docs/OBSERVATION_SHEET.md`.

Before that runs with other people, read the last section of the 2026-11-13 third-run entry
in `docs/QA_FINDINGS.md`: every run so far is the founder reporting on his own hypothesis,
and the study must not reveal which direction counts as a good result.

## Not built yet (by plan)
The 'Your setup' screen from the design canvas. Everything else in the journey is built.

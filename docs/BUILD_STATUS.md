# build status

**Updated:** 2026-11-14 · **Status: pilot closed at n = 4.** Milestones 0–1 (spike), 2a–2c (rebrand, calibration, symbol), 3 (self-report and reach map), 4 (the experiment), 5 (ABBA trials, study kit, drag handle)
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

## The pilot result (closed 2026-11-14, n = 4)
Four balanced ABBA sessions, all on a 393×695 screen: one left-handed, one grip-switcher,
two right-handed, one of them the author. Written up in `docs/PILOT_REPORT.md`.

- **Time: unreadable in all four.** Every session's layout gap was smaller than that
  person's own spread across two runs of a single layout.
- **Comfort: better 2, level 1, worse 1.** One of the four sat at the 5/5 ceiling.
- **Preference: snerta 2, none 2, Original 0.** Nobody preferred the current layout. The
  only consistent finding, and a direction to test rather than a result.

The speed claim is dropped (D81). What the pilot is actually worth is the four times the
measurement caught a confident wrong answer: the 43% that was practice (D67), the delta
smaller than the person's own noise (D84), the first-exposure asymmetry ABBA cannot fix
(D88), and a pre-registered hypothesis that failed 2 of 4 and is reported anyway (D92).

## Where the evidence stands
The reach premise is **cited, not measured** — see `docs/EVIDENCE_BASE.md` (D75–D78).
snerta's own untested claim is narrower and unchanged: whether moving these three controls
to a lower rail in a web page helps, whether it is worth the content the rail displaces,
and whether people leave it on. Apple shipped the same intervention in iOS 15 and had to
add a setting to undo it, so a mixed result is the expected one.

## Next, if a second round is ever run
In this order, because the first one is what makes the rest readable:

1. **Familiarisation task in each layout before the clock starts** (D90). Without it the
   next round still cannot read a time.
2. **A forced comparative question** beside the 1–5 comfort scale (D94), so someone at the
   ceiling can still express a difference.
3. **Pro Max and small-handed participants.** The published work says that is where the
   effect should be largest; it is the cell with no data in it. Two synthetic fixtures in
   `docs/synthetic/` cover the viewport for code purposes only and are not evidence.

Also outstanding: the drag handle (D96–D100) has been checked in a real engine but the
gesture has had limited time on a physical phone. Observation sheets were not filled in
during the pilot, which is why P2's and P3's outlier runs have no explanation.

Before that runs with other people, read the last section of the 2026-11-13 third-run entry
in `docs/QA_FINDINGS.md`: every run so far is the founder reporting on his own hypothesis,
and the study must not reveal which direction counts as a good result.

## Not built yet (by plan)
The 'Your setup' screen from the design canvas. Everything else in the journey is built.

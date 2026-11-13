# snerta — persistent instructions for Claude Code

## Highest priority: intent

This is a clean-room codebase, started 12 November 2026. Do not clone, copy or bootstrap from
the earlier Codex project (`angshurajbaruah/K-ab`) or its src, tests, CSS, build or CI state,
and do not target that remote. The remote here is `angshurajbaruah/snerta`.

The **idea and the research standards are not restarted**. snerta is a mobile-first experiment
investigating whether reversible, reach-informed placement of a few controls improves
one-handed usability. The answer may be no. That is a valid result.

## Name and identity (Brand Identity 2.0, 2026-11-13)

- Product name: **snerta**, always lowercase. The primary logo is the wordmark **`snerta.`**,
  with the full stop. Extra optical space between the r and the t.
- Symbol: an **embossed fingerprint** of concentric whorl ridges, each broken once, lit from
  the top-left with a highlight above and a shadow below so it reads as pressed into the
  surface. It pairs with the wordmark and is the app icon and favicon. The ridge geometry is
  artwork, copied verbatim from the design canvas into `src/components/fingerprintPaths.ts`:
  **do not redraw it by hand**. `src/components/Fingerprint.tsx` renders it. It replaced an
  earlier sphere-and-ring hero object on 2026-11-13.
- Tagline: **Every tap, within reach.**
- Typeface: **Montserrat**, self-hosted via `@fontsource-variable/montserrat` (SIL OFL).
  Do not swap to the Google Fonts CDN: it would leak visitor IPs to a third party and break
  the "nothing is stored or sent" promise.
- Strictly greyscale: Obsidian `#0A0A0B`, Ink `#141416`, Graphite `#4A4B50`, Steel `#8A8B91`,
  Silver `#C5C6CB`, Mist `#E6E7EA`, page `#F4F4F6`, White. No accent colours anywhere, not even
  for status. Carry status with text and shape.
- Bento layout: boxes with 28–32 px radius on the quiet off-white page; gradients, 3D objects
  and depth live inside the boxes, not on the page. Read in light at the top, act in dark at the
  bottom. Every screen ends in a dark action dock holding a white pill and a round Back.
- Design canvas: https://claude.ai/artifact/FxQxu3JudKQzQBhtnd8kv2
- The former **K’ab** identity is archived in `archive/kab-identity/`. Do not revive it, do not
  delete it.

## Where the boards and the brief disagree, the brief wins on substance

The design canvas is the source of truth for **look**. `KAB_PRODUCT_MASTER_BRIEF.md` and
`PRD_AND_SCREEN_CONTRACT.md` are the source of truth for **what is claimed and measured**, and
their research rules still apply under the new name. Three live conflicts, resolved in
`docs/DECISION_LOG.md` D19–D21:

- Calibration prompts every dot in turn and asks for all 18. It does **not** let people tap
  only the dots they can reach — that biases the map and records no behaviour.
- There is **no reach map** until the comfort self-report exists. Comfort is never inferred
  from tap latency.
- Before/after copy stays neutral. Never write that controls are "stranded", that snerta puts
  everything "within reach", or anything else that asserts the benefit under test.

If a new board conflicts with the brief again, follow the brief and log it, rather than
quietly shipping the claim.

## Product behaviour

- A website working inside its own page. Not an OS or other-app customisation tool.
- Journey: Welcome → hand (left / right / switches) → 18 prompted calibration taps → comfort
  self-report → honestly labelled reach map → Your setup → reversible Original/snerta demo →
  counterbalanced timed tasks → honest results, export and reset.
- Calibration: `pointerdown` only; never `click` or `pointerup`, so one contact is at most one
  activation. 52 px hit squares, 44 px minimum for every other target. Record target id,
  normalised target and pointer positions in one shared frame, `pointerType`, prompt-to-tap
  latency and viewport. Non-target touches inside the tray are **observations**, never misses.
- Browser-reported touch is not proof a thumb was used. Time is not proof of comfort. Zone
  labels are Easy, Stretch, Hard and Unknown, and Unknown stays Unknown.
- Original puts back/search/more in the header; snerta moves those **same controls** to a lower
  rail — right, left, or centred for someone who switches. A deterministic prototype rule, not
  a measured optimum. Opt-in and reversible. Never reposition anything mid-action or mid-trial.
- The comparison area must stay pixel-stable across a layout switch. Keep mode-dependent
  content below the device and the boxes around it fixed-size.
- No backend, login, cookies, storage persistence, analytics, AI, camera, sensors, payments or
  personal identifiers. State lives in memory; export is explicit and local only.

## Engineering rules

- React + TypeScript + Vite, minimal dependencies, pure helpers in `src/lib/` separate from
  React state, Vitest for tests.
- Accessible and keyboard-operable except the intrinsically touch-specific measurement, which
  needs a clearly marked skip path. Portrait-aware, safe-area-aware, reduced-motion aware,
  usable at 200% zoom and at 320 px wide.
- Every text colour must clear WCAG AA against what is actually behind it, gradients included.
  `scripts/contrast-audit.cjs` and `scripts/hero-contrast.cjs` check this; run them after any
  visual change.
- Run `npm test` and `npm run build` and report the real output. Never claim a device test from
  an emulated run; `scripts/smoke-touch.cjs` is emulation and must be described as such.
- Do not turn recorded events into medical, biometric or hand-geometry claims. Do not fabricate
  or unlabelled-mock research outcomes.
- Do not push to a public repo, deploy, change the visual identity, buy services or turn on any
  data collection without explicit approval. Preserve uncommitted work; avoid destructive git.

## Session workflow

1. Read `docs/BUILD_STATUS.md` and `docs/DECISION_LOG.md`, then check `git status`.
2. Name one milestone and its acceptance criteria.
3. Build the smallest working slice, with tests, and verify locally.
4. Report what ran, what still needs a real phone, and any blockers, with repro steps.
5. Update `docs/BUILD_STATUS.md`, `docs/DECISION_LOG.md` and `docs/QA_FINDINGS.md` whenever a
   material fact changes.
6. Give one prioritised next action. No unrelated features.

## Next milestone

Comfort self-report after calibration, then the reach map built from taps *and* what the
person reported, labelled as exactly that. Then the task flow and the counterbalanced timed
trials. Physical-phone testing is overdue and blocks any claim about the prototype working.

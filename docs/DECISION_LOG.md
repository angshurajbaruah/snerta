# K’ab — decision log (fresh Claude Code build)

Dated, newest last. Product/brand decisions from the brief are locked; this log records engineering and copy decisions made during the build.

## 2026-11-12 — Milestone 0 + 1

| # | Decision | Why | Reversible? |
|---|---|---|---|
| D1 | Fresh React 19 + TypeScript 5.9 + Vite 8 + Vitest 5 app scaffolded in the starter folder. No code from the old Codex repo. | Clean-room instruction in CLAUDE.md. TS pinned to 5.9 (not 7.x) for tooling stability. | Yes |
| D2 | Pure logic in `src/lib/` (calibration state machine, layout rule, export). React only renders and forwards events. | Lets the measurement rules be unit-tested without a browser. | — |
| D3 | Calibration listens to `pointerdown` only, calls `preventDefault()`, never listens to `click`/`pointerup`. A hit = primary pointer, button 0, inside a 52×52 CSS px square around the active target. | One contact = at most one activation; no compat-mouse double counting. | — |
| D4 | Prompt clock starts after the active dot is painted (double `requestAnimationFrame`). Taps before paint are ignored. Pointer time uses `event.timeStamp` when it is in the `performance.now()` timebase, else `performance.now()`. | Latency should run from "visible" to "touch", not from React state change. | Yes |
| D5 | Non-hit pointerdowns inside the panel are stored as `nonTargetObservations`, never as misses. Second fingers and secondary buttons go there too. | PRD: observations ≠ errors. | — |
| D6 | Geometry guard: width change (>1px), orientation change or `visualViewport.scale` change interrupts the run and sets it aside; height-only changes are tolerated (all coordinates are panel-normalized). Page hidden → pause; on return the current target's clock restarts and the sample is flagged `promptRestarted`. | Don't mix incompatible geometries; don't count time away as reach time. | Yes |
| D7 | `evidence` = `touch` only if all 18 samples are browser-reported `touch`; any mouse/pen → `preview`; skip → `preview`. | Never mislabel desktop data as thumb data. | — |
| D8 | Calibration screen is a fixed-height, no-scroll layout; during the run the long explanation collapses to "Tap each dot as it darkens" so the panel gets the height. | First screenshot showed the bottom row under the sticky footer (a stray "Stop" tap). | Yes |
| D9 | MVP layout rule: Standard = Back top-left, Bag top-right. K’ab = same two controls in a bottom rail on the chosen side, Bag at the outer edge. | Deterministic candidate rule per PRD §4. Not an optimized fit. | Yes |
| D10 | Mark rendering: `scripts/make_mark_alpha.py` converts the approved crop into black/white + alpha relative to its own background so it sits on any light surface without a rectangle; welcome mark edges feathered with a CSS mask. Originals in `brand-assets/` untouched. | Raster crop showed a visible box against the UI (brief §7 allows implementation-fidelity mask refinement). | Yes — re-run or delete script output |
| D11 | Copy corrections vs board: Welcome "Your phone, adapted…" → "A short experiment…"; Hand subtitle → "decides which side a few controls move to in the demo"; Calibration "tap the dots that are comfortable" → "tap each dot as it darkens". | Brief §7 honesty corrections. | Yes |
| D12 | Hand line-art adapted from Lucide "hand" (ISC). Left = drawn as-is, Right = mirrored. | Close match to board's outline hands; permissive licence, attributed in NOTICE.md. | Yes |
| D13 | Temporary "What the browser recorded" readout screen after calibration (median latency per position, counts, raw table, opt-in JSON download). | Needed to inspect real-phone samples during the spike. Will be replaced by self-report + reach map in Milestone 2. | Yes |
| D14 | No LICENSE file added yet. | Licence choice and brand-asset rights are the founder's call (brief §14). | — |

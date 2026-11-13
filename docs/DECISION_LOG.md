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

## 2026-11-13 — Milestone 2a: rename to snerta, Brand Identity 2.0

| # | Decision | Why | Reversible? |
|---|---|---|---|
| D15 | Product renamed **K’ab → snerta**. Wordmark `snerta.` (lowercase, full stop, no symbol) is the logo. Tagline **Every tap, within reach.** | Founder's decision, 2026-11-13, with a finalised Brand Identity 2.0 design canvas. | Founder's call |
| D16 | Old identity moved to `archive/kab-identity/` rather than deleted: both approved boards, both crops, and the mark-preparation script. | They are user-provided source material and project history. The brief says preserve. | Yes |
| D17 | **Montserrat self-hosted** via `@fontsource-variable/montserrat` (SIL OFL), not the Google Fonts `<link>` the boards use. | A Google Fonts request reveals every visitor's IP to a third party, which contradicts the product's "nothing is stored or sent" promise. OFL also means shipping the file is legal, unlike Helvetica Neue. Costs ~38 kB. | Yes |
| D18 | Design tokens taken from the canvas: page `#F4F4F6`, Obsidian `#0A0A0B` → White, bento radius 28–32, the white→black hero gradient, the dark action dock with a white pill and round Back. | Brand Identity 2.0 is the source of truth for look. | Yes |
| D19 | **Calibration keeps the prompted, measured mechanic.** The board says "Tap every dot you can reach without shifting your grip" over a self-select 15-dot grid; the app prompts each dot in turn and asks for all 18. | Brief §7 explicitly says to replace comfort-filtered instructions with "tap every highlighted dot", because self-selection biases the map and records no behaviour. The brief also says to prioritise truthful wording where board copy overclaims. **Conflict resolved in favour of the brief.** | Discuss |
| D20 | **No reach map yet.** The interim screen shows timings and counts and explicitly says a map needs the comfort self-report first. | Board screen 04 renders a smooth gradient map. Brief §7 forbids an unsupported precision heatmap, and inferring comfort from latency is exactly the inference the brief rules out. | Until self-report lands |
| D21 | **Before/after copy made neutral.** Board has "Everything you tap, within reach." / "Controls stranded at the top."; the app says "Controls moved to the right" with "Which is easier for you has not been tested yet." | Those lines assert the benefit the study exists to test. Brief §1 lists such claims under "Not a claim". | Discuss |
| D22 | Third hand option **I switch between hands** added, mapping to a **centred** rail. | New in board 02, approved by founder. A centred rail stays in the lower thumb arc for either hand without betting on a side the person did not claim. Study-coverage cost noted in QA findings. | Yes |
| D23 | Demo controls changed from Back + Bag (shopping) to **back, search, more** (an inbox). | Board 06 shows an inbox. Three controls also give the placement rule something to order. The PRD's shopping checkout task still needs rebuilding on top of this in the next milestone. | Yes |
| D24 | **Back takes the slot nearest the resting thumb** — the outer edge of the rail — and the order mirrors for the left hand. | Back is the most frequent control in the demo app. Caught as a bug: the first implementation put it furthest away. Covered by a test. | Yes |
| D25 | The comparison area is **pixel-stable** across a layout switch: everything mode-dependent sits below the device, and the boxes above and below it are fixed-size. | The brief forbids repositioning a target mid-action. A device that resizes on toggle would confound the timed trials. Verified at three device sizes; guarded by a structural test. | No — keep |
| D26 | Hero scrim and short-viewport art rules added so the white hero copy always clears WCAG AA. | Measured 1.72:1 at first, 1.96:1 after a first fix. Now ≥ 8.4:1 at six viewport sizes. | Yes |

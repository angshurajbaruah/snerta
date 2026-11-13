# K’ab — QA findings

Status codes: PASS / FAIL / PARTIAL / NOT TESTED. Emulated results are labelled as such.

## 2026-11-12 — Milestone 1 (sandbox only)

| Check | Env | Result | Notes |
|---|---|---|---|
| Unit + component tests | Vitest/jsdom | PASS | 27/27 |
| Production build | Vite | PASS | |
| 18-tap flow, stray touch → observation | Chromium, iPhone 13 emulation | PASS (emulated) | `scripts/smoke-touch.cjs` |
| Calibration bottom row under sticky footer | Chromium 390×844 | FAIL → fixed | Bottom dots overlapped by footer; a tap hit "Stop". Calibration screen now fixed-height. |
| Mark shows rectangle on UI | Chromium | FAIL → fixed | Crop background differed from page; converted to alpha (D10). |
| Programmatic focus ring on h1 | Chromium | FAIL → fixed | Heading focus for screen readers drew a box; suppressed for `tabindex=-1`. |
| Layout at 320 / 390 / 430 px | Chromium | PASS (visual, emulated) | |
| Physical iPhone Safari | — | NOT TESTED | |
| Physical Android Chrome | — | NOT TESTED | |
| VoiceOver / TalkBack | — | NOT TESTED | |
| 200% zoom | — | NOT TESTED | |

## 2026-11-13 — Milestone 2a (sandbox only)

| Check | Env | Result | Notes |
|---|---|---|---|
| Unit + component tests | Vitest/jsdom | PASS | 32/32 |
| Production build | Vite | PASS | JS 245 kB (76 kB gzip), CSS 19 kB |
| 18-tap flow, stray touch → observation | Chromium, iPhone 13 emulation | PASS (emulated) | `scripts/smoke-touch.cjs` |
| Back furthest from the thumb in the rail | unit | FAIL → fixed | Mirror logic was inverted; Back now takes the outer slot. Test added. |
| Device resizes when toggling layout | Chromium 390×664 | FAIL → fixed | 34 px jump, then 18 px, now 0 px at 320×568, 390×664 and 412×915. Would have confounded the timed trials. |
| Demo screen scrolled; device squashed to 73 px at 320 px wide | Chromium | FAIL → fixed | Heading removed from that screen; device now 220–491 px. |
| Hero headline contrast | Chromium, 6 viewports | FAIL → fixed | 1.72:1 (white on the sphere highlight). Now ≥ 8.4:1 everywhere. `scripts/hero-contrast.cjs` |
| Text contrast, all screens | Chromium | PASS | `scripts/contrast-audit.cjs`, no element below AA |
| Physical iPhone Safari | — | NOT TESTED | |
| Physical Android Chrome | — | NOT TESTED | |
| VoiceOver / TalkBack | — | NOT TESTED | |
| 200% zoom | — | NOT TESTED | |

### Open limitations
- **Three-way hand split thins the study.** With left / right / switches and only five
  participants, some arms may get one person or none. Record actual coverage; do not report
  per-arm comparisons as if they were balanced.
- **The centred rail is untested as a concept.** It is a reasonable default for someone who
  switches hands, not a measured optimum.
- **The demo app changed** from a shopping flow to an inbox. The PRD's Add → Bag → Continue →
  Confirm task needs rebuilding against the new controls before any timed trial runs.

## 2026-11-13 — FIRST PHYSICAL DEVICE RUN

Founder's own iPhone, Safari, right hand, one-handed. Viewport 393×695, tray 333×355.
Session file: `docs/sessions/2026-11-13-founder-iphone-right.json`. **n = 1.** Nothing below
is evidence about people in general; it is evidence about whether the instrument works.

### The instrument held up

| Check | Result |
|---|---|
| All 18 taps registered as `touch`, no double counting | PASS |
| Whole calibration | 17.8 s |
| Worst tap offset from target centre | 17.8 px, against a 26 px allowance — 10.2 px of margin left. The 52 px hit square is correctly sized; no near-misses. |
| Safari toolbar showing/hiding during the run | No false interrupt. Tolerating height-only viewport change (D6) was the right call. |
| Page hidden / geometry interrupts | 0 |
| Stray taps | 4, all logged as observations, none counted as errors or as hits |

### FINDING 1 — people do not understand the first screen (highest priority)

The first ~8 seconds are a comprehension failure, not a reach measurement:

| When | Prompted | Actually tapped |
|---|---|---|
| −0.8 s | middle-right | bottom-centre |
| +1.1 s | top-centre | bottom-right |
| +2.6 s | top-centre | middle-centre |
| +3.7 s | top-centre | middle-right |

Then top-centre finally landed at **6918 ms**, against a median of 560 ms for everything
after. The stray taps cluster where a right thumb rests, not near the prompted dot — the
participant was tapping the tray, not the highlighted target.

Consequences: the first two samples of every session are noise, and a participant who is
confused for eight seconds has already formed an impression before the test starts.

**Fix: an unrecorded practice round (2–3 taps) before the measured sequence**, which is
standard for reaction-time tasks, plus a louder treatment for the active dot. Until that
lands, the first two samples of any session should be discarded, and the current run's
top-centre and middle-right pass-1 figures are unusable.

### FINDING 2 — the timing gradient is plausible, and not interpretable yet

Second pass only, so no learning confound and no outliers (one tap per cell, so these are
single observations, not medians of anything meaningful):

- rows: top **676 ms** · middle **559 ms** · bottom **533 ms**
- columns: left **559 ms** · centre **484 ms** · right **726 ms**

Learning is real and smaller than the row spread: pass 1 excluding the first two taps
median 676 ms, pass 2 median 560 ms.

The top row being slowest is consistent with reach being harder up there — and equally
consistent with it simply taking longer to *notice* a dot further from where the eyes are
resting. Latency contains visual search. **This is exactly why the reach map cannot be built
from timing, and why the comfort self-report is the next thing to build.** The right column
being slowest is unexplained and may be noise at n=1.

### FINDING 3 — systematic rightward offset

Mean tap lands **+5.5 px right, 1.7 px above** the target centre. Expected for a right
thumb's contact patch. Harmless for hit detection at 52 px, but it must be corrected for if
tap coordinates are ever used to *position* anything.

### Still untested
VoiceOver / TalkBack · 200% zoom · left-handed · Android Chrome · any second participant.

## 2026-11-13 — Milestone 2b verification (sandbox)

Fixes for the two findings above. Emulated at the founder's own viewport, 393×695.

| Check | Result |
|---|---|
| Dots that move when Start is pressed | **0 of 15** (was: all of them) |
| Topmost target, no safe-area inset | 38 px = 5.5% down the screen (was 34%) |
| Topmost target, with a 59 px notch inset | ≈ 91 px = 13% down — the zone the founder named as unreachable |
| Full run, 3 practice + 30 measured | Completes, no page errors |
| Stray tap mid-run | Logged as an observation, not an error |
| Hit squares fully on the tray at 320×480 | PASS (unit test) |
| No two targets within one hit square | PASS (unit test) |
| Unit + component tests | 38/38 |
| Contrast audit, all screens | PASS |

### Still open
- The 30-tap run has not been timed on a real phone. The 18-tap version took 17.8 s, so
  expect roughly 30 s. If that is too long in practice, dropping to one pass halves it.
- Whether the top row is genuinely hard **to reach** or merely slower **to notice** is still
  unresolved, and no number from this instrument can settle it. The comfort self-report can.
- Android, left-handed, VoiceOver / TalkBack, 200% zoom: all still untested.

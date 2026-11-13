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

## 2026-11-13 — SECOND PHYSICAL RUN, fixed calibration

Same phone, same person, same hand. Tray now **631 px of a 695 px screen (91%**, was 51%).
30 measured taps in 27.3 s, all browser-reported touch, no page hides.
Session file: `docs/sessions/2026-11-13-founder-iphone-right-v2.json`. **Still n = 1.**

### The practice round did its job

Pass 1 median **738 ms**, pass 2 median **739 ms** — no learning effect left to find. In the
first run pass 1 was 676 ms and pass 2 560 ms, a 116 ms gain. The three unrecorded taps now
absorb the learning, so the measured data is no longer contaminated by working out the task.

### A gradient appeared once the hard zone was in range

Median ms per cell, laid out as it sits on screen:

|           | left | centre | right |
|---|---|---|---|
| top       | **1993** | 1052 | 1151 |
| upper-mid | 868  | 643  | 592  |
| middle    | 772  | 596  | 622  |
| lower-mid | 818  | 609  | 772  |
| bottom    | 1193 | 776  | 792  |

Rows: top **1226** · upper-mid 643 · middle 634 · lower-mid 714 · bottom 905.
Columns: left **972** · centre 702 · right 696.

Top row is roughly **double** the middle, and the whole left column is slower than the
right — for a right thumb, which is what reach would predict. In the old 34–69% tray the
whole spread was 143 ms; it is now 321 ms top to bottom, with top-left at 3.1× the middle.

### Supporting signals, from behaviour rather than timing

- **A second finger appeared.** The run's only stray touch has `isPrimary: false` — a second
  contact while top-left was lit, 1.5 s before that target was finally hit at 2806 ms. The
  likeliest reading is a grip change to reach the far corner, which is exactly the
  self-reported behaviour the brief asks about. The instrument logged it as an observation,
  not an error, as designed.
- **Taps undershoot upward.** Mean vertical offset is **+7.6 px below centre in the top row**
  and −3.4 px above centre at the bottom: landing short of a stretch and over-travelling on
  an easy one. Horizontal offset stays +6 to +9 px right across every row.
- **The 52 px hit square is earning its size.** The worst tap, at top-left, was 21.9 px
  horizontally off centre — 84% of the allowance. At a 44 px target that tap would have
  missed, and the hardest cell is exactly where a miss would corrupt the measurement.

### What this still does not establish

Latency contains visual search. Top-left being 3× slower is consistent with "hard to reach"
and with "furthest from where the eyes rest". **Nothing in this file can separate the two.**

That makes the comfort self-report a test of the instrument, not just another screen: if the
difficulty is real, top-left should come back labelled Hard; if the latency is mostly looking,
it should come back Easy despite 2 seconds. That is a falsifiable prediction, written down
before the question exists.

## 2026-11-13 — THIRD RUN: the prediction resolves

Same phone, same person, same hand, now with the self-report. 30 taps in 24.0 s, all touch,
no stray touches, grip reported as **changed**.
Session: `docs/sessions/2026-11-13-founder-iphone-right-v3-with-selfreport.json`. **n = 1.**

### The prediction, and its answer

Written into this file before the question existed: *top-left comes back Hard and the
difficulty is real; Easy and the 2 seconds was mostly looking.*

**Top-left came back Hard.** It timed 1252 ms. The reading the instrument was built to allow
is the one it got, so for this person the top of the screen is genuinely harder to reach, not
merely further from where the eyes rest.

### What he said, against what the clock said

|           | what he said | | | what the clock said (ms) | | |
|---|---|---|---|---|---|---|
|           | left | centre | right | left | centre | right |
| top       | hard | hard | stretch | 1252 | 836 | 1093 |
| upper-mid | hard | stretch | stretch | 707 | 736 | 918 |
| middle    | easy | easy | easy | 530 | 624 | 607 |
| lower-mid | easy | easy | easy | 540 | 648 | 1191 |
| bottom    | easy | easy | easy | 961 | 754 | 640 |

The boundary he drew is **flat and horizontal**: the top two rows — the upper 28% of the
screen — are hard or stretch, and everything from the middle row down is easy. That is a
cleaner statement than the timing alone supports.

### Agreement is directional, not tight

- easy zones median **640 ms**; stretch and hard together **877 ms**. A ratio of **1.37×**.
- The ordering is not monotonic: *stretch* (918 ms) timed **slower** than *hard* (836 ms).
  If latency tracked difficulty, it would not.

So the two accounts point the same way without being the same measurement, which is the
result the separation was built to be able to show.

### Reproducibility is good

Top row against middle row: **1.85×** in the previous run, **1.80×** in this one, from
independent random orders. The instrument is stable across sessions.

### A weakness this run exposed, now fixed

Two taps per zone means a zone's "median" is just the average of two numbers, so one pause
drags a whole cell. Median within-zone gap was **254 ms**; the worst was **896 ms**
(lower-middle-right: 743 and 1639 ms). That single zone was the run's only reported
disagreement, and it was an artefact.

`findMismatches` now requires **every tap in a zone** to clear the threshold before the zone
is called a disagreement. Under that rule this run reports none, which is correct. Per-zone
numbers should still be treated as indicative; rows (6 taps) and columns (10 taps) are the
level worth reading.

### The limitation that matters most

**The participant is the founder.** He knows the hypothesis, designed the screens and wants
the product to work. A self-report from him about his own hypothesis is the weakest possible
evidence for it, and the unusually tidy horizontal boundary is exactly what motivated
reporting looks like. This run validates the *instrument*, not the idea.

**For the five-person study: do not state the hypothesis, do not say which direction counts
as a good result, and do not show anyone this map before they give their own labels.**

## 2026-11-13 — Milestone 3b verification (sandbox)

| Check | Result |
|---|---|
| Rail covering the last rows of the list | FAIL → fixed. Scrolled fully to the end, last row bottom 297 px vs rail top 321 px: a 24 px gap. |
| Fade present at the top edge in both layouts | PASS |
| Fade above the rail, at every scroll position | PASS |
| Controls moved | back + search only; More stays in the header. No control is lost or duplicated between layouts (unit test). |
| Unit + component tests | 79/79 |
| Contrast audit, all screens | PASS |

Left open: the snerta list has 96 px more bottom padding than Original's, so scroll length
differs slightly between the two. Expected to be irrelevant to tasks that are about tapping a
control rather than reaching the end of a list — recorded in DECISION_LOG D52 so a surprising
trial result can be checked against it.

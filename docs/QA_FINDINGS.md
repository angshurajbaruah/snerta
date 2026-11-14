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

## 2026-11-13 — Milestone 3c verification (sandbox)

| Check | Result |
|---|---|
| All three controls in the rail, none left in the header | PASS (unit + component tests) |
| No control lost or duplicated between layouts | PASS |
| Last row clears the wider rail at the end of the scroll | PASS — 24 px gap |
| Rail fits inside the phone frame | PASS at 393 px (47% wide) and 320 px (58% wide) |
| Device shift when toggling layouts | 0 px at both 393 px and 320 px |
| "has not been tested yet" truncated at 320 px | FAIL → fixed. Was clipped to "has not been teste…"; now wraps to two lines, unclipped at both widths. |
| Unit + component tests | 79/79 |
| Contrast audit, all screens | PASS |

## 2026-11-13 — Milestone 4 verification (sandbox)

| Check | Result |
|---|---|
| Both trials complete end to end, counterbalanced | PASS — `scripts/trial-smoke.cjs` |
| Every task control reachable, nothing covering it | FAIL → fixed. The task banner sat over the Original layout's header and swallowed taps on Search, More and Back; that condition could not be finished at all. Now asserted by hit-testing each control's own centre. |
| Clock excludes the brief and the rating | PASS (unit tests) |
| Stopped or interrupted trial recorded as incomplete | PASS |
| No comparison shown unless both trials completed | PASS |
| Unit + component tests | 118/118 |
| Contrast audit, all screens | PASS |

**Caught by the browser, not by jsdom.** The covered-controls bug was invisible to the
component tests because jsdom has no layout or hit-testing. Anything about one element
sitting over another needs a real engine; `scripts/trial-smoke.cjs` is where that belongs.

### Still untested
Durations from the emulated run (0.4–1.2 s) are automation speed and mean nothing. Real
timings need a person. Also untested: Android, left-handed, the 'both hands' centre rail
under a real task, VoiceOver / TalkBack, 200% zoom.

## 2026-11-14 — FIRST COMPLETE RUN, calibration through trials

Founder's iPhone, right hand, full journey. Both trials completed, nothing interrupted.
Session: `docs/sessions/2026-11-14-founder-iphone-right-v4-full-run.json`.

### The machinery works end to end

| | position | time | comfort | off-task taps |
|---|---|---|---|---|
| Original | 1 | 16.4 s | 2 | 1 |
| With snerta. | 2 | 9.3 s | 4 | 0 |

Preference: snerta. Deltas: **7.1 s faster**, **+2 comfort**. No interruptions, no voided runs.

Real human durations at last — 9 to 16 seconds, against the 0.4 s of the emulated walkthrough.
The task takes long enough to be worth timing and short enough not to tire anyone.

### The result cannot be read, and the reason is structural

**Original ran first. snerta ran second.** In this session "second" and "snerta" are the same
column of data, and nothing in the file can separate them.

A 43% improvement from a first to a second attempt is ordinary practice. By trial 2 the person
knows the task, knows the menu holds Archive, and knows which name to look for. The comfort
jump from 2 to 4 is open to the same reading, plus knowing which layout is the product.

Counterbalancing was designed in across *participants*, which does nothing for a single
session. **This run is evidence the experiment runs, not evidence about the hypothesis.**

### Calibration, now four runs deep and stable

- top / middle row ratio **1.51×** here, against 1.85× and 1.80× before.
- easy zones **614 ms** vs stretch and hard **900 ms** — a 1.47× gap, close to the 1.37× last time.
- **top-left slowest for the third run running** (1378 ms, labelled hard).
- **bottom-left slow in every run** (898 ms here, labelled stretch; 1193 ms and 961 ms before).
  The far bottom corner for a right thumb looks like a real second trouble spot, not noise.
- grip reported as changed, again.

### What would actually settle it

1. **Somebody else, starting with snerta.** If snerta-first also comes out faster, order stops
   being the obvious explanation.
2. **Or balance the order inside one session** — see the open question in `DECISION_LOG`.


## 2026-11-14 — the first trial result was unreadable, by design rather than by accident

The v4 session (`docs/sessions/2026-11-14-founder-iphone-right-v4-full-run.json`) is the
first with real timed trials on a phone. Original 16.4 s, snerta 9.3 s — snerta 43% quicker,
comfort 2 → 4.

That number cannot be used, and the reason is structural rather than a mistake in the run.
Original went first and snerta second, so "snerta" and "second attempt" are the same column
of data. A 43% improvement between a first and second attempt at an unfamiliar three-step
task is unremarkable on its own. Nothing in the two-trial design separates the two, and with
five volunteers, counterbalancing across people would not separate them reliably either.

Fixed by D67: four trials per person, ABBA. Each layout now averages position 2.5, so
practice is shared between the layouts inside one person. `compare()` reports a `balanced`
flag, and `scripts/analyse-sessions.cjs` refuses to pool a session where it is false —
which, run today, means it pools nothing at all. That is the correct output.

Also found and fixed today: `scripts/smoke-touch.cjs` had been failing for some time on
`.grid-3`, a selector for a stats block the milestone-3 screens removed. It was a stale
test, not a broken app, but a check that fails for its own reasons is worse than no check,
because the failure stops meaning anything. It now asserts against the downloaded export
(D72).

## 2026-11-14 — the ABBA run, and what it took away

First balanced four-trial run on a phone. Founder's iPhone, Safari, right hand, 393×695.
`docs/sessions/2026-11-14-founder-iphone-right-v5-abba.json`. snerta went first this time,
so the order alternated from v4.

| | Original | snerta |
|---|---|---|
| Median time | 6.9 s | 6.7 s |
| Comfort (mean of 2) | 2.5 | 4.5 |
| Off-task taps | 0 | 0 |
| Mean position | 2.5 | 2.5 |

Balanced: true. Preference: snerta.

**The speed claim did not survive the design change.** v4, unbalanced, had snerta 7.1 s
quicker — a 43% win. v5, balanced, has it 0.25 s quicker, which is nothing. The comfort
gap stayed: 2 points on a 5-point scale, and the same direction in both runs.

The trial-by-trial times say why, and this is the most useful number the project has:

```
pos 1  snerta    7.96 s
pos 2  Original  7.96 s
pos 3  Original  5.87 s
pos 4  snerta    5.37 s
```

First half 7.96 s, second half 5.62 s. **Practice was worth 2.34 s. The layout was worth
0.25 s. The order effect was 9.2× the treatment effect.** In the two-trial design that
2.34 s sat entirely on whichever layout ran second, which is exactly what produced v4's
43%. D67 was not a precaution; without it every number this project generated would have
been order, misreported as layout.

What this leaves standing is narrower and more interesting than what was claimed on
Thursday: **same speed, notably more comfortable, and preferred.** That is also consistent
with Apple's iOS 15 outcome (D78) — if there is no task-speed benefit, the whole value is
subjective, and subjective value is the kind that splits a user base rather than
converting it. A 0.25 s difference also sits right on `describeDuration`'s 250 ms "about
the same" threshold, which is the right place for it to sit.

### The calibration reproduced both of Kim & Ji's specific findings

Zone medians against an all-zone median of 651 ms, with the self-report beside them:

| Zone | Median | Reported |
|---|---|---|
| top-left | 1588 ms | hard |
| bottom-left | 1210 ms | stretch |
| top-right | 981 ms | stretch |
| fastest (lower-centre) | 464 ms | easy |

Labels: 1 hard, 5 stretch, 9 easy, 0 unknown.

Top-left slowest and the only zone called hard, matching the upper-left finding in
`docs/EVIDENCE_BASE.md` §2. And **bottom-left is the second slowest and reported as a
stretch**, which matches that paper's bottom-edge finding — the one that cuts against a
naive version of snerta (D77). For a right-handed grip the bottom-left corner is a
diagonal reach, so this is not surprising, but it is independent corroboration from a
different method, and it is a reason not to push the rail any lower.

No mismatches were flagged between the clock and the self-report: the slow zones were also
the ones reported as awkward. Worth noting that agreement rather than only reporting
disagreement, and worth not over-reading from one person.

### A bug in the export, found by this file

The export still carried `"comparison is null unless both trials were completed. Two
trials cannot separate the layout from practice."` — a statement the four-trial design had
already made false. The milestone-5 edit to `LIMITATIONS` had silently failed on an indent
mismatch (a scripted replace expecting four spaces where the file had two), so the new
ABBA wording never landed while every other part of the change did. Fixed. The export was
describing its own method incorrectly, in the one field a reader would trust for that,
which is worse than a visual bug.

## 2026-11-14 — participant 2, and the number the screen should not have shown

Second balanced ABBA run, first person who is not the founder. Right hand, same 393×695
viewport. `docs/sessions/2026-11-14-p2-iphone-right-abba.json`.

| | Original | snerta |
|---|---|---|
| Median time | 9.9 s | 11.1 s |
| Comfort | 4.0 | 3.5 |
| Off-task taps | 0 | 0 |

Balanced: true. Preference: **none**. This is the first result that does not favour snerta,
and it was collected on the same protocol that produced the favourable one.

**But neither session can actually read its own number.** Put the two side by side:

| | Founder | P2 |
|---|---|---|
| Between layouts | 0.25 s | 1.23 s |
| Spread within snerta's own two runs | 2.58 s | 3.50 s |
| Spread within Original's own two runs | 2.09 s | 5.09 s |

In both people the same person doing the same task twice in the *same* layout varied by
several times the gap between the layouts. P2's slowest run of all four was position 4,
which is where practice should have made them quickest. So the per-person delta is not a
measurement, and the results screen was presenting it as one — "With snerta the task took
1.2 s longer" is a sentence this data does not support.

Fixed. `compare()` now carries `withinSpreadMs` and `insideNoise`, and when the gap is
smaller than the person's own spread the screen says **"Too close to call"** and shows both
figures instead of the delta. `analyse-sessions.cjs` flags the same thing, and both
sessions on file trip it. Four runs per person cannot resolve a one-second effect; across
people the *direction* is the only thing readable, which is what the pooled view counts.

### P2's reach profile is the inverse of the founder's

| | Founder | P2 |
|---|---|---|
| Hardest zone | top-left (1588 ms) | **bottom-left** (1078 ms) |
| Top row | hard / stretch / stretch | stretch / **easy** / stretch |
| Grip changes during use | no | **yes** |

For P2 the top of the screen is largely fine and the bottom-left corner is the problem.
snerta's whole premise is that the top is the problem, so on their own map the intervention
is aimed somewhere they do not need help — and their result was no preference and a
slower-but-unreadable time. n = 2 cannot establish this, but it is a sharp, testable
hypothesis the app is already equipped to check: **snerta may only help people whose reach
map is bad at the top, and the app measures that before the trials run.** Worth watching
in the next three sessions rather than concluding now.

Also an instrument finding: P2 chose **right** on the hand question but answered **yes** to
the grip-change question. Those two answers describe different things and the app treats
hand as fixed. Not changed yet; noted so it is not mistaken later for a data error.

### Open question for the session notes

P2's position-4 run took 12.9 s, the slowest of the four, and carried the only comfort
rating below 4. Something happened in that run. The export cannot say what — this is
exactly the gap `docs/OBSERVATION_SHEET.md` exists to fill, and it was not filled here.

## 2026-11-14 — participant 3 (left-handed), and a confound ABBA cannot fix

First left-handed participant. `docs/sessions/2026-11-14-p3-iphone-left-abba.json`.
Original first this time.

```
pos 1  Original  10.6 s   comfort 4   off-task 0
pos 2  snerta    29.7 s   comfort 5   off-task 3
pos 3  snerta     7.6 s   comfort 5   off-task 0
pos 4  Original   9.8 s   comfort 4   off-task 0
```

Medians: Original 10.2 s, snerta 18.6 s. On the face of it snerta is 8.4 s slower. The new
`insideNoise` flag fired on its first real use and is correct to: snerta's own two runs
differ by 22.1 s, far more than the 8.4 s between layouts. Nothing about the size of that
gap is readable. The person rated snerta 5/5 twice against 4/4, and **preferred snerta**.

**The 29.7 s run is the finding, not the noise.** It carries every off-task tap in the
entire dataset — 3 of them, against 0 in all eleven other trials across three people. The
next snerta run was 7.6 s, the fastest trial of the four. That is not a layout being slow.
That is a person finding out where the controls went, once, and then being quick.

### ABBA balances position. It does not balance familiarity.

This is a real confound and it is still live:

- **Original is a lifetime habit.** Every app this person has ever used puts back and search
  at the top. Their first Original run starts with zero discovery cost.
- **snerta is novel.** Its first run always includes the cost of finding the rail.
- ABBA shares out *practice at the task* evenly. It cannot share out *familiarity with the
  layout*, because one layout arrives pre-learned and the other does not.

So the first snerta run is systematically penalised in every session, and no amount of
counterbalancing by position repairs it. Looking back with this in mind, the same shape is
visible in P2: their slower snerta run was also their first one.

This is the same class of error as the two-trial design (D67) — a cost that looks like the
treatment because it always lands on the same condition. It was not visible until someone
who had never seen the prototype used it.

**The fix is a familiarisation task in each layout before the clock starts**, so discovery
is spent outside the measurement. The preview screen already exists; it is evidently not
doing this job, either because it is skippable or because looking is not the same as using.

### Not changing it mid-pilot

The fix is **not** being shipped now. Sessions 4 and 5 are expected today, and changing the
instrument between participant 3 and participant 4 would mean the five sessions no longer
measure the same thing and cannot be pooled. A known, documented confound that applies
equally to all five is worth more than a better instrument applied to some of them.

Finish the pilot on the current build. The familiarisation change is the next milestone,
and the pilot write-up states this confound plainly rather than hiding behind the
`insideNoise` flag.

### The D86 hypothesis took a hit

| | Top row reported | Predicted | Preference |
|---|---|---|---|
| Founder | hard / stretch / stretch | helps | snerta ✓ |
| P2 | stretch / easy / stretch | no benefit | none ✓ |
| P3 | easy / easy / hard | no benefit | **snerta ✗** |

Two of three. At n = 3 that is indistinguishable from chance, so the hypothesis is
**weakened, not dead and certainly not confirmed**. P3's map is the flattest yet (540–894 ms
across all zones, against the founder's 464–1588 ms), which is consistent with their
changing grip during use — a moving grip would even out reach. Worth noting that a person
with no bad zone still preferred the rail, which if it holds would mean the benefit is not
only about reach.

Also: P3 reported **top-right** as hard, but the clock's slowest zone was **top-left**
(894 ms). For a left-hander top-right is the far diagonal, so the self-report is plausible;
the clock disagrees. Below the 1.5× threshold so no mismatch was flagged, correctly — the
whole profile is flat. Recorded because it is the first case of the two accounts pointing
at different corners.

## 2026-11-14 — participant 4 (switches grip), and the first-exposure cost across four people

First participant to answer **"switches"** on the hand question, so the first run of the
**centred** rail. `docs/sessions/2026-11-14-p4-iphone-both-abba.json`.

```
pos 1  Original  3.2 s   comfort 5   off-task 0
pos 2  snerta    7.0 s   comfort 5   off-task 0
pos 3  snerta    3.7 s   comfort 5   off-task 0
pos 4  Original  5.2 s   comfort 5   off-task 0
```

Medians: Original 4.2 s, snerta 5.3 s. `insideNoise` true again — their own snerta runs
differ by 3.2 s against 1.2 s between layouts. Preference: **none**.

Fastest participant so far by a wide margin, and the flattest reach map yet: every zone
between 389 and 659 ms, against the founder's 464–1588 ms. Only two zones not called easy.
The centred rail drew no off-task taps and no complaint in the data.

**They rated all four trials 5 out of 5.** Comfort cannot discriminate for this person —
the scale is at its ceiling in both layouts, so the 0.0 comfort delta means "no room to
move", not "no difference". A measure that can only go down for some participants is worth
noting as a limit of the 1–5 scale.

### First-exposure cost, now measurable across four people

Does each layout get faster from its own first run to its own second? If snerta gains more,
that extra is discovery sitting on top of ordinary practice.

| | Hand | snerta gain | Original gain | Difference |
|---|---|---|---|---|
| Founder | right | +2.58 s | +2.09 s | +0.49 s |
| P2 | right | −3.50 s | +5.09 s | **−8.59 s** |
| P3 | left | +22.08 s | +0.77 s | **+21.31 s** |
| P4 | switches | +3.23 s | −2.03 s | +5.26 s |

snerta improved more in **3 of 4**, median +2.88 s. But the median is carried almost
entirely by P3's 21.3 s, and P2 goes firmly the other way. Drop P3 and the remaining
differences are +0.49, −8.59 and +5.26 — no pattern at all. So D88 is **consistent with the
data and not demonstrated by it**. The honest position: a plausible mechanism, visible
clearly in one person, not established in four.

This is a reason to ship the familiarisation fix (D90) and stop arguing about it from
four sessions, rather than a reason to claim the effect now.

### D86 is not supported

Coding "top row bad" as at least two of the three top zones reported not-easy:

| | Top row | Predicted | Preference | |
|---|---|---|---|---|
| Founder | hard / stretch / stretch | helps | snerta | ✓ |
| P2 | stretch / easy / stretch | helps | none | ✗ |
| P3 | easy / easy / hard | no benefit | snerta | ✗ |
| P4 | easy / easy / stretch | no benefit | none | ✓ |

**2 of 4 — a coin flip.** The reach map did not predict who preferred snerta. D86 is
recorded as unsupported rather than quietly dropped, because it was written down in advance
and this is what happened to it.

### Where the pilot stands at n = 4

- **Time: unreadable in every single session.** All four tripped `insideNoise`. Direction
  was snerta-slower in 3 of 4, which given the first-exposure asymmetry is what would be
  expected whether or not the layout matters.
- **Comfort: better 2, level 1, worse 1.** No pattern, and one of the four was at ceiling.
- **Preference: snerta 2, none 2, Original 0.** Nobody preferred Original. That is the only
  consistent thing in the dataset, and at n = 4 with the builder in the room it is a
  direction to test, not a result.

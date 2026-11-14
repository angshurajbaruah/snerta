# snerta — pilot report

**14 November 2026 · n = 4 · closed**

Four people tested whether moving a phone's back, search and menu controls down within
thumb reach makes a one-handed task easier. **The time difference was unreadable in every
session. Nobody preferred the layout they already have.**

A formatted copy of this report lives as a Claude doc; this is the version of record in the
repository. Numbers below are reproducible with `node scripts/analyse-sessions.cjs`.

---

## What snerta is

A web page that moves three controls — back, search and a menu — from the top of the screen
to a rail near the thumb, reversibly and only if you ask it to. Not an app, not a keyboard,
not a phone setting. It works inside its own page. Nothing is stored or uploaded; the only
data that leaves a session is a JSON file the person downloads themselves.

## What was cited rather than measured

That phones are often used one-handed, and that the upper screen is awkward when they are,
is established. snerta cites it instead of spending its only real budget — people's time —
re-establishing it. Full sourcing in `EVIDENCE_BASE.md`.

- **Hoober 2013** (1,333 public observations): of 780 people touching a screen, 49%
  one-handed, 36% cradled, 15% two-handed.
- **Kim & Ji 2018** (IEA/Springer): thumb zone varies by thumb length and screen size.
  Large thumbs covered over half the screen, small and medium about 30%. The upper-left
  region *and the bottom edge* both commonly fell outside it.
- **Apple, iOS 15**: moved Safari's address bar to the bottom, then added a Single Tab
  setting to put it back after the reaction.

Two cautions came from reading these properly. The green/yellow/red thumb-zone heatmap
reproduced across design blogs for a decade is **disowned by its own author** — Hoober wrote
"Please, please everyone ignore those drawings" on his own article. It is not cited here.
And Kim & Ji's bottom-edge finding cuts against a naive version of this idea: a rail pushed
flush to the bottom could land in a second awkward zone.

Apple's walk-back is the most useful of the three. It is the only large-scale test of this
intervention that exists, and it says two things at once: the idea is not silly, and
shipping it without an obvious way back failed for a lot of people.

## Method

Fifteen minutes on the participant's own phone. Hand selection → 30 prompted calibration
taps across a full-screen 3×5 grid (after 3 unrecorded practice taps, `pointerdown` only) →
comfort self-report, where Not sure stays Not sure → free preview of both layouts → **four
timed tasks run ABBA** (first layout, other, other, first) with a comfort rating after each
→ results and export. Protocol in `SESSION_SCRIPT.md` and `OBSERVATION_SHEET.md`.

## Results

| | Hand | Original | snerta | Comfort Δ | Preferred | Time readable? |
|---|---|---|---|---|---|---|
| P1 (author) | right | 6.9s | 6.7s | +2.0 | snerta | no |
| P2 | right | 9.9s | 11.1s | −0.5 | none | no |
| P3 | left | 10.2s | 18.6s | +1.0 | snerta | no |
| P4 | switches | 4.2s | 5.3s | 0.0 | none | no |

Medians of each layout's two runs. Comfort Δ is snerta minus Original on a 1–5 scale.

**Time: nothing readable in any session.** Not one produced a layout difference larger than
that person's own variation across two runs of a single layout.

**Comfort: mixed.** Better 2, level 1, worse 1. P4 rated all four trials 5/5, so their 0.0
is a ceiling, not a null.

**Preference: snerta 2, none 2, Original 0.** The only consistent thing in the dataset.

## What the measurement caught

The pilot's real output. Four times a confident wrong answer was stopped.

**1 — A 43% improvement that was practice.** The first phone run had Original first, snerta
second, snerta 7.1s quicker. That is also what a second attempt at an unfamiliar task looks
like. Redesigned to four trials ABBA; the same person's next advantage was 0.25s. In that
session practice was worth 2.34s and the layout 0.25s — **the order effect was 9.2× the
treatment effect** (D67).

**2 — A delta smaller than the person's own noise.** In all four sessions:

| | Between layouts | Within snerta's 2 runs | Within Original's 2 runs |
|---|---|---|---|
| P1 | 0.25s | 2.58s | 2.09s |
| P2 | 1.23s | 3.50s | 5.09s |
| P3 | 8.43s | 22.08s | 0.77s |
| P4 | 1.16s | 3.23s | 2.03s |

The results screen had been telling P2 "snerta took 1.2s longer" — unsupported by their own
data. It now says **"Too close to call"** and shows both figures (D84).

**3 — A confound ABBA cannot fix.** Original is a lifetime habit; snerta is novel. ABBA
shares out practice at the task, not familiarity with the layout. P3's first snerta run took
29.7s with 3 off-task taps — every off-task tap in the dataset, against 0 in the other
eleven trials — and their second took 7.6s, the fastest of their session. Across four
people snerta improved more from first run to second in 3 of 4, median 2.88s, **but that
median is carried almost entirely by P3 and P2 goes the other way.** Plausible, not
established (D88, D93).

**4 — A pre-registered hypothesis that failed.** After P2, a prediction was written down:
snerta should help people whose reach map is bad at the top.

| | Top row reported | Predicted | Preferred | |
|---|---|---|---|---|
| P1 | hard / stretch / stretch | helps | snerta | ✓ |
| P2 | stretch / easy / stretch | helps | none | ✗ |
| P3 | easy / easy / hard | no benefit | snerta | ✗ |
| P4 | easy / easy / stretch | no benefit | none | ✓ |

**2 of 4 — a coin flip.** Reported because it was written down first, not dropped because
it came out wrong (D92).

## What this cannot tell you

- Four people. No test here would have power to find a one-second effect, so none was run.
- One of the four built it and was in the room for the other three.
- No blinding — participants could see which layout was new.
- One screen size, 393×695. Nothing tested on a Pro Max, which is where the literature says
  the effect should be largest.
- Observation notes were not filled in. P2's and P3's outlier runs have no explanation.
- Browser-reported touch is not proof a thumb was used; time is not comfort.
- First-exposure cost is still in these numbers. The fix was deliberately held back so all
  four sessions would measure the same thing (D89).

## What it changes

**The speed claim is dropped** (D81). On this evidence snerta is the same speed, and the
honest pitch is about comfort and choice, not seconds saved. That matches where Apple's
attempt landed: no task-speed benefit means the value is subjective, and subjective value
splits a user base rather than converting it.

**Reversibility becomes the product, not a feature.** If the benefit is a preference, the
only defensible way to ship it is opt-in, obvious and undoable in one gesture. The
prototype now moves the controls by dragging them — pull the grip down and they come to the
thumb, push it up and they go back (D96–D100).

## If a second round runs

1. **Familiarisation in each layout before the clock starts** (D90). Without it the next
   round still cannot read a time.
2. **A forced comparative question** beside the 1–5 scale (D94).
3. **Pro Max and small-handed participants** — the cell with no data in it.

---

The defensible statement: *four people, the time difference unreadable in every one,
comfort mixed, and nobody preferring the layout they already have.*

The pilot's value was never the result. It was building a measurement honest enough to
delete its own best number.

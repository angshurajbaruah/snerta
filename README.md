# snerta.

**Every tap, within reach.** — An open experiment on one-handed phone use.

snerta moves three controls — back, search and a menu — from the top of a phone screen down
near your thumb. Reversibly, and only if you ask it to. It exists to answer one question:

**Does that actually help?**

Run it on your own phone in about fifteen minutes and find out for yourself. Everything
happens in the page. No account, no server, no tracking, nothing uploaded. If you want to
send your results back, you download a file and send it yourself.

---

## What was found so far

Four people, 14 November 2026. Full write-up in [`docs/PILOT_REPORT.md`](docs/PILOT_REPORT.md).

| | Original | snerta |
|---|---|---|
| Time to finish the task | — | **no readable difference** |
| Comfort (1–5) | mixed: better for 2, level for 1, worse for 1 | |
| Preferred it | 0 | 2 (2 had no preference) |

**The speed claim did not survive.** The first run on a phone showed snerta 43% faster. That
turned out to be practice — people get quicker at any task the second time — and a
counterbalanced redesign reduced it to 0.25 seconds. In every session since, the difference
between layouts has been smaller than the same person's variation between two runs of a
single layout.

What is left is narrower and honest: **same speed, mixed comfort, and nobody preferring the
layout they already have.** Four people is a direction to test, not a result. One of those
four built the thing.

That is why this repo is public. The sample is small and the person who ran it is not
neutral. Running it yourself is the fix for both.

## Run it yourself

**The easy way** — if a hosted link exists, open it on your phone and skip to
[Taking part](docs/TAKE_PART.md).

**From this repo**, you need [Node.js](https://nodejs.org) 20 or newer:

```bash
git clone https://github.com/angshurajbaruah/snerta.git
cd snerta
npm install
npm run dev -- --host
```

Open the `http://<your-LAN-IP>:5173` address it prints, **on a phone on the same Wi-Fi.** It
has to be a real phone — the whole thing measures thumb reach, and a desktop browser
measures nothing.

On a Mac you can double-click **`Start snerta on my phone.command`** instead, which does all
of the above and prints the address for you.

## Taking part

The full participant guide is in [`docs/TAKE_PART.md`](docs/TAKE_PART.md). In short: hold
your phone the way you normally would, tap the dots as they appear, say how each area felt,
then do four short timed tasks. At the end you can download a JSON file of everything
recorded.

**If you want to contribute it:** look at the file first — it is readable, and it contains no
name, no account, no location and no device identifier. Then open an
[issue](https://github.com/angshurajbaruah/snerta/issues) or email it to the address on the
owner's GitHub profile. Say what phone you used and whether you are left- or right-handed;
that is the part the file cannot tell us.

Contributions of data are welcome and entirely optional. Running it and telling nobody is a
completely fine outcome.

## What it measures, and what it refuses to

Recorded: which dot was prompted, where you actually tapped, how long between the prompt and
the tap, the pointer type the browser reported, your viewport size, your own comfort labels,
and the duration of each timed task.

**Not** recorded, inferred or claimed:

- Your hand size, anatomy, or anything medical. It is a web page.
- Comfort inferred from speed. There is deliberately no function in this codebase that maps
  tap latency to a comfort label. Only you say how something felt.
- A tap near the wrong dot as a "miss". Those are logged as observations.
- A difference the data cannot support. When a gap between the two layouts is smaller than
  your own variation between two runs of one layout, the results screen says **"too close to
  call"** and shows both numbers instead of reporting the difference.

Browser-reported touch is not proof a thumb was used. Time is not comfort. One session on one
phone cannot establish a general result. All of this is restated in every export.

## What is already known, and not re-tested here

That phones are often held one-handed, and that the top of the screen is awkward when they
are, is established. snerta cites it rather than re-measuring it. Sources and the two
important caveats — including the famous thumb-zone heatmap that its own author publicly
disowned — are in [`docs/EVIDENCE_BASE.md`](docs/EVIDENCE_BASE.md).

Apple shipped this same change in iOS 15, moving Safari's address bar to the bottom, then
added a setting to put it back. That is the closest thing to a large-scale test of the idea,
and it is why snerta is opt-in and reversible rather than a default.

## How the repo is laid out

```
src/lib/          pure logic, no React — calibration, reach, trials, drag
src/screens/      one file per step of the journey
src/components/   shared UI
tests/            147 tests, Vitest
scripts/          analysis, contrast audits, browser smoke checks
docs/
  PILOT_REPORT.md       the n=4 write-up
  EVIDENCE_BASE.md      what is cited rather than measured
  DECISION_LOG.md       every design decision and why, including the reversed ones
  QA_FINDINGS.md        bugs found, and what each would have broken
  SESSION_SCRIPT.md     how to run this on someone else
  OBSERVATION_SHEET.md  what the app cannot see
  sessions/             real participant exports
  synthetic/            generated fixtures — NOT data, see that folder's README
```

```bash
npm test                          # 147 tests
npm run build
node scripts/analyse-sessions.cjs # per-session and pooled results
```

The analysis script **refuses to run** on a folder containing a synthetic file. Those exist
only to exercise a screen size no real session covers, and a hard stop is harder to remove by
accident than a filter.

`docs/DECISION_LOG.md` is the most useful file here if you want to understand the project
rather than run it. It includes the decisions that were later reversed, and the hypothesis
that was written down in advance and then failed.

## Contributing

Issues and pull requests welcome. Two things to know:

1. **Research integrity is not negotiable.** No fabricated or unlabelled mock data, no
   inferring comfort from timing, and no copy that asserts the benefit under test. A PR that
   makes the app claim snerta is better will be closed.
2. **A null result is a good result.** If your session says the layout made no difference, or
   made things worse, that is exactly as useful as the opposite and will be published the
   same way.

## Licence

Code is [MIT](LICENSE). Third-party and brand notices are in [NOTICE.md](NOTICE.md) — the
snerta name and mark are not covered by the code licence.

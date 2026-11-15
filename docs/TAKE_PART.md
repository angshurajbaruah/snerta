# Taking part

Thanks for trying this. It takes about fifteen minutes and you can stop at any point.

## Before you start

**Use your own phone.** The whole thing measures how far your thumb reaches on the handset
you actually use. A borrowed phone or a desktop browser measures nothing useful.

**Hold it the way you normally would.** Not the way you think it should be held. If you
usually rest it on your little finger, do that.

**Nothing is sent anywhere.** There is no server. Everything stays in the page until you
choose to download a file. If you close the tab, it is all gone.

## What happens

1. **Which hand.** Left, right, or you switch between them.
2. **Thirty-three taps.** Dots appear one at a time; tap each as it darkens. The first three
   are practice and are not recorded.
3. **How each area felt.** You label the fifteen areas Easy, Stretch, Hard, or Not sure.
4. **Try both layouts.** Untimed. Drag the grip to move the controls up and down.
5. **Four short tasks.** Find a message, archive it, come back. Two in each layout, timed.
6. **Your results**, and a file you can download.

## Two things that matter more than they look

**Tap every dot, including the awkward ones.** The dots you can barely reach are the ones
carrying the information. A session where someone only tapped the comfortable ones would
tell us the screen is comfortable, which is not a finding.

**Don't shift your grip to reach.** If a dot is awkward, tap it awkwardly. Regripping is a
perfectly normal thing to do with a phone — but it hides exactly what this is trying to see.
If you do regrip, that's fine, just mention it when you send the file.

Also: during the four tasks, go at a normal pace. It is the two layouts being compared, not
you, and rushing adds noise rather than information.

## Sending your results

At the end there is a **JSON** button. The file lands in your Downloads or Files.

**Open it first.** It is plain text and readable. You will find timings, tap coordinates,
your comfort labels and your viewport size. You will not find your name, an account, a
location, a device identifier or anything that could be traced back to you.

If you are happy with it, send it via an
[issue on the repo](https://github.com/angshurajbaruah/snerta/issues) or by email to the
address on the owner's GitHub profile.

Please include three things the file cannot know:

- **Which phone**, as specifically as you can — "iPhone 15 Pro Max", "Pixel 8a".
- **Left- or right-handed**, and whether you switch during normal use.
- **Anything odd that happened.** A phone call mid-task, a dropped phone, a moment where you
  could not find a button, or a run where you were distracted. One sentence. This is the most
  valuable part and the file cannot capture any of it.

Blunt feedback is more useful than kind feedback. "The bottom bar covered the message I was
reading and it annoyed me" is worth more than four clean timings.

If you later want your session removed, open an issue and it goes. No explanation needed.

## What your data will and will not be used for

It gets added to `docs/sessions/`, pooled with the others by
`scripts/analyse-sessions.cjs`, and reported — including if it contradicts the hypothesis.
The existing results already do, in places, and they are published as they came out.

It will not be used to claim anything it does not support. If your session shows no
difference, that is the finding and it gets reported as the finding.

## If something breaks

Open an issue with what phone and browser you were on and what happened. The prototype has
only been run on a handful of devices, so a bug report is a genuinely useful contribution —
arguably more useful than a clean session.

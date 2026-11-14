# snerta — session script

For running one person through the prototype. Read it beforehand; don't read it aloud
word for word, except the bracketed lines, which are worded the way they are on purpose.

**Time:** 12–15 minutes. **You need:** their own phone, this script, one observation
sheet, and somewhere to put the JSON file at the end.

---

## Before they arrive

- Open the prototype on their phone — **their** phone, not yours. A borrowed handset
  measures reach on the wrong hand and the wrong screen.
- Decide which layout goes first and write it on the sheet **now**, before you meet
  them. The app randomises it, but if you let it surprise you, you'll find yourself
  explaining the second layout more carefully than the first.
- Put your own phone away. If you're taking notes on a phone they'll mirror you.

## What not to do, for the whole session

- Don't say the words *better*, *easier*, *improvement*, *fix*, *stranded* or *within
  reach*. Those are the claim under test. If you supply it, they'll confirm it.
- Don't name which layout is "yours". Say *the first one* and *the second one*, or
  *Original* and *snerta* flatly, as two labels.
- Don't explain a control they're hunting for. Watching someone hunt is the data.
- Don't fill a silence. Count to five in your head first.
- If they ask what you're hoping to find: "That it makes no difference is a perfectly
  good answer, and about as likely." Mean it.

---

## 1 · Opening (1 min)

> "This is a small web page that moves three buttons around — back, search, and a menu.
> I want to find out whether moving them changes anything when you're using the phone
> one-handed. It might not. Either way the answer is useful to me.
>
> Nothing is saved anywhere and nothing is sent anywhere. At the end there's a file you
> can look at before I keep a copy, and you can tell me to delete it.
>
> You can stop at any point without giving a reason. Nothing here is a test of you —
> if something's confusing, that's the page being confusing."

Ask: **"Is it all right if I take notes while you use it?"** Wait for an actual yes.

## 2 · Grip, before they touch anything (1 min)

> "Hold your phone the way you normally would when you're reading something on it."

Write down what you see, not what they say: which hand, where the little finger is,
whether the phone is resting on anything. Then:

> "Is that how you usually hold it? Does it change during the day?"

## 3 · Calibration — 33 taps (4 min)

Hand them the phone. Let them read the screen themselves.

> "It'll show you dots one at a time. Tap each one as it darkens. Three practice ones
> first, then thirty that count.
>
> Two things: tap every dot, including the ones that feel awkward — that's the part I
> need. And don't shift your grip to reach. If you can't get to one comfortably, tap it
> awkwardly rather than regripping."

Then stop talking. Watch for, and write down:

- shoulder lifting, elbow going out, wrist bending back
- the phone sliding down in the hand, or being pushed up by the other hand
- a pause before a dot, and **where** that dot was
- the second hand arriving — note at which dot, exactly

If they regrip anyway, let them finish. Note it. Don't correct them mid-run.

## 4 · Comfort self-report (2 min)

> "Now it's asking how each area felt. Tap a square to change it. Leave any you're not
> sure about — *not sure* is a real answer and it stays as *not sure*."

If they ask what the timings mean: "It recorded how long each tap took, separately. It
doesn't turn that into comfort — only you can say that part."

## 5 · Four timed tasks (4 min)

> "Four short tasks now. Same thing each time: find a message, archive it, come back to
> the inbox. The buttons are in different places in different runs.
>
> It times you, so go at a normal pace — not fast. It's the two layouts being compared,
> not you. The timer starts when you tap Start and stops when you're back."

Four runs, alternating, two in each layout. Between runs it asks how comfortable that
one felt. Say nothing during a run. **Especially** say nothing when they reach for a
control that isn't there — write down where they reached first.

If they get interrupted — a call, someone walking in — the app voids that run. Let it.
Don't restart it to "get the number"; a tidy dataset and an honest one aren't the same.

## 6 · Afterwards (2 min)

Results screen first, then:

> "Which did you prefer, if either?"

Then, in this order, and don't skip the first one:

1. "Was there anything annoying about the second layout?" *(ask it this way round —
    inviting the complaint first stops them being polite about it)*
2. "Where did you look for the back button?"
3. "If this were your actual phone, would you leave it on?"
4. "Anything you'd expect it to do that it didn't?"

## 7 · The file

> "This is everything it recorded. Have a look."

Let them scroll it. Then: **"Can I keep a copy?"** If no, delete it in front of them and
write the session off. One lost session costs less than a person who felt steamrolled.

Save it as `docs/sessions/YYYY-MM-DD-<initials>-<phone>-<hand>.json`.

---

## Right after they leave, before the next one

Write two sentences on the sheet while it's fresh: the thing that surprised you, and
the thing you'd have done differently. Then run:

```
node scripts/analyse-sessions.cjs
```

If a session shows as unbalanced, something interrupted it — note what, rather than
leaving the reader to guess.

## Honest limits of this protocol

- Five people in one room over an afternoon. Volunteers who know you, on a prototype
  you built, which is roughly the weakest form of evidence that still counts as evidence.
- Four trials spread practice evenly between the two layouts. They do nothing about the
  person wanting to be helpful, or about you hoping it works.
- The participant knows which layout is the new one, because it's visibly the odd one.
  There is no blinding here and pretending otherwise would be worse than admitting it.

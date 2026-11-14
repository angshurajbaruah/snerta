# snerta — what is already known, and what snerta still has to show

**Written 2026-11-14.** The purpose of this file is to stop snerta measuring things that
have already been measured, and to be precise about the one thing it is actually for.

---

## 1 · Established: one-handed use is about half of all phone use

Hoober, S. (2013). *How Do Users Really Hold Mobile Devices?* UXmatters.

- **Method:** observational. 1,333 observations of people using mobile devices in public
  (streets, airports, bus stops, cafés, trains), over two months to 8 January 2013. Grip
  logged from the first few seconds of observation. 780 of those people were touching the
  screen.
- **Finding, among the 780 touching the screen:** one-handed **49%**, cradled **36%**,
  two-handed **15%**.
- **Limits, stated by the author:** no demographics, no device types, no activity recorded,
  and no estimate of how many people were using phones overall.

This is good enough to take as given. snerta does not need to re-establish that people use
phones one-handed.

## 2 · Established: reach is limited, and it depends on thumb length *and* screen size

Kim, H.C. & Ji, Y.G. (2018). *Natural Thumb Zone on Smartphone with One-Handed
Interaction: Effects of Thumb Length and Screen Size.* Proceedings of the 20th Congress of
the International Ergonomics Association (IEA 2018), Springer, pp. 471–477.

- **Method:** one-handed grip on three phones (4.7″, 5.1″, 5.2″). Participants grouped by
  thumb length into small, medium and large. Natural thumb zone analysed by heat map.
- **Findings:**
  - Large-thumb group: natural zone covered **more than half** the touchscreen.
  - Small and medium groups: about **30%**, on all three phones.
  - For the small-thumb group, the zone shrank markedly on the 5.2″ phone.
  - **Regardless of thumb length, the bottom edge and the upper-left region were not
    commonly inside the natural thumb zone.**

Two things to carry forward. First, this is peer-reviewed support for the premise, so the
premise can be cited rather than measured. Second, the largest phone tested was 5.2″. A
current Pro Max is around 6.9″. Whatever this paper found, the effect on today's phones is
probably larger — but that is an extrapolation, and it is labelled as one here.

Note also the bottom-edge finding. It cuts against a naive version of snerta: the very
bottom of the screen is not comfortable either. A rail pushed flush to the bottom edge
could land in a second awkward zone rather than a good one. snerta's rail sits above the
safe-area inset rather than on the edge, which happens to be right, but it was not chosen
for this reason and should not be presented as though it was.

## 3 · The thumb-zone heat map everyone cites was disowned by the person who made it

The familiar green / yellow / red thumb-zone diagram, reproduced across design blogs for
a decade, comes from Hoober's 2013 article. In a later comment on his own piece, Hoober
wrote: **"Please, please everyone ignore those drawings."** They were drawn from a small,
informal sample of his coworkers, not from the 1,333 observations. He added that people
touch the **centre** of the screen more often and more accurately than the corners or
edges.

This matters for snerta in three ways:

1. **Don't cite the heat map.** Cite the grip percentages (point 1) and the peer-reviewed
   zone work (point 2). Reproducing a disowned diagram in a portfolio piece is the kind of
   thing a reviewer who knows the literature will spot.
2. **The problem is less precisely mapped than the design community assumes.** "The top is
   hard to reach" is supportable. "Here is exactly which pixels are hard" is not, which is
   part of why snerta measures each person's own phone rather than drawing a generic map.
3. **It supports the calibration screen's existing framing.** Calibration is not
   discovering that the top of a phone is hard. It is showing *this person* where *their*
   limit falls on *their* phone, which is the part no published map can supply.

## 4 · The natural experiment: Apple already shipped snerta's intervention

In iOS 15 (2021), Apple moved Safari's address bar on iPhone from the top of the screen to
the bottom — the same move snerta makes with back, search and the menu, at the scale of
roughly a billion devices.

The reaction was bad enough that Apple added a **Single Tab** option (Settings → Safari →
Tabs) that puts the address bar back at the top. That setting still exists. Press coverage
at the time described the redesign as controversial and widely disliked; Macworld's review
called it "a mess."

This is the single most useful fact in this file, and it cuts both ways:

- **For snerta:** the biggest company in consumer software reached the same conclusion from
  the same premise, which is reasonable corroboration that the idea is not silly.
- **Against a naive snerta:** the same company found that doing it *without a way back* was
  unacceptable to a large number of people, and had to retrofit a toggle under pressure.

So snerta's opt-in, reversible design is not caution or hedging. It is the documented
lesson from the only large-scale test of this intervention that exists. That is worth
saying explicitly in the write-up, because "reversible" otherwise reads as a small product
decision rather than the central one.

It also means a real result for snerta may well be *mixed* — faster but disliked, or
preferred by some and rejected by others. Apple's outcome was mixed. A clean majority
either way would be the surprising result, not the expected one.

---

## What snerta can now take as given

- People use phones one-handed about half the time. **Cited, not measured.**
- Reach is limited, varies by thumb length and screen size, and the upper region is
  commonly outside the natural thumb zone. **Cited, not measured.**
- The bottom edge is also commonly outside it. **Cited, and it constrains the design.**
- Moving controls down is a plausible intervention that a major vendor has shipped.
  **Cited.**

## What snerta still has to show, and cannot assume

This is the whole contribution, and none of it is answered above:

1. Whether moving **these three specific controls** to a lower rail **inside a web page**
   changes how long a real task takes, or how it feels.
2. Whether it is worth **what the rail displaces** — roughly 154 px of width and the
   content behind it. This is snerta's own cost, not something Apple's change had.
3. Whether people **want it left on** once they have tried both, which is precisely where
   Apple's version failed.
4. Whether any of this holds for someone who **switches hands**, which the literature
   above does not cover at all.

A cited premise does not transfer to the fix. "The top of the screen is hard to reach" and
"moving the back button down helps" are different claims, and the second one is the one
snerta exists to test. Apple's walk-back is the proof that they come apart: the premise was
right and the fix still failed for a lot of people.

## The minimum honest version of the study

Given the premise is cited, the study no longer needs to establish reach difficulty, which
makes it considerably smaller:

- **One clean ABBA run on a phone** (four trials, balanced) is the floor. Without it there
  is no data on the fix at all.
- **Three to five people** beyond that, reported as a **pilot**, not a study. Enough to see
  whether anyone reaches for a control that is not there, whether the displaced content
  annoys them, and whether they would leave it on.
- Report it as *n = 4, directional, run by the person who built it*. That sentence is not
  a weakness in a portfolio piece. It is the thing that makes the rest of the analysis
  believable.

A pilot that honestly reports "two of four preferred it, one found the rail covered what
they were reading" is stronger evidence of product judgment than fifteen sessions with a
clean majority, because the first one is checkable and the second one invites the question
of how it got so tidy.

---

## Sources

- Hoober, S. (2013). *How Do Users Really Hold Mobile Devices?* UXmatters.
  https://www.uxmatters.com/mt/archives/2013/02/how-do-users-really-hold-mobile-devices.php
- Hoober, S. (2013). *Design for Fingers and Thumbs Instead of Touch.* UXmatters.
  https://uxmatters.com/mt/archives/2013/11/design-for-fingers-and-thumbs-instead-of-touch.php
- Kim, H.C. & Ji, Y.G. (2018). *Natural Thumb Zone on Smartphone with One-Handed
  Interaction: Effects of Thumb Length and Screen Size.* IEA 2018, Springer, 471–477.
  https://link.springer.com/chapter/10.1007/978-3-319-96071-5_50
- Macworld (2021). *Apple rolls back the biggest iOS 15 Safari change with a new Single Tab
  option.*
  https://www.macworld.com/article/353448/apple-rolls-back-the-biggest-ios-15-safari-change-with-a-new-single-tab-option.html

Secondary coverage of the iOS 15 reaction, for context rather than citation:
TechCrunch, *Apple walks back controversial Safari changes with iOS 15 beta 6 update*
(https://techcrunch.com/2021/08/18/apple-walks-back-controversial-safari-changes-with-ios-15-beta-6-update/);
Creative Bloq, *Apple backs down on controversial iOS 15 app redesign*
(https://www.creativebloq.com/news/ios-15-safari-redesign).

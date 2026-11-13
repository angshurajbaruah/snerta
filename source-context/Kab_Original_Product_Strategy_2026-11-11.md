# K’ab — Product Strategy, Discovery and MVP Handoff

**Version:** 1.0 — 11 November 2026 (India)

**Status:** Name finalized by Anshuraj; product concept selected for prototyping; problem impact, adoption and usability outcomes still need validation.

**Working one-liner:** **K’ab is an interactive, mobile-first experience that explores whether digital interfaces can adapt to an individual user's comfortable thumb reach instead of forcing everyone to use the same layout.**

**Product promise, stated as a hypothesis:** *An interface that fits your hand.*

> **For the assistant in the new chat:** This document is the product's source of context. The user wants to work on K’ab separately from other ideas. Continue from the decisions below; do not restart generic brainstorming, rename the product, assume commercial demand, or conflate a research prototype with an operating-system capability. Be evidence-driven, challenge unsupported assumptions, and help build, test, open-source and document the product primarily through **OpenAI Codex**, with minimal manual coding.

---

## 1. Founder / Builder Context

- **Builder:** Anshuraj Baruah, based in India; roughly 4.5 years of growth, GTM, product positioning and business operations experience.
- **Current objective:** Build a second standout PM/APM/Product Growth portfolio project that demonstrates problem discovery, human-centered interaction design, technical execution, experiment design, measurement and product decisions. A business or service can be considered **later**; it is not a requirement now.
- **Existing portfolio project:** **Griot**, a browser context-recovery extension based on the user's firsthand frustration: after leaving or closing many browser tabs, he forgets what he was doing and wastes time reopening them to reconstruct context. K’ab must be a distinct project.
- **Time box:** Approximately **13 days in total** for final discovery, strategic scoping, building, tests, release and the portfolio case study.
- **Implementation preference:** **OpenAI Codex only** for building and iteration, not Lovable, Bolt or Claude Code.
- **Distribution preference:** Public, open-source, immediately usable on a website or mobile browser without registration, uploads, company integrations or a sales conversation.
- **Design bar:** Polished, simple, premium product experience; genuine user benefit, not an LLM wrapper, generic calculator, directory, atlas, thin audit report or a pretty but fake demonstration.

## 2. Name and Cultural Meaning

**Chosen product name:** **K’ab** (retain this typography, including the apostrophe-like mark). ASCII fallback for filenames, URLs and compatibility: **K'ab**; use **Kab** only where punctuation is technically prohibited, not as the intended brand name.

- **Language and origin:** Yucatec Maya (Maya t’aan), Yucatán/Mexico.
- **Meaning:** *Hand*, *arm* and *forearm*. The Universidad Autónoma de Yucatán dictionary lists **K’AB: “Mano, brazo, antebrazo, pata de animal”** and also meanings such as handle and tree branch.
- **Pronunciation:** Often approximated for English speakers as **“k’ahb”**. This is only a rough guide: the initial **k’** is a glottalized/ejective consonant, not the same as ordinary English *k*. Do not present the approximation as exact phonetics or erase the contrast.
- **Why it fits:** The product is about physical human touch, reach, hands, control, accessibility and how the interface meets the body.
- **Brand identity status:** Name chosen; logo, final palette, typography, domain and trademark **not** finalized. A prior ReachShift concept mockup used warm off-white, dark navy, mint green for easy reach and coral for difficult reach; those are inspiration, not an approved brand system.
- **Cultural care:** Attribute the Yucatec Maya origin accurately. Avoid treating ancient Maya symbolism as generic decoration; do not appropriate sacred motifs or glyphs without responsible research.
- **Availability risk:** The name has **not** been legally cleared. Preliminary web searches found similarly spelled brands, including K’ab Juun and KaabAPP. Do not assume trademark or domain availability.

**Language source:** Universidad Autónoma de Yucatán, dictionary, https://www.mayas.uady.mx/diccionario/k_glotal_maya.html

---

## 3. The Problem, Not the Solution

**Observed human issue (broadly established):** Modern smartphone screens can be difficult to navigate one-handed, especially when frequent controls sit near the top or opposite corner of a large display. Grip, handedness, hand dimensions, disability, device size, posture and task context vary.

**Likely behaviors to investigate:**

- Stretching the thumb or rotating the wrist.
- Shifting the phone's grip, using the other hand, or changing how the device is held.
- Repeatedly reaching for distant primary actions or back/close buttons.
- Accidental taps, hesitation, fatigue, frustration, or avoidance of a control.

**Unverified assumptions requiring user research:** These behaviors are frequent enough to matter in the user's everyday tasks; people want an interface to adapt rather than using built-in one-handed mode; adaptation improves comfort or performance; calibration is worth the effort; developers/platforms would eventually adopt an integration.

**Fundamental problem statement:** **Mobile interfaces often assume a uniform interaction geometry even though physical reach is personal.**

**Desired emotional outcome:** Replace stretching, awkwardness and frustration with effortless control and a feeling that the interface responds to the person.

**Core product question:** **Can a simple, user-controlled, reach-informed layout make real mobile tasks easier than a standard static layout?**

## 4. Existing Alternatives and Honest Differentiation

The problem and parts of the solution **already exist**. Do not claim K’ab invented one-handed use or adaptive interfaces.

| Alternative | What it does | Difference K’ab proposes to explore |
| --- | --- | --- |
| Apple **Reachability** | Temporarily lowers the upper part of the iPhone screen. | Adapt selected action placements, not move the entire visible area. |
| Samsung **One-handed mode** | Shrinks/moves the whole display. | Personalize individual controls within an app, rather than scaling all content. |
| Android **One-handed mode** | Brings the top portion of the interface down. | Test proactive, explicit, per-user layout changes. |
| Thumb-zone checkers / UX tools | Estimate reach zones using device size, handedness or fixed heuristics. | Collect actual interaction events and compare task outcomes, not only display a score. |
| Academic research **PreTap** (2026) | Uses motion signals and an on-device model to infer individual reachability and predict taps for adaptive mobile UI. | Much simpler, opt-in, browser-native interactive prototype; do **not** claim equivalent intelligence or accuracy. |

**Initial proposed differentiator:** A free, browser-based, first-hand experiment combining *personal calibration → visual reach estimate → safe adaptation of a real-looking task interface → measured standard-versus-adaptive comparison*.

**Important caveat:** This is a **portfolio product-feature hypothesis**, not proven whitespace or a defensible company. Existing research approaches may be substantially more advanced. Customer acquisition and willingness to pay are not validated.

References:

- Apple: https://support.apple.com/en-in/guide/iphone/iph145eba8e9/ios
- Samsung: https://www.samsung.com/us/support/answer/ANS10001927/
- Android: https://support.google.com/accessibility/android/answer/12652418
- PreTap research (HKUST): https://researchportal.hkust.edu.hk/en/publications/pretap-implicit-reachability-analysis-and-tap-prediction-for-one-/

---

## 5. Users, Jobs To Be Done, and Adoption

### Primary user for the MVP

An ordinary smartphone user who sometimes operates a relatively large phone with one hand and wants to experience whether a reach-adapted interface feels easier.

**Job:** *When I'm using my phone one-handed, help me reach important actions with less awkward effort without losing control or becoming confused.*

### Secondary user

Product designers, UX researchers, accessibility designers and mobile developers evaluating one-handed interaction patterns.

**Job:** *Let me see and test a personalized interaction pattern so I can make better layout decisions.*

### Potential future buyer (not MVP)

An app company or device manufacturer seeking better ergonomics and lower task friction. The commercial relationship would require real-world evidence that K’ab improves measurable product outcomes, including adoption, task success or accessibility. We have none yet.

### Distribution principle

A user visiting K’ab's own website must get a useful, hands-on experience **before any signup, integration or sales process**. This principle was emphasized repeatedly after rejecting a previous product concept, ProofSwitch, because it required the business customer to integrate a testing widget before experiencing value.

---

## 6. MVP Product Experience

**Form factor:** A mobile-first public web app (optionally installable as a PWA later). It should run on actual iPhone and Android browsers. Desktop may show a product explanation and QR code directing visitors to test on a phone, but a desktop mouse demo is **not** a valid substitute for real thumb testing.

### Stage A — Discover and choose

Landing page: **“An interface that fits your hand.”** One clear CTA: **“Try it on your phone.”** No form, account, file upload or AI prompt. User can select left or right hand and is instructed to hold the phone naturally and use one thumb.

### Stage B — Calibrate

Show about nine neutral, adequately sized touch targets distributed across the screen. Ask the participant to tap them in a clear, controlled sequence, ideally with repeats and randomized ordering. Record:

- Target coordinates normalized to viewport dimensions.
- Actual touch coordinates and touch pointer type, where exposed.
- Target presentation time and successful tap time.
- Off-target taps or unsuccessful attempts observable within the page.
- User's optional report of difficult reach or grip adjustment.

**Do not falsely infer** thumb length, hand size, pain or actual grip changes from basic browser taps. A completed tap does not prove it was comfortable. Keep targets neutral-looking during calibration so coloring does not bias the user.

### Stage C — Understand

Display an **estimated** reach/comfort map with three descriptive zones: **Easy**, **Stretch**, **Hard**. Make clear that it is based on this short experiment and user input, not medical measurement. Allow correction or repeating calibration.

### Stage D — Experience

A working, fictional mobile shopping or checkout flow serves as the demonstration environment. Present two functionally equivalent layouts:

1. **Standard:** Familiar fixed control placement.
2. **K’ab:** Reposition high-frequency actions—such as Continue, Back or primary navigation—toward estimated comfortable reachable zones, preserving labels, functionality and visual hierarchy.

Users complete the same type of task in each layout. Keep layout fixed **during** a task; do not move buttons at the instant a user intends to tap. The person must be able to inspect, choose and revert layout modes.

### Stage E — See an honest result

Show the user's actual:

- Task completion time per layout.
- Missed or off-target taps per layout.
- Short comfort rating and preference.
- Clear note that one brief test cannot prove a universal improvement.

If K’ab performs worse, **show that**; the result is as valuable to the research as a positive outcome.

**Time to first useful interaction:** Immediate. **Time to first meaningful before/after result:** Aim for roughly 1–3 minutes, to be tested—not an asserted performance fact.

### Explicitly out of scope for the MVP

- Reorganizing the whole iOS, Android or Samsung interface.
- Automatically changing arbitrary third-party apps or websites.
- Installing an extension to monitor all browsing.
- Camera/microphone recording, sensitive data collection, external accounts or uploads.
- ML prediction of hand movement, hand-size detection or body measurements.
- Live website integration, general adaptive SDK, server dashboard or a subscription plan.

---

## 7. Core Technology Plan

**Build with OpenAI Codex**, preferably:

- **React + TypeScript**, using a lightweight Vite app or Next.js if justified. Simplicity is preferred.
- CSS responsive layouts and small tasteful animations; avoid adding complex engines.
- **Pointer Events / Touch Events** for coordinates, timing and input classification in the controlled demo; respect browser scrolling and accessibility.
- **Simple deterministic rules**, not LLM inference, to choose among a limited set of predefined safe action placements. For example, use a bottom-aligned primary CTA and hand-side-aware positioning when comfortable, respecting safe areas, minimum tap sizes and content context.
- Browser `localStorage` or in-memory state for local-only test data and opt-in persistence. No backend necessary for the first version.
- Public HTTPS deployment on Vercel, Cloudflare Pages or similar, with a public GitHub repository, README, license, limitations and reproducible tests.

**Browser reality:** Web applications can measure pointer/touch events inside **their own page**, but cannot rearrange the entire device OS or deduce actual grip changes from those events alone. iOS/Android system-wide features would require different permissions, privileged platform work or manufacturer involvement.

**Do not use an LLM API** as the core. The novel experience is physical interaction, deterministic adaptation, visual comparison and verifiable user performance.

Web API reference: https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events/Using_Pointer_Events

---

## 8. Validation and Experiment Design

### Discovery questions to answer before polishing

1. Do people actually struggle with high-frequency top-corner actions while holding their own phones one-handed?
2. Do they prefer repositioning a few controls over shrinking the whole screen or changing grip?
3. Is a short calibration sufficiently easy and understandable?
4. Does an adapted layout help with **comfort**, **speed**, **mistake rate**, or some combination?
5. Is moving controls confusing or harmful to muscle memory? Are left/right-handed results materially different?

### Primary MVP study

- Recruit **at least five** people across different hands, phone sizes and grips where practical; these are **exploratory usability tests**, not a statistically representative study.
- Use their **actual phones**, not desktop emulators.
- Ask about existing one-handed frustrations **before** showing the solution, to reduce leading questions.
- Run equivalent tasks in standard and adapted modes.
- **Counterbalance order:** Some users should try standard first, others K’ab first, to reduce practice effects.
- Preserve task structure, target labels and button sizes as much as possible; change only intended layout attributes.
- Record completion time, off-target taps, observed hesitation, participant comfort ratings and qualitative comments.
- Record cases where adaptation makes outcomes **worse**.

### Metrics

- **Primary:** Within-user difference in successful task completion time and comfort ratings between standard and adapted modes.
- **Guardrails:** Off-target taps, confusion or accidental actions, completion failures, calibration dropout, participant preference, accessibility regressions.
- **Success condition (working decision rule, not proven):** Most participants prefer or objectively perform at least as well in K’ab, with a meaningful signal of comfort improvement and no serious increase in errors. Agree on thresholds before testing; do not manufacture a success percentage.
- **Failure / pivot signal:** Calibration takes too much time, the rearrangement disorients users, no measurable or perceived benefit emerges, or the web browser cannot observe the required behavior reliably.

The core evidence should be honest before/after data and video/screen capture **only with explicit participant permission**. No public saving or sharing of identifiable participant records by default.

Product discovery reference: https://maze.co/guides/product-discovery/

---

## 9. The 13-Day Execution Roadmap

| Day | Deliverable |
| --- | --- |
| 1 | Consolidate this product brief; conduct focused competitive review and 2–3 problem conversations; define outcome measures. |
| 2 | Codex-built working mobile touch test on a real phone. **Technical feasibility gate.** |
| 3–4 | Reliable calibration interactions, touch timing, error logging, local state and accessibility basics. |
| 5 | Estimated reach-map visualization with explicit limitation notices. |
| 6–7 | Two usable versions of one realistic task flow: standard and reach-adapted. |
| 8 | A/B comparison sequence, counterbalanced ordering and honest results screen. |
| 9–10 | Usability tests on actual devices with at least five people; record surprises and failures. |
| 11 | Fix the biggest observed interaction problem and any accessibility or browser bugs. |
| 12 | Publish the live website and open-source repository; README, tests, known limitations, mobile QA. |
| 13 | Publish a crisp PM portfolio case study: problem → alternatives → hypotheses → decisions → build → actual results → what changed. |

**Do not wait until Day 13 to discover whether the touch-calibration concept works.** If Day 2's prototype is not convincing, modify the scope early.

---

## 10. Product Strategy: Now vs Later

### Now — Portfolio MVP

One accessible standalone interaction, using the person's phone, providing immediate first-hand value and an honest before/after comparison. No monetization requirements.

### Next — Open-source component (only if tests support it)

An opt-in React component or lightweight SDK to place a known set of high-frequency actions in user-preferred reachable areas. Developers could embed it into an app and give their visitors an adaptive layout option. It **would require integration by those developers** and should not be described as zero-install system-wide adaptation.

### Long-term — Device/platform feature (speculative)

Personalized one-handed ergonomics at OS or UI-framework level, potentially relevant to Apple, Samsung, Android, tablet or kiosk ecosystems. Real deployment would require platform cooperation, stronger accessibility standards and substantial behavioral research. Interest from manufacturers is **not validated**.

### Business options (not commitments)

- An open-source UI interaction component for designers/developers.
- A usability/research tool to test mobile action placement.
- A commercial adaptive-layout integration or service for selected apps.

All three require independent demand validation. Do not invent revenue projections or imply purchase intent merely because the prototype looks impressive.

---

## 11. UX and Ethics Principles

1. **Human-first:** The user controls adaptation. Do not silently move familiar controls during an action.
2. **Reversible:** Always allow standard layout and reset calibration.
3. **Accessible:** Adequate tap areas, contrast, keyboard/screen-reader considerations where applicable, reduced-motion preference, understandable labels.
4. **Private by default:** No camera, microphone, biometric identity inference or network transmission of touch traces in the first version.
5. **Scientifically humble:** Label estimated comfort maps honestly. Short task differences are exploratory findings, not clinical or population claims.
6. **Real functionality:** Taps and tasks must execute actual code; avoid prerecorded animation or fabricated progress numbers.
7. **Low friction:** No registration, file upload or third-party integration before an ordinary user can try the core feature.
8. **Culturally respectful:** Treat the name's Yucatec Maya origin accurately; avoid turning cultural identity into decorative stereotypes.

---

## 12. What Has Been Decided vs What Has Not

### Decisions made

- Product name **K’ab** replaces **ReachShift**. Refer to ReachShift only when explaining history.
- Main idea: personal one-handed reachability and limited, opt-in adaptive placement of UI controls.
- Main artifact: public mobile-first website with interactive calibration, reach map and before/after task comparison.
- First release: independent open-source PM portfolio project, not a fully integrated OS feature or startup.
- Build using OpenAI Codex and minimal dependencies.
- Ship and test within approximately 13 days.
- No LLM wrapper, static calculator, generic report, signup gate or required upload.

### Not decided / not proven

- Exact scope of the physical comfort survey and touch-adaptation algorithm.
- Final brand identity, logo, domain, trademark and final typography.
- Whether adapted controls outperform standard layouts in actual tests.
- Whether users would enable adaptation persistently in real applications.
- Whether an SDK or commercial service has demand.
- Whether any device manufacturer would be interested.

---

## 13. Suggested Immediate Work in the New Chat

1. Finalize a **one-page PRD** and the exact functional behavior of the three screens.
2. Choose **one realistic mobile task** (such as moving through a simple mock checkout) and lock a measurable baseline.
3. Define precisely what pointer events measure and what needs a direct user comfort question.
4. Write a **Codex-first master build prompt** with component structure, acceptance criteria and mobile test instructions.
5. Build the **Day 2 technical spike first**: a live phone touch calibration and two reversible button layouts.
6. Test on an actual phone and decide whether to continue before polishing visuals.

### Suggested opening message for the separate K’ab chat

> We are continuing **K’ab**, formerly ReachShift. Treat this document as our canonical product context. The name is finalized. Our goal is to design, build, test and release a credible open-source, mobile-first human-computer interaction MVP within 13 days using **OpenAI Codex only**. Do not restart ideation, introduce a generic AI calculator or assume we can modify iOS/Android system UI. Begin by critically confirming the key hypotheses, proposing the exact first-touch experience and writing a focused Day 1–2 Codex implementation plan. Help me make explicit product decisions and record the evidence as we proceed.

---

## 14. Source Notes and Cautions

- **Yucatec Maya meaning:** Universidad Autónoma de Yucatán dictionary, https://www.mayas.uady.mx/diccionario/k_glotal_maya.html
- **Apple Reachability:** https://support.apple.com/en-in/guide/iphone/iph145eba8e9/ios
- **Samsung One-handed mode:** https://www.samsung.com/us/support/answer/ANS10001927/
- **Android One-handed mode:** https://support.google.com/accessibility/android/answer/12652418
- **Academic prior art:** PreTap research, HKUST, https://researchportal.hkust.edu.hk/en/publications/pretap-implicit-reachability-analysis-and-tap-prediction-for-one-/
- **Web implementation API:** MDN Pointer Events, https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events/Using_Pointer_Events
- **Product discovery:** Maze, https://maze.co/guides/product-discovery/

**Date/context caution:** Tool features, OS restrictions, competitors, domains and brand registration may change. Verify the specifics before shipping or making public comparative claims. This file records the current strategy and open hypotheses; it does not assert proven product-market fit.

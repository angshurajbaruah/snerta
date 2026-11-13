# K’ab — discovery, real-device QA and exploratory study protocol

**Study status:** not begun for the **fresh Claude Code build**. No participant responses, usability outcomes or comfort improvements have been measured. Prior project's test logs are inapplicable.

## A. Discovery before solution exposure

Aim for 2–3 short unbiased problem conversations before a polished release. Ask:

- “When do you use your phone with one hand?”
- “Tell me about the most recent time a control was hard to reach—if one comes to mind.”
- “What were you trying to do, and what did you do instead?”
- “Have you used your device's built-in one-handed mode? Why or why not?”
- “How annoying was that instance? Did it change how you used the app?”

Avoid “Would you love a personalized layout?” or implying discomfort is mandatory. Preserve verbatim observations, including “I don't have that problem.” Do not ask for personal medical history, biometric measures or identifiers.

## B. Technical QA on real phone before human study

Use actual physical devices, not only desktop emulation. Record phone model/browser/OS voluntarily at a non-identifying level, viewport size, build commit/identifier, hand chosen and tester initials/code. Mark each outcome PASS / FAIL / PARTIAL / NOT TESTED.

- Welcome/hand screens align with approved designs, legible at widths 320/375/390/430 CSS px.
- Black pill CTA visible above bottom browser chrome/safe inset; back navigation accessible.
- Touch grid contains 9 active target positions repeated twice; one physical tap increments only once; inactive panel taps are observations but not successes.
- Export coordinates have normalized panel geometry, pointer type and plausible latency; no fabricated user metrics.
- A mid-calibration rotation, browser page hide, viewport width change or zoom is managed without mixing geometries.
- Right and left hand produce corresponding *reversible* lower rail, not arbitrary button moves.
- At least 44px UI touch areas, 52px calibration hit bounds, visible keyboard focus and enough contrast.
- No overlap with product scrolling, rail, confirm CTA, browser chrome or device home indicator.
- Real trial clocks begin on Start and stop on Confirm before rating; correct order/ratings exported.
- Standard and K’ab each work with all 4 fictional actions. Unfavorable results render normally.
- 200% zoom/reduced motion, interrupted tasks, stop/restart, export and reset behave as declared.
- Where available, test VoiceOver/TalkBack as well as screen reader and keyboard focus; do not claim verified accessibility merely from code review.

Test specifically in **iPhone Safari and Android Chrome** when possible. Document known defects with reproduction steps. Do not conduct a participant study using a broken instrument and pretend the data is clean.

## C. Five-person exploratory usability study

### Sample and order

Five people using their own phones one-handed; try different phone sizes and left/right usage where practical. This is exploratory, not representative or statistically conclusive.

| Participant ID | First mode | Second mode |
|---|---|---|
| P01 | Standard | K’ab |
| P02 | K’ab | Standard |
| P03 | Standard | K’ab |
| P04 | K’ab | Standard |
| P05 | Standard | K’ab |

Use a fixed tested build across the study. If a significant bug fix changes the experiment, record the version and distinguish rounds rather than silently combining evidence. Participants may stop or change grip; never encourage uncomfortable stretches.

### Session outline (~15–20 minutes as a guide, not a measured result)

1. **Pre-solution discovery:** recent one-handed behavior; no leading pitch.
2. **Consent and explanation:** page-only test, no real purchase; touch samples are not biometrics or proof of thumb use; anonymous notes optional; no recordings without separate permission.
3. **Calibration:** one-hand natural grip, 18 targets, record failure/hesitation and skip; explicitly report each zone Easy/Stretch/Hard/Unknown. Observe behavior without coaching.
4. **Interpretation:** “What do you think this map means?” and “What do you expect Apply to change?” Note confusion before correcting.
5. **Neutral preview:** inspect reversible Standard/K’ab controls without telling them which should be better. Give comparable exposure.
6. **Trial A and B:** “Add this item to the bag, open Bag, continue and confirm the pretend order.” Start clock only when participant presses Start. No think-aloud prompting while timed. If stuck or uncomfortable, offer help/stop, record assistance/failure separately. Rate comfort 1–5 after each completion.
7. **Debrief:** “Which did you prefer, if either? What surprised you? Did you look for a moved control? Did you change grip? Was calibration worth it? What should never move?” Record neutral/negative preference.
8. **Only with consent:** export JSON to private researcher storage, never commit populated session records or identifiable notes to public repo; reset in-memory state and explain exported files aren't deleted by reset.

### Measures and interpretation

- Primary: for valid pairs, K’ab task time minus Standard (positive = slower), K’ab comfort rating minus Standard (negative = less comfortable).
- Guardrails: completion failure, observed wrong action, non-action touches (not confirmed misses), user-reported confusion, assistance, grip-adjustment answer, calibration dropout, disorientation and unsafe placement.
- Include ALL attempted participants in a completion/failure summary. Distinguish complete, assisted, interrupted, invalid or non-touch runs.
- Show individual outcomes and medians only for comparable complete pairs with the valid n. No imputed times or invented ratings.
- Track which mode was shown first. Item differences, learning effect, practice and familiarity limit interpretation.
- Treat a serious repeated confusion/overlap/unsafe stretch as a stop-and-fix signal even if median task time looks faster.
- No statistical significance / general public claims from 5 participants. A neutral or failed experiment is a valuable product-learning outcome.

## D. Decision thresholds — establish before testing, don't retrofit

Provisional qualitative gate: users can complete the experience safely and understand the map without a critical misconception; most who complete both comparisons do not report serious disorientation or control interference. Any meaningful pattern of comfort benefit should be described with observed words/scores and qualifiers rather than a manufactured success percentage.

If calibration takes too long, is confusing, or does not yield usable understanding, simplify or allow easier opt-in controls. If adaptation increases errors/forces searching, consider an optional anchored rail or user-pinned location instead of claiming personalization. If the premise lacks user urgency, say so and record an evidence-based pivot/no-go decision.

## E. Blank session worksheet (keep privately; don't commit populated copy)

```text
Participant code:
Date (optional), device/browser/viewport:
Researcher:
Assigned trial order and actual order:
Before-demo problem example (participant words):
Calibration completion / skip / restart / interruptions:
Zones and comments (self-report, not inferred):
Standard: completion? task duration? comfort 1–5? assistance? notes?
K’ab: completion? task duration? comfort 1–5? assistance? notes?
Non-action touches (not automatically errors):
Grip changes (participant report):
Preference: Standard / K’ab / No preference / not answered
Surprises / confusion / accessibility issues:
Exact quote or observation (distinguish clearly):
What would falsify our hypothesis here?:
Data consent/export status, agreed private retention/deletion:
```

## F. Release & case study

After device QA and exploratory study, propose an evidence-based decision: ship as open-source interactive research tool, simplify feature, or stop. Validate artwork rights, accessibility and public claims. Future website, domain/trademark research and GitHub publishing require separate user approval.

Portfolio case study structure: **firsthand problem / alternatives / user discovery / falsifiable hypothesis / key tradeoffs / design and build / measurement decisions / tested outcomes (including negative) / what changed / next questions.** No invented testimonial or product-market fit claim.

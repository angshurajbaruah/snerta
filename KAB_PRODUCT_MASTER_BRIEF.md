# K’ab — comprehensive product, strategy and design context

**Owner/founder:** user. **Status:** product concept selected; fresh Claude Code engineering implementation from 12 Nov 2026. **Intent:** a working, open-source, research-grounded PM/APM portfolio product—not a fake prototype, paid SDK, or OS feature. **Original project time box:** approximately 13 days; restart the implementation clock for this clean build if workable, not the discovery/identity decisions.

## 1. The point of K’ab

**One-liner:** K’ab is a mobile-first interactive experiment exploring whether a touch interface can adapt selected controls to an individual person's **self-reported comfortable reach**, instead of making everyone use the same control geometry.

**Public tagline (approved):** *A more reachable interface*.

**Underlying problem:** smartphone touch interfaces often use uniform placements even though one-handed reach differs with hand preference, device size, grip, posture, context, mobility and task. Frequent upper-edge or opposite-corner actions can require awkward stretches, grip changes, a second hand or deliberate pauses. This is a real design consideration, but we have **not established its prevalence, impact or solution effectiveness for our target sample**.

**Core hypothesis:** An explicitly chosen, reversible repositioning of selected frequent controls might make certain one-handed mobile tasks more comfortable or quicker for some people without introducing confusion/errors.

**Not a claim:** “K’ab knows your hand size,” “automatically optimizes all apps,” “proven to reduce pain,” “better than reachability,” or “partnered with Apple/Samsung.” None is established.

**Desired user reaction:** “The interface meets me where my hand naturally is,” rather than forcing a stretch. A negative or neutral test is equally valid evidence.

## 2. What the user needs to achieve with the project

A polished public, open-source, no-login mobile website that a person can try immediately using a real thumb. It should embody **problem discovery, differentiated product judgment, HCI design, working code, measurement, transparent UX decisions and an honest before/after result**. It is intended as a second portfolio-quality product distinct from Griot, a browser context-recovery project. Do not attach K’ab to past companies/projects or mix in unrelated goals.

The builder wants Claude Code to perform implementation with minimal manual coding. Avoid dependence on integrations, users installing extensions, uploading files, buying a service, negotiating business accounts, paid APIs or expensive instrumentation just to experience first value. Open source and no registration are important.

## 3. Product origin and terminology

**Name:** `K’ab` (apostrophe retained in visible copy). Yucatec Maya (Maya t’aan); “hand/arm/forearm” among dictionary meanings. Rough English pronunciation “k’ahb” is approximate and does not reproduce the ejective/glottalized initial consonant. Source from UADY dictionary: `https://www.mayas.uady.mx/diccionario/k_glotal_maya.html`.

**Cultural responsibility:** credit the actual language, avoid inventing a Mayan glyph, sacred motif or pan-Maya stereotype. Trademark/domain rights have **not** been legally cleared. Filename/URL ASCII may use `kab` or `k-ab`, but public brand must say K’ab.

Former working name **ReachShift** is historical only. Do not display it as the product or re-open naming.

## 4. Primary and secondary users

**Primary:** ordinary smartphone users, particularly people using large touchscreens with one hand. They may sometimes have difficulty reaching frequently used controls. Avoid assuming all users experience this or have the same anatomy or handedness.

**JTBD:** *When I use my phone with one hand, help me access important actions with less awkward effort, without confusing me or taking away my control.*

**Secondary:** mobile designers, product teams, UX researchers and accessibility-aware developers curious about interaction patterns and evidence. The website should provide an experiential test, not only a calculated thumb-zone image.

**Speculative later buyer:** app company or mobile platform seeking improved one-handed ergonomics. No evidence of willingness to pay, integration demand or platform interest exists yet.

## 5. Problem discovery and falsifiable assumptions

Likely behaviors to investigate, not assert as established user evidence:

- stretching thumb or rotating wrist;
- shifting grip, using another hand;
- hesitating, accidental activations, avoiding upper-corner functions;
- users coping through OS reachability modes or simply accepting friction.

Before showing K’ab, ask people about a *recent specific instance* of one-handed discomfort, what happened, what they did, whether it matters, and what workarounds they actually use. Accept “I don't have this problem.” Avoid leading with the concept then asking if it sounds useful.

**Main assumptions to test:** (a) pain is frequent/important enough; (b) calibration cost is acceptable; (c) moving selected controls is preferable to shrinking/moving the whole display; (d) adaptation does not harm predictability/muscle memory; (e) any comfort gain is not offset by slower tasks/errors.

## 6. Existing solutions and honest differentiation

| Alternative | What it already provides | What K’ab tests differently |
|---|---|---|
| Apple Reachability | Brings upper screen region downward | Controlled rearrangement of a few app actions, not shifting whole display |
| Samsung one-handed mode | Scales/moves visible content | Explicit per-page change to defined controls |
| Android one-handed mode | Moves top region into reach | Personal choice and evaluation of particular placements |
| Thumb-zone guides | Visual ergonomic estimation/heuristics | Recorded tap behavior + self-report + functioning before/after tasks |
| Research such as 2026 PreTap | Sophisticated reachability/tap prediction | Much simpler opt-in browser prototype; do not imply equivalent modeling |

K’ab does not invent one-handed interface adaptation. The differentiator is a **firsthand, measurable, reversible, public experiment** with no installs or LLM wrapper. Avoid making defensive claims about competitors without current independent verification.

### Key principle

**The browser can report in-page touch events; it cannot infer thumb anatomy or alter the user's entire phone.** Raw tap latency includes visual search, reaction, movement and understanding; it is not purely biomechanical time. A completed tap does not imply comfort. Always ask the participant, then label maps as estimated/report-based.

## 7. Approved identity — these are source of truth

**Read these actual files visually** before writing UI code:

1. `design/references/Kab_Brand_Identity_Approved.png` (name, embossed fingerprint-apostrophe logo, app icon, monochrome palette and Helvetica Neue typography).
2. `design/references/Kab_UI_Flow_Approved.png` (five full mobile mockups, navigation, lower dock, buttons, cards, before/after layout concepts and components).

Their user-approved styling **supersedes** the original 11 Nov strategy note that logo/typography was undecided. Their tagline “A more reachable interface” supersedes the older working copy “An interface that fits your hand.” The latter can appear in internal hypothesis statements but should not replace the public tagline.

### Logo/wordmark

- Wordmark: a bold black “K” followed by a sculptural apostrophe/swirled fingertip mark and “ab”. The mark has many nested/fingerprint grooves, a rounded upper volume tapering into a curved, pointed tail, realistic embossed off-white/gray shading, soft highlights and subtle ambient shadow.
- App icon: the **same** sculpted mark centered on a large gently raised, rounded square, off-white/pale silver backdrop, soft realistic shadow.
- Source artwork **must not be replaced** with an unrelated fingerprint SVG, hand emoji or generative stock icon. The included `brand-assets/kab-fingerprint-crop.png` and `brand-assets/kab-embossed-app-icon.png` are crop references drawn from the original approved images; both are raster crops, not master transparent scalable vector files.
- If the raster crop produces an unattractive halo/rectangle against an actual UI surface, make a careful crop/mask refinement *for implementation fidelity* while retaining recognizable shape and seeking approval for significant visual redesign.

### Palette & typography

**Strictly grayscale:** #141414 near-black/charcoal, mid-gray, silver, #f7f6f6 off-white. These are approximate CSS seeds; image board pixels are the ultimate visual reference. Avoid blue/mint/coral/red/green accents (even in status callouts). Use gray scale contrast and text for accessibility, never color alone.

**Helvetica Neue** regular/medium/bold with system fallbacks: `"Helvetica Neue", Helvetica, Arial, sans-serif`. Do not ship font files or imply universal Helvetica Neue availability. Spacious near-black headings, modest muted gray description, black primary pill CTAs, lightly elevated/inset rounded cards, calm gradients and gentle 3D shadows.

**Design mood:** premium, refined, minimal, visually closer to high-quality Google product simplicity with Apple-like tactile depth. Not cyberpunk, neon, noisy glassmorphism or decorative ancient-glyph aesthetic. The mark is the cultural signature; do not add sacred Maya-looking decorations for effect.

### Visual anatomy from mockups

- Welcome: small K’ab top left; floating mark around upper-middle; dramatic “A more reachable interface” lower-middle; description; bottom black “Get started” pill.
- Hand selection: left/back and subtle three-part progress strip; question “Which hand do you usually use?”; two tactile Left/Right selectable cards with hand-outline illustrations and visible black selection check; bottom Continue pill.
- Calibration: “Let's find your natural reach”; inset pale rounded panel with three-by-three silvery raised dots, one highlighted dark dot, finger in concept image; bottom Continue after successful test.
- Map: “Your reach map”; grayscale zone interpretation within rounded phone-like container; small legend; bottom “Apply to my interface” pill. **No unsupported precision/anatomical heatmap**.
- Ready: dark circular check emblem, “You're all set!”, concise three-feature card and bottom “Explore K’ab” pill.
- Add-on areas: lower action dock, Standard vs With K’ab comparison and component examples. Implement full functional comparison/results screens in the same language even though they were not illustrated as complete phones.

### Text in approved art that requires scientifically honest correction

- In calibration, replace “tap the dots that are comfortable” with neutral instruction to tap **every highlighted dot**, then ask how each region felt (otherwise calibration is biased).
- Do not write that reach map is “based on your hand size” because no hand-size sensor is used. Instead: based on short taps and what you reported.
- Do not say K’ab automatically adapted the **whole phone**. This app only rearranges selected buttons **inside its own fictional shopping demo**.

## 8. User experience and desired outcome

The first use should feel immediate, personal and engaging without signup, uploads or camera access. The first meaningful result should plausibly appear in around 1–3 minutes once optimized; this remains a **target to test, not a measured fact**. After trial completion, results may honestly show K’ab is slower, less comfortable or confusing, or that no meaningful difference was observed.

The person must always understand the UI, maintain control, revert changes, pause or stop if uncomfortable. Calibrating is not a physical exam, biometric identity capture, medical test or accessibility certification.

Detailed component/function spec: `PRD_AND_SCREEN_CONTRACT.md`.

## 9. MVP boundaries

**In:** mobile browser, both hand choices, 9×2 tappable target sequence, safe event instrumentation, direct comfort self-report, labeled reach map, user-controlled reversible Standard/K’ab layouts, a completely functional fictional checkout flow in both modes, counterbalanced trial order, measured time and touch observations, comfort rating, preference, transparent results, opt-in JSON export and reset, responsive/accessibility basics.

**Out:** editing other websites or operating system UI, Chrome extension, global gesture interception, actual reach radius measurements, cameras, microphones, motion sensors, ML inference, LLM backend, monitoring users, cloud accounts, checkout/payment, SDK monetization, enterprise dashboard and any promise of interest from device manufacturers.

## 10. Research and product measurement philosophy

**Primary:** within-person difference in task completion duration; difference in explicitly self-reported comfort (1–5 scale). **Guardrails:** completions/failures, observed attempts away from controls (not automatically “errors”), user-reported confusion, grip-adjustment self-report, accessibility issues, calibration dropout and layout preference.

Counterbalance initial Standard/K’ab task order across participants, keep functionality/tap-area equivalent; freeze positions during a task, avoid unintended item/learning effects as much as possible. Maintain a complete record of negative findings. At least five people on physical phones for exploratory usability, but **five cannot establish statistical significance or universal benefit**. Include differing devices/hands when practical and note actual coverage.

## 11. Product strategy now/next/later

**Now:** public, free, no-account standalone prototype and credible portfolio case study built on actual user evidence.

**Next only if studies support it:** small opt-in reusable component that lets developers position a limited set of known actions differently within THEIR apps. Any SDK requires explicit developer integration; it cannot adapt arbitrary apps magically.

**Long term speculative:** OS/framework integration with platform cooperation; significantly more technical and accessibility research necessary. Commercial options (research tooling, component licensing, implementation consulting) are not MVP assumptions and need separate demand validation.

## 12. Original roadmap as a scope guide, not a command to rush

| Phase/day | Outcome |
|---|---|
| Day 1 | Consolidate brief, establish missing assumptions and first problem interviews |
| Day 2 | **Real-phone technical spike**: calibrated touches plus reversible two-layout demo |
| Days 3–4 | Robust calibration, instrumentation, self-report, safe restart, accessibility basics |
| Day 5 | Honest reach map |
| Days 6–7 | Functional shopping preview in both layouts |
| Day 8 | Counterbalanced timed tasks and honest result screen |
| Days 9–10 | Five-person exploratory usability sessions, failures preserved |
| Day 11 | Fix biggest observed problem |
| Day 12 | QA, README/license/asset rights, public website only with approval |
| Day 13 | Evidence-led PM portfolio case study |

This 13-day total was aspirational for the original project. Starting over resets engineering progress; it does **not** prove the prototype can be built/tested in any particular duration.

## 13. Ownership, repository and historical project

The user now wants a **new build from scratch with Claude Code**. Earlier Codex work existed at `https://github.com/angshurajbaruah/K-ab` and was reportedly tested (69 automated tests/build logs), but it is **not being continued**. It is historical and no old source, tests, configs or automated-check counts should be imported or claimed for the fresh implementation. Do not delete it. Do not overwrite its GitHub remote.

For a future fresh public repository, user will choose name/visibility and explicitly approve the push. This package can be the initial folder in a **brand-new local repository** if desired. Claude should create a clear implementation decision log and build status so a second chat can compare the latest state without contradictory advice.

## 14. References & provenance

**Original supplied project strategy:** `source-context/Kab_Original_Product_Strategy_2026-11-11.md`. Its old claim that identity is unsettled and that Codex is exclusive is superseded by the subsequent user-approved UI boards and fresh Claude Code decision. Its conceptual hypotheses, boundaries and research safeguards remain important.

**User-approved images:** `design/references/Kab_Brand_Identity_Approved.png`; `design/references/Kab_UI_Flow_Approved.png`.

Original research/background links, recorded for later verification (not new verified claims):
- Maya dictionary: https://www.mayas.uady.mx/diccionario/k_glotal_maya.html
- Apple Reachability: https://support.apple.com/en-in/guide/iphone/iph145eba8e9/ios
- Samsung one-handed mode: https://www.samsung.com/us/support/answer/ANS10001927/
- Android one-handed mode: https://support.google.com/accessibility/android/answer/12652418
- PreTap work: https://researchportal.hkust.edu.hk/en/publications/pretap-implicit-reachability-analysis-and-tap-prediction-for-one-/
- Pointer Events: https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events/Using_Pointer_Events
- Product discovery: https://maze.co/guides/product-discovery/

No domain or trademark is verified clear. Visual images and their derivatives are user-provided, but their rights should not be casually assumed equivalent to the eventual code's open-source license. Avoid bundling proprietary font files.

# K’ab — clean-build PRD and functional screen contract

**Product release scope:** browser-native MVP; React + TypeScript + Vite built fresh with Claude Code. Actual logic must run, not animate a pre-recorded story.

## 1. Primary full journey

`Welcome → Choose hand → Calibrate → Comfort self-report → Reach map → Ready → Shopping preview → Standard/K’ab trials → Honest results → Optional export/reset`

The approved board contains five core first-use phone images. The comfort survey and functional shopping comparison/results are deliberate **additional screens** required for valid measurement. Their styling must derive from the approved five-screen design system.

## 2. Screen contracts

### Screen 1 — Welcome

- Visual: K’ab wordmark upper left; prominent embossed fingerprint icon with subtle float/tactile shading; ample off-white space; lower bold headline “A more reachable interface”; one short line of user benefit; black bottom pill with arrow: **Get started**.
- Behavior: CTA enters hand choice. No account, permission, email prompt or demo video.
- Pass: accessible button, no tiny footer clipped by Safari chrome.

### Screen 2 — Which hand?

- Visual: subtle back arrow/3-part progress, strong question “Which hand do you usually use?”, two separate soft rounded selectable cards with hand line-art, selected checkmark, bottom Continue.
- Behavior: user explicitly chooses Left or Right; selection persists within this session; back works. Selection is preference, not inference from sensors.
- Pass: cards keyboard operable, selected state visually and programmatically distinguishable.

### Screen 3 — Calibration

- Visual: “Let’s find your natural reach”; neutral explanatory copy, inset rounded pale panel with 3×3 raised grayscale dots; one active dot at a time; progress (e.g., `4 of 18`). 52px hit areas around smaller decorative dots; keep panel appropriately large/usable across screens.
- Behavior: exactly two randomized passes over 9 positions, with no immediately duplicated final/first target. One successful activation per valid `pointerdown`; no extra `click`, secondary pointer or held-contact increments. Neutral dots, no hinted green/red easy/hard zones during measurement.
- Record: target ID [0..8], actual rendered target center and pointer position **normalized to the same panel**, timestamp/latency from prompt, pointer type, viewport dimensions. Non-target `pointerdown` observations inside instrumented area only, without claiming they are mistakes. Provide clear stop/restart path. Browser zoom/rotation/width/visibility interruptions must not silently mix incompatible geometry; handle height-only toolbar changes sensibly.
- Provide an accessibility/desktop skip clearly labeled “Preview without touch calibration” (do not treat keyboard or mouse data as actual thumb evidence). Never punish user or imply physical inability.
- Pass: 18 successes exactly; inspect exported measurements on a real mobile device; no phantom touch count; orientation restart is explicit.

### Screen 3b — Comfort self-report (required)

- Visual: continue 3×3 theme; each region can be selected and labeled through text and grayscale state. Explain this asks **how it felt**, separate from objective events.
- Behavior: 9 labels chosen from **Easy / Stretch / Hard / Unknown**; Unknown available and default; optional grip-adjustment self-report Yes/No/Unsure/Prefer not to say. No numerical inference of physical pain. Allow editing.
- Pass: Unknown remains Unknown. User can continue without fabricating classifications.

### Screen 4 — Your reach map

- Visual: approved rounded grayscale map aesthetic, readable legend and clear uncertainty. Reference image uses flowing zone bands, but do not generate curves suggesting anatomical precision without actual validated model. A legible 3×3 map with restrained zones is preferable to a fake biometric heatmap.
- Behavior: shows **self-reported** labels, perhaps separate diagnostic per-zone tap latency with clear qualifier. CTA **Apply to my interface** leads into demo. Ability to edit or repeat survey/calibration.
- Copy: “Based on this short test and how each area felt to you,” not “We measured your hand size.”
- Pass: no inferred comfort from speed. High contrast legends including Unknown.

### Screen 5 — You're all set!

- Visual: floating dark embossed circular check; larger heading; 3-feature rounded list (selected controls moved nearer in a demo / you remain in control / change back anytime); black pill **Explore K’ab**.
- Behavior: proceeds to reversible demo. Copy must clarify **within this page only**.
- Pass: polished approved look, no false OS-wide claims.

### Screen 6 — Working fictional shopping preview

- Visual: restrained monochrome shopping UI; product and bag state; toggle/segmented control Standard versus K’ab; content scrolling; distinguish modes without flashing disruptive shifts.
- Behavior: Standard has functional Back and Bag in top header. K’ab has **same labels, sizes and actions** in bottom handedness-aware rail. User switches explicitly, never automatically mid-gesture. Bag/cart state and checkout stage persist across mode changes. Real buttons, no pretend click animations. Bottom controls must avoid mobile safe-area overlap. Keep high-frequency action positions fixed within a task.
- Note: adaptation is a *safe, deterministic candidate layout* selected from hand preference and self-reports. Do not claim the browser mathematically optimized every button or measured thumb reach radius.
- Pass: Add item → Bag → Continue → Confirm pretend order succeeds in both modes; Standard instantly reversible.

### Screen 7 — Controlled comparison trials

- Visual: same polished shopping interface with a clear task-instructions screen then explicit **Start task**; no hidden automatic timer.
- Behavior: same 4 required actions (Add, Bag, Continue, Confirm) across two equivalent fictional items. Trial 1 mode order randomly selected or explicitly assigned for study; Trial 2 uses the other mode. Freeze mode during trial, don't silently swap. Timing begins only on Start and ends on final Confirm, **before** comfort rating. Record interrupted/unfinished trials as incomplete; don't invent times or coerce a completion. After each successful trial ask 1–5 comfort (very uncomfortable to very comfortable). Use consistent control dimensions, action semantics and distractions. No real purchase.
- Pass: both trial results accurately recorded, with mode, item, duration, comfort and observed non-action touch count; no extra movement during active trial; stops/restarts well defined.

### Screen 8 — Results

- Visual: same rounded grayscale cards and typography. Comparative mode durations, comfort ratings, non-action observations, personal preference (Standard, K’ab or No preference). Simple clear language, including when K’ab performs worse.
- Behavior: Standard and K’ab comparison only if both actual valid completed trials exist; positive duration delta K’ab minus Standard means K’ab took longer; negative comfort delta K’ab minus Standard means K’ab was rated less comfortable. Touches not on action controls are labeled **non-action observations**, not verified “misses.” Show explicit limitations: “Two short trials on one phone cannot establish a universal result.”
- Provide optional JSON export via browser download and **Reset session**. No backend. No invisible analytics upload. Data loss on refresh is honest and acceptable for first version.

## 3. Proposed new-build event/data contract

Implement locally and document schema before evolving it. Suggested names (not inherited code):

```ts
type Hand = 'left' | 'right';
type Mode = 'standard' | 'kab';
type ReachLabel = 'unknown' | 'easy' | 'stretch' | 'hard';

type TapSample = {
  targetId: number;              // 0..8
  pointerType: string;          // 'touch', 'mouse', etc.
  targetX: number; targetY: number;  // normalized [0, 1] to touch panel
  pointerX: number; pointerY: number; // normalized [0, 1] to same touch panel
  latencyMs: number;            // prompt to pointerdown, not physical move time
  viewportW: number; viewportH: number;
  occurredAtIso: string;
};

type Trial = {
  mode: Mode;
  itemId: string;
  durationMs: number; // strictly task start to confirmation
  comfort: 1 | 2 | 3 | 4 | 5;
  nonActionTouches: number;
  valid: boolean;
};
```

Recommended session export additionally includes `schemaVersion`, hand, calibration completion/skip flag, samples, self-reports, grip-change answer, trial order and assigned/random status, interruptions, preference and concise limitations. Generate no stable identity tied to a person or device. If browser returns mouse/pen, mark session as preview, **not** completed actual thumb study. Exact schema is an engineering choice for Claude to implement and test openly.

## 4. Deterministic adaptation — MVP rule

The existing strategy proposes **safe predefined placements**, not machine learning. For this clean build:

- Hand choice determines whether a lower action rail is left- or right-aligned.
- Standard keeps Back/Bag top; K’ab puts Back/Bag lower on the chosen hand side, subject to safe-area and available space.
- When user reports no top difficulty or all Unknown, explain candidly that this is a suggested reversible demo, not a proven optimal personal fit. Do not force a claim of personalization unsupported by selected regions.
- Never reposition checkout Confirm under a finger in-flight. No layout changes during timed trials.
- Preserve page legibility, minimum 44 CSS-pixel hit areas, and identical actions across modes. If an unsafe placement would obscure content, use a safe fallback.

Any more sophisticated inference must first be justified with real evidence; don't add AI just to look intelligent.

## 5. Nonfunctional acceptance criteria

- Responsive 320px, 375×812, 390×844, 430×932 CSS viewport layouts, with safe insets and scrollable content; keyboard navigable except touch-specific calibration; reasonable VoiceOver/TalkBack labels; zoom allowed at 200%, focus visible; `prefers-reduced-motion` supported.
- Side-by-side human check of actual screenshots against BOTH approved boards. Visual fidelity has no value if targets are too small/obscured.
- No cookies/localStorage/remote telemetry by default; in-memory state and explicit JSON export only. Avoid accidental source exposure of user research.
- Run test/build commands with fresh test counts. Never cite historical 69 tests as if this build passed them.
- Explicit `Stop`, `Back`, `Reset` and appropriate interruption behavior; no made-up progress.
- Application uses browser Pointer Events in its page, not native OS APIs or imaginary phone control access.

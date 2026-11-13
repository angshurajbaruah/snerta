# K’ab — from-zero Claude Code engineering and test plan

## Core setup decision

Use **new React + TypeScript + Vite code**, a small CSS design system, in-memory session state and Vitest tests. This is not a migration; **do not import an earlier repository or copy previous components/tests**. Keep the approved image assets and this documentation. Node 24 LTS recommended, but use a compatible installed Node version and report exact versions. No backend; no account.

### Suggested fresh file tree (Claude may refine)

```text
Kab_Claude_Fresh_Start/
  CLAUDE.md
  KAB_PRODUCT_MASTER_BRIEF.md
  PRD_AND_SCREEN_CONTRACT.md
  BUILD_AND_TEST_PLAN.md
  VALIDATION_AND_RESEARCH.md
  design/references/*.png
  brand-assets/*.png
  source-context/*.md
  docs/DECISION_LOG.md           # create during build
  docs/BUILD_STATUS.md           # create during build
  docs/QA_FINDINGS.md            # create during build
  src/
    App.tsx
    main.tsx
    styles/
    components/
    screens/
    lib/calibration.ts
    lib/layout.ts
    lib/experiments.ts
    lib/export.ts
    types.ts
  tests/
  package.json
  vite.config.ts
```

Keep architecture modular only to a sensible degree. No giant framework or heavy UI library needed to achieve the design.

## Milestone 0 — clean project baseline

**Deliverable:** new Vite React TS app, CSS tokens, image assets referenced safely, Vitest configured, new `docs/BUILD_STATUS.md` and `docs/DECISION_LOG.md`, no remote Git push.

**Pass:** fresh dependency install works, app starts locally, `npm run build` passes, a trivial smoke test passes, user can see the real logo crop in browser, clean Git state understood.

## Milestone 1 — feasibility / first phone touch

**Deliverable:** mobile-responsive Welcome → Hand choice → minimal live 3×3 calibration spike and a genuine Standard/K’ab button-placement toggle on a simple demo canvas. Not a static image; interaction logs in memory.

**Technical rules:** one `pointerdown` = at most one valid target activation; normalized coordinates relative to actual touch-panel rect; timings measured using monotonic timestamps where appropriate; touch type recorded honestly; avoid touch/click double event; proper target size.

**Pass:** fresh unit/component tests cover sequence and event guard; able to run on a real phone, or explicitly document missing hardware validation. A mouse demonstration is labeled a preview. Verify controls really shift and remain clickable and reversible.

**Decision gate:** If browser gesture handling or dimensions are unreliable, fix here rather than polishing the full marketing flow.

## Milestone 2 — complete calibration + comfort map

**Deliverable:** shuffled two-pass 18-target experiment, progress/interruptions/reset, optional skip, honest nine-zone self-report and reach map with Unknown support.

**Pass:** correct sample counts and geometry; no speed-as-comfort mapping; accessible labels; orientation/zoom/hide interruptions do not contaminate data; 320px and mobile safari browser layout addressed.

## Milestone 3 — working fictional shopping demo

**Deliverable:** bag/cart/checkout state machine, Standard header and lower left/right K’ab rail for same Back/Bag actions; mode switch preserves state; real Confirm pretend order works.

**Pass:** same tasks completed with both modes, no scrolling overlap or clipping, change is user-triggered and reversible.

## Milestone 4 — controlled trials and results

**Deliverable:** two timed trials, explicit start and stop, counterbalanced starting mode, each action sequence, post-task comfort rating, preference, negative/neutral results, interruption handling, opt-in local export and reset.

**Pass:** valid comparisons only, results based on recorded events, learning/order bias clearly explained, trial layout fixed, no fabricated data.

## Milestone 5 — real-browser/phone QA and refinement

**Deliverable:** actual iOS Safari and Android Chrome sessions where available; compare screenshot captures to approved boards, verify safe areas, 200% zoom, screen reader, keyboard, one-thumb usability and interruption behavior.

**Pass:** no blocking user-flow defects; PASS/FAIL/PARTIAL with device evidence recorded; still no claim of improved comfort.

## Milestone 6 — exploratory research + release decision

**Deliverable:** five participant studies using own phones, balanced order, explicit reporting of discomfort and negative results; analyze observed data; fix biggest problem.

**Pass:** evidence-based product decisions, honest limits and a portfolio-quality story. Public deploy/GitHub publishing only on explicit user approval after brand asset rights review.

## Testing matrix to implement as code (not historical tests)

1. Sequence contains 9 unique zones twice, no immediate duplicate.
2. Normalization rejects invalid/zero rectangles and maps common coordinates correctly.
3. One contact increments once despite click/up and pointer capture behavior.
4. Wrong target, secondary mouse button and held touches do not increment successes.
5. Mouse/pen/keyboard preview never mislabeled thumb-valid.
6. Unknown reports stay Unknown; no timing-driven classification.
7. Orientation/zoom/background restart without combining measurements.
8. Standard↔K’ab switches preserve demo state, same labels/actions and correct hand side.
9. Task start/finish produces real durations; rating time excluded.
10. Trial order controls valid pairing; interruption/duplicate/missing result withholds comparison.
11. Both positive and negative comparative outcomes rendered truthfully.
12. JSON export matches real state; reset clears it; no analytics calls.
13. Interaction and keyboard/a11y controls work with reduced motion and browser zoom.

## Commands (once scaffolded)

```bash
npm install
npm test
npm run build
npm run dev -- --host 0.0.0.0
```

For local-network testing, if the server is truly running on the developer's computer, open `http://<computer-LAN-IP>:5173` on a phone on the same trusted Wi-Fi. A remote sandbox's loopback URL isn't automatically reachable from a physical phone. Prefer a controlled HTTPS preview if remote dev access otherwise blocks testing. Do not present an untested URL as accessible. Public launch is separate.

## Claude Code response contract after every milestone

```text
Milestone:
Source files created/changed:
What works now (demonstrated):
Tests run and exact output:
Browser/physical-device checks actually performed:
Bugs and unverified claims:
Design fidelity compared to provided image boards:
Documents/status updated:
ONE next action:
```

Avoid unsolicited libraries, analytics, OS-level claims and broad pivots. Approval is needed before deployment, public push or material design/strategy changes.

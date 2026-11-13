# K’ab — persistent instructions for Claude Code (fresh implementation)

## Highest priority: intent

The founder explicitly chose to **start a NEW K’ab codebase from zero** on 12 November 2026 using **Claude Code**. Do not clone/copy, bootstrap from, or secretly reuse the earlier Codex project or its `src`, tests, CSS, `node_modules`, build, or CI state. Do not target the existing `angshurajbaruah/K-ab` remote by default. Preserve existing source brief and image files in THIS starter folder; you may add fresh application code beside them.

The **idea, brand and research standards are NOT being restarted**. K’ab remains a mobile-first experiment investigating whether reversible, reach-informed placement of limited controls improves one-handed usability.

## Read before beginning

1. `KAB_PRODUCT_MASTER_BRIEF.md` (vision, people, hypotheses and positioning).
2. `PRD_AND_SCREEN_CONTRACT.md` (exact flow, metrics, requirements and limitations).
3. `BUILD_AND_TEST_PLAN.md` and `VALIDATION_AND_RESEARCH.md` (milestones, QA and research).
4. Open and inspect BOTH `design/references/Kab_Brand_Identity_Approved.png` and `design/references/Kab_UI_Flow_Approved.png` before creating UI. Image references override contradictory approximations in text.
5. `source-context/Kab_Original_Product_Strategy_2026-11-11.md` is an archival original: its Codex-only preference and statements that brand is unapproved have been superseded by the user's decisions.

## Nonnegotiable identity

- Display name: **K’ab**, with apostrophe. Tagline: **A more reachable interface**.
- Sculpted concentric fingerprint/apostrophe emblem, supplied as raster crop and within two approved design boards. Use faithfully; do not replace with a generic fingerprint emoji/stock image.
- Helvetica Neue system stack with licensed fallbacks. Do not include/download/share proprietary font files.
- Strictly black, charcoal, soft silver, grayscale, warm off-white. No colorful status badges, bright accent colors or sci-fi effects. Express errors/status through text and shape, not only color.
- Premium clean product look with lots of whitespace, restrained depth, embossed/ridged mark, gently raised cards, softly inset touch area and black bottom pill CTA.
- Match five reference mockup compositions, but prioritize usable real functionality and truthful scientific wording where reference copy overclaims.

## Product behavior

- This is a website operating within its OWN page; not an iOS/Android OS customization tool.
- Journey: Welcome → Hand selection → 3×3 calibration (9 positions twice) → explicit comfort self-report → honestly labeled reach map → Ready → reversible Standard/K’ab fictional shopping preview → two measured tasks → personal results/export/reset.
- Calibration: neutral targets, 18 successful `pointerdown` activations, avoid `click`/`pointerup` double counting; 44px minimum UI targets, ideally 52px calibration hits. Record target ID, normalized target/pointer positions in a shared panel coordinate frame, `pointerType`, elapsed/prompt latency and viewport. Record non-target touches only **within** observed panel; they are not established misses.
- Browser-reported touch is not proof that a thumb was used. Time is not proof of comfort. Explicit zone labels Easy, Stretch, Hard, Unknown; Unknown remains Unknown. Ask optionally about grip adjustment.
- Standard puts Back and Bag in a header; K’ab moves those *same functional controls* to a lower left/right rail in the fictional app. This deterministic prototype rule is not proof of calibrated optimal placement. User opts in and can revert. Never reposition a target in the middle of an action/trial.
- Each trial completes fictional Add → Bag → Continue → Confirm; no money changes hands. Use the same labels and action steps, counterbalance which mode starts, time only between explicit task start and completion (not comfort rating). Provide negative/neutral outcomes without spin.
- No backend, login, cookies/storage persistence, analytics, AI model, photo/video recording, body measurement, payments or personal identifiers in initial MVP. Keep state in memory and allow explicit opt-in local JSON export. No uploaded participant results in public repos.

## Engineering rules

- Fresh app: React + TypeScript + Vite; minimal dependencies, CSS based on approved images, pure helpers separated from React state, Vitest for tests if suitable.
- Keep code and docs clean, accessible, keyboard-operable (except intrinsically touch-specific measurements, which need a clearly marked skip/preview path), portrait-aware, safe-area-aware, support reduced motion and 200% browser zoom.
- Do not assume existing benchmark/test counts. Write tests for this new implementation, run `npm test`, `npm run build`, and report actual command output. Favor a small early working phone spike over an elaborate static landing page.
- Do not turn unverified events into medical/biometric or hand-geometry claims. Do not fabricate research outcomes, mock them without labeling, or pretend a remote test equals a physical-device test.
- Do not push/create public repo, deploy, change visual identity or assets, purchase services or turn on data collection without explicit user approval. Preserve any uncommitted work and avoid destructive Git actions.

## Session/milestone workflow

1. Read latest in-repo status and decision log if present. Inspect code and git status; do not treat historical Codex logs as new evidence.
2. Name one milestone and measurable acceptance criteria.
3. Build the smallest functioning slice, writing tests and verifying locally.
4. Report what was executed, what requires a real phone, and any blockers. Provide steps to reproduce.
5. Update `docs/BUILD_STATUS.md`, `docs/DECISION_LOG.md` and `docs/QA_FINDINGS.md` when material facts change.
6. Give ONE next prioritized action; avoid unrelated features.

## First work order

Scaffold brand-faithful Welcome + Hand Selection and a functional touch-event feasibility spike. Include a reversible Standard/K’ab placement demonstration; the full mapped comparison follows in later milestones. Do not declare the MVP completed from a visual preview. Test physical browser interaction as early as user hardware access allows.

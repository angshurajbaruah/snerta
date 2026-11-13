# K’ab — Claude Code clean-room project starter

## What this package is

This is a **fresh implementation handoff**, not a continuation of the old Codex codebase. It contains the full product brief, original strategy, visual reference boards, two artwork crops, engineering specifications, validation protocol, and a ready-to-paste first Claude Code instruction. **No previous React app code, `node_modules`, build output, test suite, or Git history is supplied.**

**Decision made 12 November 2026:** Use **Claude Code** as the builder and **start from scratch**. Preserve approved product and visual decisions; discard the earlier code implementation. Original planning documents mentioned Codex and prior repository status. Those are historical and **not** instructions for this fresh build.

### Five-minute setup

1. Extract this ZIP, keeping the entire `Kab_Claude_Fresh_Start/` folder together.
2. Open this folder in Claude Code (local workspace or a new development environment). **Do not clone/import the old `angshurajbaruah/K-ab` project into this directory.** The old repo is optional historical reference only, not a code or dependency source.
3. Claude Code should find `CLAUDE.md` automatically when working from the folder. If not, explicitly tell it to read `CLAUDE.md`.
4. Paste the complete text below as your first message to Claude Code.
5. Have Claude scaffold the new React/TypeScript/Vite app **in this folder**, not in a nested unrelated application folder. Keep reference documents/assets intact.
6. Run it on a real phone early, before committing to a complex UI or adaptation algorithm.

### First message to paste into Claude Code

```text
We are starting K’ab completely from scratch in this folder.

This is a new Claude Code implementation; DO NOT clone, copy, refactor, or continue the old Codex application. The earlier GitHub repository angshurajbaruah/K-ab and its reported tests are historical reference only. I want new source code, tests, app architecture and implementation decisions.

However, the PRODUCT is already decided. The product strategy, cultural name, precise MVP scope, research integrity and both APPROVED brand/UI image boards are locked unless I explicitly change them. Do not brainstorm a replacement product, rename it, introduce AI, or redesign the visual identity.

Before coding, read in full:
- CLAUDE.md
- KAB_PRODUCT_MASTER_BRIEF.md
- PRD_AND_SCREEN_CONTRACT.md
- BUILD_AND_TEST_PLAN.md
- VALIDATION_AND_RESEARCH.md
- source-context/Kab_Original_Product_Strategy_2026-11-11.md
Visually inspect:
- design/references/Kab_Brand_Identity_Approved.png
- design/references/Kab_UI_Flow_Approved.png
Also look at the two images under brand-assets, which are cropped RASTER references, not vector logos.

First give me a concise synthesis of: (1) the problem and research hypothesis, (2) the exact user journey, (3) the locked design direction, (4) technical boundaries, (5) what success/failure would actually mean. Then scaffold the new project using React, TypeScript and Vite with a minimal test setup, and implement ONLY the first functional milestone: responsive Welcome and Hand Selection plus a basic working nine-position touch-test spike (not yet the full polished app).

For the spike, collect one real PointerEvent per valid target activation, record normalized coordinates and prompt-to-tap latency, and demonstrate a clearly reversible Standard vs K’ab placement of two harmless demo controls. This must run on my actual phone; do not claim real-phone testing if no physical device was used. Use the approved UI visual language throughout. Add targeted tests, run npm test and npm run build where possible, and report exact results and limitations.

Do not push to any GitHub repository, buy anything, deploy a public site, change approved artwork, invent participant data, or add backend/analytics without my explicit approval. Do not reuse old tests or say the old 69 passing tests cover this fresh app. Ask for input only when a truly blocking choice is missing; otherwise proceed using documented safe defaults. End with what you built, what you verified, what remains unverified, and the next single milestone.
```

### Package map

- `CLAUDE.md` — persistent project instructions for every Claude Code session.
- `KAB_PRODUCT_MASTER_BRIEF.md` — product identity, discovery, strategic decisions, target users, differentiation, ethics and future options.
- `PRD_AND_SCREEN_CONTRACT.md` — detailed screen journey, behaviors, event/measurement contract, adaptation rules, export and quality requirements.
- `BUILD_AND_TEST_PLAN.md` — clean implementation approach, milestone plan, architecture, testing and acceptance gates.
- `VALIDATION_AND_RESEARCH.md` — initial discovery, phone QA, five-person exploratory research, metrics and how to interpret results.
- `design/references/` — **two original user-approved images**; source of visual truth.
- `brand-assets/` — approved board-derived crops usable as temporary raster references. Do not call them independently designed logo files.
- `source-context/` — the original canonical strategy handoff from Nov 11, preserved for provenance (old implementation-tool decisions overridden).

### What happened to the previous project?

An earlier Codex implementation was committed to `https://github.com/angshurajbaruah/K-ab`. Its historical logs reported 69 passing automated tests, a passing build, and no reported npm audit vulnerabilities, but real-device tests and user research were incomplete. **None of that is evidence for this clean project.** It is intentionally not imported. Do not delete or rewrite that repository unless separately instructed.

### New workflow

**Claude Code builds and reports actual evidence.** The founder decides scope and approves changes. Use project files/commits in the **new** workspace as a sync point. ChatGPT and Claude Code do not share live private chat history. Keep a dated `docs/DECISION_LOG.md`, `docs/BUILD_STATUS.md` and `docs/QA_FINDINGS.md` in the new project.

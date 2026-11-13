# First message for Claude Code — copy the text below

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

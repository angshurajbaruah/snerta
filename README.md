# K’ab — A more reachable interface

A mobile-first, open experiment: can moving a *few* controls toward the hand you hold your phone with make short one-handed tasks feel easier — or not? Runs entirely in the page. No account, no tracking, nothing uploaded.

> Status: early build (Milestone 1 feasibility spike). Not yet tested on a physical phone. No user results exist yet.

## Run it

```bash
npm install
npm run dev -- --host      # open http://<your-computer-LAN-IP>:5173 on a phone on the same Wi-Fi
npm test
npm run build && npm run preview
```

## What it does today
1. Welcome → pick your usual hand.
2. Tap 18 dots (9 positions × 2, random order). The browser records where each `pointerdown` landed, normalized to the panel, and time from dot appearing to tap.
3. See exactly what was recorded; optionally download it as JSON.
4. Toggle a demo between **Standard** (Back/Bag in the header) and **With K’ab** (same controls in a lower rail on your side).

## What it does not do
Measure your hand, infer comfort from speed, change other apps or your phone, or prove anything from one session.

Docs: `docs/BUILD_STATUS.md`, `docs/DECISION_LOG.md`, `docs/QA_FINDINGS.md`. Product context: `KAB_PRODUCT_MASTER_BRIEF.md`, `PRD_AND_SCREEN_CONTRACT.md`.

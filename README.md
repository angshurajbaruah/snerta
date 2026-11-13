# snerta. — Every tap, within reach.

A mobile-first, open experiment: can moving a *few* controls toward the hand you hold your
phone with make short one-handed tasks easier — or not? It runs entirely in the page. No
account, no tracking, nothing uploaded.

> **Status: early build.** Not yet tested on a physical phone. No user results exist yet, and
> nothing here has been shown to make anything faster, easier or better. That is the point of
> the study still to come.

## Run it on a phone, the easy way

Download the repo, unzip it, and **double-click `Start snerta on my phone.command`**. It
installs what it needs on first run, then prints a `http://<your-LAN-IP>:5173` address to
open on a phone on the same Wi-Fi. Leave the Terminal window open while testing; close it to
stop the server. macOS may ask you to right-click → Open the first time.

## Run it from a terminal

```bash
npm install
npm run dev -- --host     # then open http://<your-computer's-LAN-IP>:5173 on a phone on the same Wi-Fi
npm test                  # unit + component tests
npm run build && npm run preview
node scripts/smoke-touch.cjs      # emulated-touch walkthrough (NOT a device test)
node scripts/contrast-audit.cjs   # text contrast on every screen
node scripts/hero-contrast.cjs    # hero copy contrast at six viewport sizes
```

## What it does today

1. **Welcome** → pick the hand you mostly use, including *I switch between hands*.
2. **Find your reach** — 18 prompted taps (9 positions, each twice, random order). The browser
   records where each `pointerdown` landed, normalised to the tray, and the time from the dot
   appearing to the tap.
3. **What was recorded** — exactly that, with no comfort inferred from it. Download it as JSON
   if you want it.
4. **Before and after** — the same three controls (back, search, more) in the header, or in a
   bottom rail on your side. Switch as often as you like.

## What it does not do

Measure your hand, infer comfort from speed, change other apps or your phone, or prove
anything from one session. There is no reach map yet: labelling a zone easy or hard needs you
to say how it felt, and that question is the next thing to build.

## Design

Brand Identity 2.0 — the wordmark `snerta.` is the logo, Montserrat throughout, greyscale
only, bento boxes on a quiet off-white page, actions in a dark dock in the thumb zone.
Montserrat is self-hosted (SIL OFL) rather than loaded from Google Fonts, so the page makes no
third-party request and works offline.

Design canvas: https://claude.ai/artifact/FxQxu3JudKQzQBhtnd8kv2

## Docs

`docs/BUILD_STATUS.md` · `docs/DECISION_LOG.md` · `docs/QA_FINDINGS.md`
Product context: `KAB_PRODUCT_MASTER_BRIEF.md`, `PRD_AND_SCREEN_CONTRACT.md` (written under the
former name K’ab; the research standards in them still govern).
The previous identity is kept in `archive/kab-identity/`.

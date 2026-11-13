# K’ab — QA findings

Status codes: PASS / FAIL / PARTIAL / NOT TESTED. Emulated results are labelled as such.

## 2026-11-12 — Milestone 1 (sandbox only)

| Check | Env | Result | Notes |
|---|---|---|---|
| Unit + component tests | Vitest/jsdom | PASS | 27/27 |
| Production build | Vite | PASS | |
| 18-tap flow, stray touch → observation | Chromium, iPhone 13 emulation | PASS (emulated) | `scripts/smoke-touch.cjs` |
| Calibration bottom row under sticky footer | Chromium 390×844 | FAIL → fixed | Bottom dots overlapped by footer; a tap hit "Stop". Calibration screen now fixed-height. |
| Mark shows rectangle on UI | Chromium | FAIL → fixed | Crop background differed from page; converted to alpha (D10). |
| Programmatic focus ring on h1 | Chromium | FAIL → fixed | Heading focus for screen readers drew a box; suppressed for `tabindex=-1`. |
| Layout at 320 / 390 / 430 px | Chromium | PASS (visual, emulated) | |
| Physical iPhone Safari | — | NOT TESTED | |
| Physical Android Chrome | — | NOT TESTED | |
| VoiceOver / TalkBack | — | NOT TESTED | |
| 200% zoom | — | NOT TESTED | |

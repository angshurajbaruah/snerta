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

## 2026-11-13 — Milestone 2a (sandbox only)

| Check | Env | Result | Notes |
|---|---|---|---|
| Unit + component tests | Vitest/jsdom | PASS | 32/32 |
| Production build | Vite | PASS | JS 245 kB (76 kB gzip), CSS 19 kB |
| 18-tap flow, stray touch → observation | Chromium, iPhone 13 emulation | PASS (emulated) | `scripts/smoke-touch.cjs` |
| Back furthest from the thumb in the rail | unit | FAIL → fixed | Mirror logic was inverted; Back now takes the outer slot. Test added. |
| Device resizes when toggling layout | Chromium 390×664 | FAIL → fixed | 34 px jump, then 18 px, now 0 px at 320×568, 390×664 and 412×915. Would have confounded the timed trials. |
| Demo screen scrolled; device squashed to 73 px at 320 px wide | Chromium | FAIL → fixed | Heading removed from that screen; device now 220–491 px. |
| Hero headline contrast | Chromium, 6 viewports | FAIL → fixed | 1.72:1 (white on the sphere highlight). Now ≥ 8.4:1 everywhere. `scripts/hero-contrast.cjs` |
| Text contrast, all screens | Chromium | PASS | `scripts/contrast-audit.cjs`, no element below AA |
| Physical iPhone Safari | — | NOT TESTED | |
| Physical Android Chrome | — | NOT TESTED | |
| VoiceOver / TalkBack | — | NOT TESTED | |
| 200% zoom | — | NOT TESTED | |

### Open limitations
- **Three-way hand split thins the study.** With left / right / switches and only five
  participants, some arms may get one person or none. Record actual coverage; do not report
  per-arm comparisons as if they were balanced.
- **The centred rail is untested as a concept.** It is a reasonable default for someone who
  switches hands, not a measured optimum.
- **The demo app changed** from a shopping flow to an inbox. The PRD's Add → Bag → Continue →
  Confirm task needs rebuilding against the new controls before any timed trial runs.

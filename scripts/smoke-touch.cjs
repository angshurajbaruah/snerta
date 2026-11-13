/**
 * Emulated-touch smoke check (Chromium + Playwright, iPhone 13 profile).
 * NOT a physical-device test. Run against `npm run preview` (port 4173):
 *   node scripts/smoke-touch.cjs [url]
 */
const { chromium, devices } = require('playwright');
(async () => {
  const url = process.argv[2] || 'http://localhost:4173/';
  const b = await chromium.launch();
  const ctx = await b.newContext({ ...devices['iPhone 13'] });
  const p = await ctx.newPage();
  const errors = [];
  p.on('pageerror', (e) => errors.push(String(e)));
  await p.goto(url);
  await p.getByRole('button', { name: 'Get started' }).tap();
  await p.getByRole('radio', { name: 'Right' }).tap();
  await p.getByRole('button', { name: 'Continue' }).tap();
  await p.getByRole('button', { name: 'Start' }).tap();
  // a stray touch away from the active dot must not count
  await p.waitForTimeout(80);
  const panel = await p.getByTestId('touch-panel').boundingBox();
  for (let i = 0; i < 18; i++) {
    await p.waitForTimeout(60);
    const box = await p.locator('.dot.is-active').boundingBox();
    if (i === 3) await p.touchscreen.tap(panel.x + panel.width / 2, panel.y + 14); // inside panel, away from every dot
    await p.touchscreen.tap(box.x + box.width / 2 + 4, box.y + box.height / 2 - 3);
  }
  const counter = await p.locator('.counter').innerText();
  await p.getByRole('button', { name: 'Continue' }).tap();
  const lede = await p.locator('.lede').innerText();
  const stats = await p.locator('.stats').innerText();
  const ok = /All 18 done/.test(counter) && /reported by your browser as touch/.test(lede) && /18\s*accepted taps/.test(stats) && /1\s*other touches/.test(stats);
  console.log({ counter, stats: stats.replace(/\s+/g, ' '), errors });
  console.log(ok && errors.length === 0 ? 'SMOKE PASS (emulated touch)' : 'SMOKE FAIL');
  await b.close();
  process.exit(ok && errors.length === 0 ? 0 : 1);
})();

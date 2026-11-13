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
  const panel = await p.getByTestId('tray-field').boundingBox();
  for (let i = 0; i < 33; i++) {
    await p.waitForTimeout(60);
    const box = await p.locator('.bead.is-active').boundingBox().catch(() => null);
    if (!box) break;
    if (i === 6) await p.touchscreen.tap(panel.x + panel.width / 2, panel.y + panel.height / 2 + 2); // inside tray, away from every dot
    await p.touchscreen.tap(box.x + box.width / 2 + 4, box.y + box.height / 2 - 3);
  }
  const counter = await p.locator('.cal__card .title').innerText();
  await p.getByRole('button', { name: 'Continue' }).tap();
  const lede = await p.locator('.intro .lede').innerText();
  const stats = await p.locator('.grid-3').innerText();
  const ok = /That.s all 30/.test(counter) && /reported every tap as touch/.test(lede) && /30\s*taps counted/.test(stats) && /1\s*other touches/.test(stats);
  console.log({ counter, stats: stats.replace(/\s+/g, ' '), errors });
  console.log(ok && errors.length === 0 ? 'SMOKE PASS (emulated touch)' : 'SMOKE FAIL');
  await b.close();
  process.exit(ok && errors.length === 0 ? 0 : 1);
})();

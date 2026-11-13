/**
 * Walks both timed trials in a real engine and checks the geometry the jsdom tests
 * cannot see: that nothing covers the controls the task needs.
 * Emulated touch, NOT a device test. Run against `npm run preview` (port 4173):
 *   node scripts/trial-smoke.cjs [url]
 */
const { chromium } = require('playwright');
(async () => {
  const url = process.argv[2] || 'http://localhost:4173/';
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 393, height: 695 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true });
  const p = await ctx.newPage();
  const errs = [];
  p.on('pageerror', (e) => errs.push(String(e)));
  const last = (n) => p.getByRole('button', { name: n }).last();

  await p.goto(url);
  await p.getByRole('button', { name: 'Get started' }).tap();
  await p.getByRole('radio', { name: 'Right' }).tap();
  await p.getByRole('button', { name: 'Continue' }).tap();
  await p.getByRole('button', { name: 'Skip — just show me the demo' }).tap();
  await p.getByRole('button', { name: 'Start the comparison' }).tap();
  await p.waitForTimeout(300);

  let ok = true;
  for (let trial = 1; trial <= 2; trial++) {
    const who = await p.locator('.cal__card .title').innerText();
    const name = who.replace(/^Find /, '').replace(/,.*$/, '');
    await p.getByRole('button', { name: 'Start' }).tap();
    await p.waitForTimeout(200);

    // Every control the task needs must be the top-most element at its own centre.
    const covered = await p.evaluate(() => {
      const bad = [];
      for (const el of document.querySelectorAll('.app-ctrl')) {
        const r = el.getBoundingClientRect();
        const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
        if (!el.contains(hit)) bad.push({ control: el.getAttribute('aria-label'), covered: hit?.className ?? 'nothing' });
      }
      return bad;
    });
    if (covered.length) {
      ok = false;
      console.log(`trial ${trial}: COVERED CONTROLS ->`, JSON.stringify(covered));
    }

    await last('Search').tap();
    await p.getByRole('button', { name: new RegExp(name) }).tap();
    await last('More').tap();
    await p.getByRole('menuitem', { name: /Archive/ }).tap();
    await last('Back').tap();
    await p.waitForTimeout(250);
    const rated = await p.getByRole('heading', { name: /How comfortable/ }).count();
    if (!rated) { ok = false; console.log(`trial ${trial}: did not reach the rating`); }
    await p.getByRole('radio', { name: /^4 —/ }).tap();
    await p.getByRole('button', { name: 'Continue' }).tap();
    await p.waitForTimeout(350);
    console.log(`trial ${trial}: "${name}" completed, controls reachable`);
  }

  const times = await p.locator('.versus__n').allInnerTexts();
  const hasResults = (await p.getByRole('heading', { name: 'Time to finish' }).count()) > 0;
  if (!hasResults) { ok = false; console.log('results screen did not render a comparison'); }
  console.log('durations:', times.slice(0, 2).join(' vs '));
  console.log('errors:', errs);
  console.log(ok && errs.length === 0 ? 'TRIAL SMOKE PASS (emulated touch)' : 'TRIAL SMOKE FAIL');
  await b.close();
  process.exit(ok && errs.length === 0 ? 0 : 1);
})();

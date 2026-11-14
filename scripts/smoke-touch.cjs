/**
 * Emulated-touch smoke check (Chromium + Playwright, iPhone 13 profile).
 *
 * NOT a physical-device test. Emulated touch is Chromium saying "touch", not a thumb
 * on glass, and nothing here can tell the difference. Run against `npm run preview`:
 *   node scripts/smoke-touch.cjs [url]
 *
 * It drives the whole calibration in a real engine and then checks the export rather
 * than screen text, because what the study actually depends on is what lands in the
 * JSON: 30 measured taps and no more, a stray touch kept as an observation instead of
 * being counted as a miss, and labels left alone staying unknown.
 */
const { chromium, devices } = require('playwright');

(async () => {
  const url = process.argv[2] || 'http://localhost:4173/';
  const b = await chromium.launch();
  const ctx = await b.newContext({ ...devices['iPhone 13'] });
  const p = await ctx.newPage();
  const errors = [];
  const fails = [];
  p.on('pageerror', (e) => errors.push(String(e)));

  await p.goto(url);
  await p.getByRole('button', { name: 'Get started' }).tap();
  await p.getByRole('radio', { name: 'Right' }).tap();
  await p.getByRole('button', { name: 'Continue' }).tap();
  await p.getByRole('button', { name: 'Start' }).tap();
  await p.waitForTimeout(80);

  // 3 practice + 30 measured. One stray touch inside the tray, away from every dot.
  const panel = await p.getByTestId('tray-field').boundingBox();
  let tapped = 0;
  for (let i = 0; i < 33; i++) {
    await p.waitForTimeout(60);
    const box = await p.locator('.bead.is-active').boundingBox().catch(() => null);
    if (!box) break;
    if (i === 6) await p.touchscreen.tap(panel.x + panel.width / 2, panel.y + panel.height / 2 + 2);
    await p.touchscreen.tap(box.x + box.width / 2 + 4, box.y + box.height / 2 - 3);
    tapped++;
  }
  if (tapped !== 33) fails.push(`tapped ${tapped} dots, expected 33`);

  const counter = await p.locator('.cal__card .title').innerText();
  if (!/That.s all 30/.test(counter)) fails.push(`end card said ${JSON.stringify(counter)}`);

  // Through the comfort self-report, leaving every area unknown on purpose.
  await p.getByRole('button', { name: 'Continue' }).tap();
  const skip = p.getByRole('button', { name: 'Skip this' });
  if (!(await skip.isVisible().catch(() => false))) {
    fails.push('comfort screen did not offer a skip for an untouched report');
  } else {
    await skip.tap();
  }

  const mapTitle = await p.locator('.intro .title').innerText();
  if (!/reach map/i.test(mapTitle)) fails.push(`expected the reach map, got ${JSON.stringify(mapTitle)}`);

  // The export is the artefact a study actually uses, so check that, not the page.
  const dl = await Promise.all([
    p.waitForEvent('download'),
    p.getByRole('button', { name: 'JSON' }).tap(),
  ]).then(([d]) => d);
  const fs = require('fs');
  const path = await dl.path();
  const data = JSON.parse(fs.readFileSync(path, 'utf8'));

  const check = (cond, msg) => {
    if (!cond) fails.push(msg);
  };
  check(data.sampleCount === 30, `sampleCount ${data.sampleCount}, expected 30`);
  check(data.samples.length === 30, `samples ${data.samples.length}, expected 30`);
  check(
    data.nonTargetObservations.length === 1,
    `nonTargetObservations ${data.nonTargetObservations.length}, expected 1`,
  );
  check(data.calibrationSkipped === false, 'calibrationSkipped should be false after a full run');
  check(data.evidence === 'touch', `evidence ${JSON.stringify(data.evidence)}`);
  check(
    Array.isArray(data.selfReport) && data.selfReport.every((z) => z.label === 'unknown'),
    'labels left alone did not stay unknown',
  );
  check(data.comparison === null, 'comparison should be null with no trials run');
  check(
    data.samples.every((s) => s.index >= 0 && s.index < 30),
    'a practice tap leaked into the measured samples',
  );

  console.log({
    counter,
    sampleCount: data.sampleCount,
    observations: data.nonTargetObservations.length,
    evidence: data.evidence,
    errors,
    fails,
  });
  const ok = fails.length === 0 && errors.length === 0;
  console.log(ok ? 'SMOKE PASS (emulated touch — not a device test)' : 'SMOKE FAIL');
  await b.close();
  process.exit(ok ? 0 : 1);
})();

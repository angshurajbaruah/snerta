/** Does the grip actually work with a real touch drag, and does the page not scroll instead? */
const { chromium, devices } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ ...devices['iPhone 13'] });
  const p = await ctx.newPage();
  const fails = [];
  p.on('pageerror', (e) => fails.push('pageerror: ' + e));
  await p.goto('http://localhost:4173/');
  await p.getByRole('button', { name: 'Get started' }).tap();
  await p.getByRole('radio', { name: 'Right' }).tap();
  await p.getByRole('button', { name: 'Continue' }).tap();
  await p.getByRole('button', { name: /Skip/ }).tap();

  const rail = () => p.locator('.app-rail').count();
  const handle = p.getByRole('button', { name: /Move the controls/ });
  if (await rail() !== 0) fails.push('rail present before any drag');

  const box = await handle.boundingBox();
  const cx = box.x + box.width / 2, cy = box.y + box.height / 2;

  // Real touch drag downwards.
  await p.touchscreen.tap(cx, cy); // warm up the element
  await p.waitForTimeout(100);
  const afterTap = await rail();
  if (afterTap !== 1) fails.push('tap did not move the controls down');

  // Drag back up with a genuine pointer sequence.
  const b2 = await handle.boundingBox();
  await p.mouse.move(b2.x + b2.width / 2, b2.y + b2.height / 2);
  await p.mouse.down();
  await p.mouse.move(b2.x + b2.width / 2, b2.y + b2.height / 2 - 70, { steps: 8 });
  await p.mouse.up();
  await p.waitForTimeout(150);
  if (await rail() !== 0) fails.push('drag up did not send the controls back to the header');

  // touch-action must be none, or the browser scrolls instead of dragging.
  const ta = await handle.evaluate((el) => getComputedStyle(el).touchAction);
  if (ta !== 'none') fails.push(`touch-action is "${ta}", the page will scroll instead of dragging`);

  // The handle must be a real, focusable button.
  const tag = await handle.evaluate((el) => el.tagName);
  if (tag !== 'BUTTON') fails.push('handle is not a button: not keyboard operable');
  await handle.focus();
  const focused = await p.evaluate(() => document.activeElement.tagName);
  if (focused !== 'BUTTON') fails.push('handle cannot take keyboard focus');
  await p.keyboard.press('Enter');
  await p.waitForTimeout(150);
  if (await rail() !== 1) fails.push('Enter did not operate the handle');

  // Target size: the brief's 44px minimum.
  const hb = await handle.boundingBox();
  if (hb.height < 44) fails.push(`handle is ${Math.round(hb.height)}px tall, under the 44px minimum`);

  console.log(fails.length ? 'DRAG SMOKE FAIL' : 'DRAG SMOKE PASS (emulated touch)', fails);
  await b.close();
  process.exit(fails.length ? 1 : 0);
})();

const { chromium, devices } = require('playwright');
const AUDIT = `(() => {
  const rel = c => { c/=255; return c<=0.04045 ? c/12.92 : Math.pow((c+0.055)/1.055, 2.4); };
  const lum = ([r,g,b]) => 0.2126*rel(r)+0.7152*rel(g)+0.0722*rel(b);
  const parse = s => (s.match(/[\\d.]+/g)||[0,0,0]).slice(0,3).map(Number);
  const ratio = (a,b) => { const A=lum(a),B=lum(b); const hi=Math.max(A,B),lo=Math.min(A,B); return (hi+0.05)/(lo+0.05); };
  function bgOf(el) {
    let n = el;
    while (n && n !== document.documentElement) {
      const s = getComputedStyle(n);
      const bg = s.backgroundColor;
      if (bg && !bg.startsWith('rgba(0, 0, 0, 0)')) {
        const p = parse(bg);
        const a = (bg.match(/[\\d.]+/g)||[])[3];
        if (a === undefined || Number(a) > 0.85) return p;
      }
      if (s.backgroundImage && s.backgroundImage !== 'none') return null; // gradient: measured separately
      n = n.parentElement;
    }
    return [255,255,255];
  }
  const out = [];
  document.querySelectorAll('h1,h2,p,span,button,summary,td,th,div').forEach(el => {
    const direct = Array.from(el.childNodes).some(n => n.nodeType === 3 && n.textContent.trim());
    if (!direct) return;
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) return;
    const s = getComputedStyle(el);
    if (s.visibility === 'hidden' || s.opacity === '0') return;
    const bg = bgOf(el);
    if (!bg) return;
    const fg = parse(s.color);
    const size = parseFloat(s.fontSize);
    const weight = Number(s.fontWeight) || 400;
    const large = size >= 24 || (size >= 18.66 && weight >= 700);
    const need = large ? 3 : 4.5;
    const cr = ratio(fg, bg);
    if (cr < need) out.push({ text: el.textContent.trim().slice(0,42), size, weight, cr: +cr.toFixed(2), need });
  });
  return out;
})()`;
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ ...devices['iPhone 13'] });
  const p = await ctx.newPage();
  const steps = [
    ['welcome', async () => {}],
    ['hand', async () => { await p.getByRole('button', { name: 'Get started' }).tap(); }],
    ['cal-intro', async () => { await p.getByRole('radio', { name: 'Right' }).tap(); await p.getByRole('button', { name: 'Continue' }).tap(); }],
    ['readout', async () => { await p.getByRole('button', { name: 'Skip — just show me the demo' }).tap(); }],
    ['demo', async () => { await p.getByRole('button', { name: 'See the layouts' }).tap(); }],
    ['demo-snerta', async () => { await p.getByRole('radio', { name: 'With snerta.' }).tap(); }],
  ];
  await p.goto('http://localhost:4173/');
  let total = 0;
  for (const [name, act] of steps) {
    await act(); await p.waitForTimeout(250);
    const fails = await p.evaluate(AUDIT);
    total += fails.length;
    console.log(name.padEnd(12), fails.length === 0 ? 'ok' : JSON.stringify(fails));
  }
  console.log(total === 0 ? '\nCONTRAST AUDIT PASS (solid backgrounds; gradients measured separately)' : `\n${total} FAILURES`);
  await b.close();
})();

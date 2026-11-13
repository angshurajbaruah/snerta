/**
 * Regenerate the favicon and app icons from the snerta symbol.
 * One source of truth: the same ridge geometry the app renders.
 *   node scripts/make-icons.cjs scripts/ridges.txt
 */
const { chromium } = require('playwright');
const fs = require('fs');
const paths = fs.readFileSync(process.argv[2], 'utf8').trim().split('\n');
const ridges = paths.map(d => `<path d="${d}"></path>`).join('');
// icon: symbol centred on a soft off-white rounded square, matching the brand's raised surfaces
const page = (size, bg) => `<!doctype html><html><body style="margin:0">
<div style="width:${size}px;height:${size}px;display:grid;place-items:center;background:${bg};border-radius:${Math.round(size*0.22)}px;overflow:hidden">
<svg viewBox="0 0 220 260" width="${Math.round(size*0.66)}" style="overflow:visible;filter:drop-shadow(0 ${size*0.03}px ${size*0.045}px rgba(10,10,11,0.3))">
<defs>
<linearGradient id="t" gradientUnits="userSpaceOnUse" x1="10" y1="0" x2="210" y2="260"><stop offset="0" stop-color="#8A8B91"/><stop offset="0.5" stop-color="#4A4B50"/><stop offset="1" stop-color="#141416"/></linearGradient>
<linearGradient id="s" gradientUnits="userSpaceOnUse" x1="10" y1="0" x2="210" y2="260"><stop offset="0" stop-color="#0A0A0B" stop-opacity="0.5"/><stop offset="1" stop-color="#0A0A0B" stop-opacity="0.85"/></linearGradient>
<linearGradient id="l" gradientUnits="userSpaceOnUse" x1="10" y1="0" x2="210" y2="260"><stop offset="0" stop-color="#FFF" stop-opacity="0.95"/><stop offset="0.55" stop-color="#FFF" stop-opacity="0.6"/><stop offset="1" stop-color="#FFF" stop-opacity="0.4"/></linearGradient>
<g id="r">${ridges}</g>
</defs>
<use href="#r" transform="translate(1.1 1.6)" fill="none" stroke-linecap="round" stroke-width="2.8" stroke="url(#s)"/>
<use href="#r" transform="translate(-0.7 -1)" fill="none" stroke-linecap="round" stroke-width="2.8" stroke="url(#l)"/>
<use href="#r" fill="none" stroke-linecap="round" stroke-width="2.8" stroke="url(#t)"/>
</svg></div></body></html>`;
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage();
  for (const [size, bg, name] of [
    [512, 'linear-gradient(160deg,#FFFFFF 0%,#ECECEF 60%,#DCDDE1 100%)', 'icon-512.png'],
    [192, 'linear-gradient(160deg,#FFFFFF 0%,#ECECEF 60%,#DCDDE1 100%)', 'icon-192.png'],
    [180, 'linear-gradient(160deg,#FFFFFF 0%,#ECECEF 60%,#DCDDE1 100%)', 'icon-180.png'],
    [64,  'linear-gradient(160deg,#FFFFFF 0%,#ECECEF 60%,#DCDDE1 100%)', 'icon-64.png'],
    [32,  'linear-gradient(160deg,#FFFFFF 0%,#ECECEF 60%,#DCDDE1 100%)', 'icon-32.png'],
  ]) {
    await p.setViewportSize({ width: size, height: size });
    await p.setContent(page(size, bg));
    await p.waitForTimeout(60);
    await p.screenshot({ path: `public/brand/${name}`, omitBackground: false });
  }
  await b.close();
  console.log('icons written');
})();

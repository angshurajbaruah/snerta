const { chromium, devices } = require('playwright');
const sharpLum = (r,g,b) => 0.2126*r + 0.7152*g + 0.0722*b;
const rel = c => { c/=255; return c<=0.04045 ? c/12.92 : Math.pow((c+0.055)/1.055, 2.4); };
const ratio = (a,b) => { const A=rel(a), B=rel(b); return (Math.max(A,B)+0.05)/(Math.min(A,B)+0.05); };
(async () => {
  const b = await chromium.launch();
  const cases = [
    ['se-320x568', {viewport:{width:320,height:568}}],
    ['x-360x640', {viewport:{width:360,height:640}}],
    ['i13-390x664', devices['iPhone 13']],
    ['x-390x720', {viewport:{width:390,height:720}}],
    ['pixel7', devices['Pixel 7']],
    ['max-430x932', {viewport:{width:430,height:932}}],
  ];
  for (const [name, dev] of cases) {
    const ctx = await b.newContext(dev); const p = await ctx.newPage();
    await p.goto('http://localhost:4173/'); await p.waitForTimeout(400);
    const box = await p.locator('.bento__copy').boundingBox();
    await p.addStyleTag({ content: '.bento__copy{visibility:hidden}' });
    await p.waitForTimeout(120);
    const buf = await p.screenshot({ clip: box });
    const { createCanvas, loadImage } = (() => { try { return require('canvas'); } catch { return {}; } })();
    // decode PNG without extra deps: use the browser itself
    const lightest = await p.evaluate(async (dataUrl) => {
      const img = new Image(); img.src = dataUrl; await img.decode();
      const c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
      const x = c.getContext('2d'); x.drawImage(img, 0, 0);
      const d = x.getImageData(0, 0, c.width, c.height).data;
      let max = 0;
      for (let i = 0; i < d.length; i += 4) {
        const L = 0.2126*d[i] + 0.7152*d[i+1] + 0.0722*d[i+2];
        if (L > max) max = L;
      }
      return max;
    }, 'data:image/png;base64,' + buf.toString('base64'));
    console.log(name.padEnd(12), 'lightest behind copy:', Math.round(lightest).toString().padStart(3), '| white-text contrast:', ratio(255, lightest).toFixed(2));
    await ctx.close();
  }
  await b.close();
})();

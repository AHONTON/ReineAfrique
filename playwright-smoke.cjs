const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

(async () => {
  const base = 'http://localhost:5173';
  const routes = ['/', '/admin', '/admin/clients', '/admin/commandes'];
  const viewports = [375, 768, 1024, 1440];
  const results = [];

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  for (const route of routes) {
    const url = new URL(route, base).toString();
    for (const w of viewports) {
      const h = Math.round(w * 0.7) + 800; // height enough to capture content
      await page.setViewportSize({ width: w, height: h });
      try {
        const resp = await page.goto(url, { waitUntil: 'networkidle', timeout: 20000 });
        await page.waitForTimeout(600); // allow UI transitions

        const overflow = await page.evaluate(() => {
          const el = document.scrollingElement || document.documentElement;
          const sw = el.scrollWidth || document.body.scrollWidth || 0;
          const iw = window.innerWidth || document.documentElement.clientWidth || 0;
          const hasHOverflow = sw > iw + 2; // small tolerance

          // find first element wider than viewport
          const tooWide = Array.from(document.querySelectorAll('body *'))
            .filter(n => n instanceof HTMLElement)
            .map(n => ({ el: n.tagName.toLowerCase(), w: n.getBoundingClientRect().width, selector: n.className || n.id || n.tagName }))
            .filter(x => x.w > iw + 2)
            .slice(0, 6);

          return { hasHOverflow, scrollWidth: sw, innerWidth: iw, tooWide };
        });

        // save screenshot for inspection
        const screenshotsDir = path.join(process.cwd(), 'smoke-screenshots');
        if (!fs.existsSync(screenshotsDir)) fs.mkdirSync(screenshotsDir);
        const fileName = `smoke_${route.replace(/\W+/g, '_')}_${w}.png`;
        const filePath = path.join(screenshotsDir, fileName);
        await page.screenshot({ path: filePath, fullPage: true });

        results.push({ route, width: w, ok: !overflow.hasHOverflow, details: overflow, screenshot: filePath, status: resp && resp.status() });
        console.log(`✓ ${route} @ ${w}px — overflow: ${overflow.hasHOverflow ? 'YES' : 'no'} — status: ${resp ? resp.status() : 'no-resp'}`);
      } catch (err) {
        console.error(`✗ ${route} @ ${w}px — error: ${err.message}`);
        results.push({ route, width: w, ok: false, error: err.message });
      }
    }
  }

  await browser.close();

  const out = { date: new Date().toISOString(), results };
  fs.writeFileSync(path.join(process.cwd(), 'smoke-report.json'), JSON.stringify(out, null, 2));
  console.log('\nSmoke test finished. Report written to smoke-report.json and screenshots in /smoke-screenshots');
})();

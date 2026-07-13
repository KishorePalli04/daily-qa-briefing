const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const dir = path.resolve(__dirname, '..');

  const p1 = await browser.newPage({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 2 });
  await p1.goto('file://' + path.join(dir, '07-mockup', 'mockup.html'));
  await p1.waitForTimeout(500);
  await p1.screenshot({ path: path.join(dir, '07-mockup', 'preview.png') });
  console.log('Wrote 07-mockup/preview.png');

  const p2 = await browser.newPage({ viewport: { width: 1100, height: 900 } });
  await p2.goto('file://' + path.join(dir, '06-sales-page', 'sales-page.html'));
  await p2.waitForTimeout(500);
  await p2.screenshot({ path: path.join(dir, '06-sales-page', 'preview.png'), fullPage: true });
  console.log('Wrote 06-sales-page/preview.png');

  await browser.close();
})();

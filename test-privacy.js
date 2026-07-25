const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(`file://${path.resolve('ace-lp-01-counsel.html')}`);
  
  const links = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('a[href*="privacy"]')).map(a => ({
      text: a.innerText,
      href: a.getAttribute('href'),
      visible: a.offsetWidth > 0 && a.offsetHeight > 0
    }));
  });
  
  console.log('Privacy links in original HTML:', links);
  
  await browser.close();
})();

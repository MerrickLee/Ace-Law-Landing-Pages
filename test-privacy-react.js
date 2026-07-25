const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:3000/lp/counsel/ga/georgia');
  
  const links = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('a[href*="privacy"]')).map(a => ({
      text: a.innerText,
      href: a.getAttribute('href'),
      visible: a.offsetWidth > 0 && a.offsetHeight > 0
    }));
  });
  
  console.log('Privacy links in React app:', links);
  
  await browser.close();
})();

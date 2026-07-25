const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:3000/lp/counsel/ga/georgia');
  
  const bg = await page.evaluate(() => {
    const el = document.querySelector('.stickybar');
    return getComputedStyle(el).backgroundColor;
  });
  
  const spanLgBg = await page.evaluate(() => {
    const el = document.querySelector('.sb-form .lg');
    return getComputedStyle(el).color;
  });

  const goBg = await page.evaluate(() => {
    const el = document.querySelector('.sb-call');
    return getComputedStyle(el).backgroundColor;
  });

  console.log('Stickybar BG:', bg);
  console.log('Span LG Color:', spanLgBg);
  console.log('SB Call BG:', goBg);
  
  await browser.close();
})();

import { test, expect, Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { LOCALES } from './lib/locales';

/* ============================================================================
   ACE Law landing pages — acceptance suite

   Every test here corresponds to a bug that was actually found and fixed
   during the mockup phase. Treat a failure as a real regression, not as a
   test to loosen.

   Run: npx playwright test
   ========================================================================= */

const VARIANTS = ['counsel', 'case-check'] as const;
const MARKETS = Object.keys(LOCALES);
const WIDTHS = [320, 375, 390, 430];

const url = (variant: string, market = 'georgia', qs = '') =>
  `/lp/${variant}/ga/${market}${qs}`;

/* ---------------------------------------------------------------------------
   1. CONTRAST
   A white card nested in the dark hero inherited color:#fff and rendered the
   entire form white-on-white. Layout testing cannot catch this, so contrast
   is measured directly, including against every stop of a gradient.
------------------------------------------------------------------------------ */
async function contrastFailures(page: Page) {
  return page.evaluate(() => {
    type RGB = { r: number; g: number; b: number; a: number };
    const parse = (c: string): RGB | null => {
      const m = c.match(/[\d.]+/g);
      if (!m) return null;
      return { r: +m[0], g: +m[1], b: +m[2], a: m[3] === undefined ? 1 : +m[3] };
    };
    const lum = ({ r, g, b }: RGB) => {
      const f = (v: number) => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
      };
      return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
    };
    const ratio = (a: RGB, b: RGB) => {
      const l1 = lum(a), l2 = lum(b);
      return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    };
    // gradients contribute every colour stop: white can pass on one end and
    // fail on the other, so the worst stop is the one that counts
    const backgrounds = (el: Element): RGB[] => {
      let n: Element | null = el;
      while (n && n !== document.documentElement) {
        const cs = getComputedStyle(n);
        if (cs.backgroundImage && /gradient/.test(cs.backgroundImage)) {
          const stops = (cs.backgroundImage.match(/rgba?\([^)]+\)/g) || [])
            .map(parse).filter((c): c is RGB => !!c && c.a > 0.5);
          if (stops.length) return stops;
        }
        const bg = parse(cs.backgroundColor);
        if (bg && bg.a > 0.5) return [bg];
        n = n.parentElement;
      }
      return [{ r: 255, g: 255, b: 255, a: 1 }];
    };

    const out: string[] = [];
    document.querySelectorAll('*').forEach((el) => {
      const cs = getComputedStyle(el);
      if (cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity === 0) return;
      const ownsText = [...el.childNodes].some(
        (n) => n.nodeType === 3 && (n.textContent || '').trim().length > 1
      );
      if (!ownsText) return;
      const fg = parse(cs.color);
      if (!fg) return;
      const worst = Math.min(...backgrounds(el).map((bg) => ratio(fg, bg)));
      const size = parseFloat(cs.fontSize);
      const large = size >= 24 || (size >= 18.66 && +cs.fontWeight >= 700);
      const need = large ? 3 : 4.5;
      if (worst < need) {
        out.push(
          `${el.tagName.toLowerCase()}.${String(el.className).trim().split(/\s+/).join('.')} ` +
          `${worst.toFixed(2)}:1 (need ${need}) "${(el.textContent || '').trim().slice(0, 40)}"`
        );
      }
    });
    return out;
  });
}

for (const variant of VARIANTS) {
  test(`[${variant}] no WCAG AA contrast failures`, async ({ page }) => {
    await page.goto(url(variant));
    expect(await contrastFailures(page)).toEqual([]);
  });

  test(`[${variant}] no contrast failures after the form advances`, async ({ page }) => {
    await page.goto(url(variant));
    if (variant === 'counsel') {
      await page.getByRole('radio', { name: /within the last 7 days/i }).check();
      await page.getByRole('radio', { name: /being treated/i }).check();
      await page.getByRole('button', { name: /continue/i }).click();
    } else {
      await page.getByRole('button', { name: /^car accident$/i }).click();
    }
    expect(await contrastFailures(page)).toEqual([]);
  });
}

/* ---------------------------------------------------------------------------
   2. LAYOUT at phone widths
   Caught previously: 18px horizontal scroll at 320px, footer phone links at
   102x15px, and a portrait container that collapsed to 2x3px because
   `margin:0 auto` on a grid item forces fit-content sizing.
------------------------------------------------------------------------------ */
for (const variant of VARIANTS) {
  for (const width of WIDTHS) {
    test(`[${variant}] @${width}px layout is sound`, async ({ page }) => {
      await page.setViewportSize({ width, height: 844 });
      await page.goto(url(variant));

      const scrollW = await page.evaluate(() => document.documentElement.scrollWidth);
      expect(scrollW, `horizontal scroll at ${width}px`).toBeLessThanOrEqual(width);

      const problems = await page.evaluate(() => {
        const small: string[] = [];
        const collapsed: string[] = [];
        document.querySelectorAll('*').forEach((el) => {
          const cs = getComputedStyle(el);
          if (cs.display === 'none' || cs.visibility === 'hidden') return;
          const r = el.getBoundingClientRect();
          if (!r.width && !r.height) return;

          // tap targets: the label wraps the input, so measure the label
          if (el.matches('a, button, summary, label.opt') && (r.height < 44 || r.width < 44)) {
            small.push(`${el.tagName}.${String(el.className).slice(0, 24)} ${Math.round(r.width)}x${Math.round(r.height)}`);
          }
          // containers that collapsed to nothing
          const styled = cs.backgroundColor !== 'rgba(0, 0, 0, 0)' || cs.borderTopWidth !== '0px';
          if ((el.children.length > 0 || styled) &&
              !el.matches('br, hr, script, style, i, .prog, .prog i, .steps, .steps i') &&
              (r.width < 8 || r.height < 8) && (r.width > 0 || r.height > 0)) {
            collapsed.push(`${el.tagName}.${String(el.className).slice(0, 24)} ${Math.round(r.width)}x${Math.round(r.height)}`);
          }
        });
        return { small, collapsed };
      });
      expect(problems.collapsed, 'collapsed containers').toEqual([]);
      expect(problems.small, 'tap targets under 44px').toEqual([]);
    });
  }

  test(`[${variant}] text inputs are 16px so iOS does not zoom on focus`, async ({ page }) => {
    await page.goto(url(variant));
    const undersized = await page.evaluate(() =>
      [...document.querySelectorAll('input[type=text],input[type=tel],input[type=email],input[type=date],select,textarea')]
        .filter((el) => parseFloat(getComputedStyle(el).fontSize) < 16)
        .map((el) => (el as HTMLInputElement).name || el.id)
    );
    expect(undersized).toEqual([]);
  });

  test(`[${variant}] anchor targets clear the sticky header`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(url(variant));
    const ok = await page.evaluate(() => {
      const header = document.querySelector('header')!.getBoundingClientRect().height;
      return [...document.querySelectorAll('a[href^="#"]')].every((a) => {
        const t = document.getElementById(a.getAttribute('href')!.slice(1));
        if (!t) return false;
        return parseFloat(getComputedStyle(t).scrollMarginTop) >= header;
      });
    });
    expect(ok, 'scroll-margin-top must be >= header height').toBe(true);
  });

  test(`[${variant}] the sticky bar never covers a control`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(url(variant));
    // Puppeteer once refused to click a button the fixed bar was sitting on.
    // Every control must be reachable above the bar after scrolling.
    const controls = page.locator('button[type=submit], .go, .submit, a[href^="tel:"]');
    const n = await controls.count();
    for (let i = 0; i < n; i++) {
      const el = controls.nth(i);
      if (!(await el.isVisible())) continue;
      await el.scrollIntoViewIfNeeded();
      await expect(el).toBeInViewport();
    }
  });
}

/* ---------------------------------------------------------------------------
   3. FORM FLOWS AND CONVERSION EVENTS
   `generate_lead` is the primary Google Ads conversion. If it stops firing,
   bidding goes blind.
------------------------------------------------------------------------------ */
test('[counsel] two-step form submits and fires generate_lead', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(url('counsel'));

  // step 1 validation must be inline, never window.alert
  let alerted = false;
  page.on('dialog', async (d) => { alerted = true; await d.dismiss(); });
  await page.getByRole('button', { name: /continue/i }).click();
  expect(alerted, 'must not use alert() for validation').toBe(false);
  await expect(page.locator('#err1')).toBeVisible();

  await page.getByRole('radio', { name: /within the last 7 days/i }).check();
  await page.getByRole('radio', { name: /being treated/i }).check();
  await page.getByRole('button', { name: /continue/i }).click();

  await page.fill('input[name=first_name]', 'Test');
  await page.fill('input[name=last_name]', 'Lead');
  await page.fill('input[name=phone]', '4045550142');
  await page.fill('input[name=email]', 'test@example.com');
  await page.check('input[name=tcpa]');
  await page.getByRole('button', { name: /send my case/i }).click();

  const lead = await page.evaluate(() =>
    (window as any).dataLayer.find((e: any) => e.event === 'generate_lead'));
  expect(lead).toBeTruthy();
  expect(lead.lp_variant).toBe('counsel');
  expect(lead.lp_market).toBe('georgia');
  expect(errors).toEqual([]);
});

test('[case-check] quiz advances through all steps and fires generate_lead', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(url('case-check'));

  // regression: a state array named `history` collided with window.history,
  // which is read-only, so `history.push()` threw and the quiz never advanced
  await page.getByRole('button', { name: /^car accident$/i }).click();
  await expect(page.locator('[data-step="2"]')).toBeVisible();

  const d = new Date(); d.setMonth(d.getMonth() - 5);
  await page.fill('#dateInput', d.toISOString().slice(0, 10));
  await page.getByRole('button', { name: /continue/i }).click();
  await page.getByRole('button', { name: /still being treated/i }).click();
  await page.getByRole('button', { name: /the other driver/i }).click();

  // the deadline readout must compute real days, not a placeholder
  const days = parseInt(await page.locator('#rnum').innerText().then((t) => t.replace(/,/g, '')), 10);
  expect(days).toBeGreaterThan(500);
  expect(days).toBeLessThan(600);

  await page.fill('input[name=first_name]', 'Test');
  await page.fill('input[name=last_name]', 'Lead');
  await page.fill('input[name=phone]', '4045550142');
  await page.fill('input[name=email]', 'test@example.com');
  await page.check('input[name=tcpa]');
  await page.getByRole('button', { name: /send my case check/i }).click();

  const lead = await page.evaluate(() =>
    (window as any).dataLayer.find((e: any) => e.event === 'generate_lead'));
  expect(lead).toBeTruthy();
  expect(errors).toEqual([]);
});

for (const variant of VARIANTS) {
  test(`[${variant}] tel: links fire click_to_call`, async ({ page }) => {
    await page.goto(url(variant));
    await page.evaluate(() => {
      document.querySelectorAll('a[href^="tel:"]').forEach((a) => (a as HTMLElement).click());
    });
    const calls = await page.evaluate(() =>
      (window as any).dataLayer.filter((e: any) => e.event === 'click_to_call').length);
    expect(calls).toBeGreaterThan(0);
  });

  test(`[${variant}] testimonial videos are configured for mobile and tracked`, async ({ page }) => {
    await page.goto(url(variant));
    const vids = await page.evaluate(() =>
      [...document.querySelectorAll('video[data-testi]')].map((v) => ({
        // without playsinline, iOS Safari throws the user fullscreen out of the page
        playsinline: v.hasAttribute('playsinline'),
        hasPoster: v.hasAttribute('poster'),
        preload: v.getAttribute('preload'),
      })));
    expect(vids.length).toBe(2);
    vids.forEach((v) => {
      expect(v.playsinline).toBe(true);
      expect(v.hasPoster, 'ship real poster images so preload can be none').toBe(true);
      expect(v.preload).toBe('none');
    });
  });
}

/* ---------------------------------------------------------------------------
   4. ATTRIBUTION
   No GCLID means no offline conversion import later.
------------------------------------------------------------------------------ */
for (const variant of VARIANTS) {
  test(`[${variant}] captures and persists click IDs`, async ({ page }) => {
    await page.goto(url(variant, 'georgia',
      '?gclid=TESTGCLID&gbraid=TESTGBRAID&wbraid=TESTWBRAID&fbclid=TESTFB' +
      '&utm_source=google&utm_medium=cpc&utm_campaign=ga-mv&utm_term=car+accident+lawyer'));
    // React populates tracking fields via useEffect, so we use locator assertions to wait for hydration
    await expect(page.locator('#gclid')).toHaveValue('TESTGCLID');
    await expect(page.locator('#gbraid')).toHaveValue('TESTGBRAID');
    await expect(page.locator('#wbraid')).toHaveValue('TESTWBRAID');
    await expect(page.locator('#fbclid')).toHaveValue('TESTFB');
    await expect(page.locator('#utm_campaign')).toHaveValue('ga-mv');

    // must survive a bounce out to the privacy policy and back
    await page.goto(url(variant));
    await expect(page.locator('#gclid')).toHaveValue('TESTGCLID', { timeout: 10000 });
  });
}

/* ---------------------------------------------------------------------------
   5. LOCALITY
------------------------------------------------------------------------------ */
for (const variant of VARIANTS) {
  for (const market of MARKETS) {
    test(`[${variant}] ${market} renders its own copy`, async ({ page }) => {
      await page.goto(url(variant, market));
      const L = (LOCALES as any)[market];
      await expect(page).toHaveTitle(L.title);
      await expect(page.locator('[data-loc="serving"]').first()).toContainText(L.serving);
      const empty = await page.evaluate(() =>
        [...document.querySelectorAll('[data-loc]')].filter((el) => !el.textContent!.trim()).length);
      expect(empty, 'every localised node must resolve').toBe(0);
      const marketField = await page.inputValue('input[name=market]');
      expect(marketField).toBe(market);
    });
  }

  test(`[${variant}] an unknown market 404s rather than rendering blank`, async ({ page }) => {
    const res = await page.goto(url(variant, 'not-a-real-city'));
    expect(res?.status()).toBe(404);
  });
}

test('no market page implies an office ACE Law does not have', async ({ page }) => {
  // Georgia office is Atlanta only. Bar rules restrict implying a local office.
  for (const market of MARKETS) {
    if (market === 'atlanta' || market === 'sandy-springs' || market === 'georgia') continue;
    await page.goto(url('counsel', market));
    const body = (await page.locator('body').innerText()).toLowerCase();
    const city = (LOCALES as any)[market].city.toLowerCase();
    expect(body, `${market}: must not claim a local office`).not.toContain(`${city} office`);
    expect(body).toContain('from our atlanta office');
  }
});

/* ---------------------------------------------------------------------------
   6. COMPLIANCE AND SEO GUARDS
------------------------------------------------------------------------------ */
for (const variant of VARIANTS) {
  test(`[${variant}] carries the required legal disclosures`, async ({ page }) => {
    await page.goto(url(variant));
    const body = (await page.locator('body').innerText()).toLowerCase();
    expect(body).toContain('attorney advertising');
    expect(body).toContain('prior results do not guarantee');
    expect(body).toContain('testimonials reflect the experience');
    await expect(page.locator('a[href*="privacy"]').first()).toBeVisible();

    // TCPA consent must be present and unchecked by default
    const tcpa = page.locator('input[name=tcpa]');
    await expect(tcpa).toHaveCount(1);
    expect(await tcpa.isChecked()).toBe(false);
  });

  test(`[${variant}] is noindex so it cannot cannibalise the main site`, async ({ page }) => {
    await page.goto(url(variant));
    const robots = await page.getAttribute('meta[name=robots]', 'content');
    expect(robots).toContain('noindex');
  });

  test(`[${variant}] has no outbound links that leak paid traffic`, async ({ page }) => {
    await page.goto(url(variant));
    const leaks = await page.evaluate(() =>
      [...document.querySelectorAll('a[href^="http"]')]
        .map((a) => (a as HTMLAnchorElement).href)
        .filter((h) => !h.includes(location.hostname)));
    expect(leaks, 'landing pages should have one job').toEqual([]);
  });
}

/* ---------------------------------------------------------------------------
   7. ACCESSIBILITY
------------------------------------------------------------------------------ */
for (const variant of VARIANTS) {
  test(`[${variant}] passes axe with no serious violations`, async ({ page }) => {
    await page.goto(url(variant));
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    const serious = results.violations.filter((v) => ['serious', 'critical'].includes(v.impact || ''));
    expect(serious.map((v) => `${v.id}: ${v.help}`)).toEqual([]);
  });

  test(`[${variant}] is keyboard navigable to the primary CTA`, async ({ page }) => {
    await page.goto(url(variant));
    for (let i = 0; i < 25; i++) {
      await page.keyboard.press('Tab');
      const focused = await page.evaluate(() => {
        const el = document.activeElement as HTMLElement;
        if (!el) return null;
        const cs = getComputedStyle(el);
        return { tag: el.tagName, outline: cs.outlineWidth, visible: el.offsetParent !== null };
      });
      if (focused?.tag === 'INPUT' || focused?.tag === 'BUTTON') {
        expect(focused.outline, 'focus must be visible').not.toBe('0px');
        return;
      }
    }
    throw new Error('never reached a form control by keyboard');
  });
}

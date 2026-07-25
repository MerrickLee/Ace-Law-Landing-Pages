# Antigravity Build Prompt — ACE Law Landing Pages

Paste everything below the line into Antigravity. Attach these five files first:

`ace-lp-01-counsel.html` · `ace-lp-03-casecheck.html` · `ace-locales.js` · `ace-brand.css` · `tests/landing-pages.spec.ts`

---

## Role and goal

You are building a production landing page system for ACE Law, LP, a personal injury firm in Atlanta. These pages receive paid Google Ads traffic for Georgia motor vehicle accident cases at roughly $65 per click, so correctness matters more than cleverness. Two page variants run as an A/B test, each localised across 13 Georgia markets.

The attached HTML mockups are **the source of truth for markup, copy, and styling**. They have already been verified against WCAG contrast, four mobile viewports, tap-target sizing, form flows, and locality switching. Port them faithfully. Do not redesign, restyle, or "improve" them.

## Stack

- Next.js 15, App Router, TypeScript, React Server Components
- Deployed to Vercel
- Plain CSS: `app/globals.css` for tokens, co-located CSS Modules per component
- Playwright + `@axe-core/playwright` for tests

**Do not:**
- Do not convert the CSS to Tailwind. Every value in the mockups was tuned against contrast and layout tests; re-expressing it loses that work.
- Do not add a UI component library.
- Do not add animation beyond what exists in the mockups.
- Do not use `localStorage`. Attribution uses `sessionStorage` deliberately.
- Do not make the whole page a client component. Server-render everything except the form island.

Set `"lib": ["es2020", "dom", "dom.iterable"]` in `tsconfig.json` or the test suite will not compile.

## File structure

```
app/
  layout.tsx                          GTM script, fonts, globals.css
  globals.css                         ace-brand.css verbatim
  lp/[variant]/ga/[market]/page.tsx   the 26 static pages
  privacy-policy/page.tsx
  disclaimer/page.tsx
  api/lead/route.ts                   server-side lead handler
components/lp/
  Counsel.tsx                         server component
  CaseCheck.tsx                       server component
  LeadForm.tsx                        "use client"
  CaseCheckQuiz.tsx                   "use client"
  StickyCallBar.tsx
  TestimonialVideos.tsx
lib/
  locales.ts                          typed from ace-locales.js
  attribution.ts
  ghl.ts
  analytics.ts
tests/
  landing-pages.spec.ts               attached, must pass unmodified
public/
  ace-logo.svg, ace-logo-white.svg, mumin.jpg
  testimonial-1.mp4, testimonial-1.jpg, testimonial-1.vtt
  testimonial-2.mp4, testimonial-2.jpg, testimonial-2.vtt
```

## Build in this order

### 1. Routes and locale system

```ts
// app/lp/[variant]/ga/[market]/page.tsx
export const dynamicParams = false;   // unknown slug 404s instead of rendering blank
export function generateStaticParams() {
  return Object.keys(LOCALES).flatMap(market =>
    (['counsel', 'case-check'] as const).map(variant => ({ variant, market })));
}
export async function generateMetadata({ params }) {
  const L = LOCALES[params.market];
  return { title: L.title, description: L.desc, robots: { index: false, follow: true } };
}
```

Port `ace-locales.js` to `lib/locales.ts` with a `Market` type and a `MarketSlug` union derived from the keys. All 13 markets, all 10 fields, values unchanged.

Localised values must be **rendered server-side into the HTML**, not swapped by client JavaScript as the mockup does. The mockup uses `data-loc` attributes because it has to work as a static file. In Next.js, pass the locale record down as props.

`noindex, follow` on every LP route. These must not compete with myacelaw.com in organic.

### 2. Design system

`ace-brand.css` becomes `app/globals.css` unchanged, including its comment block. Those three rules describe bugs that already happened:

- Any light card inside a dark section must set its own `color`. The hero sets `color:#fff`, and a nested white card inherits it, rendering the entire form white on white. Put `color: var(--ink)` on the card component itself.
- `--gold` is a fill, never text on a light background. Buttons take dark text `#20180A`. For gold text on light, use `--gold-ink`.
- Light brand colours force pure white text. Relevant if the palette ever changes.

Fonts self-hosted via `next/font/google` (Newsreader, Inter, JetBrains Mono) so there is no render-blocking request to Google's CDN.

### 3. Form and lead handling

The form is a client island. Everything else stays a server component.

**Attribution** (`lib/attribution.ts`): on mount, read `gclid`, `gbraid`, `wbraid`, `fbclid`, `utm_source`, `utm_medium`, `utm_campaign`, `utm_term` from the query string, fall back to `sessionStorage`, write back to `sessionStorage`, populate hidden fields. Also capture `landing_page`, `referrer`, and `market`.

`gbraid` and `wbraid` are not optional. Google splits iOS app and web-to-app clicks into those parameters; omit them and you lose iOS attribution entirely.

**POST to `/api/lead`, not to GHL from the browser.** Server-side gives you spam filtering, rate limiting, and a place to fire the server-side conversion.

The route handler must:
1. Reject if the honeypot field is filled
2. Reject if submitted under 3 seconds after page load (bot signal)
3. Rate limit by IP
4. POST to the GHL inbound webhook with all fields mapped to the same custom fields as the existing "ACE Law - MV Lead Form"
5. Fire a GA4 Measurement Protocol `generate_lead` event with an `event_id` matching the client-side push
6. Return `{ ok: true, eventId }`

Spam filtering is not hygiene here, it is bidding accuracy. Junk form fills become conversions, and Smart Bidding optimises toward whatever you tell it is a conversion. Garbage in trains it to buy more garbage.

Environment variables: `GHL_WEBHOOK_URL`, `GHL_LOCATION_ID`, `GA4_MEASUREMENT_ID`, `GA4_API_SECRET`, `NEXT_PUBLIC_GTM_ID`.

### 4. Tracking

GTM `GTM-5KFRRG3Q` in `app/layout.tsx` via `next/script` with `strategy="afterInteractive"`. GA4 property `G-LSC1GC0CRM`.

Every `dataLayer` push carries `lp_variant`, `experiment_id`, `lp_market`, `lp_practice`.

| Event | Fires on |
|---|---|
| `lp_view` | page load |
| `form_start` | first input touched |
| `form_step_2` | Counsel step 1 complete |
| `form_error` | inline validation failure |
| `casecheck_step` | each quiz question |
| `testimonial_play` / `testimonial_complete` | video engagement |
| `generate_lead` | successful submit |
| `click_to_call` | any `tel:` click |

**Fire `generate_lead` both client-side and server-side, deduplicated on `event_id`.** Client-side alone gets eaten by ad blockers. This is not hypothetical for this account: an ad blocker suppressed analytics hits during earlier testing on this exact property.

### 5. Media

- Logo from `/public/ace-logo.svg`, with the text lockup fallback from the mockups preserved. White version in the dark footer.
- Mu'min's photo: `object-fit: cover`, `object-position: 50% 18%`. If the source is a transparent cutout rather than a full-bleed photo, switch to `object-fit: contain` — the mockup has a comment marking the exact line.
- Testimonial videos: `playsinline`, `controls`, `preload="none"`, real `poster` images, and a `<track kind="captions">` per video. **`playsinline` is mandatory** — without it iOS Safari throws the user into fullscreen on tap, out of your page and away from the form.
- Everything served from `/public`. Nothing hotlinked to WordPress.

### 6. Tests

`tests/landing-pages.spec.ts` is attached and is the acceptance bar. Run it with `npx playwright test`. It must pass **unmodified**.

If a test fails, fix the implementation. Do not edit the test to accommodate the code. Every assertion in that file corresponds to a bug that actually occurred:

- Contrast measured against gradient stops, because a nested card once rendered an entire form white on white
- Collapsed-container detection, because `margin: 0 auto` on a grid item forces fit-content sizing and shrank a portrait to 2×3px
- Quiz step advancement, because a state array named `history` collided with the read-only `window.history` and silently broke the whole quiz
- 44px tap targets, because footer phone links were 102×15px
- `scroll-margin-top` ≥ header height, because anchor jumps landed under the sticky header
- Sticky bar occlusion, because a fixed bar was physically blocking taps on a submit button
- No `alert()` for validation, because it is a jarring system modal on iOS and yields no analytics
- No market page implying an office outside Atlanta, because bar rules restrict that

Add a `test:ci` script and wire it to run on every Vercel preview deploy.

## Acceptance criteria

1. `npx playwright test` green: both variants, all 13 markets, four viewport widths
2. All 26 pages statically prerendered; an unknown market slug returns 404
3. Lighthouse mobile performance ≥ 90 and accessibility 100 on both variants
4. Zero WCAG AA contrast failures, verified in both the initial and post-interaction states
5. A submission with `?gclid=TEST123` reaches GHL carrying the click ID and market slug
6. A submission with an ad blocker enabled still records a server-side conversion
7. No outbound links other than the privacy policy and disclaimer

## When you are done

Report back with: the routes generated, the Playwright results summary, Lighthouse scores for both variants, and any place where you deviated from the mockups and why. Flag anything you stubbed rather than implemented, particularly missing media assets.

---

## Follow-up prompt, once the build is green

Use this after the first pass:

> Add a Vercel Edge Middleware A/B split at `/go` that assigns visitors 50/50 between the two variants, persists the choice in a 90-day cookie, preserves all query parameters, excludes bot user agents from the sample, and sets `Cache-Control: private, no-store` so the edge cache cannot serve one variant to everybody. Support `?v=counsel` and `?v=case-check` to force a variant for previewing. Expose the assignment in an `x-ace-variant` response header. Add a Playwright test that hits `/go` 40 times with fresh contexts and asserts the split lands between 35% and 65%.

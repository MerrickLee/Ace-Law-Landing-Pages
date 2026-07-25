# ACE Law — Geo-Targeted Landing Pages

## What's live in the mockups now

Open either page with a `?loc=` parameter and the whole page re-targets:

```
ace-lp-01-counsel.html                      -> statewide Georgia
ace-lp-01-counsel.html?loc=marietta         -> Marietta / Cobb County
ace-lp-01-counsel.html?loc=lawrenceville    -> Lawrenceville / Gwinnett County
ace-lp-01-counsel.html?loc=savannah         -> Savannah / Chatham County
ace-lp-01-counsel.html?loc=anything-invalid -> falls back to statewide
```

Thirteen Georgia markets are loaded: statewide, Atlanta, Sandy Springs, Marietta, Decatur, Lawrenceville, Alpharetta, McDonough, Douglasville, Savannah, Augusta, Macon, Columbus.

What changes per market: page title, meta description, hero eyebrow, H1, the serving-area line in the hero and footer, the county badge, the venue reference, and the placeholder text in the "what happened" field. The market slug is written into a hidden `market` field on the form and onto every `dataLayer` event as `lp_market`.

The data lives in **`ace-locales.js`**, one record per market with ten fields. Both pages read from it. Adding a market is adding an object.

---

## Moving this to Next.js

The mockup reads the slug from a query parameter because that's what works in a static file. In production use a path segment instead: it's cleaner for per-ad-group Final URLs, it reads better in the ad's display URL, and it doesn't collide with the tracking parameters Google appends.

```
app/
  lp/
    [variant]/
      ga/
        [market]/
          page.tsx        ->  /lp/counsel/ga/marietta
lib/
  locales.ts              ->  the same records as ace-locales.js, typed
```

```ts
// app/lp/[variant]/ga/[market]/page.tsx
import { LOCALES, type MarketSlug } from '@/lib/locales';

export const dynamicParams = false;            // unknown slugs 404 rather than render empty
export function generateStaticParams() {
  return Object.keys(LOCALES).flatMap(market =>
    ['counsel', 'case-check'].map(variant => ({ variant, market }))
  );
}

export async function generateMetadata({ params }: { params: { market: MarketSlug } }) {
  const L = LOCALES[params.market];
  return { title: L.title, description: L.desc, robots: { index: false, follow: true } };
}
```

Two things this buys you over the client-side version:

**Titles and meta render server-side.** The mockup sets `document.title` in JavaScript, which is fine for a noindex paid page but would be a real problem if you ever wanted these indexed.

**`dynamicParams = false` means a typo'd slug 404s** instead of quietly rendering the statewide page under a city URL. During a campaign build that's the failure you want to be loud.

With 2 variants × 13 markets you get 26 static pages, all prerendered at build time. That scales to a few hundred before build time becomes a consideration.

---

## Wiring it to campaigns

One ad group per market, one Final URL per ad group:

| Ad group | Final URL |
|---|---|
| MV – Marietta – Exact | `https://go.myacelaw.com/lp/counsel/ga/marietta` |
| MV – Lawrenceville – Exact | `https://go.myacelaw.com/lp/counsel/ga/lawrenceville` |
| MV – Atlanta – Exact | `https://go.myacelaw.com/lp/counsel/ga/atlanta` |

Set the geo target on each ad group to the matching radius. The page and the targeting then agree, which is the whole point: someone searching "car accident lawyer marietta" lands on a page whose H1 says Marietta.

The `market` field arriving in GHL lets you route intake by geography and report cost per signed case by market, which is what will eventually tell you where to concentrate the budget.

**Don't use keyword insertion for the city.** `{KeyWord:Atlanta}` in an H1 is how you end up with "Hurt in a cheap lawyer near me wreck?" on a live page. The URL-driven approach can't produce garbage because the values come from a fixed table.

---

## Three things to get right before scaling this

### 1. Thin content is a real risk

Google's doorway page policy targets exactly this pattern: many near-identical pages differing only by city name. These pages are `noindex` so Search penalties aren't the concern, but **Google Ads has its own low-value content standard**, and a legal advertiser already under manual review is not who you want testing its boundaries.

The mockup's market records include county, interstates, and venue for this reason, so each page says something true about that place rather than swapping one word. If you scale past roughly 15 markets, add at least one genuinely local element per page — local crash context, a named interchange, court-specific detail. If a page reads like every other page with the city find-and-replaced, it probably shouldn't exist.

The stronger version of this strategy is fewer, better pages. Six markets with real local substance will outperform forty thin ones on both conversion rate and policy risk.

### 2. Do not imply an office you don't have

ACE Law's only Georgia office is 7000 Central Parkway, Atlanta 30328. Every market record phrases the location line as **"Serving Marietta and Cobb County from our Atlanta office"** rather than naming a local address, and no page carries a local phone number or map pin.

This matters twice over. Bar advertising rules restrict implying a bona fide office where you have none. And Google Business Profile rules prohibit listings at addresses without staffed presence, so don't pair these pages with virtual-office GBP listings.

Have Mumin confirm the wording meets Georgia Bar requirements before launch.

### 3. Georgia legal claims on the page

The pages now state, and I verified each against primary-source citations:

- **Two years** to file most personal injury claims, O.C.G.A. § 9-3-33. Four years for property damage.
- **Ante litem notice**: as little as six months for a municipality, twelve months for a county.
- **Modified comparative fault, 50% bar**, O.C.G.A. § 51-12-33. Recovery allowed under 50% fault, reduced by your share. At 50% or above, nothing.
- **25/50/25** minimum liability limits.
- **UM/UIM is not required** in Georgia, but insurers must offer it and rejection must be in writing.

These are accurate as researched, but Mumin is the one whose license is attached to them. He signs off before launch.

---

## Adding a market

1. Add a record to `ace-locales.js` (or `lib/locales.ts`) with all ten fields
2. Rebuild. `generateStaticParams` picks it up automatically
3. Create the ad group, set its geo target, point the Final URL at the new slug
4. Load the page and confirm the H1, title, and serving line all read correctly

Ten minutes per market once the pattern is running.

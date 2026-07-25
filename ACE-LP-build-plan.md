# ACE Law Landing Pages — Build Plan

Target: production Next.js build on Vercel, serving Google Ads traffic for Georgia motor vehicle cases.

---

## Before you open Antigravity

Four things gate go-live and none of them are code. Start the slow ones now, because two have external dependencies you don't control.

| Gate | Blocks | Owner | Status |
|---|---|---|---|
| **Google Ads advertiser verification** | Ads serving at all | Google review, days to weeks | In flight |
| **Tracking number port from the outgoing vendor** | Every call conversion | Vendor, hard end-of-July cutoff | **Most urgent** |
| **Mumin's sign-off on Georgia legal copy** | Publishing | Him | Not started |
| **Privacy Policy + Disclaimer live on the LP domain** | Google Ads policy, TCPA consent | You | Not started |

The number port is the one to chase today. Click-to-call will likely be the dominant conversion on a personal injury page, and if the vendor's number goes dark before it moves, every call conversion lands nowhere and you can't reconstruct it after the fact.

**Assets to gather before the build starts**, because Antigravity will otherwise stub them and you'll forget:

- Logo as SVG, plus a white version for the dark footers
- Mu'min's headshot, and confirmation of whether it's a transparent cutout or a full-bleed photo
- Poster JPGs exported from both testimonial videos
- Both testimonial MP4s re-encoded for web (H.264, 1–2 Mbps, faststart)
- Caption VTT files for both videos
- The GHL inbound webhook URL and Location ID
- GA4 Measurement Protocol API secret

---

## Build phases

Realistically phases 1 through 5 fit in a focused day with an agent. Phases 6 and 7 are gated on other people.

### Phase 1 — Scaffold and design system (≈1 hr)
Next.js 15 App Router, TypeScript, Vercel. Port `ace-brand.css` into `app/globals.css` verbatim. Port both mockups' CSS into co-located CSS Modules **without redesigning anything**. The two HTML files are the source of truth for markup and styling; every colour and spacing value in them has already been verified against contrast and layout tests.

*Done when:* both pages render at `/lp/counsel/ga/georgia` and `/lp/case-check/ga/georgia` and look identical to the mockups.

### Phase 2 — Locale system and routes (≈1 hr)
`lib/locales.ts` typed from `ace-locales.js`. Dynamic route `app/lp/[variant]/ga/[market]/page.tsx` with `generateStaticParams`, `generateMetadata`, and `dynamicParams = false`.

*Done when:* all 26 pages (2 variants × 13 markets) prerender, and `/lp/counsel/ga/nonsense` returns a real 404.

### Phase 3 — Form, GHL, and spam defence (≈2 hrs)
Client form island, server route handler that posts to GHL. Honeypot plus a submit-timing check.

*Done when:* a test submission with `?gclid=TEST123` lands in GHL with the click ID and market slug attached.

### Phase 4 — Tracking (≈1.5 hrs)
GTM `GTM-5KFRRG3Q`, GA4 `G-LSC1GC0CRM`. Client-side dataLayer plus a server-side GA4 Measurement Protocol event, deduplicated on a shared `event_id`.

*Done when:* a submission with an ad blocker active still records a conversion.

### Phase 5 — Test suite green (≈1.5 hrs)
`tests/landing-pages.spec.ts` runs clean. This is the acceptance bar, not a formality — every test in it corresponds to a bug that actually occurred during the mockup phase.

*Done when:* `npx playwright test` passes with zero failures across both variants and all 13 markets.

### Phase 6 — Compliance review (gated on Mumin)
He reads and approves: the Georgia legal claims, the testimonial disclaimer, the TCPA consent wording, and the "serving X from our Atlanta office" phrasing on every market page.

### Phase 7 — Google Ads go-live (gated on verification)
Conversion actions, ad group to URL mapping, geo targeting. Detail below.

---

## Google Ads configuration

**Conversion actions**

| Action | Source | Category | Count | Primary? |
|---|---|---|---|---|
| Lead Form Submit | Website (GTM) | Submit lead form | One | Yes |
| Click to Call | Website (GTM) | Contact | One | Yes |
| Phone Call from Ads | Call reporting | Phone call lead | One | Yes |

Set a value on each, even a placeholder. Smart Bidding optimising toward raw form fills with no value will happily buy you the cheapest, worst leads available.

**Settings that matter and are easy to get wrong**

- **Auto-tagging ON.** No auto-tagging means no GCLID, which means the offline conversion import you'll want in 60 days has nothing to key on.
- **Location options set to "Presence: People in or regularly in your targeted locations."** The default includes people merely *interested in* your location, which on a Georgia PI campaign buys you clicks from out of state at $65 each.
- **Ad rotation is irrelevant here** because each ad group has one Final URL. Don't use two URLs in one ad group to split-test pages; Google will optimise the split away.

**Ad group to URL mapping**

| Ad group | Final URL | Geo radius |
|---|---|---|
| MV – Atlanta – Exact | `/lp/counsel/ga/atlanta` | Atlanta + 15mi |
| MV – Marietta – Exact | `/lp/counsel/ga/marietta` | Marietta + 12mi |
| MV – Lawrenceville – Exact | `/lp/counsel/ga/lawrenceville` | Lawrenceville + 12mi |
| MV – Georgia – Broad | `/lp/counsel/ga/georgia` | State of Georgia |

Start with three or four markets, not thirteen. At $1K/month you cannot feed thirteen ad groups enough data for any of them to learn, and thin city pages are the pattern Google's low-value content review looks for. Add markets as spend grows.

---

## Go-live checklist

**Code**
- [ ] `npx playwright test` fully green
- [ ] Lighthouse mobile performance ≥ 90 on both variants
- [ ] Logo, headshot, videos, and posters all served from `/public`, nothing hotlinked to WordPress
- [ ] `noindex, follow` confirmed on every LP route
- [ ] Privacy Policy and Disclaimer live and linked
- [ ] Test submission end to end with `?gclid=TEST123`, confirmed in GHL and the sheet
- [ ] Test submission **with an ad blocker enabled**, server-side conversion still recorded
- [ ] Real phone test on iOS and Android: sticky bar doesn't cover the submit button, `tel:` links dial

**Tracking**
- [ ] GTM container published with all seven triggers
- [ ] `lp_variant`, `experiment_id`, `lp_market` registered as GA4 custom dimensions, at least 24 hours before traffic
- [ ] Conversion actions created and receiving test data
- [ ] Auto-tagging on, location options set to Presence

**Compliance**
- [ ] Mumin has approved every Georgia legal claim
- [ ] Mumin has approved the testimonial disclaimer
- [ ] No market page implies an office outside Atlanta (the test suite enforces this, but read one yourself)
- [ ] Advertiser verification cleared

**Campaign**
- [ ] Campaign still paused until every box above is ticked
- [ ] Each ad group's Final URL loads the correct city page
- [ ] Budget capped, negatives loaded, sub-caps on high-volume "near me" terms

---

## What to watch in week one

Not conversion rate. At 12 to 20 clicks a month it will be noise.

Watch **`lp_view` → `form_start`**. If that's under 25%, the ad-to-headline match is wrong and no amount of page polish fixes it. It fires on far more sessions than conversions do, so it's the only signal that'll move meaningfully in the first fortnight.

Then watch the **ratio of `click_to_call` to `generate_lead`**. If calls outrun forms three to one, restructure the page around the phone and stop optimising the form.

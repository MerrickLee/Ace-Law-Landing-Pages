# ACE Law Landing Pages

This is a Next.js project containing highly localized, high-converting landing pages for ACE Law's personal injury campaigns.

## What This Is

This project serves static, ultra-fast Next.js landing pages designed for Paid Search and Paid Social traffic. 

We currently have **two main variants** being split-tested:
1. **Counsel Variant:** A traditional, authoritative attorney landing page focusing on credibility, case results, and a straightforward contact form.
2. **Case Check Variant:** An interactive, quiz-style landing page designed to lower friction, gather more context (fault, treatment, accident date), and calculate the statute of limitations urgency.

Each variant is procedurally generated for **13 different local markets** in Georgia (e.g., Atlanta, Savannah, Columbus, Marietta). This allows ad campaigns to direct traffic to highly relevant, localized pages (e.g., "Atlanta Car Accident Lawyer" with local imagery and copy).

In total, there are **26 distinct live pages** (2 variants × 13 markets), plus a root redirect.

## Where We Are (Current Status)

The core infrastructure and integration are fully built and live:

- **Deployment:** Hosted on Vercel (`ace-law-landing-pages.vercel.app`), heavily optimized with static generation (SSG) for instant load times.
- **Routing:** 
  - Dynamic routes exist at `/lp/[variant]/ga/[market]`.
  - The root `/` automatically redirects to the default `/lp/counsel/ga/georgia` page.
- **Attribution & Tracking:** 
  - Captures deep attribution parameters (`gclid`, `fbclid`, `wbraid`, `gbraid`, and full `utm_*` tags).
  - Uses Google Tag Manager (`NEXT_PUBLIC_GTM_ID`) for analytics.
- **Lead Routing (API):**
  - Next.js API route (`/api/lead`) accepts form submissions and routes them to the correct GoHighLevel webhook based on the page variant.
- **GoHighLevel Integration:**
  - Live workflows in GHL accept webhook payloads.
  - Automatically creates/updates contacts, maps custom fields (attribution, case type, fault, etc.), tags leads (`lp-case-check`, `lp-counsel`), and drops them into the "PI Boost Lead Pipeline".
- **Google Sheets & Notifications:**
  - Leads are automatically logged to the "ACE Law - MV Leads" Google Sheet.
  - A responsive HTML email template (`public/email-lead-notification.html`) is prepared for internal team alerts via GHL.

## What to Look Forward To (Future Steps)

With the foundation solid, the next phases will focus on optimization and expansion:

1. **A/B Testing & Traffic:** 
   - Launching ad campaigns and monitoring the conversion rate differences between the "Counsel" and "Case Check" variants.
   - Adjusting copy, CTAs, or layout based on heatmaps and user behavior data.
2. **Expansion to New States:** 
   - Adding new routing (e.g., `/lp/[variant]/pa/[market]`) and localizing data for Pennsylvania and New Jersey markets.
3. **Expansion to New Practice Areas:** 
   - Adapting the templates for other PI verticals like Slip & Fall, Medical Malpractice, or Workers' Comp.
4. **CRM Optimization:** 
   - Enhancing the GoHighLevel workflows (e.g., automated follow-up SMS sequences, dynamic email responses based on the "Case Check" inputs).
5. **SEO & Organic (Optional):** 
   - While currently optimized for paid traffic (`robots: noindex`), the architecture can easily support organic, indexable versions of these localized pages in the future.

---

## Local Development

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

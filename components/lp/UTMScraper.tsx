"use client";

import { useEffect } from "react";

export default function UTMScraper() {
  useEffect(() => {
    const params = ['gclid', 'gbraid', 'wbraid', 'fbclid', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_term'];
    const url = new URL(window.location.href);
    params.forEach(p => {
      const v = url.searchParams.get(p);
      if (v) sessionStorage.setItem(p, v);
      const stored = sessionStorage.getItem(p);
      if (stored) {
        const el = document.getElementById(p) as HTMLInputElement;
        if (el) el.value = stored;
      }
    });
    const lEl = document.getElementById('landing_page') as HTMLInputElement;
    if (lEl && !lEl.value) lEl.value = window.location.href;
    const rEl = document.getElementById('referrer') as HTMLInputElement;
    if (rEl && !rEl.value) rEl.value = document.referrer;
  }, []);
  
  return null;
}

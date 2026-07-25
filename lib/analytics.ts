/* eslint-disable @typescript-eslint/no-explicit-any */
export function pushEvent(eventName: string, extra?: Record<string, any>) {
  if (typeof window !== "undefined") {
    const dataLayer = (window as any).dataLayer = (window as any).dataLayer || [];
    
    // Attempt to grab these from the DOM if available
    const variantEl = document.getElementById('lp_variant') as HTMLInputElement | null;
    const marketEl = document.getElementById('market') as HTMLInputElement | null;
    const expEl = document.getElementById('experiment_id') as HTMLInputElement | null;

    const o = {
      event: eventName,
      lp_variant: variantEl?.value || 'unknown',
      experiment_id: expEl?.value || 'ace-mv-lp-2026-q3',
      lp_practice: 'mv_accident',
      lp_market: marketEl?.value || 'unknown',
      ...extra
    };
    
    dataLayer.push(o);
  }
}

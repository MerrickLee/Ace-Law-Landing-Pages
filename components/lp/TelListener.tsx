"use client";

import { useEffect } from "react";
import { pushEvent } from "@/lib/analytics";

export default function TelListener() {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      let target = e.target as HTMLElement | null;
      while (target) {
        if (target.tagName === 'A') {
          const href = target.getAttribute("href");
          if (href && href.startsWith("tel:")) {
            pushEvent("click_to_call", { cta: target.getAttribute("data-cta") || "unknown" });
          }
          break;
        }
        target = target.parentElement;
      }
    };
    
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);
  
  return null;
}

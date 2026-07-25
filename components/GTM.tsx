'use client';

import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';

function GTMAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

  useEffect(() => {
    if (!gtmId) return;
    
    // Construct full URL including query params
    const search = searchParams.toString();
    const url = pathname + (search ? `?${search}` : '');
    
    // Send a pageview event to GTM on route changes
    // @ts-ignore
    if (typeof window !== 'undefined' && window.dataLayer) {
      // @ts-ignore
      window.dataLayer.push({
        event: 'pageview',
        page_path: url,
      });
    }
  }, [pathname, searchParams, gtmId]);

  if (!gtmId) return null;

  return (
    <>
      <Script
        id="gtm-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${gtmId}');
          `,
        }}
      />
    </>
  );
}

export default function GTM() {
  return (
    <Suspense fallback={null}>
      <GTMAnalytics />
    </Suspense>
  );
}

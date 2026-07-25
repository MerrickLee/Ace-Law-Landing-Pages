import type { Metadata } from "next";
import { Inter, Newsreader, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import TelListener from "@/components/lp/TelListener";
import UTMScraper from "@/components/lp/UTMScraper";
import GTM from "@/components/GTM";
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: 'swap' });
const newsreader = Newsreader({ subsets: ["latin"], variable: "--font-newsreader", display: 'swap' });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: 'swap' });

export const metadata: Metadata = {
  title: "ACE Law",
  description: "ACE Law Landing Pages",
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    images: [{ url: '/social-3.png' }],
  },
  twitter: {
    images: ['/social-3.png'],
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${newsreader.variable} ${jetbrains.variable}`}>
      <body>
        <noscript>
          <iframe 
            src={`https://www.googletagmanager.com/ns.html?id=${process.env.NEXT_PUBLIC_GTM_ID}`}
            height="0" 
            width="0" 
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        <GTM />
        <UTMScraper />
        <TelListener />
        {children}
      </body>
    </html>
  );
}

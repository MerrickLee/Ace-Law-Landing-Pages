import { LOCALES, MarketSlug } from "@/lib/locales";
import Counsel from "@/components/lp/Counsel";
import CaseCheck from "@/components/lp/CaseCheck";
import { notFound } from "next/navigation";
import { Metadata } from "next";

export const dynamicParams = false;

export function generateStaticParams() {
  const variants = ["counsel", "case-check"];
  const markets = Object.keys(LOCALES) as MarketSlug[];
  
  const params = [];
  for (const variant of variants) {
    for (const market of markets) {
      params.push({ variant, market });
    }
  }
  
  return params;
}

export async function generateMetadata({ params }: { params: Promise<{ variant: string, market: string }> }): Promise<Metadata> {
  const resolved = await params;
  const data = LOCALES[resolved.market as MarketSlug];
  if (!data) return { title: "Not Found" };
  
  return {
    title: data.title,
    description: data.desc,
    robots: { index: false, follow: true },
  };
}

export default async function LandingPage({
  params
}: {
  params: Promise<{ variant: string; market: string }>
}) {
  const resolvedParams = await params;
  const marketSlug = resolvedParams.market as MarketSlug;
  const variant = resolvedParams.variant;
  
  const data = LOCALES[marketSlug];
  if (!data) {
    notFound();
  }

  if (variant === "counsel") {
    return <Counsel data={data} market={marketSlug} variant={variant} />;
  } else if (variant === "case-check") {
    return <CaseCheck data={data} market={marketSlug} variant={variant} />;
  }

  notFound();
}

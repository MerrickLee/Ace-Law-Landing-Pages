import { NextResponse } from "next/server";

const WEBHOOK_URLS: Record<string, string> = {
  "case-check":
    "https://services.leadconnectorhq.com/hooks/KJwFNcEiPSbGReL9DOyp/webhook-trigger/9d33665e-22ae-4b77-ae6c-e7221191f7e5",
  counsel:
    "https://services.leadconnectorhq.com/hooks/KJwFNcEiPSbGReL9DOyp/webhook-trigger/6a91adc3-383f-4208-a007-38e16cfc14ff",
};

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Check honeypot
    if (body.hp_field) {
      return NextResponse.json({ success: true, message: "Honeypot filled, ignoring." });
    }

    const variant = body.lp_variant || "counsel";
    const webhookUrl = WEBHOOK_URLS[variant] || WEBHOOK_URLS.counsel;

    console.log("New Lead Received:", body);
    console.log("Forwarding to webhook:", webhookUrl);

    const webhookRes = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!webhookRes.ok) {
      console.error("Webhook error:", webhookRes.status, await webhookRes.text());
    }

    return NextResponse.json({ success: true, message: "Lead received." });
  } catch (error) {
    console.error("Error processing lead:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

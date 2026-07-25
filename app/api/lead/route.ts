import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Check honeypot
    if (body.hp_field) {
      return NextResponse.json({ success: true, message: "Honeypot filled, ignoring." });
    }

    // Here you would normally integrate with a CRM (e.g. LeadDockets, Salesforce)
    // or send an email via SendGrid, etc.
    console.log("New Lead Received:", body);

    return NextResponse.json({ success: true, message: "Lead received." });
  } catch (error) {
    console.error("Error processing lead:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

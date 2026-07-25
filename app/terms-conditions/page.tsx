import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions | ACE Law",
  robots: { index: false, follow: true }
};

export default function TermsConditions() {
  return (
    <div style={{ maxWidth: 800, margin: "60px auto", padding: "0 20px" }}>
      <h1 style={{ fontFamily: "var(--display)", marginBottom: "20px" }}>Terms & Conditions</h1>
      <p style={{ color: "var(--slate)" }}>This is a placeholder for the terms & conditions.</p>
      <Link href="/" style={{ color: "var(--accent)" }}>&larr; Back to home</Link>
    </div>
  );
}

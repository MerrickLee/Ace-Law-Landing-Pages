"use client";

export default function CounselStickyBar() {
  return (
    <div className="stickybar">
      <a className="sb-call" href="tel:+14046653144" data-cta="sticky-call">Call now</a>
      <a className="sb-form" href="#leadform" onClick={(e) => { e.preventDefault(); document.getElementById('leadform')?.scrollIntoView({behavior: 'smooth'}) }}><span className="lg">Free case review</span><span className="sm">Free review</span></a>
    </div>
  );
}

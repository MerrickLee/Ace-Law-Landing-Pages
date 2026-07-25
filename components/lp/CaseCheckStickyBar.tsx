"use client";

export default function CaseCheckStickyBar() {
  return (
    <div className="stickybar">
      <a className="sb1" href="tel:+14046653144" data-cta="sticky-call">Call now</a>
      <a className="sb2" href="#tool" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: (document.getElementById('tool')?.offsetTop || 0) - 88, behavior: 'smooth' }) }}>Free case check</a>
    </div>
  );
}

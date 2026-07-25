import './Counsel.css';
import { MarketData, MarketSlug } from "@/lib/locales";
import LeadForm from "./LeadForm";
import TestimonialVideos from "./TestimonialVideos";
import ClientImage from "./ClientImage";
import CounselStickyBar from "./CounselStickyBar";

export default function Counsel({ data, market, variant }: { data: MarketData, market: MarketSlug, variant: string }) {
  return (
    <main className="variant-counsel">
      <div className="strip"><div className="shell">
        <span>Metro Atlanta &amp; Greater Philadelphia</span>
        <span><b>No fee</b> unless we win</span>
        <span>Free case review &mdash; <b>7 days a week</b></span>
      </div></div>

      <header><div className="shell">
        <div className="brand">
          <ClientImage className="logo" src="/logo-new-transparent.png" alt="ACE Law, LP" fallbackMode="brand" />
          <div className="brand-fallback"><div className="mark">&#9824;</div><div>ACE LAW<small>Attorneys at Law</small></div></div>
        </div>
        <a className="callbtn" href="tel:+14046653144" data-cta="header-call"><b>Call now</b> <span>(404) 665-3144</span></a>
      </div></header>

      {/* Hero section */}
      <section className="hero"><div className="shell">
        <div>
          <span className="eyebrow" data-loc="eyebrow">{data.eyebrow}</span>
          <h1>Hurt in a <span data-loc="h1place">{data.h1place}</span> wreck? Get a lawyer on the phone <em>today</em>.</h1>
          <p className="lede">Tell us what happened and an ACE Law attorney will review your case at no cost. Georgia gives you two years to file, and the insurer starts building its file the day of the crash.</p>
          <ul className="checks">
            <li><span className="tick">&#10003;</span><span>You talk to an attorney, not a call-center script.</span></li>
            <li><span className="tick">&#10003;</span><span>We deal with the insurance adjuster so you can focus on treatment.</span></li>
            <li><span className="tick">&#10003;</span><span>We front the case costs. No retainer, no hourly bills.</span></li>
            <li><span className="tick">&#10003;</span><span data-loc="serving">{data.serving}</span></li>
          </ul>
          <div className="badges">
            <span className="badge">Licensed in Georgia</span>
            <span className="badge" data-loc="county">{data.county}</span>
            <span className="badge">Se habla espa&ntilde;ol</span>
          </div>
        </div>

        <div className="card">
          <div className="card-top">
            <h2>Free case review</h2>
            <p>Two quick questions, then how to reach you. Takes about 45 seconds.</p>
            <div className="steps"><i className="on" id="s1"></i><i id="s2"></i></div>
          </div>
          <div className="card-body">
            <LeadForm data={data} market={market} variant={variant} />
          </div>
        </div>
      </div></section>

      {/* Ledger section */}
      <section className="sec">
        <div className="shell">
          <div className="sec-head">
            <span className="eyebrow">What we&rsquo;ve recovered</span>
            <h2>Results from real cases.</h2>
            <p>A sample of recoveries obtained by ACE Law attorneys for injured clients.</p>
          </div>
          <div className="ledger">
            <div className="lrow"><div className="amt">$1,500,000</div><p>Day laborer catastrophically injured at a residential construction site.</p></div>
            <div className="lrow"><div className="amt">$192,000</div><p>Inmate fell 24 feet during a seizure after medical staff withheld his medication.</p></div>
            <div className="lrow"><div className="amt">$97,000</div><p>Store security injured a shopper while attempting to restrain him.</p></div>
            <div className="lrow"><div className="amt">$55,000</div><p>Slip and fall at a university; 82-year-old client required a hip replacement.</p></div>
          </div>
          <p className="disc">Prior results do not guarantee or predict a similar outcome. Every case is different and depends on its own facts.</p>
        </div>
      </section>

      {/* Testimonials */}
      <section className="sec sec-tint"><div className="shell">
        <div className="testi">
          <div className="sec-head">
            <span className="eyebrow">Testimonials</span>
            <h2>Real stories. Real results.</h2>
            <p>Hear directly from people ACE Law represented, in their own words. No scripts and no actors.</p>
            <p className="testi-disc">Testimonials reflect the experience of individual clients. They are not a guarantee, warranty, or prediction of the outcome of your case.</p>
          </div>
          <TestimonialVideos />
        </div>
      </div></section>

      {/* 72 hours */}
      <section className="sec">
        <div className="shell">
          <div className="sec-head">
            <span className="eyebrow">The first 72 hours</span>
            <h2>What happens after you call.</h2>
            <p>The insurance company starts building its file the day of the wreck. Here&rsquo;s how we start building yours.</p>
          </div>
          <div className="grid3">
            <div className="tile"><div className="num">HOUR 1</div><h3>We listen</h3><p>An attorney walks through the crash with you and tells you straight whether you have a claim worth pursuing.</p></div>
            <div className="tile"><div className="num">DAY 1</div><h3>We take over the calls</h3><p>Adjusters go through us. You stop giving recorded statements that get used against you later.</p></div>
            <div className="tile"><div className="num">DAY 2&ndash;3</div><h3>We line up treatment</h3><p>We connect you with providers who will treat now and wait on payment until the case resolves. If your claim has to be filed, it goes in <span data-loc="venue">{data.venue}</span>.</p></div>
          </div>
        </div>
      </section>

      {/* Attorney */}
      <section className="sec sec-tint"><div className="shell">
        <div className="atty">
          <div className="portrait">
            <ClientImage src="/mumin.png" alt="Mu'min F. Islam, attorney at ACE Law, LP" width="480" height="600" loading="lazy" decoding="async" fallbackMode="portrait" />
          </div>
          <div>
            <span className="eyebrow" style={{color: 'var(--gold-ink)', display: 'block', marginBottom: '12px'}}>Who you&rsquo;ll be working with</span>
            <h2>Mu&rsquo;min F. Islam</h2>
            <p className="role">Attorney &middot; ACE Law, LP</p>
            <p>Mu&rsquo;min represents clients in personal injury and civil litigation across Georgia and Pennsylvania, alongside a practice in corporate law and real estate. He has handled high-stakes litigation including contract disputes, investment fraud, and civil rights claims.</p>
            <p>ACE Law is a full-service firm serving Metro Atlanta and Greater Philadelphia. Every case gets prepared with the same thoroughness as a million-dollar trial.</p>
          </div>
        </div>
      </div></section>

      {/* FAQ */}
      <section className="sec"><div className="shell">
        <div className="sec-head"><span className="eyebrow">Straight answers</span><h2>Questions people actually ask.</h2></div>
        <div className="faq">
          <details open><summary>What does it cost to hire you?</summary><p>Nothing up front. We work on a contingency fee, which means our fee comes out of the recovery. If we don&rsquo;t recover money for you, you owe us no attorney&rsquo;s fee.</p></details>
          <details><summary>How long do I have to file in Georgia?</summary><p>Two years from the date of injury for most personal injury claims, under O.C.G.A. &sect; 9-3-33. Property damage runs four years. If a city vehicle was involved you may have as little as six months to give notice, and twelve months for a county. Those notice deadlines catch people out constantly.</p></details>
          <details><summary>The other driver only had state minimum coverage. Now what?</summary><p>Georgia&rsquo;s minimum is 25/50/25: $25,000 per person for bodily injury, $50,000 per accident, and $25,000 for property damage. One ambulance ride and a surgery can pass $25,000 on its own. When that happens we look at your own uninsured and underinsured motorist coverage, and at any other policy that might apply.</p></details>
          <details><summary>I don&rsquo;t think I have UM coverage. Are you sure?</summary><p>Check before you assume. Georgia doesn&rsquo;t require uninsured motorist coverage, but insurers must offer it and you have to reject it in writing. Plenty of people carry it without realising. Send us your declarations page and we&rsquo;ll read it at no charge.</p></details>
          <details><summary>The other driver&rsquo;s insurance already offered me money. Should I take it?</summary><p>Talk to a lawyer first. Early offers usually land before anyone knows the full cost of your treatment, and accepting one typically closes the claim for good.</p></details>
          <details><summary>What if the wreck was partly my fault?</summary><p>Under O.C.G.A. &sect; 51-12-33 Georgia uses modified comparative fault with a 50% bar. You can recover as long as you were less than 50% responsible, and your award drops by your share. At 20% fault a $100,000 case pays $80,000. At 50% it pays nothing, which is exactly why adjusters push fault onto you early.</p></details>
          <details><summary>Do I have to come to your office?</summary><p>No. We can do the first consultation by phone or video, and we can come to you if you&rsquo;re in the hospital or can&rsquo;t travel.</p></details>
        </div>
      </div></section>

      {/* Close */}
      <section className="close"><div className="shell">
        <h2>The insurance company already has a lawyer.</h2>
        <p>Get yours. The call is free, and it takes about ten minutes to find out where you stand.</p>
        <div className="ctarow">
          <a className="btn-gold" href="tel:+14046653144" data-cta="footer-call">Call (404) 665-3144</a>
          <a className="btn-ghost" href="#leadform">Start my free case review</a>
        </div>
      </div></section>

      {/* Footer */}
      <footer><div className="shell">
        <div className="offices">
          <div><b>Metro Atlanta</b><br />7000 Central Parkway, Atlanta, GA 30328<br/><a href="tel:+14046653144">(404) 665-3144</a></div>
          <div><b>Greater Philadelphia</b><br />1500 Chestnut St., Ste. 2 #1481, Philadelphia, PA 19102<br/><a href="tel:+12157352357">(215) 735-2357</a> &middot; By appointment</div>
        </div>
        <div className="offices" style={{borderTop: '1px solid rgba(255,255,255,.1)', paddingTop: '18px'}}>
          <div data-loc="serving">{data.serving}</div>
        </div>
        <div className="legal">
          Attorney Advertising. The information on this page is for general purposes only and is not legal advice. Viewing this page or submitting the form does not create an attorney-client relationship; that relationship begins only when we sign a written agreement. Prior results do not guarantee a similar outcome.<br/>
          &copy; 2026 ACE Law, LP &middot; <a href="/privacy-policy">Privacy Policy</a> &middot; <a href="/terms-conditions">Terms &amp; Conditions</a> &middot; <a href="/disclaimer">Disclaimer</a>
        </div>
      </div></footer>

      <CounselStickyBar />
    </main>
  );
}

import './CaseCheck.css';
import { MarketData, MarketSlug } from "@/lib/locales";
import CaseCheckQuiz from "./CaseCheckQuiz";
import TestimonialVideos from "./TestimonialVideos";
import ClientImage from "./ClientImage";
import CaseCheckStickyBar from "./CaseCheckStickyBar";

export default function CaseCheck({ data, market, variant }: { data: MarketData, market: MarketSlug, variant: string }) {
  return (
    <main className="variant-casecheck">
      <header><div className="shell">
        <div className="brand">
          <ClientImage className="logo" src="/logo-new-transparent.png" alt="ACE Law, LP" fallbackMode="brand" />
          <div className="brand-fallback"><div className="spade">&#9824;</div>ACE LAW</div>
        </div>
        <a className="hcall" href="tel:+14046653144" data-cta="header-call">&#9742; (404) 665-3144</a>
      </div></header>

      <section className="top"><div className="shell">
        <span className="eyebrow"><span data-loc="city">{data.city}</span> car accidents &middot; Free &amp; confidential</span>
        <h1>Find out where your claim stands in <u>60 seconds</u>.</h1>
        <p className="lede">Four questions about your crash in <span data-loc="city">{data.city}</span>. No cost, no obligation, and an ACE Law attorney reviews every answer.</p>
        <div className="trustline">
          <span className="pill"><b>$0</b> unless we win</span>
          <span className="pill"><b>$1.5M</b> top recovery</span>
          <span className="pill" data-loc="serving">{data.serving}</span>
        </div>

        <CaseCheckQuiz data={data} market={market} variant={variant} />

        <div className="reviewer">
          <div className="rv-photo">
            <ClientImage src="/mum-pics/DSC_3484_2.jpg" alt="Mu'min F. Islam" width="112" height="112" loading="lazy" decoding="async" fallbackMode="portrait" />
          </div>
          <div className="rv-txt"><b>Mu&rsquo;min F. Islam</b><span>Attorney at ACE Law, LP. He reviews every case check personally.</span></div>
        </div>
      </div></section>

      <section className="sec sec-white"><div className="shell">
        <div className="head">
          <span className="eyebrow">Why people call us</span>
          <h2>You get an attorney, not an intake queue.</h2>
          <p>ACE Law is a full-service firm serving Metro Atlanta and Greater Philadelphia. Injury cases are handled by attorneys, start to finish.</p>
        </div>
        <div className="g3">
          <div className="tile"><div className="ic">$</div><h3>Nothing up front</h3><p>Contingency fee. We front the case costs, and our fee comes out of the recovery. No recovery, no fee.</p></div>
          <div className="tile"><div className="ic">&#9742;</div><h3>We take the calls</h3><p>Every adjuster call routes through us, so you never give a recorded statement that gets used against you.</p></div>
          <div className="tile"><div className="ic">&#43;</div><h3>Treatment first</h3><p>We connect you with providers who will treat you now and wait for payment until your case resolves.</p></div>
        </div>
      </div></section>

      <section className="sec"><div className="shell">
        <div className="testi">
          <div className="head" style={{margin:0, textAlign:'left'}}>
            <span className="eyebrow">Testimonials</span>
            <h2>Real stories. Real results.</h2>
            <p>Hear directly from people ACE Law represented, in their own words. No scripts and no actors.</p>
            <p className="testi-disc">Testimonials reflect the experience of individual clients. They are not a guarantee, warranty, or prediction of the outcome of your case.</p>
          </div>
          <TestimonialVideos />
        </div>
      </div></section>

      <section className="sec sec-ink"><div className="shell">
        <div className="head">
          <span className="eyebrow">Track record</span>
          <h2>Recoveries for injured clients.</h2>
          <p>A sample of results obtained by ACE Law attorneys.</p>
        </div>
        <div className="numbers">
          <div className="stat"><div className="v">$1.5M</div><p>Construction site injury, day laborer</p></div>
          <div className="stat"><div className="v">$192K</div><p>Civil rights, medication withheld</p></div>
          <div className="stat"><div className="v">$116K</div><p>Civil rights, dialysis denied</p></div>
          <div className="stat"><div className="v">$97K</div><p>Injury during store detention</p></div>
        </div>
        <p style={{fontSize:'12.5px', color:'#8496AE', fontStyle:'italic', margin:'18px 0 0'}}>Prior results do not guarantee a similar outcome. Every case depends on its own facts.</p>
      </div></section>

      <section className="sec"><div className="shell">
        <div className="head"><span className="eyebrow">Good to know</span><h2>Quick answers.</h2></div>
        <div className="faq">
          <details open><summary>Is the case check really free?</summary><p>Yes. There&rsquo;s no cost and no obligation to hire us. If we take your case, we work on contingency, so you pay no attorney&rsquo;s fee unless we recover money for you.</p></details>
          <details><summary>How fast will someone call me?</summary><p>Usually within the hour during business hours. If you submit overnight, expect a call the next morning.</p></details>
          <details><summary>What if I already talked to the insurance company?</summary><p>Still call. We regularly take over claims where a statement was already given or an offer was already made. Just don&rsquo;t sign or accept anything else until we&rsquo;ve looked at it.</p></details>
          <details><summary>Do I have to come into the office?</summary><p>No. The first consultation can be by phone or video, and we can come to you if you&rsquo;re unable to travel.</p></details>
          <details><summary>What if the other driver had no insurance, or only the minimum?</summary><p>Georgia&rsquo;s legal minimum is 25/50/25, which a single surgery can exhaust. Georgia doesn&rsquo;t require uninsured motorist coverage, but insurers must offer it and you have to reject it in writing, so plenty of people carry it without realising. Send us your declarations page and we&rsquo;ll check.</p></details>
        </div>
      </div></section>

      <section className="close"><div className="shell">
        <h2>Not sure if it&rsquo;s worth a call? It&rsquo;s worth a call.</h2>
        <p>Ten minutes on the phone will tell you more than an hour of searching.</p>
        <a className="cbtn" href="tel:+14046653144" data-cta="footer-call">&#9742; (404) 665-3144</a>
      </div></section>

      <footer><div className="shell">
        <div className="offs">
          <div><b>Metro Atlanta</b><br />7000 Central Parkway, Atlanta, GA 30328<br /><a href="tel:+14046653144">(404) 665-3144</a></div>
          <div><b>Greater Philadelphia</b><br />1500 Chestnut St., Ste. 2 #1481, Philadelphia, PA 19102<br /><a href="tel:+12157352357">(215) 735-2357</a> &middot; By appointment only</div>
        </div>
        <div className="legal">
          Attorney Advertising. The case check is an informational tool, not a legal opinion, a case evaluation, or a prediction of any outcome. Using it does not create an attorney-client relationship, which forms only through a signed written agreement. Deadlines described here are general and may not apply to your situation. Prior results do not guarantee a similar outcome.<br />
          &copy; 2026 ACE Law, LP &middot; <a href="/privacy-policy">Privacy Policy</a> &middot; <a href="/terms-conditions">Terms &amp; Conditions</a> &middot; <a href="/disclaimer">Disclaimer</a>
        </div>
      </div></footer>

      <CaseCheckStickyBar />
    </main>
  );
}

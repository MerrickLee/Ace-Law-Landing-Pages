"use client";
import './CaseCheck.css';

import { MarketData, MarketSlug } from "@/lib/locales";
import { useState, useRef, useEffect } from "react";
import { pushEvent } from "@/lib/analytics";

export default function CaseCheckQuiz({ data, market, variant }: { data: MarketData, market: MarketSlug, variant: string }) {
  const [step, setStep] = useState(1);
  const [stepHistory, setStepHistory] = useState<number[]>([]);
  
  const [answers, setAnswers] = useState({
    caseType: "",
    date: "",
    treat: "",
    fault: "",
    daysRemaining: 0
  });

  const [submitted, setSubmitted] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const startedRef = useRef(false);

  const [utms, setUtms] = useState<Record<string, string>>({});

  useEffect(() => {
    // Attribution capture logic
    const keys = ['gclid', 'gbraid', 'wbraid', 'fbclid', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_term'];
    const q = new URLSearchParams(window.location.search);
    const newUtms: Record<string, string> = {};
    keys.forEach(k => {
      const v = q.get(k) || sessionStorage.getItem('ace_' + k) || sessionStorage.getItem(k) || '';
      if (v) {
        sessionStorage.setItem('ace_' + k, v);
        sessionStorage.setItem(k, v);
      }
      newUtms[k] = v;
    });
    
    newUtms['landing_page'] = window.location.href;
    newUtms['referrer'] = document.referrer;
    
    setUtms(newUtms);
    pushEvent('lp_view');
  }, []);

  const scrollToTool = () => {
    const header = document.querySelector('header');
    const tool = document.getElementById('tool');
    if (header && tool) {
      const h = header.getBoundingClientRect().height;
      const t = tool.getBoundingClientRect().top + window.scrollY - h - 12;
      if (window.scrollY > t - 4) {
        window.scrollTo({
          top: t,
          behavior: typeof window !== "undefined" && window.matchMedia('(prefers-reduced-motion:reduce)').matches ? 'auto' : 'smooth'
        });
      }
    }
  };

  const showStep = (n: number) => {
    setStep(n);
    scrollToTool();
    pushEvent('casecheck_step', { step: n });
    if (n === 5 && !startedRef.current) {
      startedRef.current = true;
      pushEvent('form_start');
    }
  };

  const handleOptClick = (f: string, v: string) => {
    setAnswers(prev => ({ ...prev, [f]: v }));
    if (f === 'caseType') {
      setStepHistory(prev => [...prev, 1]);
      showStep(2);
    } else if (f === 'treat') {
      setStepHistory(prev => [...prev, 3]);
      showStep(4);
    } else if (f === 'fault') {
      setStepHistory(prev => [...prev, 4]);
      // Math for days is already done when date is picked, but let's re-eval if needed
      showStep(5);
    }
  };

  const handleDateNext = () => {
    setStepHistory(prev => [...prev, 2]);
    showStep(3);
  };

  const handleBack = () => {
    const history = [...stepHistory];
    const prevStep = history.pop();
    if (prevStep) {
      setStepHistory(history);
      showStep(prevStep);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;
    
    const formData = new FormData(formRef.current);
    
    // Additional data to append based on react state
    formData.append('case_type', answers.caseType);
    formData.append('accident_date', answers.date);
    formData.append('treatment', answers.treat);
    formData.append('fault', answers.fault);
    formData.append('days_remaining', answers.daysRemaining.toString());
    
    const body = Object.fromEntries(formData.entries());
    
    // Push event before fetch so analytics trigger immediately
    pushEvent('generate_lead', { case_type: answers.caseType || '', value: 1, currency: 'USD' });
    setSubmitted(true);
    showStep(6);

    try {
      await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
    } catch (err) {
      console.error(err);
    }
  };

  // Build readout for step 5
  let readoutNum = "\u2014";
  let readoutUnit = "days left to file";
  let readoutText = "Georgia generally allows two years from the date of injury to file a personal injury lawsuit. Deadlines can be shorter in some situations.";
  let readoutLab = "Georgia filing deadline";
  let readoutClass = "readout";

  if (answers.date) {
    const acc = new Date(answers.date + 'T00:00:00');
    const deadline = new Date(acc);
    deadline.setFullYear(deadline.getFullYear() + 2);
    const days = Math.ceil((deadline.getTime() - new Date().getTime()) / 864e5);
    
    // We update the state once if it hasn't been set yet.
    if (answers.daysRemaining !== days) {
      setTimeout(() => setAnswers(prev => ({ ...prev, daysRemaining: days })), 0);
    }
    
    if (days > 0) {
      readoutNum = days.toLocaleString();
      readoutUnit = days === 1 ? 'day left to file' : 'days left to file';
      readoutText = 'Georgia generally allows two years from the date of injury to file a personal injury lawsuit. Shorter deadlines apply to claims against government entities, and exceptions exist. An attorney should confirm the deadline for your case.';
    } else {
      readoutNum = 'Past';
      readoutUnit = 'the usual two-year window';
      readoutText = 'The general two-year window appears to have passed, but exceptions can extend it depending on the facts. Do not assume your claim is closed without talking to an attorney.';
      readoutClass = 'readout warn';
      readoutLab = 'Worth a conversation';
    }
  } else if (step === 5) {
    readoutNum = '2';
    readoutUnit = 'years, generally';
    readoutText = 'Georgia generally allows two years from the date of injury to file a personal injury lawsuit. An attorney can confirm the deadline that applies to you.';
  }

  const sigs = [];
  if (answers.treat === 'Currently treating' || answers.treat === 'Treated, finished') sigs.push('You have a medical record documenting the injury.');
  if (answers.treat === 'ER only') sigs.push('An ER visit gives us a starting point in the medical record.');
  if (answers.treat === 'Not yet') sigs.push('Getting evaluated soon matters. We can help you find a provider.');
  if (answers.fault === 'Other driver') sigs.push('Fault pointing to the other driver is a helpful starting point.');
  if (answers.fault === 'Both') sigs.push('Georgia allows recovery when you are less than 50% at fault.');
  if (answers.fault === 'Unclear') sigs.push('Unclear fault is common early on. The police report usually clarifies it.');
  if (answers.fault === 'Me') sigs.push('Even so, fault is often shared differently than it first appears.');
  if (step === 5) sigs.push('An attorney will review your answers before calling you.');

  return (
    <div className="tool" id="tool">
      <div className="prog"><i id="bar" style={{ width: Math.min(step * 20, 100) + '%' }}></i></div>
      <div className="tool-in">
        <form id="leadform" noValidate ref={formRef} onSubmit={handleSubmit}>
          <input type="hidden" name="gclid" id="gclid" value={utms.gclid || ''} />
          <input type="hidden" name="gbraid" id="gbraid" value={utms.gbraid || ''} />
          <input type="hidden" name="wbraid" id="wbraid" value={utms.wbraid || ''} />
          <input type="hidden" name="fbclid" id="fbclid" value={utms.fbclid || ''} />
          <input type="hidden" name="utm_source" id="utm_source" value={utms.utm_source || ''} />
          <input type="hidden" name="utm_medium" id="utm_medium" value={utms.utm_medium || ''} />
          <input type="hidden" name="utm_campaign" id="utm_campaign" value={utms.utm_campaign || ''} />
          <input type="hidden" name="utm_term" id="utm_term" value={utms.utm_term || ''} />
          <input type="hidden" name="landing_page" id="landing_page" value={utms.landing_page || ''} />
          <input type="hidden" name="referrer" id="referrer" value={utms.referrer || ''} />
          <input type="hidden" name="lp_variant" id="lp_variant" value={variant} />
          <input type="hidden" name="experiment_id" id="experiment_id" value="ace-mv-lp-2026-q3" />
          <input type="hidden" name="market" id="market" value={market} />
          {/* Honeypot field for spam */}
          <input type="text" name="hp_field" style={{display: "none"}} tabIndex={-1} autoComplete="off" />

          {/* Q1 */}
          <div className={`qstep ${step === 1 ? '' : 'hide'}`} data-step="1">
            <div className="qcount">Question 1 of 4</div>
            <p className="q">What kind of accident were you in?</p>
            <div className="opts">
              <button type="button" className="opt" onClick={() => handleOptClick('caseType', 'Car accident')}>Car accident<span className="arw" aria-hidden="true">&rarr;</span></button>
              <button type="button" className="opt" onClick={() => handleOptClick('caseType', 'Truck / 18-wheeler')}>Truck or 18-wheeler<span className="arw" aria-hidden="true">&rarr;</span></button>
              <button type="button" className="opt" onClick={() => handleOptClick('caseType', 'Motorcycle')}>Motorcycle<span className="arw" aria-hidden="true">&rarr;</span></button>
              <button type="button" className="opt" onClick={() => handleOptClick('caseType', 'Rideshare')}>Uber or Lyft<span className="arw" aria-hidden="true">&rarr;</span></button>
              <button type="button" className="opt" onClick={() => handleOptClick('caseType', 'Pedestrian / bicycle')}>Pedestrian or bicycle<span className="arw" aria-hidden="true">&rarr;</span></button>
            </div>
            <p className="helper">Your answers stay confidential and are never sold.</p>
          </div>

          {/* Q2 */}
          <div className={`qstep ${step === 2 ? '' : 'hide'}`} data-step="2">
            <div className="qcount">Question 2 of 4</div>
            <p className="q">What date did it happen?</p>
            <label className="f"><span>Approximate is fine</span>
              <input type="date" id="dateInput" value={answers.date} onChange={e => setAnswers({...answers, date: e.target.value})} />
            </label>
            <button type="button" className="go" onClick={handleDateNext}>Continue</button>
            <button type="button" className="backlink" onClick={handleBack}>&larr; Back</button>
          </div>

          {/* Q3 */}
          <div className={`qstep ${step === 3 ? '' : 'hide'}`} data-step="3">
            <div className="qcount">Question 3 of 4</div>
            <p className="q">Have you seen a doctor since the crash?</p>
            <div className="opts">
              <button type="button" className="opt" onClick={() => handleOptClick('treat', 'Currently treating')}>Yes, I&rsquo;m still being treated<span className="arw" aria-hidden="true">&rarr;</span></button>
              <button type="button" className="opt" onClick={() => handleOptClick('treat', 'Treated, finished')}>Yes, treatment is finished<span className="arw" aria-hidden="true">&rarr;</span></button>
              <button type="button" className="opt" onClick={() => handleOptClick('treat', 'ER only')}>ER or urgent care only<span className="arw" aria-hidden="true">&rarr;</span></button>
              <button type="button" className="opt" onClick={() => handleOptClick('treat', 'Not yet')}>Not yet<span className="arw" aria-hidden="true">&rarr;</span></button>
            </div>
            <button type="button" className="backlink" onClick={handleBack}>&larr; Back</button>
          </div>

          {/* Q4 */}
          <div className={`qstep ${step === 4 ? '' : 'hide'}`} data-step="4">
            <div className="qcount">Question 4 of 4</div>
            <p className="q">Who was cited or found at fault?</p>
            <div className="opts">
              <button type="button" className="opt" onClick={() => handleOptClick('fault', 'Other driver')}>The other driver<span className="arw" aria-hidden="true">&rarr;</span></button>
              <button type="button" className="opt" onClick={() => handleOptClick('fault', 'Unclear')}>Nobody yet, it&rsquo;s unclear<span className="arw" aria-hidden="true">&rarr;</span></button>
              <button type="button" className="opt" onClick={() => handleOptClick('fault', 'Both')}>Both of us, partly<span className="arw" aria-hidden="true">&rarr;</span></button>
              <button type="button" className="opt" onClick={() => handleOptClick('fault', 'Me')}>Me<span className="arw" aria-hidden="true">&rarr;</span></button>
            </div>
            <p className="helper">Under O.C.G.A. &sect; 51-12-33 you can still recover in Georgia if you were partly at fault, as long as your share was under 50%.</p>
            <button type="button" className="backlink" onClick={handleBack}>&larr; Back</button>
          </div>

          {/* Contact */}
          <div className={`qstep ${step === 5 ? '' : 'hide'}`} data-step="5">
            <div className="qcount">Last step &mdash; where should the attorney reach you?</div>
            <div className={readoutClass}>
              <div className="lab">{readoutLab}</div>
              <div className="clock"><span className="num" id="rnum">{readoutNum}</span><span className="unit">{readoutUnit}</span></div>
              <p>{readoutText}</p>
            </div>
            <ul className="signals">
              {sigs.map((s, i) => (
                <li key={i}><span className="dot">&#10003;</span><span>{s}</span></li>
              ))}
            </ul>
            <div className="two">
              <label className="f"><span>First name</span><input type="text" name="first_name" autoComplete="given-name" required /></label>
              <label className="f"><span>Last name</span><input type="text" name="last_name" autoComplete="family-name" required /></label>
            </div>
            <label className="f"><span>Mobile phone</span><input type="tel" name="phone" inputMode="tel" autoComplete="tel" placeholder="(404) 555-0142" required /></label>
            <label className="f"><span>Email</span><input type="email" name="email" autoComplete="email" required /></label>
            <label className="consent">
              <input type="checkbox" name="tcpa" required />
              <span>I agree that ACE Law, LP may contact me by phone, text, or email about my case, including with an autodialer or prerecorded message. Consent is not a condition of hiring us. Msg &amp; data rates may apply; reply STOP to opt out. <a onClick={() => window.open('/privacy-policy', '_blank')} style={{cursor: 'pointer', textDecoration: 'underline'}}>Privacy Policy</a>.</span>
            </label>
            <button type="submit" className="go">Send my case check</button>
            <button type="button" className="backlink" onClick={handleBack}>&larr; Back</button>
          </div>

          {/* Thanks */}
          <div className={`qstep ${step === 6 ? '' : 'hide'}`} data-step="6" style={{textAlign:'center', padding:'14px 0'}}>
            <div style={{width:'54px', height:'54px', borderRadius:'50%', background:'var(--accent-soft)', color:'var(--accent)', display:'grid', placeItems:'center', fontSize:'26px', margin:'0 auto 16px', fontWeight:700}}>&#10003;</div>
            <h2 style={{fontSize:'27px', marginBottom:'10px'}}>Your case check is in.</h2>
            <p style={{color:'var(--mid)', margin:'0 0 20px', fontSize:'16px'}}>An ACE Law attorney will call you shortly. If you&rsquo;d rather not wait, call us right now.</p>
            <a className="cbtn" href="tel:+14046653144" data-cta="thanks-call">&#9742; (404) 665-3144</a>
          </div>
        </form>
      </div>
    </div>
  );
}

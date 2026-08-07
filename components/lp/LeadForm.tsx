"use client";
import './Counsel.css';

import { MarketData, MarketSlug } from "@/lib/locales";
import { useState, useRef, useEffect } from "react";
import { pushEvent } from "@/lib/analytics";

export default function LeadForm({ data, market, variant }: { data: MarketData, market: MarketSlug, variant: string }) {
  const [step, setStep] = useState(1);
  const [accidentDate, setAccidentDate] = useState("");
  const [treatment, setTreatment] = useState("");
  
  const [missDate, setMissDate] = useState(false);
  const [missTreat, setMissTreat] = useState(false);
  const [showErr, setShowErr] = useState(false);

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
    newUtms['started_at'] = Date.now().toString();
    
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUtms(newUtms);
    pushEvent('lp_view');
  }, []);

  const handleInput = () => {
    if (!startedRef.current) {
      startedRef.current = true;
      pushEvent('form_start');
    }
  };

  const scrollToForm = () => {
    const form = document.getElementById('leadform');
    const header = document.querySelector('header');
    if (form && header) {
      const h = header.getBoundingClientRect().height;
      const y = form.getBoundingClientRect().top + window.scrollY - h - 14;
      window.scrollTo({
        top: y,
        behavior: typeof window !== "undefined" && window.matchMedia('(prefers-reduced-motion:reduce)').matches ? 'auto' : 'smooth'
      });
    }
  };

  const handleNext = () => {
    const mDate = !accidentDate;
    const mTreat = !treatment;
    
    setMissDate(mDate);
    setMissTreat(mTreat);
    
    if (mDate || mTreat) {
      setShowErr(true);
      const targetId = mDate ? 'fs-date' : 'fs-treat';
      const target = document.getElementById(targetId);
      const header = document.querySelector('header');
      if (target && header) {
        const h = header.getBoundingClientRect().height;
        window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - h - 20, behavior: 'smooth' });
      }
      pushEvent('form_error', { error_field: mDate ? 'accident_date' : 'treatment' });
      return;
    }
    
    setShowErr(false);
    setStep(2);
    
    // Update steps UI using DOM if needed or let React handle it. React doesn't know about #s1 #s2 in the parent unless we lift state.
    // We will do a quick DOM hack since the steps are in the parent card component.
    const s2 = document.getElementById('s2');
    if (s2) s2.classList.add('on');

    pushEvent('form_step_2', { accident_date: accidentDate, treatment });
    scrollToForm();
    
    if (typeof window !== "undefined" && window.matchMedia('(min-width:941px)').matches) {
      setTimeout(() => {
        const firstInput = document.querySelector('#step2 input') as HTMLInputElement;
        if (firstInput) firstInput.focus();
      }, 50);
    }
  };

  const handleBack = () => {
    setStep(1);
    const s2 = document.getElementById('s2');
    if (s2) s2.classList.remove('on');
    scrollToForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;
    
    const formData = new FormData(formRef.current);
    
    // Convert to JSON and send to API route
    const body = Object.fromEntries(formData.entries());
    
    scrollToForm();

    try {
      await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      // Fire analytics only after a successful submission
      pushEvent('generate_lead', { value: 1, currency: 'USD' });

      // Push required event to GTM dataLayer
      if (typeof window !== "undefined") {
        (window as any).dataLayer = (window as any).dataLayer || [];
        (window as any).dataLayer.push({
          event: "generate_lead",
          lead_type: "car_accident",
          market: market,
        });
      }

      setSubmitted(true);
    } catch (err) {
      console.error(err);
    }
  };

  if (submitted) {
    return (
      <div id="thanks" style={{textAlign: 'center', padding: '22px 0'}}>
        <div style={{width: '52px', height: '52px', borderRadius: '50%', background: 'rgba(14,124,80,.12)', color: 'var(--go)', display: 'grid', placeItems: 'center', fontSize: '25px', margin: '0 auto 16px'}}>&#10003;</div>
        <h2 style={{fontSize: '26px', marginBottom: '8px', color: 'var(--ink)'}}>We got it.</h2>
        <p style={{color: 'var(--slate)', margin: '0 0 20px'}}>An attorney will call you shortly. If it&rsquo;s urgent, call us now.</p>
        <a className="callbtn" style={{justifyContent: 'center'}} href="tel:+14046653144">Call <span>(404) 665-3144</span></a>
      </div>
    );
  }

  return (
    <form id="leadform" noValidate ref={formRef} onInput={handleInput} onSubmit={handleSubmit}>
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
      {utms.started_at && <input type="hidden" name="started_at" value={utms.started_at} />}

      <div id="step1" className={step === 1 ? "" : "hide"}>
        <div className="stepno">Step 1 of 2</div>
        <div className={`err ${showErr ? 'on' : ''}`} id="err1" role="alert" aria-live="polite">Pick one answer for each question so we can route your case to the right attorney.</div>
        <fieldset id="fs-date" className={missDate ? 'invalid' : ''}>
          <legend>When did the accident happen?</legend>
          <div className="opts">
            {["Within the last 7 days", "1 to 6 months ago", "6 months to 2 years ago", "More than 2 years ago"].map((label, i) => {
              const vals = ["Within 7 days", "1-6 months", "6-24 months", "Over 2 years"];
              const val = vals[i];
              return (
                <label key={val} className={`opt ${accidentDate === val ? 'checked' : ''}`}>
                  <input type="radio" name="accident_date" value={val} checked={accidentDate === val} onChange={(e) => setAccidentDate(e.target.value)} required />
                  <span>{label}</span>
                </label>
              );
            })}
          </div>
        </fieldset>
        <fieldset id="fs-treat" className={missTreat ? 'invalid' : ''}>
          <legend>Did you see a doctor?</legend>
          <div className="opts">
            {["Yes, I'm being treated", "ER or urgent care only", "Not yet"].map((label, i) => {
              const vals = ["Yes, treating", "Yes, ER only", "Not yet"];
              const val = vals[i];
              return (
                <label key={val} className={`opt ${treatment === val ? 'checked' : ''}`}>
                  <input type="radio" name="treatment" value={val} checked={treatment === val} onChange={(e) => setTreatment(e.target.value)} />
                  <span>{label.replace("I'm", "I\u2019m")}</span>
                </label>
              );
            })}
          </div>
        </fieldset>
        <button type="button" className="submit" id="next" onClick={handleNext}>Continue</button>
        <p className="secure">&#128274; Your answers stay private. No obligation.</p>
      </div>

      <div id="step2" className={step === 2 ? "" : "hide"}>
        <div className="stepno">Step 2 of 2 &mdash; where do we reach you?</div>
        <div className="row">
          <label className="fld"><span>First name</span><input type="text" name="first_name" autoComplete="given-name" required /></label>
          <label className="fld"><span>Last name</span><input type="text" name="last_name" autoComplete="family-name" required /></label>
        </div>
        <label className="fld"><span>Mobile phone</span><input type="tel" name="phone" autoComplete="tel" inputMode="tel" placeholder="(404) 555-0142" required /></label>
        <label className="fld"><span>Email</span><input type="email" name="email" autoComplete="email" placeholder="you@email.com" required /></label>
        <label className="fld"><span>What happened? <small style={{fontWeight: 400, color: 'var(--slate)'}}>(optional)</small></span>
          <textarea name="notes" placeholder={data.placeholder}></textarea>
        </label>
        <label className="consent">
          <input type="checkbox" name="tcpa" required />
          <span>I agree that ACE Law, LP may contact me by phone, text, or email about my case, including with an autodialer or prerecorded message. Consent is not a condition of hiring us. Message and data rates may apply. Reply STOP to opt out. See our <a onClick={() => window.open('/privacy-policy', '_blank')} style={{cursor: 'pointer', textDecoration: 'underline'}}>Privacy Policy</a>.</span>
        </label>
        <button type="submit" className="submit">Send my case for review</button>
        <button type="button" className="back" id="back" onClick={handleBack}>&larr; Back</button>
      </div>
    </form>
  );
}

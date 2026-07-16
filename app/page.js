'use client';

import { useEffect, useState } from 'react';

// Wedding date/time used by the countdown — edit this.
const WEDDING_DATE = new Date('2027-05-08T16:00:00');

// GitHub Pages only serves static files, so there's no server to run an
// API route on. Point this at a form backend instead — Formspree
// (https://formspree.io) has a free tier that takes about 5 minutes to
// set up: create a form there, then paste its endpoint URL below.
const RSVP_ENDPOINT = ''; // e.g. 'https://formspree.io/f/xxxxxxx'

function useCountdown(target) {
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    const tick = () => {
      const diff = target - new Date();
      if (diff <= 0) {
        setTimeLeft({ done: true });
        return;
      }
      setTimeLeft({
        done: false,
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        mins: Math.floor((diff / (1000 * 60)) % 60),
        secs: Math.floor((diff / 1000) % 60)
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);

  return timeLeft;
}

function pad(n) {
  return String(n).padStart(2, '0');
}

export default function Page() {
  const countdown = useCountdown(WEDDING_DATE);

  const [form, setForm] = useState({
    name: '',
    email: '',
    attending: '',
    guests: '1',
    dietary: '',
    note: ''
  });
  const [status, setStatus] = useState('idle'); // idle | sending | done | error
  const [message, setMessage] = useState('');

  function updateField(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.attending) {
      setMessage('Please let us know if you can make it.');
      return;
    }

    setStatus('sending');
    setMessage('');

    try {
      if (!RSVP_ENDPOINT) {
        // No backend configured yet — fall back to saving in this
        // browser only, so you can still test the form while building.
        const existing = JSON.parse(localStorage.getItem('wedding-rsvps') || '[]');
        existing.push({ ...form, submittedAt: new Date().toISOString() });
        localStorage.setItem('wedding-rsvps', JSON.stringify(existing));
        console.info(
          'RSVP saved to localStorage only (no RSVP_ENDPOINT set in app/page.js). ' +
          'Set RSVP_ENDPOINT before sharing the site so responses reach you from every guest\'s device.'
        );
      } else {
        const res = await fetch(RSVP_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(form)
        });
        if (!res.ok) throw new Error('Request failed');
      }

      setStatus('done');
      setMessage(
        form.attending === 'yes'
          ? `Thank you, ${form.name.split(' ')[0]} — we can't wait to celebrate with you! 🌿`
          : `Thanks for letting us know, ${form.name.split(' ')[0]}. You'll be missed!`
      );
      setForm({ name: '', email: '', attending: '', guests: '1', dietary: '', note: '' });
    } catch (err) {
      setStatus('error');
      setMessage('Something went wrong — please try again.');
    }
  }

  return (
    <>
      <nav>
        <div className="nav-inner">
          <span className="nav-monogram">D &amp; M</span>
          <ul className="nav-links">
            <li><a href="#story">Story</a></li>
            <li><a href="#details">Details</a></li>
            <li><a href="#travel">Travel</a></li>
            <li><a href="#faq">FAQ</a></li>
            <li><a href="#rsvp">RSVP</a></li>
          </ul>
        </div>
      </nav>

      <header className="hero">
        <svg
          className="hero-botanical"
          viewBox="0 0 900 600"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g stroke="currentColor" strokeWidth="1.4" fill="none" opacity="0.9">
            <path d="M60 560 C 80 420, 40 300, 90 160" />
            <path d="M90 160 C 110 140, 140 150, 150 170 C 140 190, 105 190, 90 160 Z" />
            <path d="M75 220 C 95 200, 125 210, 135 230 C 120 250, 90 245, 75 220 Z" />
            <path d="M65 300 C 45 285, 40 255, 60 240 C 80 255, 80 285, 65 300 Z" />
            <path d="M840 40 C 815 170, 850 280, 800 420" />
            <path d="M800 420 C 780 440, 750 430, 745 405 C 760 385, 790 390, 800 420 Z" />
            <path d="M815 340 C 795 325, 790 295, 810 280 C 830 295, 828 325, 815 340 Z" />
            <path d="M825 260 C 845 245, 850 215, 830 200 C 810 215, 810 245, 825 260 Z" />
          </g>
        </svg>
        <div className="hero-content">
          <div className="hero-eyebrow">Together with our families</div>
          <h1 className="hero-names">
            Derrick<span className="hero-amp">&amp;</span>Michelle
          </h1>
          <div className="hero-sub">are getting married</div>
          <div className="hero-place">Saturday, May 8, 2027 · The Willow Barn, Fraser Valley, BC</div>
        </div>
      </header>

      <div className="wrap">
        <div className="countdown-card">
          {countdown?.done ? (
            <div className="countdown-done">Today's the day — see you there! 🌿</div>
          ) : (
            <>
              <div className="countdown-label">Counting down to the big day</div>
              <div className="countdown-grid">
                <div className="cd-unit">
                  <div className="cd-num mono">{countdown ? countdown.days : '--'}</div>
                  <div className="cd-word">Days</div>
                </div>
                <div className="cd-unit">
                  <div className="cd-num mono">{countdown ? pad(countdown.hours) : '--'}</div>
                  <div className="cd-word">Hours</div>
                </div>
                <div className="cd-unit">
                  <div className="cd-num mono">{countdown ? pad(countdown.mins) : '--'}</div>
                  <div className="cd-word">Minutes</div>
                </div>
                <div className="cd-unit">
                  <div className="cd-num mono">{countdown ? pad(countdown.secs) : '--'}</div>
                  <div className="cd-word">Seconds</div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <section id="story">
        <div className="wrap">
          <div className="section-eyebrow">How it began</div>
          <h2 className="section-title">Our Story</h2>
          <svg className="sprig" viewBox="0 0 64 40" fill="none" stroke="currentColor" strokeWidth="1.2">
            <path d="M2 20 H62 M20 20 C 20 10, 28 6, 32 6 C 28 12, 24 16, 20 20 Z M44 20 C 44 30, 36 34, 32 34 C 36 28, 40 24, 44 20 Z" />
          </svg>
          <div className="story-text" style={{ marginTop: 30 }}>
            <p>
              Replace this paragraph with how you two met — the honest, slightly unglamorous
              version usually lands better than the polished one. A coffee shop, a mutual
              friend&apos;s terrible party, a dating app neither of you wanted to be on.
            </p>
            <p>
              Add a second paragraph about the proposal: where it happened, who cried, whether
              the dog was involved. Guests genuinely read this section, so keep it in your own
              voice.
            </p>
          </div>
        </div>
      </section>

      <section id="details">
        <div className="wrap">
          <div className="section-eyebrow">Saturday, May 8, 2027</div>
          <h2 className="section-title">Wedding Day Details</h2>
          <div className="timeline">
            <div className="tl-row">
              <div className="tl-time">3:30 PM</div>
              <div className="tl-what">
                <h3>Guests Arrive</h3>
                <p>Please arrive by 3:45 — the ceremony starts promptly at 4.</p>
              </div>
            </div>
            <div className="tl-row">
              <div className="tl-time">4:00 PM</div>
              <div className="tl-what">
                <h3>Ceremony</h3>
                <p>Outdoor, weather permitting. The Willow Barn, Fraser Valley.</p>
              </div>
            </div>
            <div className="tl-row">
              <div className="tl-time">5:00 PM</div>
              <div className="tl-what">
                <h3>Cocktail Hour</h3>
                <p>Drinks and appetizers on the lawn.</p>
              </div>
            </div>
            <div className="tl-row">
              <div className="tl-time">6:30 PM</div>
              <div className="tl-what">
                <h3>Reception &amp; Dinner</h3>
                <p>Seated dinner, toasts, and dancing until midnight.</p>
              </div>
            </div>
          </div>
          <div className="venue-note">
            <strong>The Willow Barn</strong> — 1284 Orchard Lane, Fraser Valley, BC
            <br />
            Add parking info, shuttle details, or a map link here.
          </div>
        </div>
      </section>

      <section id="travel">
        <div className="wrap">
          <div className="section-eyebrow">Getting here</div>
          <h2 className="section-title">Travel &amp; Stay</h2>
          <div className="card-grid">
            <div className="info-card">
              <h3>Accommodations</h3>
              <p>
                We&apos;ve held a block of rooms at [Hotel Name] about 10 minutes from the venue.
                Mention &quot;Derrick &amp; Michelle Wedding&quot; for the discounted rate.
              </p>
              <a className="button-link" href="#">Book a room →</a>
            </div>
            <div className="info-card">
              <h3>Getting There</h3>
              <p>
                Closest airport is [YVR/Airport Code]. Rental cars are recommended — parking is
                free at the venue. Shuttle details to follow.
              </p>
            </div>
            <div className="info-card">
              <h3>Registry</h3>
              <p>
                Your presence is truly the gift. If you&apos;d like to contribute to our next
                chapter, our registry is linked below.
              </p>
              <a className="button-link" href="#">View registry →</a>
            </div>
            <div className="info-card">
              <h3>Dress Code</h3>
              <p>
                Garden formal. Think soft, seasonal colors — outdoor ceremony on grass, so heels
                may want a wedge.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="faq">
        <div className="wrap">
          <div className="section-eyebrow">Good to know</div>
          <h2 className="section-title">FAQ</h2>
          <div className="faq">
            <details>
              <summary>Are kids welcome?</summary>
              <p>
                Edit this to reflect your policy — e.g. &quot;We love your little ones, but our
                wedding is an adults-only celebration&quot; or the opposite.
              </p>
            </details>
            <details>
              <summary>Can I bring a plus-one?</summary>
              <p>Your invitation will indicate if a plus-one is included. Check your RSVP form below.</p>
            </details>
            <details>
              <summary>What if it rains?</summary>
              <p>The Willow Barn has an indoor space we&apos;ll move to. Either way, the party goes on.</p>
            </details>
            <details>
              <summary>Is there a hashtag?</summary>
              <p>#DerrickAndMichelle2027 — tag your photos so we can find them all later.</p>
            </details>
            <details>
              <summary>When&apos;s the RSVP deadline?</summary>
              <p>Please respond by [date, ~6-8 weeks before the wedding] so we can finalize catering counts.</p>
            </details>
          </div>
        </div>
      </section>

      <section id="rsvp">
        <div className="wrap">
          <div className="section-eyebrow">We can&apos;t wait to celebrate with you</div>
          <h2 className="section-title">RSVP</h2>
          <div className="rsvp-card">
            <form onSubmit={handleSubmit}>
              <div className="field">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  required
                  placeholder="Jamie Smith"
                  value={form.name}
                  onChange={(e) => updateField('name', e.target.value)}
                />
              </div>
              <div className="field">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  required
                  placeholder="jamie@email.com"
                  value={form.email}
                  onChange={(e) => updateField('email', e.target.value)}
                />
              </div>
              <div className="field">
                <label>Will you be attending?</label>
                <div className="radio-row">
                  <label className={`radio-opt ${form.attending === 'yes' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="attending"
                      value="yes"
                      checked={form.attending === 'yes'}
                      onChange={(e) => updateField('attending', e.target.value)}
                    />
                    Joyfully Accept
                  </label>
                  <label className={`radio-opt ${form.attending === 'no' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="attending"
                      value="no"
                      checked={form.attending === 'no'}
                      onChange={(e) => updateField('attending', e.target.value)}
                    />
                    Regretfully Decline
                  </label>
                </div>
              </div>
              <div className="field">
                <label htmlFor="guests"># Attending (including you)</label>
                <select
                  id="guests"
                  value={form.guests}
                  onChange={(e) => updateField('guests', e.target.value)}
                >
                  <option value="1">Just me</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                </select>
              </div>
              <div className="field">
                <label htmlFor="dietary">Dietary Restrictions / Allergies</label>
                <textarea
                  id="dietary"
                  placeholder="Vegetarian, nut allergy, etc. — or leave blank"
                  value={form.dietary}
                  onChange={(e) => updateField('dietary', e.target.value)}
                />
              </div>
              <div className="field">
                <label htmlFor="note">A note for the couple (optional)</label>
                <textarea
                  id="note"
                  placeholder="Song requests, well wishes..."
                  value={form.note}
                  onChange={(e) => updateField('note', e.target.value)}
                />
              </div>
              <button type="submit" className="submit-btn" disabled={status === 'sending'}>
                {status === 'sending' ? 'Sending...' : 'Send RSVP'}
              </button>
              {message && <div className="rsvp-msg">{message}</div>}
            </form>
          </div>
        </div>
      </section>

      <footer>Derrick &amp; Michelle — May 8, 2027 — With love and gratitude</footer>
    </>
  );
}

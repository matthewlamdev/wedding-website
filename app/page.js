'use client';

import { useEffect, useState } from 'react';

// Wedding date/time used by the countdown
const WEDDING_DATE = new Date('2027-05-08T16:00:00');

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

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

// Login Component
function LoginScreen({ onLoginSuccess }) {
  const [code, setCode] = useState('');
  const [loginStatus, setLoginStatus] = useState('idle'); // idle | loading | error
  const [loginError, setLoginError] = useState('');

  async function handleLogin(e) {
    e.preventDefault();
    setLoginStatus('loading');
    setLoginError('');

    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Login failed');
      }

      const data = await response.json();
      localStorage.setItem('wedding_auth_token', data.token);
      setLoginStatus('idle');
      onLoginSuccess(data.guest);
    } catch (err) {
      setLoginStatus('idle');
      setLoginError(err.message || 'Login failed. Please try again.');
    }
  }

  return (
    <div className="login-screen">
      <div className="login-container">
        <div className="hero-content" style={{ marginBottom: 40 }}>
          <div className="hero-eyebrow">Welcome</div>
          <h1 className="hero-names">
            Derrick<span className="hero-amp">&amp;</span>Michelle
          </h1>
          <div className="hero-sub">Wedding Details</div>
        </div>

        <div className="login-card">
          <h2 style={{ marginTop: 0 }}>Guest Login</h2>
          <p style={{ color: '#666', marginBottom: 30 }}>
            Enter your guest code to access your personalized details.
          </p>

          <form onSubmit={handleLogin}>
            <div className="field">
              <label htmlFor="code">Guest Code</label>
              <input
                type="text"
                id="code"
                placeholder="e.g., chui2027"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
            </div>

            {loginError && <div className="error-msg">{loginError}</div>}

            <button type="submit" className="submit-btn" disabled={loginStatus === 'loading'}>
              {loginStatus === 'loading' ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div style={{ marginTop: 20, fontSize: '0.9rem', color: '#999' }}>
            <p style={{ marginTop: 0 }}>Need help? Contact the couple for your guest code and password.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main Wedding Page
function WeddingPage({ guest, onLogout }) {
  const countdown = useCountdown(WEDDING_DATE);
  const [guestData, setGuestData] = useState(guest || null);
  const [rsvpData, setRsvpData] = useState(null);
  const [loadingData, setLoadingData] = useState(true);

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

  // Fetch guest and RSVP data
  useEffect(() => {
    async function fetchData() {
      const token = localStorage.getItem('wedding_auth_token');
      if (!token) {
        setLoadingData(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.ok) {
          const data = await response.json();
          setGuestData(data.guest);
          setRsvpData(data.rsvps);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoadingData(false);
      }
    }

    fetchData();
  }, []);

  function updateField(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.attending) {
      setMessage('Please let us know if you can make it.');
      return;
    }

    if (!guestData?.code) {
      setStatus('error');
      setMessage('Unable to submit RSVP. Please refresh and log in again.');
      return;
    }

    setStatus('sending');
    setMessage('');

    try {
      const res = await fetch(`${API_BASE}/rsvp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guest_code: guestData.code,
          ...form
        })
      });

      if (!res.ok) throw new Error('Request failed');

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

  if (loadingData || !guestData) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        Loading guest details...
      </div>
    );
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
            <li><button onClick={onLogout} className="logout-btn">Logout</button></li>
          </ul>
        </div>
      </nav>

      {/* Guest Info Card */}
      <div className="wrap" style={{ marginTop: 20 }}>
        <div className="guest-info-card">
          <h2>Welcome, {guestData.displayName}!</h2>
          <div className="guest-details">
            <div className="detail-row">
              <strong>Guests:</strong> {guestData.names.join(', ')}
            </div>
            <div className="detail-row">
              <strong>Seats Allotted:</strong> {guestData.seatsAllotted}
            </div>
            {guestData.tableName && (
              <div className="detail-row">
                <strong>Table:</strong> {guestData.tableName}
              </div>
            )}
            {guestData.notes && (
              <div className="detail-row">
                <strong>Notes:</strong> {guestData.notes}
              </div>
            )}
          </div>

          {rsvpData && rsvpData.length > 0 && (
            <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid #eee' }}>
              <h3 style={{ marginTop: 0 }}>Your RSVP</h3>
              {rsvpData.map((rsvp, idx) => (
                <div key={idx} className="rsvp-detail">
                  <strong>{rsvp.name}</strong> — {rsvp.attending === 'yes' ? '✓ Attending' : '✗ Declining'}
                  {rsvp.dietary && <div style={{ fontSize: '0.9rem', color: '#666' }}>Dietary: {rsvp.dietary}</div>}
                  {rsvp.note && <div style={{ fontSize: '0.9rem', color: '#666' }}>Note: {rsvp.note}</div>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

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
              <p>Your invitation will indicate if a plus-one is included. Check your guest info above.</p>
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

// Main App Component
export default function Page() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [guest, setGuest] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('wedding_auth_token');
    if (token) {
      setIsLoggedIn(true);
    }
    setIsLoading(false);
  }, []);

  function handleLoginSuccess(guestData) {
    setGuest(guestData);
    setIsLoggedIn(true);
  }

  function handleLogout() {
    localStorage.removeItem('wedding_auth_token');
    setIsLoggedIn(false);
    setGuest(null);
  }

  if (isLoading) {
    return <div style={{ padding: 40, textAlign: 'center' }}>Loading...</div>;
  }

  if (!isLoggedIn) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  return <WeddingPage guest={guest} onLogout={handleLogout} />;
}

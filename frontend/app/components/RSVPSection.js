'use client';

import { useState } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export function RSVPSection({ guestData }) {
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

  return (
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
  );
}

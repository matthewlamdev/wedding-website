'use client';

import { useState } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export function LoginScreen({ onLoginSuccess }) {
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

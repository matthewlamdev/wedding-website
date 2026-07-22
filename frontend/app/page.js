'use client';

import { useEffect, useState } from 'react';
import { LoginScreen } from './components/LoginScreen';
import { WeddingPage } from './components/WeddingPage';

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

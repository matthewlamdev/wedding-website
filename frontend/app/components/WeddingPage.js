'use client';

import { useEffect, useState } from 'react';
import { useCountdown } from '../hooks/useCountdown';
import { Navigation } from './Navigation';
import { GuestInfoCard } from './GuestInfoCard';
import { HeroSection } from './HeroSection';
import { CountdownCard } from './CountdownCard';
import { StorySection } from './StorySection';
import { DetailsSection } from './DetailsSection';
import { TravelSection } from './TravelSection';
import { FAQSection } from './FAQSection';
import { RSVPSection } from './RSVPSection';
import { Footer } from './Footer';

const WEDDING_DATE = new Date('2027-05-08T16:00:00');
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export function WeddingPage({ guest, onLogout }) {
  const countdown = useCountdown(WEDDING_DATE);
  const [guestData, setGuestData] = useState(guest || null);
  const [rsvpData, setRsvpData] = useState(null);
  const [loadingData, setLoadingData] = useState(true);

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

  if (loadingData || !guestData) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        Loading guest details...
      </div>
    );
  }

  return (
    <>
      <Navigation onLogout={onLogout} />
      <GuestInfoCard guestData={guestData} rsvpData={rsvpData} />
      <HeroSection />
      <CountdownCard countdown={countdown} />
      <StorySection />
      <DetailsSection />
      <TravelSection />
      <FAQSection />
      <RSVPSection guestData={guestData} />
      <Footer />
    </>
  );
}

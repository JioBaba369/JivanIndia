
'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const COOKIE_CONSENT_KEY = 'jivanindia-cookie-consent';

export default function CookieConsentBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check localStorage only on the client side after mount
    if (typeof window !== 'undefined') {
        const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
        if (!consent) {
          setIsVisible(true);
        }
    }
  }, []);

  const handleAccept = () => {
    if (typeof window !== 'undefined') {
        localStorage.setItem(COOKIE_CONSENT_KEY, 'true');
        setIsVisible(false);
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <Card className="container mx-auto max-w-4xl p-4 shadow-2xl">
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <p className="flex-grow text-sm text-muted-foreground text-center sm:text-left">
            We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.{' '}
            <Link href="/legal/privacy" className="underline hover:text-primary">
              Learn more
            </Link>
            .
          </p>
          <Button onClick={handleAccept} className="flex-shrink-0">Accept</Button>
        </div>
      </Card>
    </div>
  );
}

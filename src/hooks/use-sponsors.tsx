
'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface Sponsor {
  id: string;
  name: string;
  industry: string;
  tier: 'Platinum' | 'Gold' | 'Silver' | 'Bronze';
  logoUrl: string;
  website: string;
  description: string;
  fullDescription: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  socialMedia: {
    twitter?: string;
    linkedin?: string;
    facebook?: string;
  };
  region: string;
  eventsSponsored: Array<{ eventId: string, eventName: string }>;
}

interface SponsorsContextType {
  sponsors: Sponsor[];
  getSponsorById: (id: string) => Sponsor | undefined;
}

const SponsorsContext = createContext<SponsorsContextType | undefined>(undefined);

const initialSponsors: Sponsor[] = [];

export function SponsorsProvider({ children }: { children: ReactNode }) {
  const [sponsors, setSponsors] = useState<Sponsor[]>(initialSponsors);

  useEffect(() => {
    setSponsors(initialSponsors);
  }, []);

  const getSponsorById = (id: string) => {
    return sponsors.find(sponsor => sponsor.id === id);
  };

  const value = {
    sponsors,
    getSponsorById,
  };

  return (
    <SponsorsContext.Provider value={value}>
      {children}
    </SponsorsContext.Provider>
  );
}

export function useSponsors() {
  const context = useContext(SponsorsContext);
  if (context === undefined) {
    throw new Error('useSponsors must be used within a SponsorsProvider');
  }
  return context;
}

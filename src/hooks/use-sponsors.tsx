
'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { initialSponsors as data, type Sponsor as SponsorType } from '@/data/sponsors';

export type Sponsor = SponsorType;
export const initialSponsors = data;


interface SponsorsContextType {
  sponsors: Sponsor[];
  getSponsorById: (id: string) => Sponsor | undefined;
}

const SponsorsContext = createContext<SponsorsContextType | undefined>(undefined);


export function SponsorsProvider({ children }: { children: ReactNode }) {
  const [sponsors] = useState<Sponsor[]>(initialSponsors);


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

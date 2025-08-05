
'use client';

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { initialSponsors as data, type Sponsor as SponsorType } from '@/data/sponsors';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';

export type Sponsor = SponsorType;
export const initialSponsors = data;


interface SponsorsContextType {
  sponsors: Sponsor[];
  isLoading: boolean;
  getSponsorById: (id: string) => Sponsor | undefined;
}

const SponsorsContext = createContext<SponsorsContextType | undefined>(undefined);
const sponsorsCollectionRef = collection(firestore, 'sponsors');

export function SponsorsProvider({ children }: { children: ReactNode }) {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSponsors = useCallback(async () => {
    setIsLoading(true);
    try {
      const querySnapshot = await getDocs(sponsorsCollectionRef);
      if (querySnapshot.empty) {
        setSponsors(initialSponsors);
      } else {
        const sponsorsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Sponsor));
        setSponsors(sponsorsData);
      }
    } catch (error) {
      console.error("Failed to fetch sponsors from Firestore", error);
      setSponsors(initialSponsors); // Fallback to static data
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSponsors();
  }, [fetchSponsors]);


  const getSponsorById = (id: string) => {
    return sponsors.find(sponsor => sponsor.id === id);
  };

  const value = {
    sponsors,
    isLoading,
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

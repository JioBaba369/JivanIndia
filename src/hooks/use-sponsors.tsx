'use client';

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';

export type SponsorTier = 'Platinum' | 'Gold' | 'Silver' | 'Bronze' | 'Supporter';

export interface Sponsor {
  id: string;
  name: string;
  logoUrl: string;
  website: string;
  industry: string;
  tier: SponsorTier;
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
  eventsSponsored: Array<{
    eventId: string;
    contribution: string;
  }>;
}

export type NewSponsorInput = Omit<Sponsor, 'id' | 'eventsSponsored'>;


interface SponsorsContextType {
  sponsors: Sponsor[];
  isLoading: boolean;
  getSponsorById: (id: string) => Sponsor | undefined;
  addSponsor: (sponsor: NewSponsorInput) => Promise<Sponsor>;
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
        const sponsorsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Sponsor));
        setSponsors(sponsorsData);
    } catch (error) {
        console.error("Failed to fetch sponsors from Firestore", error);
        setSponsors([]);
    } finally {
        setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSponsors();
  }, [fetchSponsors]);
  
  const addSponsor = async (sponsorData: NewSponsorInput): Promise<Sponsor> => {
    const newSponsorData = { ...sponsorData, eventsSponsored: [] };
    const docRef = await addDoc(sponsorsCollectionRef, newSponsorData);
    const newSponsor = { id: docRef.id, ...newSponsorData } as Sponsor;
    setSponsors(prev => [...prev, newSponsor]);
    return newSponsor;
  }


  const getSponsorById = useCallback((id: string) => {
    if (!id) return undefined;
    return sponsors.find(sponsor => sponsor.id === id);
  }, [sponsors]);

  const value = {
    sponsors,
    isLoading,
    getSponsorById,
    addSponsor
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

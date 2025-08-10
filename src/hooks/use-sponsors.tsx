
'use client';

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, serverTimestamp, query, orderBy, doc } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import { useToast } from './use-toast';

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
  createdAt: any;
}

export type NewSponsorInput = Omit<Sponsor, 'id' | 'eventsSponsored' | 'createdAt'>;


interface SponsorsContextType {
  sponsors: Sponsor[];
  isLoading: boolean;
  getSponsorById: (id: string) => Sponsor | undefined;
  addSponsor: (sponsor: NewSponsorInput) => Promise<Sponsor>;
  updateSponsor: (id: string, sponsor: Partial<NewSponsorInput>) => Promise<void>;
  deleteSponsor: (id: string) => Promise<void>;
}

const SponsorsContext = createContext<SponsorsContextType | undefined>(undefined);

export function SponsorsProvider({ children }: { children: ReactNode }) {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    setIsLoading(true);
    const q = query(collection(firestore, 'sponsors'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, 
      (querySnapshot) => {
        const sponsorsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Sponsor));
        setSponsors(sponsorsData);
        setIsLoading(false);
      },
      (error) => {
        console.error("Failed to fetch sponsors from Firestore", error);
        toast({ title: "Error", description: "Could not fetch sponsors.", variant: "destructive" });
        setIsLoading(false);
      }
    );
    
    return () => unsubscribe();
  }, [toast]);
  
  const addSponsor = useCallback(async (sponsorData: NewSponsorInput): Promise<Sponsor> => {
    try {
        const newSponsorData = { ...sponsorData, eventsSponsored: [], createdAt: serverTimestamp() };
        const docRef = await addDoc(collection(firestore, 'sponsors'), newSponsorData);
        return { id: docRef.id, ...newSponsorData, createdAt: { toDate: () => new Date() } } as Sponsor;
    } catch(error) {
        console.error("Error adding sponsor:", error);
        toast({ title: "Error", description: "Could not add new sponsor.", variant: "destructive" });
        throw error;
    }
  }, [toast]);

  const updateSponsor = useCallback(async (id: string, sponsorData: Partial<NewSponsorInput>) => {
    const sponsorDocRef = doc(firestore, 'sponsors', id);
    try {
        await updateDoc(sponsorDocRef, sponsorData);
        toast({ title: 'Sponsor Updated', description: 'The sponsor details have been saved.' });
    } catch (e) {
        console.error("Error updating sponsor:", e);
        toast({ title: "Error", description: "Could not update the sponsor.", variant: "destructive" });
        throw e;
    }
  }, [toast]);

  const deleteSponsor = useCallback(async (id: string) => {
    const sponsorDocRef = doc(firestore, 'sponsors', id);
    try {
        await deleteDoc(sponsorDocRef);
        toast({ title: 'Sponsor Deleted', description: 'The sponsor has been removed.' });
    } catch (e) {
        console.error("Error deleting sponsor:", e);
        toast({ title: "Error", description: "Could not delete the sponsor.", variant: "destructive" });
        throw e;
    }
  }, [toast]);


  const getSponsorById = useCallback((id: string) => {
    if (!id) return undefined;
    return sponsors.find(sponsor => sponsor.id === id);
  }, [sponsors]);

  const value = {
    sponsors,
    isLoading,
    getSponsorById,
    addSponsor,
    updateSponsor,
    deleteSponsor
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

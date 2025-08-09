
'use client';

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { collection, onSnapshot, doc, addDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import { useToast } from './use-toast';

export interface Deal {
  id: string;
  title: string;
  description: string;
  terms: string;
  category: 'Food & Dining' | 'Retail & Shopping' | 'Services' | 'Entertainment' | 'Other';
  imageUrl: string;
  expires: string; 
  business: string;
  businessId: string; // This should be the community ID
  businessLocation: string;
  businessWebsite: string;
  postedAt: any; 
  submittedByUid: string;
}

export type NewDealInput = Omit<Deal, 'id' | 'postedAt'>;

interface DealsContextType {
  deals: Deal[];
  isLoading: boolean;
  error: Error | null;
  getDealById: (id: string) => Deal | undefined;
  addDeal: (deal: NewDealInput) => Promise<Deal>;
}

const DealsContext = createContext<DealsContextType | undefined>(undefined);

export function DealsProvider({ children }: { children: ReactNode }) {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    const q = query(collection(firestore, 'deals'), orderBy('postedAt', 'desc'));

    const unsubscribe = onSnapshot(q, 
      (querySnapshot) => {
        const dealsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Deal));
        setDeals(dealsData);
        setIsLoading(false);
      },
      (err) => {
        console.error("Failed to fetch deals from Firestore", err);
        setError(new Error("Could not fetch deals."));
        toast({ title: "Error", description: "Could not fetch deals.", variant: "destructive" });
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [toast]);

  const addDeal = useCallback(async (dealData: NewDealInput): Promise<Deal> => {
    try {
        const newDeal = {
          ...dealData,
          postedAt: serverTimestamp(),
        };
        const docRef = await addDoc(collection(firestore, 'deals'), newDeal);
        return { id: docRef.id, ...newDeal, postedAt: new Date() } as Deal;
    } catch (error) {
        console.error("Error adding deal:", error);
        toast({ title: "Error", description: "Could not add the new deal.", variant: "destructive" });
        throw error;
    }
  }, [toast]);

  const getDealById = useCallback((id: string): Deal | undefined => {
    if (!id) return undefined;
    return deals.find(d => d.id === id);
  }, [deals]);

  const value = { deals, isLoading, error, getDealById, addDeal };

  return (
    <DealsContext.Provider value={value}>
      {children}
    </DealsContext.Provider>
  );
}

export function useDeals() {
  const context = useContext(DealsContext);
  if (context === undefined) {
    throw new Error('useDeals must be used within a DealsProvider');
  }
  return context;
}

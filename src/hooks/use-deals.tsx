
'use client';

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { collection, getDocs, doc, addDoc } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';

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
  postedAt: string; 
  submittedByUid: string;
}

export type NewDealInput = Omit<Deal, 'id' | 'postedAt'>;

interface DealsContextType {
  deals: Deal[];
  isLoading: boolean;
  getDealById: (id: string) => Deal | undefined;
  addDeal: (deal: NewDealInput) => Promise<Deal>;
}

const DealsContext = createContext<DealsContextType | undefined>(undefined);

const dealsCollectionRef = collection(firestore, 'deals');

export function DealsProvider({ children }: { children: ReactNode }) {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDeals = useCallback(async () => {
    setIsLoading(true);
    try {
        const querySnapshot = await getDocs(dealsCollectionRef);
        const dealsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Deal));
        setDeals(dealsData);
    } catch (error) {
        console.error("Failed to fetch deals from Firestore", error);
        setDeals([]);
    } finally {
        setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDeals();
  }, [fetchDeals]);

  const addDeal = async (dealData: NewDealInput): Promise<Deal> => {
    const newDeal = {
      ...dealData,
      postedAt: new Date().toISOString(),
    };
    const docRef = await addDoc(dealsCollectionRef, newDeal);
    const newDealWithId = { id: docRef.id, ...newDeal } as Deal;
    setDeals(prev => [...prev, newDealWithId]);
    return newDealWithId;
  };

  const getDealById = (id: string): Deal | undefined => {
    return deals.find(d => d.id === id);
  };

  return (
    <DealsContext.Provider value={{ deals, isLoading, getDealById, addDeal }}>
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

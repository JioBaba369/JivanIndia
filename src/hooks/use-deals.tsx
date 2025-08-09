
'use client';

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { collection, onSnapshot, doc, addDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';
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
  postedAt: any; 
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

  useEffect(() => {
    setIsLoading(true);
    const q = query(dealsCollectionRef, orderBy('postedAt', 'desc'));

    const unsubscribe = onSnapshot(q, 
      (querySnapshot) => {
        const dealsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Deal));
        setDeals(dealsData);
        setIsLoading(false);
      },
      (error) => {
        console.error("Failed to fetch deals from Firestore", error);
        setDeals([]);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const addDeal = async (dealData: NewDealInput): Promise<Deal> => {
    const newDeal = {
      ...dealData,
      postedAt: serverTimestamp(),
    };
    const docRef = await addDoc(dealsCollectionRef, newDeal);
    const newDealWithId = { id: docRef.id, ...newDeal, postedAt: new Date() } as Deal;
    // No need to set state here, onSnapshot will do it
    return newDealWithId;
  };

  const getDealById = (id: string): Deal | undefined => {
    if (!id) return undefined;
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

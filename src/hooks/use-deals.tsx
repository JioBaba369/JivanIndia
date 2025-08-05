
'use client';

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import { deals as initialDealsData, type Deal as DealType } from '@/data/deals';

export type Deal = DealType;

interface DealsContextType {
  deals: Deal[];
  isLoading: boolean;
  getDealById: (id: string) => Deal | undefined;
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
      if (querySnapshot.empty) {
        setDeals(initialDealsData);
      } else {
        const dealsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Deal));
        setDeals(dealsData);
      }
    } catch (error) {
      console.error("Failed to fetch deals from Firestore", error);
      setDeals(initialDealsData);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDeals();
  }, [fetchDeals]);


  const getDealById = (id: string): Deal | undefined => {
    return deals.find(d => d.id === id);
  };

  return (
    <DealsContext.Provider value={{ deals, isLoading, getDealById }}>
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

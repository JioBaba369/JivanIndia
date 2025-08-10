
'use client';

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { collection, onSnapshot, doc, addDoc, updateDoc, deleteDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import { useToast } from './use-toast';
import { useNotifications } from './use-notifications';
import { useCommunities } from './use-communities';
import { useBusinesses } from './use-businesses';

export interface Deal {
  id: string;
  title: string;
  description: string;
  terms: string;
  category: 'Food & Dining' | 'Retail & Shopping' | 'Services' | 'Entertainment' | 'Other';
  expires: string; 
  business: string;
  businessId: string; // This can be a community ID or a business ID
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
  updateDeal: (id: string, deal: Partial<NewDealInput>) => Promise<void>;
  deleteDeal: (id: string) => Promise<void>;
}

const DealsContext = createContext<DealsContextType | undefined>(undefined);

export function DealsProvider({ children }: { children: ReactNode }) {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();
  const { createNotificationForCommunity } = useNotifications();
  const { communities } = useCommunities();


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
        const newDealForDb = {
          ...dealData,
          postedAt: serverTimestamp(),
        };
        const docRef = await addDoc(collection(firestore, 'deals'), newDealForDb);
        const newDeal = { id: docRef.id, ...newDealForDb, postedAt: { toDate: () => new Date() } } as Deal;

        const community = communities.find(c => c.id === newDeal.businessId);
        if (community) {
            await createNotificationForCommunity(community.id, {
                title: `New Deal: ${newDeal.title}`,
                description: `${community.name} has a new offer!`,
                link: `/deals/${newDeal.id}`,
                icon: 'Tag',
            });
        }
        
        return newDeal;

    } catch (error) {
        console.error("Error adding deal:", error);
        toast({ title: "Error", description: "Could not add the new deal.", variant: "destructive" });
        throw error;
    }
  }, [toast, communities, createNotificationForCommunity]);
  
  const updateDeal = useCallback(async (id: string, dealData: Partial<NewDealInput>) => {
    const dealDocRef = doc(firestore, 'deals', id);
    try {
        await updateDoc(dealDocRef, dealData);
        toast({ title: 'Deal Updated', description: 'The deal has been saved.'});
    } catch (e) {
        console.error("Error updating deal:", e);
        toast({ title: "Error", description: "Could not update the deal.", variant: "destructive" });
        throw e;
    }
  }, [toast]);
  
  const deleteDeal = useCallback(async (id: string) => {
    const dealDocRef = doc(firestore, 'deals', id);
    try {
        await deleteDoc(dealDocRef);
        toast({ title: 'Deal Deleted', description: 'The deal has been removed.'});
    } catch (e) {
        console.error("Error deleting deal:", e);
        toast({ title: "Error", description: "Could not delete the deal.", variant: "destructive" });
        throw e;
    }
  }, [toast]);

  const getDealById = useCallback((id: string): Deal | undefined => {
    if (!id) return undefined;
    return deals.find(d => d.id === id);
  }, [deals]);

  const value = { deals, isLoading, error, getDealById, addDeal, updateDeal, deleteDeal };

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

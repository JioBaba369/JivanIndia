'use client';

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { collection, getDocs, writeBatch, doc, addDoc } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import type { User } from './use-auth';

export interface Deal {
  id: string;
  title: string;
  description: string;
  terms: string;
  category: 'Food & Dining' | 'Retail & Shopping' | 'Services' | 'Entertainment' | 'Other';
  imageUrl: string;
  expires: string; 
  business: string;
  businessId: string; // This should be the community ID (slug or actual ID)
  businessLocation: string;
  businessWebsite: string;
  postedAt: string; 
  submittedByUid: string;
}

export type NewDealInput = Omit<Deal, 'id' | 'postedAt'>;


const initialDealsData: Omit<Deal, 'id' | 'submittedByUid'>[] = [
    {
      title: "20% Off Your Entire Meal",
      description: "Enjoy a delicious 20% discount on your entire bill when you dine with us. Perfect for a family dinner or a night out with friends.",
      terms: "Dine-in only. Not valid with other offers. Mention 'JivanIndia' to redeem. Valid Monday to Thursday.",
      category: "Food & Dining",
      imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxJbmRpYW4lMjByZXN0YXVyYW50fGVufDB8fHx8MTc1NDE5NzQzNnww&ixlib=rb-4.1.0&q=80&w=1080",
      expires: "2024-12-31",
      business: "Saffron Spice Restaurant",
      businessId: "saffron-spice-restaurant",
      businessLocation: "123 Main St, Fremont, CA",
      businessWebsite: "saffronspice.com",
      postedAt: "2024-07-20T10:00:00Z"
    },
    {
      title: "Buy One, Get One Free Saree",
      description: "Refresh your wardrobe with our beautiful collection of sarees. Buy one and get the second one of equal or lesser value for free.",
      terms: "Offer valid on select styles. Cannot be combined with other promotions.",
      category: "Retail & Shopping",
      imageUrl: "https://images.unsplash.com/photo-1583513135406-ac698a3a890a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxzYXJlZSUyMHNob3B8ZW58MHx8fHwxNzU0MTk3NDM2fDA&ixlib=rb-4.1.0&q=80&w=1080",
      expires: "2024-10-31",
      business: "Rani's Boutique",
      businessId: "ranis-boutique",
      businessLocation: "456 Oak Ave, Sunnyvale, CA",
      businessWebsite: "ranisboutique.com",
      postedAt: "2024-07-18T11:00:00Z"
    },
    {
      title: "50% Off First Month of Yoga Classes",
      description: "Start your wellness journey with us. Get 50% off your first month of unlimited yoga classes.",
      terms: "For new members only. Must sign up for a monthly membership.",
      category: "Services",
      imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHx5b2dhJTIwY2xhc3N8ZW58MHx8fHwxNzU0MTk3NDM2fDA&ixlib=rb-4.1.0&q=80&w=1080",
      expires: "2024-11-30",
      business: "Nirvana Yoga Studio",
      businessId: "nirvana-yoga-studio",
      businessLocation: "789 Pine St, Santa Clara, CA",
      businessWebsite: "nirvanayoga.com",
      postedAt: "2024-07-15T14:00:00Z"
    },
    {
      title: "$5 Movie Tickets on Tuesdays",
      description: "Enjoy the latest Bollywood blockbusters for just $5 every Tuesday.",
      terms: "Valid for all shows on Tuesdays. Excludes 3D and premium formats.",
      category: "Entertainment",
      imageUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxib2xseXdvb2QlMjBtb3ZpZSUyMHRoZWF0ZXJ8ZW58MHx8fHwxNzU0MTk3NDM2fDA&ixlib=rb-4.1.0&q=80&w=1080",
      expires: "2025-01-01",
      business: "Bollywood Cinemas",
      businessId: "bollywood-cinemas",
      businessLocation: "321 Maple Rd, Milpitas, CA",
      businessWebsite: "bollywoodcinemas.com",
      postedAt: "2024-07-12T18:00:00Z"
    }
];

interface DealsContextType {
  deals: Deal[];
  isLoading: boolean;
  getDealById: (id: string) => Deal | undefined;
  addDeal: (deal: NewDealInput) => Promise<void>;
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
            console.log("Deals collection is empty, seeding with initial data...");
            const batch = writeBatch(firestore);
            const seededDeals: Deal[] = [];
            initialDealsData.forEach((dealData) => {
                const docRef = doc(dealsCollectionRef);
                batch.set(docRef, { ...dealData, submittedByUid: 'seed_user' });
                seededDeals.push({ id: docRef.id, ...dealData, submittedByUid: 'seed_user' });
            });
            await batch.commit();
            setDeals(seededDeals);
            console.log("Deals collection seeded successfully.");
        } else {
            const dealsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Deal));
            setDeals(dealsData);
        }
    } catch (error) {
        console.error("Failed to fetch or seed deals from Firestore", error);
        setDeals([]);
    } finally {
        setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDeals();
  }, [fetchDeals]);

  const addDeal = async (dealData: NewDealInput) => {
    const newDeal = {
      ...dealData,
      postedAt: new Date().toISOString(),
    };
    const docRef = await addDoc(dealsCollectionRef, newDeal);
    setDeals(prev => [...prev, { id: docRef.id, ...newDeal } as Deal]);
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

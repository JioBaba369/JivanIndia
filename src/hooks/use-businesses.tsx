
'use client';

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { collection, getDocs, doc, addDoc } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';

export type BusinessCategory = 'Professional Services' | 'Restaurant' | 'Retail' | 'Health & Wellness' | 'Entertainment' | 'Other';
export const businessCategories: BusinessCategory[] = ['Professional Services', 'Restaurant', 'Retail', 'Health & Wellness', 'Entertainment', 'Other'];


export interface Business {
  id: string;
  name: string;
  category: BusinessCategory;
  description: string;
  fullDescription: string;
  imageUrl: string;
  isVerified: boolean;
  region: string;
  rating: number;
  reviewCount: number;
  services: string[];
  contact: {
    phone: string;
    email: string;
    website: string;
    address: string;
  };
  associatedCommunityId?: string; // ID of the community
}

export type NewBusinessInput = Omit<Business, 'id' | 'isVerified' | 'rating' | 'reviewCount'>;

interface BusinessesContextType {
  businesses: Business[];
  isLoading: boolean;
  getBusinessById: (id: string) => Business | undefined;
  addBusiness: (business: NewBusinessInput) => Promise<void>;
}

const BusinessesContext = createContext<BusinessesContextType | undefined>(undefined);

const businessesCollectionRef = collection(firestore, 'businesses');

export function BusinessesProvider({ children }: { children: ReactNode }) {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBusinesses = useCallback(async () => {
    setIsLoading(true);
    try {
        const querySnapshot = await getDocs(businessesCollectionRef);
        const businessesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Business));
        setBusinesses(businessesData);
    } catch (error) {
        console.error("Failed to fetch businesses from Firestore", error);
        setBusinesses([]);
    } finally {
        setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBusinesses();
  }, [fetchBusinesses]);

  const addBusiness = async (businessData: NewBusinessInput) => {
    const newBusinessForDb = {
      ...businessData,
      isVerified: true, // Admin-added businesses are auto-verified
      rating: 0,
      reviewCount: 0,
    };
    const docRef = await addDoc(businessesCollectionRef, newBusinessForDb);
    const newBusinessForState = { ...newBusinessForDb, id: docRef.id };
    setBusinesses(prev => [...prev, newBusinessForState]);
  };


  const getBusinessById = (id: string) => {
    return businesses.find(business => business.id === id);
  };

  const value = {
    businesses,
    isLoading,
    getBusinessById,
    addBusiness,
  };

  return (
    <BusinessesContext.Provider value={value}>
      {children}
    </BusinessesContext.Provider>
  );
}

export function useBusinesses() {
  const context = useContext(BusinessesContext);
  if (context === undefined) {
    throw new Error('useBusinesses must be used within a BusinessesProvider');
  }
  return context;
}

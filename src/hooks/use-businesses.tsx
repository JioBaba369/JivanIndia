
'use client';

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { collection, onSnapshot, doc, addDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import { useToast } from './use-toast';

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
  isFeatured?: boolean;
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
  createdAt?: any;
}

export type NewBusinessInput = Omit<Business, 'id' | 'isVerified' | 'rating' | 'reviewCount' | 'isFeatured' | 'createdAt'>;

interface BusinessesContextType {
  businesses: Business[];
  isLoading: boolean;
  getBusinessById: (id: string) => Business | undefined;
  addBusiness: (business: NewBusinessInput) => Promise<Business>;
  verifyBusiness: (businessId: string) => Promise<void>;
  updateBusinessFeaturedStatus: (businessId: string, isFeatured: boolean) => Promise<void>;
}

const BusinessesContext = createContext<BusinessesContextType | undefined>(undefined);

const businessesCollectionRef = collection(firestore, 'businesses');

export function BusinessesProvider({ children }: { children: ReactNode }) {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = onSnapshot(businessesCollectionRef, 
      (querySnapshot) => {
        const businessesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Business));
        setBusinesses(businessesData);
        setIsLoading(false);
      }, 
      (error) => {
        console.error("Failed to fetch businesses from Firestore", error);
        setBusinesses([]);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const addBusiness = async (businessData: NewBusinessInput): Promise<Business> => {
    const newBusinessForDb = {
      ...businessData,
      isVerified: false, 
      isFeatured: false,
      rating: 4.5, // Placeholder
      reviewCount: 0,
      createdAt: serverTimestamp(),
    };
    const docRef = await addDoc(businessesCollectionRef, newBusinessForDb);
    // We don't need to update state manually, onSnapshot will do it.
    return { ...newBusinessForDb, id: docRef.id, createdAt: new Date() } as Business;
  };


  const getBusinessById = useCallback((id: string) => {
    if (!id) return undefined;
    return businesses.find(business => business.id === id);
  }, [businesses]);

  const verifyBusiness = async (businessId: string) => {
    const businessDocRef = doc(firestore, 'businesses', businessId);
    await updateDoc(businessDocRef, { isVerified: true });
    // No need to set state here, onSnapshot will do it
  };
  
  const updateBusinessFeaturedStatus = async (businessId: string, isFeatured: boolean) => {
    const businessDocRef = doc(firestore, 'businesses', businessId);
    await updateDoc(businessDocRef, { isFeatured });
    // No need to set state here, onSnapshot will do it
    toast({
      title: 'Business Updated',
      description: `Business has been ${isFeatured ? 'featured' : 'un-featured'}.`,
    });
  };

  const value = {
    businesses,
    isLoading,
    getBusinessById,
    addBusiness,
    verifyBusiness,
    updateBusinessFeaturedStatus,
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

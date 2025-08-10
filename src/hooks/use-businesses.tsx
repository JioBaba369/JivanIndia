
'use client';

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { collection, onSnapshot, doc, addDoc, updateDoc, deleteDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import { useToast } from './use-toast';

export type BusinessCategory = 'Professional Services' | 'Restaurant' | 'Retail' | 'Health & Wellness' | 'Entertainment' | 'Venue Hire' | 'Religious Services' | 'Other';
export const businessCategories: BusinessCategory[] = ['Professional Services', 'Restaurant', 'Retail', 'Health & Wellness', 'Entertainment', 'Venue Hire', 'Religious Services', 'Other'];


export interface Business {
  id: string;
  name: string;
  category: BusinessCategory;
  description: string;
  fullDescription: string;
  imageUrl?: string;
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
  ownerId?: string; // The UID of the user who submitted the business
  createdAt?: any;
}

export type NewBusinessInput = Omit<Business, 'id' | 'isVerified' | 'rating' | 'reviewCount' | 'isFeatured' | 'createdAt'>;

interface BusinessesContextType {
  businesses: Business[];
  isLoading: boolean;
  getBusinessById: (id: string) => Business | undefined;
  addBusiness: (business: NewBusinessInput) => Promise<Business>;
  updateBusiness: (id: string, business: Partial<NewBusinessInput>) => Promise<void>;
  deleteBusiness: (id: string) => Promise<void>;
  verifyBusiness: (businessId: string) => Promise<void>;
  updateBusinessFeaturedStatus: (businessId: string, isFeatured: boolean) => Promise<void>;
}

const BusinessesContext = createContext<BusinessesContextType | undefined>(undefined);

export function BusinessesProvider({ children }: { children: ReactNode }) {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    setIsLoading(true);
    const q = query(collection(firestore, 'businesses'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, 
      (querySnapshot) => {
        const businessesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Business));
        setBusinesses(businessesData);
        setIsLoading(false);
      }, 
      (error) => {
        console.error("Failed to fetch businesses from Firestore", error);
        toast({ title: "Error", description: "Could not fetch business listings.", variant: "destructive" });
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [toast]);

  const addBusiness = useCallback(async (businessData: NewBusinessInput): Promise<Business> => {
    try {
        const newBusinessForDb = {
          ...businessData,
          isVerified: false, 
          isFeatured: false,
          rating: 0, 
          reviewCount: 0,
          createdAt: serverTimestamp(),
        };
        const docRef = await addDoc(collection(firestore, 'businesses'), newBusinessForDb);
        return { ...newBusinessForDb, id: docRef.id, createdAt: new Date() } as Business;
    } catch (error) {
        console.error("Error adding business:", error);
        toast({ title: 'Error', description: 'Could not add the new business.', variant: 'destructive' });
        throw error;
    }
  }, [toast]);

  const updateBusiness = useCallback(async (id: string, businessData: Partial<NewBusinessInput>) => {
    const businessDocRef = doc(firestore, 'businesses', id);
    try {
        await updateDoc(businessDocRef, businessData);
        toast({ title: 'Business Updated', description: 'The business details have been saved.' });
    } catch (e) {
        console.error("Error updating business:", e);
        toast({ title: "Error", description: "Could not update the business.", variant: "destructive" });
        throw e;
    }
  }, [toast]);
  
  const deleteBusiness = useCallback(async (id: string) => {
    const businessDocRef = doc(firestore, 'businesses', id);
    try {
        await deleteDoc(businessDocRef);
        toast({ title: 'Business Deleted', description: 'The business has been removed.' });
    } catch (e) {
        console.error("Error deleting business:", e);
        toast({ title: "Error", description: "Could not delete the business.", variant: "destructive" });
        throw e;
    }
  }, [toast]);

  const getBusinessById = useCallback((id: string) => {
    if (!id) return undefined;
    return businesses.find(business => business.id === id);
  }, [businesses]);

  const verifyBusiness = useCallback(async (businessId: string) => {
    const businessDocRef = doc(firestore, 'businesses', businessId);
    try {
      await updateDoc(businessDocRef, { isVerified: true });
    } catch (error) {
      console.error("Error verifying business:", error);
      toast({ title: 'Error', description: 'Could not verify the business.', variant: 'destructive' });
    }
  }, [toast]);
  
  const updateBusinessFeaturedStatus = useCallback(async (businessId: string, isFeatured: boolean) => {
    const businessDocRef = doc(firestore, 'businesses', businessId);
    try {
      await updateDoc(businessDocRef, { isFeatured });
      toast({
        title: 'Business Updated',
        description: `Business has been ${isFeatured ? 'featured' : 'un-featured'}.`,
      });
    } catch (error) {
      console.error("Error updating business feature status:", error);
      toast({ title: 'Error', description: 'Could not update the business.', variant: 'destructive' });
    }
  }, [toast]);

  const value = {
    businesses,
    isLoading,
    getBusinessById,
    addBusiness,
    updateBusiness,
    deleteBusiness,
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

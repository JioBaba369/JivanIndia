
'use client';

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { collection, getDocs, writeBatch, doc, addDoc } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import { initialBusinesses } from '@/data/businesses';

export type BusinessCategory = 'Temples & Worship' | 'Groceries & Spices' | 'Restaurants' | 'Legal' | 'Healthcare' | 'Financial' | 'Real Estate' | 'Immigration' | 'Other';
export const businessCategories: BusinessCategory[] = ['Temples & Worship', 'Groceries & Spices', 'Restaurants', 'Legal', 'Healthcare', 'Financial', 'Real Estate', 'Immigration', 'Other'];


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
  associatedCommunityId?: string; // Slug of the community
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
        if (querySnapshot.empty) {
            console.log("Businesses collection is empty, seeding with initial data...");
            const batch = writeBatch(firestore);
            const seededBusinesses: Business[] = [];
            initialBusinesses.forEach((businessData) => {
                const docRef = doc(businessesCollectionRef);
                batch.set(docRef, businessData);
                seededBusinesses.push({ id: docRef.id, ...businessData });
            });
            await batch.commit();
            setBusinesses(seededBusinesses);
            console.log("Businesses collection seeded successfully.");
        } else {
            const businessesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Business));
            setBusinesses(businessesData);
        }
    } catch (error) {
        console.error("Failed to fetch or seed businesses from Firestore", error);
        setBusinesses([]);
    } finally {
        setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBusinesses();
  }, [fetchBusinesses]);

  const addBusiness = async (businessData: NewBusinessInput) => {
    const newBusiness = {
      ...businessData,
      isVerified: true, // Admin-added businesses are auto-verified
      rating: 0,
      reviewCount: 0,
    };
    const docRef = await addDoc(businessesCollectionRef, newBusiness);
    setBusinesses(prev => [...prev, { id: docRef.id, ...newBusiness } as Business]);
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

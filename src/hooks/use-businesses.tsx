
'use client';

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { collection, getDocs, writeBatch, doc, addDoc } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';

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

export const initialBusinesses: Omit<Business, 'id'>[] = [
    {
      name: "Fremont Hindu Temple",
      category: "Temples & Worship",
      description: "A vibrant cultural and spiritual center for the Hindu community.",
      fullDescription: "The Fremont Hindu Temple is dedicated to providing a place of worship and organizing cultural and religious festivals. It serves as a vital hub for spiritual activities, educational classes, and community gatherings, fostering a sense of peace and unity.",
      imageUrl: "https://images.unsplash.com/photo-1594778962534-a89c814421b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxoaW5kdSUyMHRlbXBsZXxlbnwwfHx8fDE3NTQ0NDgwMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      isVerified: true,
      region: "Fremont, CA",
      rating: 4.9,
      reviewCount: 520,
      services: ["Daily Puja", "Religious Festivals", "Vedic Classes", "Wedding Services"],
      contact: {
        phone: "510-555-0101",
        email: "contact@fremonttemple.org",
        website: "www.fremonttemple.org",
        address: "3676 Delaware Dr, Fremont, CA 94538"
      },
      associatedCommunityId: "bay-area-tamil-sangam"
    },
    {
      name: "Bharat Bazaar",
      category: "Groceries & Spices",
      description: "Your one-stop shop for authentic Indian groceries, spices, and fresh produce.",
      fullDescription: "Bharat Bazaar offers the widest selection of authentic Indian groceries, from rare spices and flours to fresh vegetables and sweets. We are committed to bringing the taste of home to your kitchen with high-quality products and friendly service.",
      imageUrl: "https://images.unsplash.com/photo-1583182474438-421711736780?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxJbmRpYW4lMjBzcGljZSUyMHNob3B8ZW58MHx8fHwxNzU0NDQ4MDE2fDA&ixlib=rb-4.1.0&q=80&w=1080",
      isVerified: true,
      region: "Sunnyvale, CA",
      rating: 4.7,
      reviewCount: 310,
      services: ["Imported Spices", "Fresh Produce", "Sweets & Snacks", "Puja Supplies"],
      contact: {
        phone: "408-555-0102",
        email: "info@bharatbazaar.com",
        website: "www.bharatbazaar.com",
        address: "1202 Kifer Rd, Sunnyvale, CA 94086"
      },
       associatedCommunityId: "bay-area-tamil-sangam"
    },
    {
      name: "Gupta Law Firm",
      category: "Legal",
      description: "Specializing in immigration and family law for the community.",
      fullDescription: "Gupta Law Firm has been serving the community for over 15 years, offering expert legal advice on immigration, family matters, and business law. Our team understands the unique challenges faced by our community and provides compassionate, effective representation.",
      imageUrl: "https://images.unsplash.com/photo-1589216532372-1c2a367902d9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxsYXclMjBvZmZpY2V8ZW58MHx8fHwxNzU0MTk3NDM3fDA&ixlib=rb-4.1.0&q=80&w=1080",
      isVerified: true,
      region: "San Francisco Bay Area",
      rating: 4.9,
      reviewCount: 120,
      services: ["Immigration Visas", "Family Law", "Business Contracts", "Estate Planning"],
      contact: {
        phone: "415-555-1234",
        email: "contact@guptalaw.com",
        website: "www.guptalaw.com",
        address: "123 Market St, San Francisco, CA 94103"
      },
      associatedCommunityId: "bay-area-tamil-sangam"
    },
    {
      name: "Patel Medical Clinic",
      category: "Healthcare",
      description: "Comprehensive healthcare services for the entire family.",
      fullDescription: "From routine check-ups to specialized care, Patel Medical Clinic is dedicated to the health and well-being of our community. We offer services in both English and Hindi, ensuring clear and comfortable communication for all our patients.",
      imageUrl: "https://images.unsplash.com/photo-1576091160550-2173dba9996a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxoZWFsdGhjYXJlJTIwY2xpbmljfGVufDB8fHx8MTc1NDE5NzQzN3ww&ixlib=rb-4.1.0&q=80&w=1080",
      isVerified: true,
      region: "Los Angeles",
      rating: 4.8,
      reviewCount: 250,
      services: ["General Practice", "Pediatrics", "Cardiology", "Preventative Care"],
       contact: {
        phone: "310-555-5678",
        email: "info@patelmedical.com",
        website: "www.patelmedical.com",
        address: "456 Wilshire Blvd, Los Angeles, CA 90010"
      },
       associatedCommunityId: "bay-area-tamil-sangam"
    },
];

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

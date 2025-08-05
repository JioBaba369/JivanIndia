
'use client';

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { collection, getDocs, writeBatch, doc } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';

export interface Provider {
  id: string;
  name: string;
  category: 'Legal' | 'Healthcare' | 'Financial' | 'Real Estate' | 'Immigration';
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

export const initialProviders: Omit<Provider, 'id'>[] = [
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
    {
      name: "Singh Financials",
      category: "Financial",
      description: "Expert financial planning and investment advice.",
      fullDescription: "Achieve your financial goals with Singh Financials. We provide personalized strategies for retirement planning, investment management, and wealth creation, all tailored to your unique circumstances.",
      imageUrl: "https://images.unsplash.com/photo-1554224155-1696413565d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxmaW5hbmNpYWwlMjBhZHZpc29yfGVufDB8fHx8MTc1NDE5NzQzN3ww&ixlib=rb-4.1.0&q=80&w=1080",
      isVerified: false,
      region: "New York City",
      rating: 4.7,
      reviewCount: 95,
      services: ["Retirement Planning", "Stock Portfolio Management", "Tax Guidance"],
      contact: {
        phone: "212-555-9876",
        email: "support@singhfinancials.com",
        website: "www.singhfinancials.com",
        address: "789 Wall Street, New York, NY 10005"
      },
       associatedCommunityId: "bay-area-tamil-sangam"
    }
];

interface ProvidersContextType {
  providers: Provider[];
  isLoading: boolean;
  getProviderById: (id: string) => Provider | undefined;
}

const ProvidersContext = createContext<ProvidersContextType | undefined>(undefined);

const providersCollectionRef = collection(firestore, 'providers');

export function ProvidersProvider({ children }: { children: ReactNode }) {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAndSetProviders = useCallback(async () => {
     try {
        const querySnapshot = await getDocs(providersCollectionRef);
        const providersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Provider));
        setProviders(providersData);
    } catch (error) {
        console.error("Failed to fetch providers from Firestore", error);
        setProviders([]);
    }
  }, []);

  const seedProviders = useCallback(async () => {
    console.log("Providers collection is empty, seeding with initial data...");
    const batch = writeBatch(firestore);
    const seededProviders: Provider[] = [];
    initialProviders.forEach((providerData) => {
        const docRef = doc(providersCollectionRef);
        batch.set(docRef, providerData);
        seededProviders.push({ id: docRef.id, ...providerData });
    });
    await batch.commit();
    setProviders(seededProviders);
    console.log("Providers collection seeded successfully.");
  }, []);

  useEffect(() => {
    const initializeProviders = async () => {
        setIsLoading(true);
        const querySnapshot = await getDocs(providersCollectionRef);
        if (querySnapshot.empty) {
            await seedProviders();
        } else {
            await fetchAndSetProviders();
        }
        setIsLoading(false);
    };
    initializeProviders();
  }, [seedProviders, fetchAndSetProviders]);

  const getProviderById = (id: string) => {
    return providers.find(provider => provider.id === id);
  };

  const value = {
    providers,
    isLoading,
    getProviderById,
  };

  return (
    <ProvidersContext.Provider value={value}>
      {children}
    </ProvidersContext.Provider>
  );
}

export function useProviders() {
  const context = useContext(ProvidersContext);
  if (context === undefined) {
    throw new Error('useProviders must be used within a ProvidersProvider');
  }
  return context;
}

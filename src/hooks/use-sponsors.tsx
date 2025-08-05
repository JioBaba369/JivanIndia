
'use client';

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { collection, getDocs, writeBatch, doc } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';

export interface Sponsor {
  id: string;
  name: string;
  logoUrl: string;
  website: string;
  industry: string;
  tier: 'Platinum' | 'Gold' | 'Silver';
  description: string;
  fullDescription: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  socialMedia: {
    twitter?: string;
    linkedin?: string;
    facebook?: string;
  };
  eventsSponsored: Array<{
    eventId: string;
    contribution: string;
  }>;
}

const initialSponsors: Omit<Sponsor, 'id'>[] = [
    {
      name: "Innovate Corp",
      logoUrl: "https://placehold.co/400x200.png",
      website: "www.innovatecorp.com",
      industry: "Technology",
      tier: "Platinum",
      description: "Driving innovation forward with cutting-edge technology solutions.",
      fullDescription: "Innovate Corp is a global leader in enterprise software and cloud solutions. We are proud to support community initiatives that foster technological literacy and growth.",
      contactEmail: "sponsorship@innovatecorp.com",
      contactPhone: "1-800-555-0101",
      address: "1 Tech Plaza, Silicon Valley, CA 94043",
      socialMedia: {
        twitter: "https://twitter.com/innovatecorp",
        linkedin: "https://linkedin.com/company/innovatecorp"
      },
      eventsSponsored: [
        { eventId: "1", contribution: "Title Sponsor" },
        { eventId: "3", contribution: "Technology Partner" }
      ]
    },
    {
      name: "Unity Bank",
      logoUrl: "https://placehold.co/400x200.png",
      website: "www.unitybank.com",
      industry: "Finance",
      tier: "Gold",
      description: "Your trusted partner in financial growth and stability.",
      fullDescription: "Unity Bank provides comprehensive financial services to individuals and businesses. Our commitment to the community is reflected in our support for local events and organizations that enrich cultural life.",
      contactEmail: "community@unitybank.com",
      contactPhone: "1-800-555-0102",
      address: "100 Finance Ave, New York, NY 10004",
       socialMedia: {
        linkedin: "https://linkedin.com/company/unitybank"
      },
      eventsSponsored: [
        { eventId: "1", contribution: "Gold Sponsor" },
        { eventId: "2", contribution: "Financial Wellness Partner" }
      ]
    },
    {
      name: "Taste of India Grocers",
      logoUrl: "https://placehold.co/400x200.png",
      website: "www.tasteofindiagrocers.com",
      industry: "Retail",
      tier: "Silver",
      description: "Authentic ingredients for your kitchen.",
      fullDescription: "Taste of India Grocers is your one-stop shop for authentic spices, produce, and ingredients. We are delighted to sponsor events that bring the flavors and traditions of India to the community.",
      contactEmail: "info@tasteofindiagrocers.com",
      contactPhone: "1-800-555-0103",
      address: "500 Spice Route, Edison, NJ 08820",
      socialMedia: {
        facebook: "https://facebook.com/tasteofindiagrocers"
      },
      eventsSponsored: [
        { eventId: "2", contribution: "Food and Beverage Sponsor" }
      ]
    }
];


interface SponsorsContextType {
  sponsors: Sponsor[];
  isLoading: boolean;
  getSponsorById: (id: string) => Sponsor | undefined;
}

const SponsorsContext = createContext<SponsorsContextType | undefined>(undefined);
const sponsorsCollectionRef = collection(firestore, 'sponsors');

export function SponsorsProvider({ children }: { children: ReactNode }) {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSponsors = useCallback(async () => {
    setIsLoading(true);
    try {
        const querySnapshot = await getDocs(sponsorsCollectionRef);
        if (querySnapshot.empty) {
            console.log("Sponsors collection is empty, seeding with initial data...");
            const batch = writeBatch(firestore);
            const seededSponsors: Sponsor[] = [];
            initialSponsors.forEach((sponsorData) => {
                const docRef = doc(sponsorsCollectionRef);
                batch.set(docRef, sponsorData);
                seededSponsors.push({ id: docRef.id, ...sponsorData });
            });
            await batch.commit();
            setSponsors(seededSponsors);
            console.log("Sponsors collection seeded successfully.");
        } else {
            const sponsorsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Sponsor));
            setSponsors(sponsorsData);
        }
    } catch (error) {
        console.error("Failed to fetch or seed sponsors from Firestore", error);
        setSponsors([]);
    } finally {
        setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSponsors();
  }, [fetchSponsors]);


  const getSponsorById = (id: string) => {
    return sponsors.find(sponsor => sponsor.id === id);
  };

  const value = {
    sponsors,
    isLoading,
    getSponsorById,
  };

  return (
    <SponsorsContext.Provider value={value}>
      {children}
    </SponsorsContext.Provider>
  );
}

export function useSponsors() {
  const context = useContext(SponsorsContext);
  if (context === undefined) {
    throw new Error('useSponsors must be used within a SponsorsProvider');
  }
  return context;
}

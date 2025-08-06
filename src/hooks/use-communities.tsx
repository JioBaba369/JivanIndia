
'use client';

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, writeBatch } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import { useAuth } from './use-auth';
import type { User } from './use-auth';

export interface Community {
  id: string;
  slug: string;
  name: string;
  type: 'Cultural & Arts' | 'Business & Commerce' | 'Social & Non-Profit' | 'Educational' | 'Religious' | 'Other';
  description: string;
  fullDescription: string;
  imageUrl: string;
  logoUrl: string;
  region: string;
  membersCount: number;
  isVerified: boolean;
  founded: string;
  tags: string[];
  address: string;
  phone: string;
  contactEmail: string;
  website: string;
  socialMedia?: {
    twitter?: string;
    linkedin?: string;
    facebook?: string;
  };
  founderUid: string;
  founderEmail: string;
  createdAt: string;
  updatedAt: string;
}

export const initialCommunities: Omit<Community, 'id' | 'createdAt' | 'updatedAt' | 'founderEmail'>[] = [
    {
        slug: "bay-area-tamil-sangam",
        name: "Bay Area Tamil Sangam",
        type: 'Cultural & Arts',
        description: "Promoting Tamil language and culture in the Bay Area through events and community service.",
        fullDescription: "Since its inception, the Bay Area Tamil Sangam has been a cornerstone for the Tamil-speaking community in Northern California. We are dedicated to preserving and promoting the rich heritage of Tamil language, literature, and culture. Through a variety of programs including cultural events, educational workshops, and community service initiatives, we aim to create a vibrant and supportive network for Tamils and friends of Tamil culture.",
        imageUrl: "https://images.unsplash.com/photo-1594917409245-8a245973c8b4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw0fHxJbmRpYW4lMjBmZXN0aXZhbCUyMGNyb3dkfGVufDB8fHx8MTc1NDE5NzQzNnww&ixlib=rb-4.1.0&q=80&w=1080",
        logoUrl: "https://placehold.co/200x200.png",
        region: "San Francisco Bay Area",
        membersCount: 1250,
        isVerified: true,
        founded: "1985",
        tags: ['cultural', 'tamil', 'bay-area', 'non-profit', 'family-friendly'],
        address: "PO Box 1234, Fremont, CA 94538",
        phone: "(510) 555-1234",
        contactEmail: "contact@bayareatamilsangam.org",
        website: "https://www.bayareatamilsangam.org",
        socialMedia: {
            twitter: "https://x.com/batamilsangam",
            facebook: "https://facebook.com/batamilsangam"
        },
        founderUid: "defDHmCjCdWvmGid9YYg3RJi01x2"
    },
    // more communities...
];

export type NewCommunityInput = Omit<Community, 'id' | 'createdAt' | 'updatedAt' | 'isVerified' | 'founderEmail'>;

interface CommunitiesContextType {
  communities: Community[];
  isLoading: boolean;
  addCommunity: (community: NewCommunityInput, founderEmail: string) => Promise<Community>;
  updateCommunity: (id: string, data: Partial<Omit<Community, 'id'>>) => Promise<void>;
  deleteCommunity: (id: string) => Promise<void>;
  getCommunityById: (id: string) => Community | undefined;
  getCommunityBySlug: (slug: string) => Community | undefined;
  isSlugUnique: (slug: string, currentId?: string) => boolean;
  verifyCommunity: (communityId: string) => Promise<void>;
}

const CommunitiesContext = createContext<CommunitiesContextType | undefined>(undefined);

const communitiesCollectionRef = collection(firestore, 'communities');

export function CommunitiesProvider({ children }: { children: ReactNode }) {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, setAffiliation } = useAuth();

  const fetchCommunities = useCallback(async () => {
    setIsLoading(true);
    try {
      const querySnapshot = await getDocs(communitiesCollectionRef);
       if (querySnapshot.empty) {
        console.log("Communities collection is empty, seeding data...");
        const batch = writeBatch(firestore);
        initialCommunities.forEach(communityData => {
            const docRef = doc(communitiesCollectionRef);
            batch.set(docRef, { ...communityData, founderEmail: 'seed@jivanindia.co', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
        });
        await batch.commit();
        const seededSnapshot = await getDocs(communitiesCollectionRef);
        const communitiesData = seededSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Community));
        setCommunities(communitiesData);
        console.log("Communities collection seeded successfully.");
      } else {
         const communitiesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Community));
         setCommunities(communitiesData);
      }
    } catch (error) {
      console.error("Failed to fetch communities from Firestore", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCommunities();
  }, [fetchCommunities]);

  const addCommunity = async (communityData: NewCommunityInput, founderEmail: string): Promise<Community> => {
    const now = new Date().toISOString();
    const newCommunityData = {
      ...communityData,
      createdAt: now,
      updatedAt: now,
      isVerified: false,
      founderEmail: founderEmail,
    };
    const docRef = await addDoc(communitiesCollectionRef, newCommunityData);
    const newCommunity = { id: docRef.id, ...newCommunityData } as Community;
    
    await setAffiliation(newCommunity.id, newCommunity.name, newCommunity.slug);

    setCommunities(prev => [...prev, newCommunity]);
    return newCommunity;
  };

  const updateCommunity = async (id: string, data: Partial<Omit<Community, 'id'>>) => {
    const communityDocRef = doc(firestore, 'communities', id);
    const updatedData = { ...data, updatedAt: new Date().toISOString() };
    await updateDoc(communityDocRef, updatedData);
    setCommunities(prev => prev.map(c => c.id === id ? { ...c, ...updatedData } as Community : c));
     // Also update user's affiliation if name/slug changed
    if (user && user.affiliation?.orgId === id && (data.name || data.slug)) {
        await setAffiliation(
          id,
          data.name || user.affiliation.orgName,
          data.slug || user.affiliation.orgSlug
        );
    }
  };
  
  const deleteCommunity = async (id: string) => {
    const communityDocRef = doc(firestore, 'communities', id);
    await deleteDoc(communityDocRef);
    if(user && user.affiliation?.orgId === id) {
        await setAffiliation('', '', '');
    }
    setCommunities(prev => prev.filter(c => c.id !== id));
  };

  const getCommunityById = (id: string): Community | undefined => {
    return communities.find(c => c.id === id);
  };

  const getCommunityBySlug = (slug: string): Community | undefined => {
    return communities.find(c => c.slug === slug);
  };

  const isSlugUnique = (slug: string, currentId?: string): boolean => {
    return !communities.some(c => c.slug === slug && c.id !== currentId);
  };

  const verifyCommunity = async (communityId: string): Promise<void> => {
    const communityDocRef = doc(firestore, 'communities', communityId);
    const updatedData = { isVerified: true, updatedAt: new Date().toISOString() };
    await updateDoc(communityDocRef, updatedData);
    setCommunities(prev => prev.map(c => 
      c.id === communityId ? { ...c, isVerified: true, updatedAt: updatedData.updatedAt } as Community : c
    ));
  };

  const contextValue = {
    communities,
    isLoading,
    addCommunity,
    updateCommunity,
    deleteCommunity,
    getCommunityById,
    getCommunityBySlug,
    isSlugUnique,
    verifyCommunity,
  };

  return (
    <CommunitiesContext.Provider value={contextValue}>
      {children}
    </CommunitiesContext.Provider>
  );
}

export function useCommunities() {
  const context = useContext(CommunitiesContext);
  if (context === undefined) {
    throw new Error('useCommunities must be used within a CommunitiesProvider');
  }
  return context;
}

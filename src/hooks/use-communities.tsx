
'use client';

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import { useAuth } from './use-auth';

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

export type NewCommunityInput = Omit<Community, 'id' | 'createdAt' | 'updatedAt' | 'isVerified' | 'founderEmail'>;

interface CommunitiesContextType {
  communities: Community[];
  isLoading: boolean;
  addCommunity: (community: NewCommunityInput, founderEmail: string) => Promise<Community>;
  updateCommunity: (id: string, data: Partial<Community>) => Promise<void>;
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
  const { user, updateUser } = useAuth();


  const fetchCommunities = useCallback(async () => {
    setIsLoading(true);
    try {
      const querySnapshot = await getDocs(communitiesCollectionRef);
      const communitiesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Community));
      setCommunities(communitiesData);
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
    setCommunities(prev => [...prev, newCommunity]);
    return newCommunity;
  };

  const updateCommunity = async (id: string, data: Partial<Community>) => {
    const communityDocRef = doc(firestore, 'communities', id);
    const updatedData = { ...data, updatedAt: new Date().toISOString() };
    await updateDoc(communityDocRef, updatedData);
    setCommunities(prev => prev.map(c => c.id === id ? { ...c, ...updatedData } as Community : c));
  };
  
  const deleteCommunity = async (id: string) => {
    const communityDocRef = doc(firestore, 'communities', id);
    await deleteDoc(communityDocRef);
    if(user && user.affiliation?.orgId === id) {
        await updateUser({ affiliation: undefined });
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

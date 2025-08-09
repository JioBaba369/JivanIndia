
'use client';

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where, writeBatch } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import type { User } from '@/hooks/use-auth';
import { useToast } from './use-toast';

export interface Community {
  id: string;
  slug: string;
  name: string;
  type: 'Social' | 'Cultural' | 'Business' | 'Religious' | 'Charitable' | 'Regional' | 'Professional' | 'Other';
  description: string;
  fullDescription: string;
  imageUrl: string;
  logoUrl: string;
  region: string;
  country: string; // New field
  membersCount: number;
  isVerified: boolean;
  isFeatured?: boolean;
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

export type NewCommunityInput = Omit<Community, 'id' | 'createdAt' | 'updatedAt' | 'isVerified' | 'founderEmail' | 'isFeatured'>;

interface CommunitiesContextType {
  communities: Community[];
  isLoading: boolean;
  addCommunity: (community: NewCommunityInput, user: User) => Promise<Community>;
  updateCommunity: (id: string, data: Partial<Omit<Community, 'id'>>) => Promise<void>;
  deleteCommunity: (id: string) => Promise<void>;
  getCommunityById: (id: string) => Community | undefined;
  getCommunityBySlug: (slug: string) => Community | undefined;
  isSlugUnique: (slug: string, currentId?: string) => boolean;
  verifyCommunity: (communityId: string) => Promise<void>;
  updateCommunityFeaturedStatus: (communityId: string, isFeatured: boolean) => Promise<void>;
}

const CommunitiesContext = createContext<CommunitiesContextType | undefined>(undefined);

const communitiesCollectionRef = collection(firestore, 'communities');

export function CommunitiesProvider({ children }: { children: ReactNode }) {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchCommunities = useCallback(async () => {
    setIsLoading(true);
    try {
        const querySnapshot = await getDocs(communitiesCollectionRef);
        const communitiesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Community));
        setCommunities(communitiesData);
    } catch (error) {
        console.error("Failed to fetch communities from Firestore", error);
        setCommunities([]);
    } finally {
        setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCommunities();
  }, [fetchCommunities]);


  const addCommunity = async (communityData: NewCommunityInput, user: User): Promise<Community> => {
    if (!user) throw new Error("User must be logged in to create a community.");

    const now = new Date().toISOString();
    const newCommunityData = {
      ...communityData,
      createdAt: now,
      updatedAt: now,
      isVerified: false,
      isFeatured: false,
      founderEmail: user.email,
    };
    const docRef = await addDoc(communitiesCollectionRef, newCommunityData);
    const newCommunity = { id: docRef.id, ...newCommunityData } as Community;
    
    setCommunities(prev => [...prev, newCommunity]);
    return newCommunity;
  };

  const updateCommunity = async (id: string, data: Partial<Omit<Community, 'id'>>) => {
    const communityDocRef = doc(firestore, 'communities', id);
    const updatedData = { ...data, updatedAt: new Date().toISOString() };
    await updateDoc(communityDocRef, updatedData);
    setCommunities(prev => prev.map(c => c.id === id ? { ...c, ...updatedData } as Community : c));
  };
  
  const deleteCommunity = async (id: string) => {
    const communityDocRef = doc(firestore, 'communities', id);
    await deleteDoc(communityDocRef);

    const usersRef = collection(firestore, 'users');
    const q = query(usersRef, where("affiliation.orgId", "==", id));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
        const batch = writeBatch(firestore);
        querySnapshot.forEach(userDoc => {
            batch.update(userDoc.ref, { affiliation: null, roles: arrayRemove('community-manager') });
        });
        await batch.commit();
    }

    setCommunities(prev => prev.filter(c => c.id !== id));
  };

  const getCommunityById = useCallback((id: string): Community | undefined => {
    if (!id) return undefined;
    return communities.find(c => c.id === id);
  }, [communities]);

  const getCommunityBySlug = useCallback((slug: string): Community | undefined => {
    if (!slug) return undefined;
    return communities.find(c => c.slug === slug);
  }, [communities]);

  const isSlugUnique = useCallback((slug: string, currentId?: string): boolean => {
    return !communities.some(c => c.slug === slug && c.id !== currentId);
  }, [communities]);

  const verifyCommunity = async (communityId: string): Promise<void> => {
    const communityDocRef = doc(firestore, 'communities', communityId);
    const updatedData = { isVerified: true, updatedAt: new Date().toISOString() };
    await updateDoc(communityDocRef, updatedData);
    setCommunities(prev => prev.map(c => 
      c.id === communityId ? { ...c, isVerified: true, updatedAt: updatedData.updatedAt } as Community : c
    ));
  };

  const updateCommunityFeaturedStatus = async (communityId: string, isFeatured: boolean) => {
    const communityDocRef = doc(firestore, 'communities', communityId);
    await updateDoc(communityDocRef, { isFeatured });
    setCommunities(prev => prev.map(c => c.id === communityId ? { ...c, isFeatured } : c));
    toast({
      title: 'Community Updated',
      description: `Community has been ${isFeatured ? 'featured' : 'un-featured'}.`,
    });
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
    updateCommunityFeaturedStatus,
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

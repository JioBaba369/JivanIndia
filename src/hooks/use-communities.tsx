
'use client';

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { collection, addDoc, onSnapshot, doc, updateDoc, deleteDoc, query, where, writeBatch, serverTimestamp, arrayUnion, arrayRemove, getDocs, orderBy } from 'firebase/firestore';
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
  country: string; 
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
  createdAt: any;
  updatedAt: any;
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

export function CommunitiesProvider({ children }: { children: ReactNode }) {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    setIsLoading(true);
    const q = query(collection(firestore, 'communities'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, 
      (querySnapshot) => {
        const communitiesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Community));
        setCommunities(communitiesData);
        setIsLoading(false);
      },
      (error) => {
        console.error("Failed to fetch communities from Firestore", error);
        toast({ title: "Error", description: "Could not fetch communities.", variant: "destructive" });
        setIsLoading(false);
      }
    );
    
    return () => unsubscribe();
  }, [toast]);

  const addCommunity = useCallback(async (communityData: NewCommunityInput, user: User): Promise<Community> => {
    if (!user) throw new Error("User must be logged in to create a community.");

    const batch = writeBatch(firestore);
    
    const newCommunityRef = doc(collection(firestore, 'communities'));
    const newCommunityForDb = {
      ...communityData,
      id: newCommunityRef.id,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      isVerified: false,
      isFeatured: false,
      founderEmail: user.email,
    };
    batch.set(newCommunityRef, newCommunityForDb);

    const userRef = doc(firestore, 'users', user.uid);
    batch.update(userRef, {
      affiliation: {
        orgId: newCommunityRef.id,
        orgName: communityData.name,
        orgSlug: communityData.slug,
      },
      roles: arrayUnion('community-manager')
    });

    try {
        await batch.commit();
        return { ...newCommunityForDb, createdAt: new Date(), updatedAt: new Date() } as Community;
    } catch (error) {
        console.error("Error adding community and updating user:", error);
        toast({ title: "Error", description: "Failed to create community.", variant: "destructive" });
        throw error;
    }
  }, [toast]);

  const updateCommunity = useCallback(async (id: string, data: Partial<Omit<Community, 'id'>>) => {
    const communityDocRef = doc(firestore, 'communities', id);
    const updatedData = { ...data, updatedAt: serverTimestamp() };
    try {
        await updateDoc(communityDocRef, updatedData);
    } catch (error) {
        console.error("Error updating community:", error);
        toast({ title: "Error", description: "Failed to update community.", variant: "destructive" });
    }
  }, [toast]);
  
  const deleteCommunity = useCallback(async (id: string) => {
    try {
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
    } catch (error) {
        console.error("Error deleting community:", error);
        toast({ title: "Error", description: "Failed to delete community.", variant: "destructive" });
    }
  }, [toast]);

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

  const verifyCommunity = useCallback(async (communityId: string): Promise<void> => {
    const communityDocRef = doc(firestore, 'communities', communityId);
    try {
        await updateDoc(communityDocRef, { isVerified: true, updatedAt: serverTimestamp() });
        toast({ title: "Community Verified", description: "The community has been marked as verified." });
    } catch (error) {
        console.error("Error verifying community:", error);
        toast({ title: "Error", description: "Could not verify the community.", variant: "destructive" });
    }
  }, [toast]);

  const updateCommunityFeaturedStatus = useCallback(async (communityId: string, isFeatured: boolean) => {
    const communityDocRef = doc(firestore, 'communities', communityId);
    try {
        await updateDoc(communityDocRef, { isFeatured, updatedAt: serverTimestamp() });
        toast({
          title: 'Community Updated',
          description: `Community has been ${isFeatured ? 'featured' : 'un-featured'}.`,
        });
    } catch (error) {
        console.error("Error updating featured status:", error);
        toast({ title: "Error", description: "Could not update community's featured status.", variant: "destructive" });
    }
  }, [toast]);

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

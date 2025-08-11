
'use client';

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { collection, addDoc, onSnapshot, doc, updateDoc, deleteDoc, query, where, writeBatch, serverTimestamp, arrayUnion, arrayRemove, getDocs, orderBy } from 'firebase/firestore';
import { firestore, auth } from '@/lib/firebase';
import type { User } from '@/hooks/use-auth';
import { useToast } from './use-toast';
import { useAbout } from './use-about';

export interface CommunityManager {
  uid: string;
  email: string;
  name: string;
  role: 'admin' | 'moderator';
  addedAt: string;
  addedBy: string;
}

export interface Community {
  id: string;
  slug: string;
  name: string;
  type: 'Social' | 'Cultural' | 'Business' | 'Religious' | 'Charitable' | 'Regional' | 'Professional' | 'Other';
  description: string;
  fullDescription: string;
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
  logoUrl?: string;
  bannerUrl?: string;
  socialMedia?: {
    twitter?: string;
    linkedin?: string;
    facebook?: string;
    instagram?: string;
    facebookGroup?: string;
  };
  founderUid: string;
  managers?: CommunityManager[];
  founderEmail: string;
  createdAt: any;
  updatedAt: any;
}

export type NewCommunityInput = Omit<Community, 'id' | 'createdAt' | 'updatedAt' | 'isVerified' | 'founderEmail' | 'isFeatured' | 'managers'>;

interface CommunitiesContextType {
  communities: Community[];
  isLoading: boolean;
  error: string | null;
  retryFetch: () => void;
  addCommunity: (community: NewCommunityInput, user: User) => Promise<Community>;
  updateCommunity: (id: string, data: Partial<Omit<Community, 'id'>>) => Promise<void>;
  deleteCommunity: (id: string) => Promise<void>;
  getCommunityById: (id: string) => Community | undefined;
  getCommunityBySlug: (slug: string) => Community | undefined;
  isSlugUnique: (slug: string, currentId?: string) => Promise<boolean>;
  verifyCommunity: (communityId: string) => Promise<void>;
  updateCommunityFeaturedStatus: (communityId: string, isFeatured: boolean) => Promise<void>;
  addManager: (communityId: string, userToAdd: User, role: 'admin' | 'moderator') => Promise<void>;
  removeManager: (communityId: string, managerUid: string) => Promise<void>;
  updateManagerRole: (communityId: string, managerUid: string, newRole: 'admin' | 'moderator') => Promise<void>;
  canManageCommunity: (community: Community, user: User) => boolean;
}

const CommunitiesContext = createContext<CommunitiesContextType | undefined>(undefined);

export function CommunitiesProvider({ children }: { children: ReactNode }) {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { aboutContent } = useAbout();

  const fetchCommunities = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const q = query(collection(firestore, 'communities'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, 
      (querySnapshot) => {
        const communitiesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Community));
        setCommunities(communitiesData);
        setIsLoading(false);
      },
      (error: any) => {
        console.error("Failed to fetch communities from Firestore", error);
        let errorMessage = "Could not fetch communities. Please check your internet connection and try again.";
        if (error?.code === 'permission-denied') {
          errorMessage = "Access denied. Please check your Firebase security rules.";
        } else if (error?.code === 'unavailable') {
          errorMessage = "Service temporarily unavailable. Please try again later.";
        } else if (error?.message?.includes('Firebase')) {
          errorMessage = "Firebase connection error. Please check your configuration.";
        }
        setError(errorMessage);
        setIsLoading(false);
      }
    );
    
    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribePromise = fetchCommunities();
    return () => {
      unsubscribePromise.then(unsubscribe => unsubscribe && unsubscribe());
    };
  }, [fetchCommunities]);

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
      managers: [{
        uid: user.uid,
        email: user.email,
        name: user.name,
        role: 'admin' as const,
        addedAt: new Date().toISOString(),
        addedBy: user.uid,
      }],
    };
    batch.set(newCommunityRef, newCommunityForDb);

    const userRef = doc(firestore, 'users', user.uid);
    batch.update(userRef, {
      affiliation: {
        orgId: newCommunityRef.id,
        orgName: communityData.name,
        communitySlug: communityData.slug,
      },
    });

    try {
        await batch.commit();
        toast({ title: 'Community Created!', description: 'Your community page is now live.'});
        return { ...newCommunityForDb, id: newCommunityRef.id, createdAt: new Date(), updatedAt: new Date() } as Community;
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
                batch.update(userDoc.ref, { affiliation: null });
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

  const isSlugUnique = useCallback(async (slug: string, currentId?: string): Promise<boolean> => {
    if (!slug) return false;
    const q = query(collection(firestore, 'communities'), where("slug", "==", slug));
    const querySnapshot = await getDocs(q);
    if(querySnapshot.empty) return true;
    if(currentId && querySnapshot.docs[0].id === currentId) return true;
    return false;
  }, []);

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

  const addManager = useCallback(async (communityId: string, userToAdd: User, role: 'admin' | 'moderator') => {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error("Authentication required.");

    const community = getCommunityById(communityId);
    if (!community) throw new Error("Community not found.");
    if (userToAdd.uid === community.founderUid) {
      throw new Error("The founder is already the primary admin.");
    }
    if ((community.managers || []).some(m => m.uid === userToAdd.uid)) {
      throw new Error(`${userToAdd.name} is already a manager of this community.`);
    }

    const newManager: CommunityManager = {
      uid: userToAdd.uid,
      email: userToAdd.email,
      name: userToAdd.name,
      role: role,
      addedAt: new Date().toISOString(),
      addedBy: currentUser.uid,
    };
    
    try {
        const communityDocRef = doc(firestore, 'communities', communityId);
        await updateDoc(communityDocRef, {
            managers: arrayUnion(newManager)
        });
    } catch (error) {
        console.error("Error adding manager:", error);
        throw new Error("Failed to add manager to the database.");
    }
  }, [getCommunityById]);
  
  const removeManager = useCallback(async (communityId: string, managerUid: string) => {
    const community = getCommunityById(communityId);
    if (!community) throw new Error("Community not found.");
    if (managerUid === community.founderUid) throw new Error("The community founder cannot be removed.");

    const managerToRemove = (community.managers || []).find(m => m.uid === managerUid);
    if (!managerToRemove) throw new Error("Manager not found in this community.");

    const communityDocRef = doc(firestore, 'communities', communityId);
    await updateDoc(communityDocRef, { managers: arrayRemove(managerToRemove) });
  }, [getCommunityById]);
  
  const updateManagerRole = useCallback(async (communityId: string, managerUid: string, newRole: 'admin' | 'moderator') => {
    const community = getCommunityById(communityId);
    if (!community) throw new Error("Community not found.");
    if (managerUid === community.founderUid) throw new Error("The founder's role cannot be changed.");

    const updatedManagers = (community.managers || []).map(m => m.uid === managerUid ? { ...m, role: newRole } : m);
    await updateDoc(doc(firestore, 'communities', communityId), { managers: updatedManagers });
  }, [getCommunityById]);


  const canManageCommunity = useCallback((community: Community, user: User) => {
    if (!user) return false;
    if (aboutContent.adminUids.includes(user.uid)) return true;
    if (user.uid === community.founderUid) return true;
    if (community.managers?.some(m => m.uid === user.uid)) return true;
    return false;
  }, [aboutContent]);

  const retryFetch = useCallback(() => {
    fetchCommunities();
  }, [fetchCommunities]);

  const contextValue = {
    communities,
    isLoading,
    error,
    retryFetch,
    addCommunity,
    updateCommunity,
    deleteCommunity,
    getCommunityById,
    getCommunityBySlug,
    isSlugUnique,
    verifyCommunity,
    updateCommunityFeaturedStatus,
    addManager,
    removeManager,
    updateManagerRole,
    canManageCommunity,
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

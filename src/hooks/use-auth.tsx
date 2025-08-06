
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { auth, firestore } from '@/lib/firebase';
import { onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, type User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs, arrayUnion, arrayRemove } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';
import { initialAboutContent } from './use-about'; // Import initial content to get admin list

export interface User {
  uid: string;
  name: string;
  username: string;
  email: string;
  isAdmin?: boolean;
  profileImageUrl?: string;
  bio?: string;
  affiliation?: {
    orgId: string;
    orgName: string;
    orgSlug: string;
  } | null; // Allow null for no affiliation
  phone?: string;
  website?: string;
  currentLocation?: {
    country: string;
    state: string;
    city: string;
  };
  originLocation?: {
    indiaState: string;
    indiaDistrict: string;
  }
  languagesSpoken?: string[];
  interests?: string[];
  
  savedEvents?: string[];
  joinedCommunities?: string[];
  savedDeals?: string[];
  savedProviders?: string[];
  savedSponsors?: string[];
  
  notificationPreferences?: {
    eventsNearby: boolean;
    reminders: boolean;
  };
  calendarSyncEnabled?: boolean;
}

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  isLoading: boolean;
  signup: (name: string, email: string, pass: string) => Promise<void>;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updatedData: Partial<User>) => Promise<void>;
  setAffiliation: (orgId: string, orgName: string, orgSlug: string) => Promise<void>;
  getUserByUsername: (username: string) => Promise<User | undefined>;
  
  savedEvents: string[];
  saveEvent: (eventId: string) => void;
  unsaveEvent: (eventId: string) => void;
  isEventSaved: (eventId: string) => boolean;

  joinedCommunities: string[];
  joinCommunity: (orgId: string) => void;
  leaveCommunity: (orgId: string) => void;
  isCommunityJoined: (orgId: string) => boolean;

  savedDeals: string[];
  saveDeal: (dealId: string) => void;
  unsaveDeal: (dealId: string) => void;
  isDealSaved: (dealId: string) => boolean;

  savedProviders: string[];
  saveProvider: (providerId: string) => void;
  unsaveProvider: (providerId: string) => void;
  isProviderSaved: (providerId: string) => boolean;

  savedSponsors: string[];
  saveSponsor: (sponsorId: string) => void;
  unsaveSponsor: (sponsorId: string) => void;
  isSponsorSaved: (sponsorId: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function to fetch the admin list
const getAdminUids = async (): Promise<string[]> => {
    try {
        const aboutDocRef = doc(firestore, 'about', 'singleton');
        const docSnap = await getDoc(aboutDocRef);
        if (docSnap.exists() && docSnap.data()?.adminUids) {
            return docSnap.data().adminUids;
        }
    } catch (error) {
        console.error("Could not fetch admin UIDs", error);
    }
    // Fallback to initial content if Firestore fails
    return initialAboutContent.adminUids || [];
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setIsLoading(true);
      setFirebaseUser(fbUser);
      if (fbUser) {
        const userDocRef = doc(firestore, 'users', fbUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        if(userDocSnap.exists()) {
          const userData = userDocSnap.data() as User;
          
          const adminUids = await getAdminUids();
          userData.isAdmin = adminUids.includes(fbUser.uid);

          // If user has an affiliation, ensure the slug is present by fetching it.
          if (userData.affiliation && userData.affiliation.orgId && !userData.affiliation.orgSlug) {
              const communityDocRef = doc(firestore, 'communities', userData.affiliation.orgId);
              const communityDocSnap = await getDoc(communityDocRef);
              if (communityDocSnap.exists()) {
                  const communityData = communityDocSnap.data();
                  if(communityData && communityData.slug) {
                      const updatedAffiliation = { ...userData.affiliation, orgSlug: communityData.slug };
                      await updateDoc(userDocRef, { affiliation: updatedAffiliation });
                      setUser({ ...userData, affiliation: updatedAffiliation });
                  } else {
                     setUser(userData);
                  }
              } else {
                 setUser(userData);
              }
          } else {
             setUser(userData);
          }
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signup = async (name: string, email: string, pass: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    const fbUser = userCredential.user;
    const username = name.toLowerCase().replace(/[^a-z0-9]/g, '') + Math.floor(Math.random() * 1000);
    
    const adminUids = await getAdminUids();

    const newUser: User = {
      uid: fbUser.uid,
      name,
      username,
      email: fbUser.email!,
      isAdmin: adminUids.includes(fbUser.uid),
      affiliation: null,
      profileImageUrl: '',
      bio: '',
      phone: '',
      website: '',
      currentLocation: { country: '', state: '', city: '' },
      originLocation: { indiaState: '', indiaDistrict: '' },
      languagesSpoken: [],
      interests: [],
      
      savedEvents: [],
      joinedCommunities: [],
      savedDeals: [],
      savedProviders: [],
      savedSponsors: [],
    };
    await setDoc(doc(firestore, 'users', fbUser.uid), newUser);
    setUser(newUser);
  }

  const login = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass);
  }

  const logout = async () => {
    await signOut(auth);
  };
  
  const updateUser = async (updatedData: Partial<User>) => {
    if (user) {
      const userDocRef = doc(firestore, 'users', user.uid);
      await updateDoc(userDocRef, updatedData);
      setUser(prevUser => prevUser ? { ...prevUser, ...updatedData } : null);
    }
  };

  const setAffiliation = async (orgId: string, orgName: string, orgSlug: string) => {
    if (user) {
        const affiliation = (orgId && orgName && orgSlug) ? { orgId, orgName, orgSlug } : null;
        const userDocRef = doc(firestore, 'users', user.uid);
        await updateDoc(userDocRef, { affiliation });
        setUser(prevUser => prevUser ? { ...prevUser, affiliation } : null);
    }
  };

  const getUserByUsername = async (username: string): Promise<User | undefined> => {
    const usersRef = collection(firestore, 'users');
    const q = query(usersRef, where("username", "==", username));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
        return querySnapshot.docs[0].data() as User;
    }
    return undefined;
  };

  const createSaveFunctions = (listType: keyof User & ('savedEvents' | 'joinedCommunities' | 'savedDeals' | 'savedProviders' | 'savedSponsors')) => {
    const list = user?.[listType] || [];

    const saveItem = async (itemId: string) => {
        if (!user) return;
        const userRef = doc(firestore, 'users', user.uid);
        await updateDoc(userRef, { [listType]: arrayUnion(itemId) });
        setUser(prevUser => prevUser ? { ...prevUser, [listType]: [...(prevUser[listType] || []), itemId] } : null);
    };

    const unsaveItem = async (itemId: string) => {
        if (!user) return;
        const userRef = doc(firestore, 'users', user.uid);
        await updateDoc(userRef, { [listType]: arrayRemove(itemId) });
        setUser(prevUser => prevUser ? { ...prevUser, [listType]: (prevUser[listType] || []).filter(id => id !== itemId) } : null);
    };
    
    const isItemSaved = (itemId: string) => list.includes(itemId);

    return { saveItem, unsaveItem, isItemSaved, list };
  };
  
  const { saveItem: saveEvent, unsaveItem: unsaveEvent, isItemSaved: isEventSaved, list: savedEvents } = createSaveFunctions('savedEvents');
  const { saveItem: joinCommunity, unsaveItem: leaveCommunity, isItemSaved: isCommunityJoined, list: joinedCommunities } = createSaveFunctions('joinedCommunities');
  const { saveItem: saveDeal, unsaveItem: unsaveDeal, isItemSaved: isDealSaved, list: savedDeals } = createSaveFunctions('savedDeals');
  const { saveItem: saveProvider, unsaveItem: unsaveProvider, isItemSaved: isProviderSaved, list: savedProviders } = createSaveFunctions('savedProviders');
  const { saveItem: saveSponsor, unsaveItem: unsaveSponsor, isItemSaved: isSponsorSaved, list: savedSponsors } = createSaveFunctions('savedSponsors');

  const value = { 
    user,
    firebaseUser,
    isLoading,
    signup,
    login, 
    logout, 
    updateUser,
    setAffiliation,
    getUserByUsername,
    savedEvents, saveEvent, unsaveEvent, isEventSaved,
    joinedCommunities, joinCommunity, leaveCommunity, isCommunityJoined,
    savedDeals, saveDeal, unsaveDeal, isDealSaved,
    savedProviders, saveProvider, unsaveProvider, isProviderSaved,
    savedSponsors, saveSponsor, unsaveSponsor, isSponsorSaved,
  };

  return (
    <AuthContext.Provider value={value}>
      {isLoading ? (
        <div className="flex h-screen w-screen items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

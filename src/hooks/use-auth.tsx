
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { auth, firestore } from '@/lib/firebase';
import { onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, type User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';
import { getInitials } from '@/lib/utils';

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
  };
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
  updateUser: (updatedData: Partial<User>) => void;
  setAffiliation: (orgId: string, orgName: string) => void;
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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        const userDocRef = doc(firestore, 'users', fbUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        if(userDocSnap.exists()) {
          setUser(userDocSnap.data() as User);
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
    const newUser: User = {
      uid: fbUser.uid,
      name,
      username,
      email: fbUser.email!,
      isAdmin: fbUser.uid === 'defDHmCjCdWvmGid9YYg3RJi01x2',
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
      const updatedUser = { ...user, ...updatedData };
      setUser(updatedUser);
      const userDocRef = doc(firestore, 'users', user.uid);
      await updateDoc(userDocRef, updatedData);
    }
  };

  const setAffiliation = (orgId: string, orgName: string) => {
    if (user) {
      updateUser({ affiliation: { orgId, orgName } });
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

  const createSaveFunctions = <K extends keyof User>(listType: K) => {
    const list = (user?.[listType] as string[] | undefined) || [];

    const saveItem = (itemId: string) => {
      if (user && !list.includes(itemId)) {
        const newList = [...list, itemId];
        updateUser({ [listType]: newList } as Partial<User>);
      }
    };

    const unsaveItem = (itemId: string) => {
      if (user) {
        const newList = list.filter((id) => id !== itemId);
        updateUser({ [listType]: newList } as Partial<User>);
      }
    };
    
    const isItemSaved = (itemId: string) => list.includes(itemId);

    return { saveItem, unsaveItem, isItemSaved };
  };
  
  const { saveItem: saveEvent, unsaveItem: unsaveEvent, isItemSaved: isEventSaved } = createSaveFunctions('savedEvents');
  const { saveItem: joinCommunity, unsaveItem: leaveCommunity, isItemSaved: isCommunityJoined } = createSaveFunctions('joinedCommunities');
  const { saveItem: saveDeal, unsaveItem: unsaveDeal, isItemSaved: isDealSaved } = createSaveFunctions('savedDeals');
  const { saveItem: saveProvider, unsaveItem: unsaveProvider, isItemSaved: isProviderSaved } = createSaveFunctions('savedProviders');
  const { saveItem: saveSponsor, unsaveItem: unsaveSponsor, isItemSaved: isSponsorSaved } = createSaveFunctions('savedSponsors');

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
    savedEvents: (user?.savedEvents || []), saveEvent, unsaveEvent, isEventSaved,
    joinedCommunities: (user?.joinedCommunities || []), joinCommunity, leaveCommunity, isCommunityJoined,
    savedDeals: (user?.savedDeals || []), saveDeal, unsaveDeal, isDealSaved,
    savedProviders: (user?.savedProviders || []), saveProvider, unsaveProvider, isProviderSaved,
    savedSponsors: (user?.savedSponsors || []), saveSponsor, unsaveSponsor, isSponsorSaved,
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

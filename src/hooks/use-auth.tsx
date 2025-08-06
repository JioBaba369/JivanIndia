
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { auth, firestore } from '@/lib/firebase';
import { onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, type User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs, arrayUnion, arrayRemove } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';
import { useAbout } from '@/hooks/use-about'; 
import { useToast } from './use-toast';
import { useCommunities } from './use-communities';

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
  } | null; 
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
  savedBusinesses?: string[];
  savedSponsors?: string[];
  savedMovies?: string[];
  
  notificationPreferences?: {
    eventsNearby: boolean;
    reminders: boolean;
  };
  calendarSyncEnabled?: boolean;
}

export type SaveableItem = 'savedEvents' | 'joinedCommunities' | 'savedDeals' | 'savedBusinesses' | 'savedSponsors' | 'savedMovies';


interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  isLoading: boolean;
  signup: (name: string, email: string, pass: string, country: string) => Promise<void>;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updatedData: Partial<User>) => Promise<void>;
  setAffiliation: (orgId: string, orgName: string, orgSlug: string) => Promise<void>;
  getUserByUsername: (username: string) => Promise<User | undefined>;
  isUsernameUnique: (username: string, currentUid?: string) => Promise<boolean>;
  
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

  savedBusinesses: string[];
  saveBusiness: (businessId: string) => void;
  unsaveBusiness: (businessId: string) => void;
  isBusinessSaved: (businessId: string) => boolean;

  savedSponsors: string[];
  saveSponsor: (sponsorId: string) => void;
  unsaveSponsor: (sponsorId: string) => void;
  isSponsorSaved: (sponsorId: string) => boolean;

  savedMovies: string[];
  saveMovie: (movieId: string) => void;
  unsaveMovie: (movieId: string) => void;
  isMovieSaved: (movieId: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const { aboutContent, isLoading: isAboutLoading } = useAbout();
  const { communities, isLoading: isCommunitiesLoading } = useCommunities();
  const { toast } = useToast();

  const fetchUserData = useCallback(async (fbUser: FirebaseUser, adminUids: string[], allCommunities: any[]): Promise<User | null> => {
    const userDocRef = doc(firestore, 'users', fbUser.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
        return null;
    }

    const userData = userDocSnap.data() as User;
    userData.isAdmin = adminUids.includes(fbUser.uid);
    
    if (userData.affiliation && userData.affiliation.orgId && !userData.affiliation.orgSlug) {
        const community = allCommunities.find(c => c.id === userData.affiliation!.orgId);
        if (community?.slug) {
            const updatedAffiliation = { ...userData.affiliation, orgSlug: community.slug };
            await updateDoc(userDocRef, { affiliation: updatedAffiliation });
            return { ...userData, affiliation: updatedAffiliation };
        }
    }
    
    return userData;
  }, []);
  
  useEffect(() => {
    if (isAboutLoading || isCommunitiesLoading) return;
    
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setIsAuthLoading(true);
      setFirebaseUser(fbUser);
      if (fbUser) {
        const userData = await fetchUserData(fbUser, aboutContent.adminUids || [], communities);
        setUser(userData);
      } else {
        setUser(null);
      }
      setIsAuthLoading(false);
    });
    return () => unsubscribe();
  }, [fetchUserData, isAboutLoading, isCommunitiesLoading, aboutContent, communities]);

  const signup = async (name: string, email: string, pass: string, country: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    const fbUser = userCredential.user;
    const username = name.toLowerCase().replace(/[^a-z0-9]/g, '') + Math.floor(Math.random() * 1000);
    
    const adminUids = aboutContent?.adminUids || [];

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
      currentLocation: { country: country, state: '', city: '' },
      originLocation: { indiaState: '', indiaDistrict: '' },
      languagesSpoken: [],
      interests: [],
      savedEvents: [],
      joinedCommunities: [],
      savedDeals: [],
      savedBusinesses: [],
      savedSponsors: [],
      savedMovies: [],
    };
    await setDoc(doc(firestore, 'users', fbUser.uid), newUser);
    setUser(newUser);
  }

  const login = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass);
     toast({
        title: "Login Successful",
        description: "Welcome back!",
      });
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
        await updateUser({ affiliation });
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

  const isUsernameUnique = async (username: string, currentUid?: string): Promise<boolean> => {
    const usersRef = collection(firestore, 'users');
    const q = query(usersRef, where("username", "==", username));
    const querySnapshot = await getDocs(q);
    if(querySnapshot.empty) return true;
    if(currentUid && querySnapshot.docs[0].id === currentUid) {
      return true;
    }
    return false;
  };

  const createSaveFunctions = (listType: SaveableItem) => {
    const list = user?.[listType] || [];

    const saveItem = async (itemId: string) => {
        if (!user) return;
        setUser(prevUser => prevUser ? { ...prevUser, [listType]: [...(prevUser[listType] || []), itemId] } : null);
        const userRef = doc(firestore, 'users', user.uid);
        await updateDoc(userRef, { [listType]: arrayUnion(itemId) });
    };

    const unsaveItem = async (itemId: string) => {
        if (!user) return;
        setUser(prevUser => prevUser ? { ...prevUser, [listType]: (prevUser[listType] || []).filter(id => id !== itemId) } : null);
        const userRef = doc(firestore, 'users', user.uid);
        await updateDoc(userRef, { [listType]: arrayRemove(itemId) });
    };
    
    const isItemSaved = (itemId: string) => list.includes(itemId);

    return { saveItem, unsaveItem, isItemSaved, list };
  };
  
  const { saveItem: saveEvent, unsaveItem: unsaveEvent, isItemSaved: isEventSaved, list: savedEvents } = createSaveFunctions('savedEvents');
  const { saveItem: joinCommunity, unsaveItem: leaveCommunity, isItemSaved: isCommunityJoined, list: joinedCommunities } = createSaveFunctions('joinedCommunities');
  const { saveItem: saveDeal, unsaveItem: unsaveDeal, isItemSaved: isDealSaved, list: savedDeals } = createSaveFunctions('savedDeals');
  const { saveItem: saveBusiness, unsaveItem: unsaveBusiness, isItemSaved: isBusinessSaved, list: savedBusinesses } = createSaveFunctions('savedBusinesses');
  const { saveItem: saveSponsor, unsaveItem: unsaveSponsor, isItemSaved: isSponsorSaved, list: savedSponsors } = createSaveFunctions('savedSponsors');
  const { saveItem: saveMovie, unsaveItem: unsaveMovie, isItemSaved: isMovieSaved, list: savedMovies } = createSaveFunctions('savedMovies');

  const isLoading = isAuthLoading || isAboutLoading || isCommunitiesLoading;

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
    isUsernameUnique,
    savedEvents, saveEvent, unsaveEvent, isEventSaved,
    joinedCommunities, joinCommunity, leaveCommunity, isCommunityJoined,
    savedDeals, saveDeal, unsaveDeal, isDealSaved,
    savedBusinesses, saveBusiness, unsaveBusiness, isBusinessSaved,
    savedSponsors, saveSponsor, unsaveSponsor, isSponsorSaved,
    savedMovies, saveMovie, unsaveMovie, isMovieSaved,
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

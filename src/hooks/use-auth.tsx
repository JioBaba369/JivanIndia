
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { auth, firestore } from '@/lib/firebase';
import { onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, type User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs, arrayUnion, arrayRemove, writeBatch } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';
import { initialAboutContent, type AboutContent } from '@/hooks/use-about'; 
import { initialCommunities, type Community } from '@/hooks/use-communities';
import { useToast } from './use-toast';

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
  initialAboutData: AboutContent | null;
  initialCommunitiesData: Community[];
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
  const [isLoading, setIsLoading] = useState(true);
  const [initialAboutData, setInitialAboutData] = useState<AboutContent | null>(null);
  const [initialCommunitiesData, setInitialCommunitiesData] = useState<Community[]>([]);
  const { toast } = useToast();

  const fetchInitialData = useCallback(async () => {
    try {
      // Fetch About Content
      const aboutDocRef = doc(firestore, 'about', 'singleton');
      const aboutDocSnap = await getDoc(aboutDocRef);
      let aboutData;
      if (aboutDocSnap.exists()) {
        aboutData = aboutDocSnap.data() as AboutContent;
      } else {
        await setDoc(aboutDocRef, initialAboutContent);
        aboutData = initialAboutContent;
      }
      setInitialAboutData(aboutData);
      
      // Fetch Communities
      const communitiesCollectionRef = collection(firestore, 'communities');
      const communitiesSnapshot = await getDocs(communitiesCollectionRef);
      let communitiesData;
      if (communitiesSnapshot.empty) {
        const batch = writeBatch(firestore);
        initialCommunities.forEach(communityData => {
            const docRef = doc(communitiesCollectionRef);
            batch.set(docRef, { ...communityData, founderEmail: 'seed@jivanindia.co', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
        });
        await batch.commit();
        const seededSnapshot = await getDocs(communitiesCollectionRef);
        communitiesData = seededSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Community));
      } else {
        communitiesData = communitiesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Community));
      }
      setInitialCommunitiesData(communitiesData);

    } catch (error) {
        console.error("Error fetching initial data:", error);
    }
  }, []);
  
  useEffect(() => {
    fetchInitialData().then(() => {
        const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
            setFirebaseUser(fbUser);
            if (fbUser && initialAboutData && initialCommunitiesData) {
                const userDocRef = doc(firestore, 'users', fbUser.uid);
                const userDocSnap = await getDoc(userDocRef);
                if (userDocSnap.exists()) {
                    const userData = userDocSnap.data() as User;
                    userData.isAdmin = initialAboutData.adminUids?.includes(fbUser.uid) || false;
                    setUser(userData);
                } else {
                    setUser(null); // User exists in Auth, but not in Firestore. Should not happen in normal flow.
                }
            } else {
                setUser(null);
            }
            setIsLoading(false);
        });

        return () => unsubscribe();
    });
  }, [fetchInitialData, initialAboutData, initialCommunitiesData]);


  const signup = async (name: string, email: string, pass: string, country: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    const fbUser = userCredential.user;
    const username = name.toLowerCase().replace(/[^a-z0-9]/g, '') + Math.floor(Math.random() * 1000);
    
    const adminUids = initialAboutData?.adminUids || [];

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

  const value = { 
    user,
    firebaseUser,
    isLoading,
    initialAboutData,
    initialCommunitiesData,
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

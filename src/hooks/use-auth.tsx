
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { auth, firestore } from '@/lib/firebase';
import { onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, type User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs, arrayUnion, arrayRemove } from 'firebase/firestore';
import { useToast } from './use-toast';
import { useAbout } from './use-about';

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
  savedMovies?: string[];
  
  notificationPreferences?: {
    eventsNearby: boolean;
    reminders: boolean;
  };
  calendarSyncEnabled?: boolean;
}

interface AuthContextType {
  user: User | null;
  users: User[];
  firebaseUser: FirebaseUser | null;
  isLoading: boolean;
  signup: (name: string, email: string, pass: string, country: string) => Promise<void>;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updatedData: Partial<User>) => Promise<void>;
  setAffiliation: (orgId: string, orgName: string, orgSlug: string) => Promise<void>;
  getUserByUsername: (username: string) => Promise<User | undefined>;
  isUsernameUnique: (username: string, currentUid?: string) => Promise<boolean>;
  
  saveEvent: (eventId: string) => void;
  unsaveEvent: (eventId: string) => void;
  isEventSaved: (eventId: string) => boolean;

  joinCommunity: (orgId: string) => void;
  leaveCommunity: (orgId: string) => void;
  isCommunityJoined: (orgId: string) => boolean;

  saveDeal: (dealId: string) => void;
  unsaveDeal: (dealId: string) => void;
  isDealSaved: (dealId: string) => boolean;

  saveBusiness: (businessId: string) => void;
  unsaveBusiness: (businessId: string) => void;
  isBusinessSaved: (businessId: string) => boolean;

  saveMovie: (movieId: string) => void;
  unsaveMovie: (movieId: string) => void;
  isMovieSaved: (movieId: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { aboutContent } = useAbout();

  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        const userDocRef = doc(firestore, 'users', fbUser.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data() as User;
          userData.isAdmin = aboutContent?.adminUids?.includes(fbUser.uid) || false;
          setUser(userData);
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
      
      // Fetch all users for admin panel
      const usersCollectionRef = collection(firestore, 'users');
      const usersSnapshot = await getDocs(usersCollectionRef);
      setUsers(usersSnapshot.docs.map(doc => ({ ...doc.data() } as User)));
      
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [aboutContent]);

  const signup = async (name: string, email: string, pass: string, country: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    const fbUser = userCredential.user;
    const username = name.toLowerCase().replace(/[^a-z0-9]/g, '') + Math.floor(Math.random() * 1000);
    
    const newUser: User = {
      uid: fbUser.uid,
      name,
      username,
      email: fbUser.email!,
      isAdmin: aboutContent?.adminUids?.includes(fbUser.uid),
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
      savedMovies: [],
    };
    await setDoc(doc(firestore, 'users', fbUser.uid), newUser);
    setUser(newUser);
    setUsers(prev => [...prev, newUser]);
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
  
  const updateUser = useCallback(async (updatedData: Partial<User>) => {
    if (user) {
      const userDocRef = doc(firestore, 'users', user.uid);
      await updateDoc(userDocRef, updatedData);
      setUser(prevUser => prevUser ? { ...prevUser, ...updatedData } : null);
    }
  }, [user]);

  const setAffiliation = useCallback(async (orgId: string, orgName: string, orgSlug: string) => {
    if (user) {
        const affiliation = (orgId && orgName && orgSlug) ? { orgId, orgName, orgSlug } : null;
        await updateUser({ affiliation });
    }
  }, [user, updateUser]);

  const getUserByUsername = useCallback(async (username: string): Promise<User | undefined> => {
    const usersRef = collection(firestore, 'users');
    const q = query(usersRef, where("username", "==", username));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
        return querySnapshot.docs[0].data() as User;
    }
    return undefined;
  }, []);

  const isUsernameUnique = useCallback(async (username: string, currentUid?: string): Promise<boolean> => {
    const usersRef = collection(firestore, 'users');
    const q = query(usersRef, where("username", "==", username));
    const querySnapshot = await getDocs(q);
    if(querySnapshot.empty) return true;
    if(currentUid && querySnapshot.docs[0].id === currentUid) {
      return true;
    }
    return false;
  }, []);

 const saveItem = useCallback(async (listType: keyof User, itemId: string) => {
    if (!user) return;
    const userRef = doc(firestore, 'users', user.uid);
    try {
        await updateDoc(userRef, { [listType]: arrayUnion(itemId) });
        setUser(prevUser => {
            if (!prevUser) return null;
            const currentList = (prevUser[listType] as string[] || []);
            return { ...prevUser, [listType]: [...currentList, itemId] };
        });
    } catch (e) { console.error(e); }
  }, [user]);

  const unsaveItem = useCallback(async (listType: keyof User, itemId: string) => {
    if (!user) return;
    const userRef = doc(firestore, 'users', user.uid);
     try {
        await updateDoc(userRef, { [listType]: arrayRemove(itemId) });
        setUser(prevUser => {
            if (!prevUser) return null;
            const currentList = (prevUser[listType] as string[] || []);
            return { ...prevUser, [listType]: currentList.filter(id => id !== itemId) };
        });
    } catch (e) { console.error(e); }
  }, [user]);

  const isItemSaved = useCallback((listType: keyof User, itemId: string) => {
    if (!user || !user[listType]) return false;
    return (user[listType] as string[]).includes(itemId);
  }, [user]);

  const value = { 
    user,
    users,
    firebaseUser,
    isLoading,
    signup,
    login, 
    logout, 
    updateUser,
    setAffiliation,
    getUserByUsername,
    isUsernameUnique,
    saveEvent: (id: string) => saveItem('savedEvents', id),
    unsaveEvent: (id: string) => unsaveItem('savedEvents', id),
    isEventSaved: (id: string) => isItemSaved('savedEvents', id),
    joinCommunity: (id: string) => saveItem('joinedCommunities', id),
    leaveCommunity: (id: string) => unsaveItem('joinedCommunities', id),
    isCommunityJoined: (id: string) => isItemSaved('joinedCommunities', id),
    saveDeal: (id: string) => saveItem('savedDeals', id),
    unsaveDeal: (id: string) => unsaveItem('savedDeals', id),
    isDealSaved: (id: string) => isItemSaved('savedDeals', id),
    saveBusiness: (id: string) => saveItem('savedBusinesses', id),
    unsaveBusiness: (id: string) => unsaveItem('savedBusinesses', id),
    isBusinessSaved: (id: string) => isItemSaved('savedBusinesses', id),
    saveMovie: (id: string) => saveItem('savedMovies', id),
    unsaveMovie: (id: string) => unsaveItem('savedMovies', id),
    isMovieSaved: (id: string) => isItemSaved('savedMovies', id),
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
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

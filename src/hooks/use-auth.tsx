
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { auth, firestore } from '@/lib/firebase';
import { onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, type User as FirebaseUser, EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs, arrayUnion, arrayRemove, onSnapshot, writeBatch } from 'firebase/firestore';
import { useToast } from './use-toast';
import { generateSlug } from '@/lib/utils';


export interface User {
  uid: string;
  name: string;
  username: string;
  email: string;
  bio?: string;
  profileImageUrl?: string;
  affiliation?: {
    orgId: string;
    orgName: string;
    communitySlug: string;
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
  firebaseUser: FirebaseUser | null;
  isAuthLoading: boolean;
  signup: (name: string, email: string, pass: string, country: string, state: string, city: string) => Promise<void>;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updatedData: Partial<User>) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  setAffiliation: (orgId: string, orgName: string, communitySlug: string) => Promise<void>;
  getUserByUsername: (username: string) => Promise<User | undefined>;
  isUsernameUnique: (username: string, currentUid?: string) => Promise<boolean>;
  
  saveItem: (listType: keyof Pick<User, 'savedEvents' | 'joinedCommunities' | 'savedDeals' | 'savedMovies' | 'savedBusinesses'>, itemId: string) => Promise<void>;
  unsaveItem: (listType: keyof Pick<User, 'savedEvents' | 'joinedCommunities' | 'savedDeals' | 'savedMovies' | 'savedBusinesses'>, itemId: string) => Promise<void>;
  isItemSaved: (listType: keyof Pick<User, 'savedEvents' | 'joinedCommunities' | 'savedDeals' | 'savedMovies' | 'savedBusinesses'>, itemId: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const authUnsubscribe = onAuthStateChanged(auth, (fbUser) => {
        setIsAuthLoading(true);
        setFirebaseUser(fbUser);
        if (!fbUser) {
            setUser(null);
            setIsAuthLoading(false);
        }
    });

    return () => authUnsubscribe();
  }, []);

  useEffect(() => {
    let userUnsubscribe: (() => void) | undefined;

    if (firebaseUser) {
        const userDocRef = doc(firestore, 'users', firebaseUser.uid);
        userUnsubscribe = onSnapshot(userDocRef, (userDocSnap) => {
            if (userDocSnap.exists()) {
                const userData = userDocSnap.data() as User;
                setUser({ ...userData, uid: firebaseUser.uid });
            } else {
                setUser(null);
            }
            setIsAuthLoading(false);
        }, (error) => {
            console.error("Error listening to user document:", error);
            setUser(null);
            setIsAuthLoading(false);
        });
    } else {
      setIsAuthLoading(false);
    }

    return () => {
        if (userUnsubscribe) {
            userUnsubscribe();
        }
    };
  }, [firebaseUser]);

  const isUsernameUnique = useCallback(async (username: string, currentUid?: string): Promise<boolean> => {
    if (!username) return false;
    const q = query(collection(firestore, 'users'), where("username", "==", username));
    const querySnapshot = await getDocs(q);
    if(querySnapshot.empty) return true;
    if(currentUid && querySnapshot.docs[0].id === currentUid) {
      return true;
    }
    return false;
  }, []);

  const signup = async (name: string, email: string, pass: string, country: string, state: string, city: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
      const fbUser = userCredential.user;
      
      let username = generateSlug(name);
      let isUnique = await isUsernameUnique(username, fbUser.uid);
      let attempts = 0;
      while (!isUnique && attempts < 5) {
          username = `${generateSlug(name)}${Math.floor(Math.random() * 1000)}`;
          isUnique = await isUsernameUnique(username, fbUser.uid);
          attempts++;
      }
      
      const newUser: Omit<User, 'uid'> = {
        name,
        username,
        email: fbUser.email!,
        affiliation: null,
        bio: '',
        phone: '',
        website: '',
        profileImageUrl: '',
        currentLocation: { country, state, city },
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
    } catch (error) {
      console.error('Signup Error:', error);
      throw error;
    }
  };

  const login = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass);
     toast({
        title: "Login Successful",
        description: "Welcome back!",
      });
  };

  const logout = async () => {
    await signOut(auth);
  };
  
  const updateUser = useCallback(async (updatedData: Partial<User>) => {
    if (!firebaseUser) return;
    try {
      const userDocRef = doc(firestore, 'users', firebaseUser.uid);
      await updateDoc(userDocRef, updatedData);
    } catch(error) {
      console.error('Update User Error:', error);
      throw error;
    }
  }, [firebaseUser]);

  const changePassword = useCallback(async (currentPassword: string, newPassword: string) => {
    if (!firebaseUser || !firebaseUser.email) {
      throw new Error("You must be logged in to change your password.");
    }
    
    const credential = EmailAuthProvider.credential(firebaseUser.email, currentPassword);
    
    try {
      await reauthenticateWithCredential(firebaseUser, credential);
      await updatePassword(firebaseUser, newPassword);
    } catch (error: any) {
      console.error("Password change error:", error);
      if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        throw new Error("The current password you entered is incorrect.");
      }
      throw new Error("An unexpected error occurred while changing your password.");
    }
  }, [firebaseUser]);


  const setAffiliation = useCallback(async (orgId: string, orgName: string, communitySlug: string) => {
    if (!user) return;
    
    const userRef = doc(firestore, 'users', user.uid);
    let affiliationData = null;

    if (orgId && orgName && communitySlug) {
        affiliationData = { orgId, orgName, communitySlug };
    }
    
    await updateDoc(userRef, { affiliation: affiliationData });
  }, [user]);

  const getUserByUsername = useCallback(async (username: string): Promise<User | undefined> => {
    const q = query(collection(firestore, 'users'), where("username", "==", username));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();
        return { ...userData, uid: querySnapshot.docs[0].id } as User;
    }
    return undefined;
  }, []);

  const saveItem = useCallback(async (listType: keyof Pick<User, 'savedEvents' | 'joinedCommunities' | 'savedDeals' | 'savedMovies' | 'savedBusinesses'>, itemId: string) => {
    if (!firebaseUser) return;
    const userRef = doc(firestore, 'users', firebaseUser.uid);
    try {
        await updateDoc(userRef, { [listType]: arrayUnion(itemId) });
    } catch (e) { console.error(`Failed to save item to ${String(listType)}`, e); }
  }, [firebaseUser]);

  const unsaveItem = useCallback(async (listType: keyof Pick<User, 'savedEvents' | 'joinedCommunities' | 'savedDeals' | 'savedMovies' | 'savedBusinesses'>, itemId: string) => {
    if (!firebaseUser) return;
    const userRef = doc(firestore, 'users', firebaseUser.uid);
     try {
        await updateDoc(userRef, { [listType]: arrayRemove(itemId) });
    } catch (e) { console.error(`Failed to unsave item from ${String(listType)}`, e); }
  }, [firebaseUser]);

  const isItemSaved = useCallback((listType: keyof Pick<User, 'savedEvents' | 'joinedCommunities' | 'savedDeals' | 'savedMovies' | 'savedBusinesses'>, itemId: string) => {
    if (!user || !user[listType] || !Array.isArray(user[listType])) return false;
    return (user[listType] as string[]).includes(itemId);
  }, [user]);


  const value = { 
    user,
    firebaseUser,
    isAuthLoading,
    signup,
    login, 
    logout, 
    updateUser,
    changePassword,
    setAffiliation,
    getUserByUsername,
    isUsernameUnique,
    saveItem,
    unsaveItem,
    isItemSaved
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


'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { auth, firestore } from '@/lib/firebase';
import { onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, type User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs, arrayUnion, arrayRemove, onSnapshot, writeBatch } from 'firebase/firestore';
import { useToast } from './use-toast';
import { generateSlug } from '@/lib/utils';
import { useAbout } from './use-about';


export type UserRole = 'admin' | 'community-manager';

export interface User {
  uid: string;
  name: string;
  username: string;
  email: string;
  roles: UserRole[];
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
  firebaseUser: FirebaseUser | null;
  isLoading: boolean;
  isAuthLoading: boolean;
  signup: (name: string, email: string, pass: string, country: string, state: string, city: string) => Promise<void>;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updatedData: Partial<User>) => Promise<void>;
  setAffiliation: (orgId: string, orgName: string, orgSlug: string) => Promise<void>;
  getUserByUsername: (username: string) => Promise<User | undefined>;
  isUsernameUnique: (username: string, currentUid?: string) => Promise<boolean>;
  
  saveEvent: (eventId: string) => Promise<void>;
  unsaveEvent: (eventId: string) => Promise<void>;
  isEventSaved: (eventId: string) => boolean;
  
  joinCommunity: (communityId: string) => Promise<void>;
  leaveCommunity: (communityId: string) => Promise<void>;
  isCommunityJoined: (communityId: string) => boolean;

  saveDeal: (dealId: string) => Promise<void>;
  unsaveDeal: (dealId: string) => Promise<void>;
  isDealSaved: (dealId: string) => boolean;

  saveBusiness: (businessId: string) => Promise<void>;
  unsaveBusiness: (businessId: string) => Promise<void>;
  isBusinessSaved: (businessId: string) => boolean;

  saveMovie: (movieId: string) => Promise<void>;
  unsaveMovie: (movieId: string) => Promise<void>;
  isMovieSaved: (movieId: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const { aboutContent, isLoading: isAboutLoading } = useAbout();
  const { toast } = useToast();
  
  const isLoading = isAuthLoading || isAboutLoading;

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
                const userData = userDocSnap.data() as Omit<User, 'uid'>;
                let roles: UserRole[] = userData.roles || [];
                
                const isAdmin = aboutContent.adminUids?.includes(firebaseUser.uid);
                
                if (isAdmin && !roles.includes('admin')) {
                    roles = [...roles, 'admin'];
                } else if (!isAdmin && roles.includes('admin')) {
                    roles = roles.filter(role => role !== 'admin');
                }

                setUser({ ...userData, uid: firebaseUser.uid, roles });
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
      setUser(null);
      setIsAuthLoading(false);
    }

    return () => {
        if (userUnsubscribe) {
            userUnsubscribe();
        }
    };
  }, [firebaseUser, aboutContent.adminUids]);

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
    
    const newUser: User = {
      uid: fbUser.uid,
      name,
      username,
      email: fbUser.email!,
      roles: [],
      affiliation: null,
      bio: '',
      phone: '',
      website: '',
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
    setUser(newUser);
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
    const userDocRef = doc(firestore, 'users', firebaseUser.uid);
    await updateDoc(userDocRef, updatedData);
  }, [firebaseUser]);

  const setAffiliation = useCallback(async (orgId: string, orgName: string, orgSlug: string) => {
    if (user) {
        const batch = writeBatch(firestore);
        const userRef = doc(firestore, 'users', user.uid);

        const affiliation = (orgId && orgName && orgSlug) ? { orgId, orgName, orgSlug } : null;
        let newRoles: UserRole[] = [...(user.roles || [])].filter(r => r !== 'community-manager');
        
        if (affiliation) {
            newRoles.push('community-manager');
        }
        
        batch.update(userRef, { affiliation, roles: newRoles });
        await batch.commit();
    }
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

  const saveItem = useCallback(async (listType: keyof User, itemId: string) => {
    if (!firebaseUser) return;
    const userRef = doc(firestore, 'users', firebaseUser.uid);
    try {
        await updateDoc(userRef, { [listType]: arrayUnion(itemId) });
    } catch (e) { console.error(`Failed to save item to ${String(listType)}`, e); }
  }, [firebaseUser]);

  const unsaveItem = useCallback(async (listType: keyof User, itemId: string) => {
    if (!firebaseUser) return;
    const userRef = doc(firestore, 'users', firebaseUser.uid);
     try {
        await updateDoc(userRef, { [listType]: arrayRemove(itemId) });
    } catch (e) { console.error(`Failed to unsave item from ${String(listType)}`, e); }
  }, [firebaseUser]);

  const isItemSaved = useCallback((listType: keyof User, itemId: string) => {
    if (!user || !Array.isArray(user[listType])) return false;
    return (user[listType] as string[]).includes(itemId);
  }, [user]);

  const value = { 
    user,
    firebaseUser,
    isLoading,
    isAuthLoading,
    signup,
    login, 
    logout, 
    updateUser,
    setAffiliation,
    getUserByUsername,
    isUsernameUnique,
    saveEvent: (eventId: string) => saveItem('savedEvents', eventId),
    unsaveEvent: (eventId: string) => unsaveItem('savedEvents', eventId),
    isEventSaved: (eventId: string) => isItemSaved('savedEvents', eventId),
    joinCommunity: (communityId: string) => saveItem('joinedCommunities', communityId),
    leaveCommunity: (communityId: string) => unsaveItem('joinedCommunities', communityId),
    isCommunityJoined: (communityId: string) => isItemSaved('joinedCommunities', communityId),
    saveDeal: (dealId: string) => saveItem('savedDeals', dealId),
    unsaveDeal: (dealId: string) => unsaveItem('savedDeals', dealId),
    isDealSaved: (dealId: string) => isItemSaved('savedDeals', dealId),
    saveBusiness: (businessId: string) => saveItem('savedBusinesses', businessId),
    unsaveBusiness: (businessId: string) => unsaveItem('savedBusinesses', businessId),
    isBusinessSaved: (businessId: string) => isItemSaved('savedBusinesses', businessId),
    saveMovie: (movieId: string) => saveItem('savedMovies', movieId),
    unsaveMovie: (movieId: string) => unsaveItem('savedMovies', movieId),
    isMovieSaved: (movieId: string) => isItemSaved('savedMovies', movieId),
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

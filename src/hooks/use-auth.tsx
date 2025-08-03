
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { type Community, useCommunities } from '@/hooks/use-communities';

interface User {
  uid: string;
  name: string;
  username?: string;
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
  login: (user: Pick<User, 'name' | 'email'>) => void;
  logout: () => void;
  updateUser: (updatedData: Partial<User>) => void;
  setAffiliation: (orgId: string, orgName: string) => void;
  getUserByUsername: (username: string) => User | undefined;
  isLoading: boolean;
  getInitials: (name: string) => string;
  
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

const jivanIndiaUser: User = {
    uid: 'jivanindia-official',
    name: 'JivanIndia.co',
    username: 'jivanindia',
    email: 'contact@jivanindia.co',
    profileImageUrl: 'https://images.unsplash.com/photo-1594917409245-8a245973c8b4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw0fHxJbmRpYW4lMjBmZXN0aXZhbCUyMGNyb3dkfGVufDB8fHx8MTc1NDE5NzQzNnww&ixlib=rb-4.1.0&q=80&w=1080',
    bio: 'The heart of the Indian community, all in one place. Discover events, connect with organizations, and find local deals.',
    affiliation: { orgId: '2', orgName: 'India Cultural Center' },
    website: 'jivanindia.co',
    currentLocation: { country: 'USA', state: 'CA', city: 'San Francisco' },
    originLocation: { indiaState: 'Maharashtra', indiaDistrict: 'Mumbai' },
};

const allUsers: User[] = [jivanIndiaUser];


const usePersistedState = <T,>(key: string, defaultValue: T): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [state, setState] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return defaultValue;
    }
    try {
      const storedValue = window.localStorage.getItem(key);
      if (storedValue === null && defaultValue === null) {
          return defaultValue;
      }
      return storedValue ? JSON.parse(storedValue) : defaultValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return defaultValue;
    }
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        if (state === null || state === undefined) {
          window.localStorage.removeItem(key);
        } else {
          window.localStorage.setItem(key, JSON.stringify(state));
        }
      } catch (error) {
         console.warn(`Error setting localStorage key "${key}":`, error);
      }
    }
  }, [key, state]);

  return [state, setState];
};


export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = usePersistedState<User | null>('jivanindia-user', null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [savedEvents, setSavedEvents] = useState<string[]>([]);
  const [joinedCommunities, setJoinedCommunities] = useState<string[]>([]);
  const [savedDeals, setSavedDeals] = useState<string[]>([]);
  const [savedProviders, setSavedProviders] = useState<string[]>([]);
  const [savedSponsors, setSavedSponsors] = useState<string[]>([]);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  useEffect(() => {
    setSavedEvents(user?.savedEvents || []);
  }, [user?.savedEvents]);

  useEffect(() => {
    setJoinedCommunities(user?.joinedCommunities || []);
  }, [user?.joinedCommunities]);
  
  useEffect(() => {
    setSavedDeals(user?.savedDeals || []);
  }, [user?.savedDeals]);

  useEffect(() => {
    setSavedProviders(user?.savedProviders || []);
  }, [user?.savedProviders]);
  
  useEffect(() => {
    setSavedSponsors(user?.savedSponsors || []);
  }, [user?.savedSponsors]);


  const updateUser = (updatedData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updatedData });
    }
  };

  const setAffiliation = (orgId: string, orgName: string) => {
    if (user) {
        updateUser({ affiliation: { orgId, orgName } });
    }
  };

  const getUserByUsername = (username: string) => {
    return allUsers.find(u => u.username?.toLowerCase() === username.toLowerCase());
  }

  const login = (loginData: Pick<User, 'name' | 'email'>) => {
    let affiliation;
    let isAdmin = false;
    let username = loginData.name.toLowerCase().replace(/\s+/g, '');
    
    if (loginData.email === 'admin@saffron.com') {
      affiliation = { orgId: '1', orgName: 'Saffron Restaurant Group' };
    } else if (loginData.email === 'admin@yashraj.com') {
      affiliation = { orgId: '7', orgName: 'Yash Raj Films' };
    } else if (loginData.email === 'admin@icc.com') {
      affiliation = { orgId: '2', orgName: 'India Cultural Center' };
    } else if (loginData.email === 'admin@jivanindia.co') {
      isAdmin = true;
      username = 'jivanindia_admin';
    }
    
    const userToLogin: User = {
        ...loginData,
        username,
        uid: `user-${new Date().getTime()}`,
        affiliation,
        isAdmin,
        profileImageUrl: '',
        savedEvents: [],
        joinedCommunities: [],
        savedDeals: [],
        savedProviders: [],
        savedSponsors: [],
        notificationPreferences: { eventsNearby: true, reminders: true },
        calendarSyncEnabled: false,
    };
    setUser(userToLogin);
    allUsers.push(userToLogin);
  };

  const logout = () => {
    setUser(null);
    setSavedEvents([]);
    setJoinedCommunities([]);
    setSavedDeals([]);
    setSavedProviders([]);
    setSavedSponsors([]);
    setIsLoading(false);
  };
  
  const getInitials = useCallback((name: string) => {
    if (!name) return '';
    const names = name.split(' ');
    if (names.length > 1) {
        return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }, []);

  const createSaveFunctions = (
    list: string[],
    listType: 'savedEvents' | 'joinedCommunities' | 'savedDeals' | 'savedProviders' | 'savedSponsors'
  ) => {
    const saveItem = (itemId: string) => {
      if (user && !list.includes(itemId)) {
        const newList = [...list, itemId];
        updateUser({ [listType]: newList });
      }
    };

    const unsaveItem = (itemId: string) => {
      if (user) {
        const newList = list.filter((id) => id !== itemId);
        updateUser({ [listType]: newList });
      }
    };
    
    const isItemSaved = (itemId: string) => list.includes(itemId);

    return { saveItem, unsaveItem, isItemSaved };
  };
  
  const { saveItem: saveEvent, unsaveItem: unsaveEvent, isItemSaved: isEventSaved } = createSaveFunctions(savedEvents, 'savedEvents');
  const { saveItem: joinCommunity, unsaveItem: leaveCommunity, isItemSaved: isCommunityJoined } = createSaveFunctions(joinedCommunities, 'joinedCommunities');
  const { saveItem: saveDeal, unsaveItem: unsaveDeal, isItemSaved: isDealSaved } = createSaveFunctions(savedDeals, 'savedDeals');
  const { saveItem: saveProvider, unsaveItem: unsaveProvider, isItemSaved: isProviderSaved } = createSaveFunctions(savedProviders, 'savedProviders');
  const { saveItem: saveSponsor, unsaveItem: unsaveSponsor, isItemSaved: isSponsorSaved } = createSaveFunctions(savedSponsors, 'savedSponsors');

  const value = { 
    user, 
    login, 
    logout, 
    updateUser,
    setAffiliation,
    getUserByUsername,
    isLoading, 
    getInitials,
    savedEvents, saveEvent, unsaveEvent, isEventSaved,
    joinedCommunities, joinCommunity, leaveCommunity, isCommunityJoined,
    savedDeals, saveDeal, unsaveDeal, isDealSaved,
    savedProviders, saveProvider, unsaveProvider, isProviderSaved,
    savedSponsors, saveSponsor, unsaveSponsor, isSponsorSaved,
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
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

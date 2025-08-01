
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface User {
  uid: string;
  name: string;
  email: string;
  profileImageUrl?: string;
  bio?: string;
  affiliation?: {
    orgId: string;
    orgName: string;
  };
  phone?: string;
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
  
  savedJobs?: string[];
  savedEvents?: string[];
  joinedCommunities?: string[];
  savedDeals?: string[];
  
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
  isLoading: boolean;
  
  savedJobs: string[];
  saveJob: (jobId: string) => void;
  unsaveJob: (jobId: string) => void;
  isJobSaved: (jobId: string) => boolean;

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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const usePersistedState = <T,>(key: string, defaultValue: T): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [state, setState] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return defaultValue;
    }
    try {
      const storedValue = window.localStorage.getItem(key);
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
  
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [savedEvents, setSavedEvents] = useState<string[]>([]);
  const [joinedCommunities, setJoinedCommunities] = useState<string[]>([]);
  const [savedDeals, setSavedDeals] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
        setSavedJobs(user.savedJobs || []);
        setSavedEvents(user.savedEvents || []);
        setJoinedCommunities(user.joinedCommunities || []);
        setSavedDeals(user.savedDeals || []);
    } else {
        setSavedJobs([]);
        setSavedEvents([]);
        setJoinedCommunities([]);
        setSavedDeals([]);
    }
    setIsLoading(false);
  }, [user]);

  const updateUser = (updatedData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updatedData });
    }
  };

  const login = (loginData: Pick<User, 'name' | 'email'>) => {
    let affiliation;
    if (loginData.email === 'admin@saffron.com') {
      affiliation = { orgId: '1', orgName: 'Saffron Restaurant Group' };
    } else if (loginData.email === 'admin@yashraj.com') {
      affiliation = { orgId: '7', orgName: 'Yash Raj Films' };
    } else if (loginData.email === 'admin@icc.com') {
      affiliation = { orgId: '2', orgName: 'India Cultural Center' };
    }
    
    const userToLogin: User = {
        ...loginData,
        uid: `user-${new Date().getTime()}`,
        affiliation,
        profileImageUrl: '',
        savedJobs: [],
        savedEvents: [],
        joinedCommunities: [],
        savedDeals: [],
        notificationPreferences: { eventsNearby: true, reminders: true },
        calendarSyncEnabled: false,
    };
    setUser(userToLogin);
  };

  const logout = () => {
    setUser(null);
    setSavedJobs([]);
    setSavedEvents([]);
    setJoinedCommunities([]);
    setSavedDeals([]);
  };

  const createSaveFunctions = (
    listType: 'savedJobs' | 'savedEvents' | 'joinedCommunities' | 'savedDeals'
  ) => {
    const list = user?.[listType] || [];
    
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
  
  const { saveItem: saveJob, unsaveItem: unsaveJob, isItemSaved: isJobSaved } = createSaveFunctions('savedJobs');
  const { saveItem: saveEvent, unsaveItem: unsaveEvent, isItemSaved: isEventSaved } = createSaveFunctions('savedEvents');
  const { saveItem: joinCommunity, unsaveItem: leaveCommunity, isItemSaved: isCommunityJoined } = createSaveFunctions('joinedCommunities');
  const { saveItem: saveDeal, unsaveItem: unsaveDeal, isItemSaved: isDealSaved } = createSaveFunctions('savedDeals');

  const value = { 
    user, 
    login, 
    logout, 
    updateUser,
    isLoading, 
    savedJobs, saveJob, unsaveJob, isJobSaved,
    savedEvents, saveEvent, unsaveEvent, isEventSaved,
    joinedCommunities, joinCommunity, leaveCommunity, isCommunityJoined,
    savedDeals, saveDeal, unsaveDeal, isDealSaved
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

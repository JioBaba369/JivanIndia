
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
  
  // New fields from schema
  registeredEvents?: string[];
  joinedCommunities?: string[];
  notificationPreferences?: {
    eventsNearby: boolean;
    reminders: boolean;
  };
  calendarSyncEnabled?: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (user: Omit<User, 'uid'>) => void;
  logout: () => void;
  updateUser: (updatedUser: Partial<User>) => void;
  isLoading: boolean;
  
  // Job saving
  savedJobs: string[];
  saveJob: (jobId: string) => void;
  unsaveJob: (jobId: string) => void;
  isJobSaved: (jobId: string) => boolean;

  // Event saving
  savedEvents: string[];
  saveEvent: (eventId: string) => void;
  unsaveEvent: (eventId: string) => void;
  isEventSaved: (eventId: string) => boolean;

  // Organization/Community saving
  joinedCommunities: string[];
  joinCommunity: (orgId: string) => void;
  leaveCommunity: (orgId: string) => void;
  isCommunityJoined: (orgId: string) => boolean;

  // Deal saving
  savedDeals: string[];
  saveDeal: (dealId: string) => void;
  unsaveDeal: (dealId: string) => void;
  isDealSaved: (dealId: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const createSaveFunctions = <T extends string>(
  user: User | null,
  savedItems: T[],
  setSavedItems: React.Dispatch<React.SetStateAction<T[]>>,
  storageKey: string,
  updateUserInState: (items: T[]) => void,
) => {
  const saveItem = (itemId: T) => {
    if (user && !savedItems.includes(itemId)) {
      const newSavedItems = [...savedItems, itemId];
      setSavedItems(newSavedItems);
      updateUserInState(newSavedItems);
    }
  };

  const unsaveItem = (itemId: T) => {
    if (user) {
      const newSavedItems = savedItems.filter(id => id !== itemId);
      setSavedItems(newSavedItems);
       updateUserInState(newSavedItems);
    }
  };

  const isItemSaved = (itemId: T) => {
    return savedItems.includes(itemId);
  };

  return { saveItem, unsaveItem, isItemSaved };
};


export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [savedEvents, setSavedEvents] = useState<string[]>([]);
  const [joinedCommunities, setJoinedCommunities] = useState<string[]>([]);
  const [savedDeals, setSavedDeals] = useState<string[]>([]);

  const updateUserAndLocalStorage = (newUserData: Partial<User>) => {
      if (user) {
          const newUser = { ...user, ...newUserData };
          setUser(newUser);
          localStorage.setItem('user', JSON.stringify(newUser));
      }
  }

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsedUser: User = JSON.parse(storedUser);
        setUser(parsedUser);
        setSavedJobs(parsedUser.registeredEvents || []); // Using registeredEvents to store saved jobs for now
        setSavedEvents(parsedUser.registeredEvents || []);
        setJoinedCommunities(parsedUser.joinedCommunities || []);
        setSavedDeals(JSON.parse(localStorage.getItem(`savedItems_${parsedUser.email}_deals`) || '[]'));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
    }
    setIsLoading(false);
  }, []);

  const login = (loginData: Omit<User, 'uid'>) => {
    const userToLogin: User = {
        ...loginData,
        uid: `user-${new Date().getTime()}`, // simple unique id for demo
        affiliation: loginData.email ? { 
            orgId: '1', 
            orgName: 'India Cultural Center',
        } : undefined,
        joinedCommunities: [],
        registeredEvents: [],
        notificationPreferences: { eventsNearby: true, reminders: true },
        calendarSyncEnabled: false,
    };
    setUser(userToLogin);
    localStorage.setItem('user', JSON.stringify(userToLogin));
    setJoinedCommunities(userToLogin.joinedCommunities || []);
    // Initialize other saved items if needed
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    setSavedJobs([]);
    setSavedEvents([]);
    setJoinedCommunities([]);
    setSavedDeals([]);
  };
  
  const { saveItem: saveJob, unsaveItem: unsaveJob, isItemSaved: isJobSaved } = createSaveFunctions(user, savedJobs, setSavedJobs, 'jobs', () => {});
  const { saveItem: saveEvent, unsaveItem: unsaveEvent, isItemSaved: isEventSaved } = createSaveFunctions(user, savedEvents, setSavedEvents, 'events', (items) => updateUserAndLocalStorage({ registeredEvents: items }));
  const { saveItem: joinCommunity, unsaveItem: leaveCommunity, isItemSaved: isCommunityJoined } = createSaveFunctions(user, joinedCommunities, setJoinedCommunities, 'orgs', (items) => updateUserAndLocalStorage({ joinedCommunities: items }));
  const { saveItem: saveDeal, unsaveItem: unsaveDeal, isItemSaved: isDealSaved } = createSaveFunctions(user, savedDeals, setSavedDeals, 'deals', () => {});


  const value = { 
    user, 
    login, 
    logout, 
    updateUser: updateUserAndLocalStorage,
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

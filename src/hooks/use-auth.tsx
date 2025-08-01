
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface User {
  name: string;
  email: string;
  affiliation?: {
    orgId: string;
    orgName: string;
    orgLogoUrl: string;
    orgLogoAiHint: string;
  };
}

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
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

  // Organization saving
  savedOrgs: string[];
  saveOrg: (orgId: string) => void;
  unsaveOrg: (orgId: string) => void;
  isOrgSaved: (orgId: string) => boolean;

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
  storageKey: string
) => {
  const saveItem = (itemId: T) => {
    if (user && !savedItems.includes(itemId)) {
      const newSavedItems = [...savedItems, itemId];
      setSavedItems(newSavedItems);
      localStorage.setItem(`savedItems_${user.email}_${storageKey}`, JSON.stringify(newSavedItems));
    }
  };

  const unsaveItem = (itemId: T) => {
    if (user) {
      const newSavedItems = savedItems.filter(id => id !== itemId);
      setSavedItems(newSavedItems);
      localStorage.setItem(`savedItems_${user.email}_${storageKey}`, JSON.stringify(newSavedItems));
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
  const [savedOrgs, setSavedOrgs] = useState<string[]>([]);
  const [savedDeals, setSavedDeals] = useState<string[]>([]);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        
        const storedSavedJobs = localStorage.getItem(`savedItems_${parsedUser.email}_jobs`);
        if (storedSavedJobs) setSavedJobs(JSON.parse(storedSavedJobs));

        const storedSavedEvents = localStorage.getItem(`savedItems_${parsedUser.email}_events`);
        if (storedSavedEvents) setSavedEvents(JSON.parse(storedSavedEvents));

        const storedSavedOrgs = localStorage.getItem(`savedItems_${parsedUser.email}_orgs`);
        if (storedSavedOrgs) setSavedOrgs(JSON.parse(storedSavedOrgs));

        const storedSavedDeals = localStorage.getItem(`savedItems_${parsedUser.email}_deals`);
        if (storedSavedDeals) setSavedDeals(JSON.parse(storedSavedDeals));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
    }
    setIsLoading(false);
  }, []);

  const login = (user: User) => {
    // For demo purposes, add an affiliation to the default user
    const userToLogin = {
        ...user,
        affiliation: user.email ? { 
            orgId: '1', 
            orgName: 'India Cultural Center',
            orgLogoUrl: 'https://images.unsplash.com/photo-1583445063483-392a2596e7e9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHxjb21tdW5pdHklMjBjZW50ZXJ8ZW58MHx8fHwxNzU0MDUxODgxfDA&ixlib=rb-4.1.0&q=80&w=1080',
            orgLogoAiHint: 'community center logo',
        } : undefined,
    };
    setUser(userToLogin);
    localStorage.setItem('user', JSON.stringify(userToLogin));

    const storedSavedJobs = localStorage.getItem(`savedItems_${user.email}_jobs`);
    setSavedJobs(storedSavedJobs ? JSON.parse(storedSavedJobs) : []);

    const storedSavedEvents = localStorage.getItem(`savedItems_${user.email}_events`);
    setSavedEvents(storedSavedEvents ? JSON.parse(storedSavedEvents) : []);
    
    const storedSavedOrgs = localStorage.getItem(`savedItems_${user.email}_orgs`);
    setSavedOrgs(storedSavedOrgs ? JSON.parse(storedSavedOrgs) : []);

    const storedSavedDeals = localStorage.getItem(`savedItems_${user.email}_deals`);
    setSavedDeals(storedSavedDeals ? JSON.parse(storedSavedDeals) : []);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    setSavedJobs([]);
    setSavedEvents([]);
    setSavedOrgs([]);
    setSavedDeals([]);
  };

  const updateUser = (updatedUser: Partial<User>) => {
    if (user) {
      const newUser = { ...user, ...updatedUser };
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
    }
  };
  
  const { saveItem: saveJob, unsaveItem: unsaveJob, isItemSaved: isJobSaved } = createSaveFunctions(user, savedJobs, setSavedJobs, 'jobs');
  const { saveItem: saveEvent, unsaveItem: unsaveEvent, isItemSaved: isEventSaved } = createSaveFunctions(user, savedEvents, setSavedEvents, 'events');
  const { saveItem: saveOrg, unsaveItem: unsaveOrg, isItemSaved: isOrgSaved } = createSaveFunctions(user, savedOrgs, setSavedOrgs, 'orgs');
  const { saveItem: saveDeal, unsaveItem: unsaveDeal, isItemSaved: isDealSaved } = createSaveFunctions(user, savedDeals, setSavedDeals, 'deals');


  const value = { 
    user, 
    login, 
    logout, 
    updateUser,
    isLoading, 
    savedJobs, saveJob, unsaveJob, isJobSaved,
    savedEvents, saveEvent, unsaveEvent, isEventSaved,
    savedOrgs, saveOrg, unsaveOrg, isOrgSaved,
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

    
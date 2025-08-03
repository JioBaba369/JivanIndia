
'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface Community {
  id: string;
  name: string;
  type: 'Cultural' | 'Business' | 'Religious' | 'Social' | 'Non-Profit' | 'Other';
  description: string;
  fullDescription: string;
  imageUrl: string;
  region: string;
  membersCount: number;
  isVerified: boolean;
  founded: string;
  tags: string[];
  address: string;
  phone: string;
  contactEmail: string;
  website: string;
  founderUid: string;
  founderEmail: string;
  createdAt: string; // ISO 8601
  updatedAt?: string; // ISO 8601
}

interface CommunitiesContextType {
  communities: Community[];
  addCommunity: (community: Omit<Community, 'id' | 'createdAt' | 'isVerified' | 'founderEmail'>, founderEmail: string) => Community;
  getCommunityById: (id: string) => Community | undefined;
  verifyCommunity: (communityId: string) => void;
}

const CommunitiesContext = createContext<CommunitiesContextType>(undefined as any);

const initialCommunities: Community[] = [];

const STORAGE_KEY = 'jivanindia-communities';

export function CommunitiesProvider({ children }: { children: ReactNode }) {
  const [communities, setCommunities] = useState<Community[]>([]);

   useEffect(() => {
    if (typeof window === 'undefined') {
        setCommunities(initialCommunities);
        return;
    }
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setCommunities(JSON.parse(stored));
      } else {
        setCommunities(initialCommunities);
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(initialCommunities));
      }
    } catch (error) {
      console.error("Failed to access localStorage for communities", error);
      setCommunities(initialCommunities);
    }
  }, []);

  const persistCommunities = (updatedCommunities: Community[]) => {
    setCommunities(updatedCommunities);
     if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedCommunities));
      } catch (error) {
        console.error("Failed to save communities to localStorage", error);
      }
    }
  };

  const addCommunity = (community: Omit<Community, 'id' | 'createdAt' | 'isVerified' | 'founderEmail'>, founderEmail: string) => {
    const newCommunity: Community = {
      ...community,
      id: new Date().getTime().toString(),
      createdAt: new Date().toISOString(),
      isVerified: false,
      founderEmail: founderEmail,
    };
    persistCommunities([...communities, newCommunity]);
    return newCommunity;
  };

  const getCommunityById = (id: string) => {
    return communities.find(c => c.id === id);
  };

  const verifyCommunity = (communityId: string) => {
    const updatedCommunities = communities.map(c => 
      c.id === communityId ? { ...c, isVerified: true, updatedAt: new Date().toISOString() } : c
    );
    persistCommunities(updatedCommunities);
  };

  const value = {
    communities,
    addCommunity,
    getCommunityById,
    verifyCommunity,
  };

  return (
    <CommunitiesContext.Provider value={value}>
      {children}
    </CommunitiesContext.Provider>
  );
}

export function useCommunities() {
  const context = useContext(CommunitiesContext);
  if (context === undefined) {
    throw new Error('useCommunities must be used within a CommunitiesProvider');
  }
  return context;
}


'use client';

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';

export interface Community {
  id: string;
  slug: string;
  name: string;
  type: 'Cultural & Arts' | 'Business & Commerce' | 'Social & Non-Profit' | 'Educational' | 'Religious' | 'Other';
  description: string;
  fullDescription: string;
  imageUrl: string;
  logoUrl: string;
  region: string;
  membersCount: number;
  isVerified: boolean;
  founded: string;
  tags: string[];
  address: string;
  phone: string;
  contactEmail: string;
  website: string;
  socialMedia?: {
    twitter?: string;
    linkedin?: string;
    facebook?: string;
  };
  founderUid: string;
  founderEmail: string;
  createdAt: string;
  updatedAt?: string;
}

export type NewCommunityInput = Omit<Community, 'id' | 'createdAt' | 'isVerified' | 'founderEmail'>;


interface CommunitiesContextType {
  communities: Community[];
  addCommunity: (community: NewCommunityInput, founderEmail: string) => Community;
  getCommunityById: (id: string) => Community | undefined;
  getCommunityBySlug: (slug: string) => Community | undefined;
  isSlugUnique: (slug: string, currentId?: string) => boolean;
  verifyCommunity: (communityId: string) => void;
  getInitials: (name: string) => string;
  updateCommunity: (id: string, data: Partial<Community>) => void;
}

const CommunitiesContext = createContext<CommunitiesContextType | undefined>(undefined);

const STORAGE_KEY = 'jivanindia-communities';

const initialCommunities: Community[] = [
  {
    id: 'sydney-123',
    slug: 'sydney',
    name: 'Sydney Indian Community',
    type: 'Cultural & Arts',
    description: 'A vibrant community for Indians in Sydney, celebrating culture, festivals, and connections.',
    fullDescription: 'The Sydney Indian Community is a non-profit organization dedicated to fostering a sense of belonging among the Indian diaspora in Sydney. We organize various cultural events, workshops, and social gatherings to celebrate our rich heritage and build strong community bonds. Whether you are new to the city or have been here for years, we welcome you to join our family.',
    imageUrl: 'https://images.unsplash.com/photo-1559132231-deff9205d04e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxzeWRuZXklMjBvcmllbnRhbCUyMGNvbW11bml0eXxlbnwwfHx8fDE3NTQxOTc0Mzd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    logoUrl: 'https://placehold.co/200x200.png',
    region: 'Sydney, Australia',
    membersCount: 1250,
    isVerified: true,
    founded: '2015',
    tags: ['cultural', 'sydney', 'festivals', 'community'],
    address: '123 Harbour Bridge Rd, Sydney, NSW 2000',
    phone: '+61 2 1234 5678',
    contactEmail: 'contact@sydneyindiancommunity.com',
    website: 'sydneyindiancommunity.com',
    founderUid: 'admin-sydney',
    founderEmail: 'admin@sydney.com',
    createdAt: new Date().toISOString(),
  }
];

export function CommunitiesProvider({ children }: { children: ReactNode }) {
  const [communities, setCommunities] = useState<Community[]>([]);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
        try {
            const stored = window.localStorage.getItem(STORAGE_KEY);
            // Only set initial communities if local storage is empty
            if (!stored || JSON.parse(stored).length === 0) {
                setCommunities(initialCommunities);
                window.localStorage.setItem(STORAGE_KEY, JSON.stringify(initialCommunities));
            } else {
                 setCommunities(JSON.parse(stored));
            }
        } catch (error) {
            console.error("Failed to load communities from localStorage", error);
            setCommunities(initialCommunities);
        }
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

  const addCommunity = useCallback((communityData: NewCommunityInput, founderEmail: string): Community => {
    const newCommunity: Community = {
      ...communityData,
      id: new Date().getTime().toString(),
      createdAt: new Date().toISOString(),
      isVerified: false,
      founderEmail: founderEmail,
    };
    const updatedCommunities = [...communities, newCommunity];
    persistCommunities(updatedCommunities);
    return newCommunity;
  }, [communities]);
  
  const updateCommunity = useCallback((id: string, data: Partial<Community>) => {
      const updatedCommunities = communities.map(c => c.id === id ? { ...c, ...data, updatedAt: new Date().toISOString() } : c);
      persistCommunities(updatedCommunities);
  }, [communities]);

  const getCommunityById = useCallback((id: string): Community | undefined => {
    return communities.find(c => c.id === id);
  }, [communities]);
  
  const getCommunityBySlug = useCallback((slug: string): Community | undefined => {
    return communities.find(c => c.slug === slug);
  }, [communities]);
  
  const isSlugUnique = useCallback((slug: string, currentId?: string): boolean => {
    return !communities.some(c => c.slug === slug && c.id !== currentId);
  }, [communities]);

  const verifyCommunity = useCallback((communityId: string): void => {
    const updatedCommunities = communities.map(c => 
        c.id === communityId ? { ...c, isVerified: true, updatedAt: new Date().toISOString() } : c
    );
    persistCommunities(updatedCommunities);
  }, [communities]);

  const getInitials = useCallback((name: string) => {
    if (!name) return '';
    const names = name.split(' ');
    if (names.length > 1) {
        return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }, []);

  const contextValue = {
    communities,
    addCommunity,
    getCommunityById,
    getCommunityBySlug,
    isSlugUnique,
    verifyCommunity,
    getInitials,
    updateCommunity,
  };

  return (
    <CommunitiesContext.Provider value={contextValue}>
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

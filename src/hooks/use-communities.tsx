
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
        id: '1',
        name: 'Saffron Restaurant Group',
        slug: 'saffron-restaurant-group',
        type: 'Business & Commerce',
        description: 'Authentic Indian cuisine with a modern twist. Join our community for exclusive culinary events and offers.',
        fullDescription: 'Saffron Restaurant Group is dedicated to bringing the rich and diverse flavors of India to a global audience. Our chefs masterfully blend traditional recipes with contemporary techniques to create an unforgettable dining experience. We are more than just a restaurant; we are a community of food lovers who celebrate the art of Indian cooking. Join us for cooking classes, tasting events, and exclusive offers.',
        imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxJbmRpYW4lMjByZXN0YXVyYW50fGVufDB8fHx8MTc1NDIxMDk4N3ww&ixlib=rb-4.1.0&q=80&w=1080',
        logoUrl: 'https://placehold.co/400x400.png',
        region: 'New York City, NY',
        membersCount: 1250,
        isVerified: true,
        founded: '2015',
        tags: ['restaurants', 'food', 'cuisine', 'new-york'],
        address: '123 Saffron St, New York, NY 10001',
        phone: '(212) 555-1234',
        contactEmail: 'contact@saffron.example.com',
        website: 'saffron.example.com',
        founderUid: 'dev-user-1',
        founderEmail: 'founder1@example.com',
        createdAt: '2024-01-15T10:00:00Z',
    },
    {
        id: '2',
        name: 'India Cultural Center',
        slug: 'india-cultural-center',
        type: 'Cultural & Arts',
        description: 'Celebrating and preserving Indian culture through arts, education, and community events.',
        fullDescription: 'The India Cultural Center is a non-profit organization committed to promoting and preserving the rich heritage of India. We offer a wide range of programs, including classical music and dance performances, language classes, art exhibitions, and educational workshops. Our mission is to create a vibrant hub where people of all ages can connect with Indian culture and build a strong, supportive community.',
        imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxjommunityJTIwY2VudGVyJTIwZXZlbnR8ZW58MHx8fHwxNzU0MjEwOTg3fDA&ixlib=rb-4.1.0&q=80&w=1080',
        logoUrl: 'https://placehold.co/400x400.png',
        region: 'San Francisco Bay Area, CA',
        membersCount: 3500,
        isVerified: true,
        founded: '2005',
        tags: ['culture', 'arts', 'non-profit', 'bay-area'],
        address: '456 Heritage Ave, Fremont, CA 94538',
        phone: '(510) 555-5678',
        contactEmail: 'info@icc.example.org',
        website: 'icc.example.org',
        founderUid: 'dev-user-2',
        founderEmail: 'founder2@example.com',
        createdAt: '2024-02-20T14:30:00Z',
    },
    {
        id: '3',
        name: 'Yash Raj Films',
        slug: 'yash-raj-films',
        type: 'Business & Commerce',
        description: 'Leading Indian film production and distribution house, bringing the best of Bollywood to the world.',
        fullDescription: 'Yash Raj Films (YRF) is one of India\'s most prominent entertainment companies, with a legacy spanning over five decades. From iconic blockbusters to critically acclaimed masterpieces, YRF has been at the forefront of Indian cinema. We are dedicated to producing high-quality entertainment that resonates with audiences worldwide and nurturing the next generation of talent in the film industry.',
        imageUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxtb3ZpZSUyMHRoZWF0ZXJ8ZW58MHx8fHwxNzU0MjEwOTg3fDA&ixlib=rb-4.1.0&q=80&w=1080',
        logoUrl: 'https://placehold.co/400x400.png',
        region: 'Global',
        membersCount: 50000,
        isVerified: true,
        founded: '1970',
        tags: ['movies', 'bollywood', 'entertainment', 'film'],
        address: 'Veera Desai Road, Andheri West, Mumbai, Maharashtra 400053, India',
        phone: '+91 22 3061 3500',
        contactEmail: 'press@yashrajfilms.com',
        website: 'yashrajfilms.com',
        founderUid: 'dev-user-3',
        founderEmail: 'founder3@example.com',
        createdAt: '2024-03-01T09:00:00Z',
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

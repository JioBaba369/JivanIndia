
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
  createdAt: string;
  updatedAt?: string;
}

export type NewCommunityInput = Omit<Community, 'id' | 'createdAt' | 'isVerified' | 'founderEmail'>;


interface CommunitiesContextType {
  communities: Community[];
  addCommunity: (community: NewCommunityInput, founderEmail: string) => Community;
  getCommunityById: (id: string) => Community | undefined;
  getCommunityBySlug: (slug: string) => Community | undefined;
  isSlugUnique: (slug: string) => boolean;
  verifyCommunity: (communityId: string) => void;
}

const CommunitiesContext = createContext<CommunitiesContextType | undefined>(undefined);

const STORAGE_KEY = 'jivanindia-communities';

const initialCommunities: Community[] = [
    {
      id: '1',
      slug: 'saffron-restaurant-group',
      name: 'Saffron Restaurant Group',
      type: 'Business & Commerce',
      description: 'Authentic Indian cuisine with a modern twist. Join our community for exclusive culinary events and offers.',
      fullDescription: 'Founded in 2010, the Saffron Restaurant Group is dedicated to bringing the rich and diverse flavors of India to the world. Our award-winning chefs use traditional recipes and the freshest ingredients to create an unforgettable dining experience. We regularly host cooking classes, wine-pairing dinners, and cultural food festivals. Our mission is to be more than just a restaurant; we aim to be a cultural hub where people can connect over a shared love for Indian food.',
      imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxJbmRpYW4lMjByZXN0YXVyYW50fGVufDB8fHx8MTc1NDE5NzQzNnww&ixlib=rb-4.1.0&q=80&w=1080',
      region: 'New York City, NY',
      membersCount: 1250,
      isVerified: true,
      founded: '2010',
      tags: ['food', 'restaurant', 'cuisine', 'indian-food', 'culinary'],
      address: '123 Saffron Avenue, New York, NY 10001',
      phone: '(212) 555-1234',
      contactEmail: 'contact@saffron.com',
      website: 'www.saffronrestaurants.com',
      founderUid: 'admin-saffron-uid',
      founderEmail: 'admin@saffron.com',
      createdAt: '2024-01-15T12:00:00Z',
    },
    {
      id: '2',
      slug: 'india-cultural-center',
      name: 'India Cultural Center',
      type: 'Cultural & Arts',
      description: 'Celebrating and preserving Indian culture through arts, education, and community events.',
      fullDescription: 'The India Cultural Center (ICC) is a non-profit organization committed to promoting Indian culture and heritage in the diaspora. We offer a wide range of programs, including classical dance and music classes, language workshops, art exhibitions, and major festival celebrations like Diwali and Holi. Our center serves as a gathering place for all ages to learn, share, and connect with the traditions of India. We welcome everyone to join us in our mission to build a vibrant and inclusive cultural community.',
      imageUrl: 'https://images.unsplash.com/photo-1627895439379-373f9801844a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxJbmRpYW4lMjB0ZW1wbGUlMjBhcmNoaXRlY3R1cmV8ZW58MHx8fHwxNzU0MTk3NDM2fDA&ixlib=rb-4.1.0&q=80&w=1080',
      region: 'San Francisco Bay Area, CA',
      membersCount: 4800,
      isVerified: true,
      founded: '1995',
      tags: ['culture', 'non-profit', 'arts', 'events', 'education', 'community'],
      address: '456 Heritage Way, Fremont, CA 94538',
      phone: '(510) 555-5678',
      contactEmail: 'info@iccbayarea.org',
      website: 'www.iccbayarea.org',
      founderUid: 'admin-icc-uid',
      founderEmail: 'admin@icc.com',
      createdAt: '2024-02-01T10:00:00Z',
    },
    {
        id: '7',
        slug: 'yash-raj-films',
        name: 'Yash Raj Films',
        type: 'Business & Commerce',
        description: 'Leading Indian film production and distribution house, bringing the best of Bollywood to the world.',
        fullDescription: 'Yash Raj Films (YRF) is one of India’s biggest and most successful film production houses. Since our inception in the 1970s, we have produced and distributed some of the most iconic films in the history of Indian cinema. Our mission is to entertain and inspire audiences globally with compelling stories, unforgettable music, and world-class production values. We are committed to pushing the boundaries of creativity and technology in filmmaking.',
        imageUrl: 'https://images.unsplash.com/photo-1604975701397-1cfc506e2669?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxmaWxtJTIwcHJvamVjdG9yJTIwc2NyZWVufGVufDB8fHx8MTc1NDE5NzQzNnww&ixlib=rb-4.1.0&q=80&w=1080',
        region: 'Global',
        membersCount: 150000,
        isVerified: true,
        founded: '1970',
        tags: ['movies', 'bollywood', 'entertainment', 'film', 'production'],
        address: 'Veera Desai Road, Andheri West, Mumbai, Maharashtra 400053, India',
        phone: '+91 22 3061 3500',
        contactEmail: 'helpdesk@yashrajfilms.com',
        website: 'www.yashrajfilms.com',
        founderUid: 'admin-yashraj-uid',
        founderEmail: 'admin@yashraj.com',
        createdAt: '2024-03-20T09:00:00Z',
    }
];

export function CommunitiesProvider({ children }: { children: ReactNode }) {
  const [communities, setCommunities] = useState<Community[]>([]);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
        try {
            const stored = window.localStorage.getItem(STORAGE_KEY);
            if (stored) {
                setCommunities(JSON.parse(stored));
            } else {
                setCommunities(initialCommunities);
                window.localStorage.setItem(STORAGE_KEY, JSON.stringify(initialCommunities));
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

  const getCommunityById = useCallback((id: string): Community | undefined => {
    return communities.find(c => c.id === id);
  }, [communities]);
  
  const getCommunityBySlug = useCallback((slug: string): Community | undefined => {
    return communities.find(c => c.slug === slug);
  }, [communities]);
  
  const isSlugUnique = useCallback((slug: string): boolean => {
    return !communities.some(c => c.slug === slug);
  }, [communities]);

  const verifyCommunity = useCallback((communityId: string): void => {
    const updatedCommunities = communities.map(c => 
        c.id === communityId ? { ...c, isVerified: true, updatedAt: new Date().toISOString() } : c
    );
    persistCommunities(updatedCommunities);
  }, [communities]);

  const contextValue = {
    communities,
    addCommunity,
    getCommunityById,
    getCommunityBySlug,
    isSlugUnique,
    verifyCommunity,
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

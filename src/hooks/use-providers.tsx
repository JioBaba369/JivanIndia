
'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface Provider {
  id: string;
  name: string;
  category: 'Legal' | 'Health' | 'Finance' | 'Real Estate' | 'Education' | 'Other';
  services: string[];
  description: string;
  fullDescription: string;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  contact: {
    phone: string;
    email: string;
    website: string;
    address: string;
  };
  region: string;
  tags: string[];
  associatedCommunityId?: string;
  associatedCommunityName?: string;
}

interface ProvidersContextType {
  providers: Provider[];
  getProviderById: (id: string) => Provider | undefined;
}

const ProvidersContext = createContext<ProvidersContextType | undefined>(undefined);

const initialProviders: Provider[] = [
    {
    id: '1',
    name: 'Sharma Law Group',
    category: 'Legal',
    services: ['Immigration Law', 'Family Law', 'Business Law'],
    description: 'Expert legal services for the community, specializing in immigration and family law.',
    fullDescription: 'Sharma Law Group is a premier law firm dedicated to providing comprehensive legal solutions to the Indian community. Our experienced attorneys understand the unique cultural and legal challenges our clients face. We are committed to offering personalized and effective representation. Whether you need help with a visa application, a business contract, or a family matter, we are here to guide you every step of the way.',
    imageUrl: 'https://images.unsplash.com/photo-1590099033615-be1917f6ce52?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxsYXclMjBvZmZpY2V8ZW58MHx8fHwxNzU0MTk3NDM2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    rating: 4.9,
    reviewCount: 152,
    isVerified: true,
    contact: {
      phone: '(212) 555-9876',
      email: 'info@sharmalaw.com',
      website: 'www.sharmalaw.com',
      address: '456 Legal Plaza, New York, NY 10002',
    },
    region: 'New York City, NY',
    tags: ['immigration', 'lawyer', 'legal', 'visa', 'family-law'],
    associatedCommunityId: '2',
    associatedCommunityName: 'India Cultural Center',
  },
  {
    id: '2',
    name: 'Gupta Financial Advisors',
    category: 'Finance',
    services: ['Retirement Planning', 'Investment Management', 'Tax Services'],
    description: 'Helping families achieve their financial goals with expert advice and personalized planning.',
    fullDescription: 'Gupta Financial Advisors has been serving the community for over 20 years, offering a holistic approach to financial planning. We specialize in wealth management, retirement strategies, and tax-efficient investing. Our mission is to empower our clients to build a secure financial future for themselves and their families. We are proud to be a trusted partner in their financial journey.',
    imageUrl: 'https://images.unsplash.com/photo-1554224155-169544351742?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxmaW5hbmNpYWwlMjBhZHZpc29yfGVufDB8fHx8MTc1NDE5NzQzNnww&ixlib=rb-4.1.0&q=80&w=1080',
    rating: 4.8,
    reviewCount: 98,
    isVerified: true,
    contact: {
      phone: '(713) 555-4321',
      email: 'contact@guptafinancial.com',
      website: 'www.guptafinancial.com',
      address: '789 Money Street, Houston, TX 77002',
    },
    region: 'Houston, TX',
    tags: ['finance', 'investment', 'retirement', 'taxes', 'planning'],
  }
];

export function ProvidersProvider({ children }: { children: ReactNode }) {
  const [providers, setProviders] = useState<Provider[]>(initialProviders);

  useEffect(() => {
    // This is where you would fetch data from a database
    // For now, we'll use the mock data
    setProviders(initialProviders);
  }, []);

  const getProviderById = (id: string) => {
    return providers.find(provider => provider.id === id);
  };

  const value = {
    providers,
    getProviderById,
  };

  return (
    <ProvidersContext.Provider value={value}>
      {children}
    </ProvidersContext.Provider>
  );
}

export function useProviders() {
  const context = useContext(ProvidersContext);
  if (context === undefined) {
    throw new Error('useProviders must be used within a ProvidersProvider');
  }
  return context;
}

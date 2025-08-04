
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

const initialProviders: Provider[] = [];

export function ProvidersProvider({ children }: { children: ReactNode }) {
  const [providers, setProviders] = useState<Provider[]>(initialProviders);

  useEffect(() => {
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

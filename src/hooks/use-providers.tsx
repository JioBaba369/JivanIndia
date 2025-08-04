
'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { initialProviders as data, type Provider as ProviderType } from '@/data/providers';

export type Provider = ProviderType;
export const initialProviders = data;

interface ProvidersContextType {
  providers: Provider[];
  getProviderById: (id: string) => Provider | undefined;
}

const ProvidersContext = createContext<ProvidersContextType | undefined>(undefined);

export function ProvidersProvider({ children }: { children: ReactNode }) {
  const [providers] = useState<Provider[]>(initialProviders);

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

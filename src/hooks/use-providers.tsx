
'use client';

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { initialProviders as data, type Provider as ProviderType } from '@/data/providers';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';

export type Provider = ProviderType;
export const initialProviders = data;

interface ProvidersContextType {
  providers: Provider[];
  isLoading: boolean;
  getProviderById: (id: string) => Provider | undefined;
}

const ProvidersContext = createContext<ProvidersContextType | undefined>(undefined);

const providersCollectionRef = collection(firestore, 'providers');

export function ProvidersProvider({ children }: { children: ReactNode }) {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProviders = useCallback(async () => {
    setIsLoading(true);
    try {
      const querySnapshot = await getDocs(providersCollectionRef);
      if (querySnapshot.empty) {
        // If the collection is empty, you might want to seed it with initial data
        // For now, we'll just set it to the initial static data
        setProviders(initialProviders);
      } else {
        const providersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Provider));
        setProviders(providersData);
      }
    } catch (error) {
      console.error("Failed to fetch providers from Firestore", error);
      setProviders(initialProviders); // Fallback to static data on error
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProviders();
  }, [fetchProviders]);

  const getProviderById = (id: string) => {
    return providers.find(provider => provider.id === id);
  };

  const value = {
    providers,
    isLoading,
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

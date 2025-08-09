
'use client';

import { createContext, useContext, useState, ReactNode, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from './use-auth';

export const ALL_COUNTRIES_VALUE = 'All Countries';

interface CountryContextType {
  selectedCountry: string;
  setSelectedCountry: (country: string) => void;
}

const CountryContext = createContext<CountryContextType | undefined>(undefined);

export function CountryProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [selectedCountry, setSelectedCountryState] = useState<string>(ALL_COUNTRIES_VALUE);

  useEffect(() => {
    if (user?.currentLocation?.country) {
      setSelectedCountryState(user.currentLocation.country);
    }
  }, [user?.currentLocation?.country]);

  const setSelectedCountry = useCallback((country: string) => {
    setSelectedCountryState(country);
  }, []);
  
  const value = useMemo(() => ({
    selectedCountry,
    setSelectedCountry,
  }), [selectedCountry, setSelectedCountry]);

  return (
    <CountryContext.Provider value={value}>
      {children}
    </CountryContext.Provider>
  );
}

export function useCountry() {
  const context = useContext(CountryContext);
  if (context === undefined) {
    throw new Error('useCountry must be used within a CountryProvider');
  }
  return context;
}

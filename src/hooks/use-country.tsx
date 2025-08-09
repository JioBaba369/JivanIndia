
'use client';

import { createContext, useContext, useState, ReactNode, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from './use-auth';

const COUNTRY_STORAGE_KEY = 'jivanindia-selected-country';
const ALL_COUNTRIES_VALUE = 'All Countries';

interface CountryContextType {
  selectedCountry: string;
  setSelectedCountry: (country: string) => void;
}

const CountryContext = createContext<CountryContextType | undefined>(undefined);

export function CountryProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [selectedCountry, setSelectedCountryState] = useState<string>(() => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem(COUNTRY_STORAGE_KEY) || ALL_COUNTRIES_VALUE;
    }
    return ALL_COUNTRIES_VALUE;
  });

  useEffect(() => {
    const storedCountry = localStorage.getItem(COUNTRY_STORAGE_KEY);
    if (user?.currentLocation?.country) {
      setSelectedCountryState(user.currentLocation.country);
      localStorage.setItem(COUNTRY_STORAGE_KEY, user.currentLocation.country);
    } else if (storedCountry) {
        setSelectedCountryState(storedCountry);
    }
  }, [user?.currentLocation?.country]);

  const setSelectedCountry = useCallback((country: string) => {
    setSelectedCountryState(country);
    localStorage.setItem(COUNTRY_STORAGE_KEY, country);
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

export { ALL_COUNTRIES_VALUE };

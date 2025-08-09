
'use client';

import { createContext, useContext, useState, ReactNode, useEffect, useMemo } from 'react';
import { useAuth } from './use-auth';

const COUNTRY_STORAGE_KEY = 'jivanindia-selected-country';
const ALL_COUNTRIES = 'All Countries';

interface CountryContextType {
  selectedCountry: string;
  setSelectedCountry: (country: string) => void;
}

const CountryContext = createContext<CountryContextType | undefined>(undefined);

export function CountryProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [selectedCountry, setSelectedCountryState] = useState<string>(ALL_COUNTRIES);

  // Effect to load from localStorage on mount
  useEffect(() => {
    const storedCountry = localStorage.getItem(COUNTRY_STORAGE_KEY);
    if (storedCountry) {
      setSelectedCountryState(storedCountry);
    }
  }, []);

  // Effect to sync with user's profile country
  useEffect(() => {
    if (user?.currentLocation?.country) {
      setSelectedCountryState(user.currentLocation.country);
      localStorage.setItem(COUNTRY_STORAGE_KEY, user.currentLocation.country);
    }
  }, [user?.currentLocation?.country]);

  const setSelectedCountry = (country: string) => {
    setSelectedCountryState(country);
    localStorage.setItem(COUNTRY_STORAGE_KEY, country);
  };
  
  const value = useMemo(() => ({
    selectedCountry,
    setSelectedCountry,
  }), [selectedCountry]);

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

export const ALL_COUNTRIES_VALUE = ALL_COUNTRIES;

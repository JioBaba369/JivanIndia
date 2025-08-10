
'use client';

import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import type { User } from './use-auth';


interface SearchContextType {
    validateEmail: (email: string) => Promise<User | null>;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: ReactNode }) {
    
  const validateEmail = useCallback(async (email: string): Promise<User | null> => {
    if (!email || !email.includes('@')) {
      return null;
    }

    try {
      const usersRef = collection(firestore, 'users');
      const q = query(usersRef, where('email', '==', email.trim()), limit(1));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        return null;
      }

      const userDoc = querySnapshot.docs[0];
      return { uid: userDoc.id, ...userDoc.data() } as User;
    } catch (error) {
      console.error('Error validating email:', error);
      return null;
    }
  }, []);

  const value = { validateEmail };

  return (
    <SearchContext.Provider value={value}>
        {children}
    </SearchContext.Provider>
  )
}


export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
}

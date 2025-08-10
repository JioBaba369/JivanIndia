
'use client';

import { useCallback } from 'react';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import type { User } from './use-auth';

export function useSearch() {
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
      return { id: userDoc.id, ...userDoc.data() } as User;
    } catch (error) {
      console.error('Error validating email:', error);
      return null;
    }
  }, []);

  return { validateEmail };
}

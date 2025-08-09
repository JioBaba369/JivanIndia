
'use client';

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import { useToast } from './use-toast';

export interface Movie {
  id: string;
  title: string;
  genre: string;
  imageUrl: string;
  rating: number;
  postedAt: any;
  details: {
    synopsis: string;
    duration: string;
    releaseDate: string;
    distributor: string;
    distributorId: string;
    director: string;
    cast: string[];
    trailerUrl: string;
    backdropUrl: string;
    theaters: Array<{
      name: string;
      location: string;
      showtimes: string[];
    }>;
  };
}

interface MoviesContextType {
  movies: Movie[];
  isLoading: boolean;
  getMovieById: (id: string) => Movie | undefined;
}

const MoviesContext = createContext<MoviesContextType | undefined>(undefined);

export function MoviesProvider({ children }: { children: ReactNode }) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    setIsLoading(true);
    const q = query(collection(firestore, 'movies'), orderBy('postedAt', 'desc'));

    const unsubscribe = onSnapshot(q,
      (querySnapshot) => {
        setMovies(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Movie)));
        setIsLoading(false);
      },
      (error) => {
        console.error("Failed to fetch movies from Firestore", error);
        toast({ title: "Error", description: "Could not fetch movie listings.", variant: "destructive" });
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [toast]);

  const getMovieById = useCallback((id: string): Movie | undefined => {
    return movies.find(m => m.id === id);
  }, [movies]);
  
  const value = { movies, isLoading, getMovieById };

  return (
    <MoviesContext.Provider value={value}>
      {children}
    </MoviesContext.Provider>
  );
}

export function useMovies() {
  const context = useContext(MoviesContext);
  if (context === undefined) {
    throw new Error('useMovies must be used within a MoviesProvider');
  }
  return context;
}

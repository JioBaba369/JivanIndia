
'use client';

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';

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

const moviesCollectionRef = collection(firestore, 'movies');

export function MoviesProvider({ children }: { children: ReactNode }) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const q = query(moviesCollectionRef, orderBy('postedAt', 'desc'));

    const unsubscribe = onSnapshot(q,
      (querySnapshot) => {
        setMovies(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Movie)));
        setIsLoading(false);
      },
      (error) => {
        console.error("Failed to fetch movies from Firestore", error);
        setMovies([]);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const getMovieById = (id: string): Movie | undefined => {
    return movies.find(m => m.id === id);
  };

  return (
    <MoviesContext.Provider value={{ movies, isLoading, getMovieById }}>
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

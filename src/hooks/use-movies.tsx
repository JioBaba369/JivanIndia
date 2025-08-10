
'use client';

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { collection, onSnapshot, query, orderBy, doc, addDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import { useToast } from './use-toast';

export interface Movie {
  id: string;
  title: string;
  genre: string;
  rating: number;
  imageUrl: string;
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

export type NewMovieInput = Omit<Movie, 'id' | 'postedAt'>;

interface MoviesContextType {
  movies: Movie[];
  isLoading: boolean;
  getMovieById: (id: string) => Movie | undefined;
  addMovie: (movie: NewMovieInput) => Promise<Movie>;
  updateMovie: (id: string, movie: Partial<NewMovieInput>) => Promise<void>;
  deleteMovie: (id: string) => Promise<void>;
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

  const addMovie = useCallback(async (movieData: NewMovieInput): Promise<Movie> => {
    try {
        const newMovieForDb = { ...movieData, postedAt: serverTimestamp() };
        const docRef = await addDoc(collection(firestore, 'movies'), newMovieForDb);
        return { id: docRef.id, ...newMovieForDb, postedAt: { toDate: () => new Date() }} as Movie;
    } catch (e) {
        console.error("Error adding movie:", e);
        toast({ title: "Error", description: "Could not add the movie.", variant: "destructive" });
        throw e;
    }
  }, [toast]);

  const updateMovie = useCallback(async (id: string, movieData: Partial<NewMovieInput>) => {
    const movieDocRef = doc(firestore, 'movies', id);
    try {
        await updateDoc(movieDocRef, movieData);
        toast({ title: 'Movie Updated', description: 'Movie details have been saved.' });
    } catch (e) {
        console.error("Error updating movie:", e);
        toast({ title: "Error", description: "Could not update the movie.", variant: "destructive" });
        throw e;
    }
  }, [toast]);
  
  const deleteMovie = useCallback(async (id: string) => {
    const movieDocRef = doc(firestore, 'movies', id);
    try {
        await deleteDoc(movieDocRef);
        toast({ title: 'Movie Deleted', description: 'The movie has been removed.' });
    } catch (e) {
        console.error("Error deleting movie:", e);
        toast({ title: "Error", description: "Could not delete the movie.", variant: "destructive" });
        throw e;
    }
  }, [toast]);


  const getMovieById = useCallback((id: string): Movie | undefined => {
    return movies.find(m => m.id === id);
  }, [movies]);
  
  const value = { movies, isLoading, getMovieById, addMovie, updateMovie, deleteMovie };

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

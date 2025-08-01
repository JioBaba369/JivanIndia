'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface User {
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  isLoading: boolean;
  savedJobs: string[];
  saveJob: (jobId: string) => void;
  unsaveJob: (jobId: string) => void;
  isJobSaved: (jobId: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [savedJobs, setSavedJobs] = useState<string[]>([]);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        const storedSavedJobs = localStorage.getItem(`savedJobs_${parsedUser.email}`);
        if (storedSavedJobs) {
          setSavedJobs(JSON.parse(storedSavedJobs));
        }
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
    }
    setIsLoading(false);
  }, []);

  const login = (user: User) => {
    setUser(user);
    localStorage.setItem('user', JSON.stringify(user));
    const storedSavedJobs = localStorage.getItem(`savedJobs_${user.email}`);
    if (storedSavedJobs) {
      setSavedJobs(JSON.parse(storedSavedJobs));
    } else {
      setSavedJobs([]);
    }
  };

  const logout = () => {
    setUser(null);
    setSavedJobs([]);
    localStorage.removeItem('user');
  };

  const saveJob = (jobId: string) => {
    if (user && !savedJobs.includes(jobId)) {
      const newSavedJobs = [...savedJobs, jobId];
      setSavedJobs(newSavedJobs);
      localStorage.setItem(`savedJobs_${user.email}`, JSON.stringify(newSavedJobs));
    }
  };

  const unsaveJob = (jobId: string) => {
    if (user) {
      const newSavedJobs = savedJobs.filter(id => id !== jobId);
      setSavedJobs(newSavedJobs);
      localStorage.setItem(`savedJobs_${user.email}`, JSON.stringify(newSavedJobs));
    }
  };
  
  const isJobSaved = (jobId: string) => {
    return savedJobs.includes(jobId);
  };


  const value = { user, login, logout, isLoading, savedJobs, saveJob, unsaveJob, isJobSaved };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

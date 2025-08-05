
'use client';

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import { jobs as initialJobsData, type Job as JobType } from '@/data/jobs';

export type Job = JobType;

interface JobsContextType {
  jobs: Job[];
  isLoading: boolean;
  getJobById: (id: string) => Job | undefined;
}

const JobsContext = createContext<JobsContextType | undefined>(undefined);

const jobsCollectionRef = collection(firestore, 'jobs');

export function JobsProvider({ children }: { children: ReactNode }) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchJobs = useCallback(async () => {
    setIsLoading(true);
    try {
      const querySnapshot = await getDocs(jobsCollectionRef);
      if (querySnapshot.empty) {
        setJobs(initialJobsData);
      } else {
        const jobsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Job));
        setJobs(jobsData);
      }
    } catch (error) {
      console.error("Failed to fetch jobs from Firestore", error);
      setJobs(initialJobsData);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const getJobById = (id: string): Job | undefined => {
    return jobs.find(j => j.id === id);
  };

  return (
    <JobsContext.Provider value={{ jobs, isLoading, getJobById }}>
      {children}
    </JobsContext.Provider>
  );
}

export function useJobs() {
  const context = useContext(JobsContext);
  if (context === undefined) {
    throw new Error('useJobs must be used within a JobsProvider');
  }
  return context;
}


'use client';

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { collection, onSnapshot, doc, addDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';

export interface Job {
  id: string;
  title: string;
  companyName: string;
  companyId: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
  salary?: string;
  description: string;
  applicationUrl: string;
  postedAt: any; // ISO 8601 date string
  submittedByUid: string;
}

export type NewJobInput = Omit<Job, 'id' | 'postedAt'>;


interface JobsContextType {
  jobs: Job[];
  isLoading: boolean;
  getJobById: (id: string) => Job | undefined;
  addJob: (job: NewJobInput) => Promise<Job>;
}

const JobsContext = createContext<JobsContextType | undefined>(undefined);

const jobsCollectionRef = collection(firestore, 'jobs');

export function JobsProvider({ children }: { children: ReactNode }) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const q = query(jobsCollectionRef, orderBy('postedAt', 'desc'));
    const unsubscribe = onSnapshot(q,
      (querySnapshot) => {
        const jobsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Job));
        setJobs(jobsData);
        setIsLoading(false);
      },
      (error) => {
        console.error("Failed to fetch jobs from Firestore", error);
        setJobs([]);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);
  
  const addJob = async (jobData: NewJobInput): Promise<Job> => {
    const newJob = {
      ...jobData,
      postedAt: serverTimestamp(),
    };
    const docRef = await addDoc(jobsCollectionRef, newJob);
    const newJobWithId = { id: docRef.id, ...newJob, postedAt: new Date() } as Job;
    // No need to manually update state with onSnapshot
    return newJobWithId;
  };

  const getJobById = useCallback((id: string): Job | undefined => {
    return jobs.find(j => j.id === id);
  }, [jobs]);

  return (
    <JobsContext.Provider value={{ jobs, isLoading, getJobById, addJob }}>
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

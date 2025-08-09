
'use client';

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { collection, onSnapshot, doc, addDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import { useToast } from './use-toast';

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
  postedAt: any;
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

export function JobsProvider({ children }: { children: ReactNode }) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    setIsLoading(true);
    const q = query(collection(firestore, 'jobs'), orderBy('postedAt', 'desc'));
    const unsubscribe = onSnapshot(q,
      (querySnapshot) => {
        const jobsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Job));
        setJobs(jobsData);
        setIsLoading(false);
      },
      (error) => {
        console.error("Failed to fetch jobs from Firestore", error);
        toast({ title: "Error", description: "Could not fetch job listings.", variant: "destructive" });
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [toast]);
  
  const addJob = useCallback(async (jobData: NewJobInput): Promise<Job> => {
    try {
        const newJob = {
          ...jobData,
          postedAt: serverTimestamp(),
        };
        const docRef = await addDoc(collection(firestore, 'jobs'), newJob);
        return { id: docRef.id, ...newJob, postedAt: new Date() } as Job;
    } catch (error) {
        console.error("Error adding job:", error);
        toast({ title: "Error", description: "Could not add the new job.", variant: "destructive" });
        throw error;
    }
  }, [toast]);

  const getJobById = useCallback((id: string): Job | undefined => {
    return jobs.find(j => j.id === id);
  }, [jobs]);

  const value = { jobs, isLoading, getJobById, addJob };

  return (
    <JobsContext.Provider value={value}>
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

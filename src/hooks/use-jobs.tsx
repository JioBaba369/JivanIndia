
'use client';

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { collection, getDocs, writeBatch, doc, addDoc } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import { User } from './use-auth';
import { initialJobsData } from '@/data/jobs';


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
  postedAt: string; // ISO 8601 date string
  submittedByUid: string;
}

export type NewJobInput = Omit<Job, 'id' | 'postedAt'>;


interface JobsContextType {
  jobs: Job[];
  isLoading: boolean;
  getJobById: (id: string) => Job | undefined;
  addJob: (job: NewJobInput) => Promise<void>;
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
            console.log("Jobs collection is empty, seeding with initial data...");
            const batch = writeBatch(firestore);
            const seededJobs: Job[] = [];
            initialJobsData.forEach((jobData) => {
                const docRef = doc(jobsCollectionRef);
                batch.set(docRef, {...jobData, submittedByUid: 'seed_user'});
                seededJobs.push({ id: docRef.id, ...jobData, submittedByUid: 'seed_user' });
            });
            await batch.commit();
            setJobs(seededJobs);
            console.log("Jobs collection seeded successfully.");
        } else {
            const jobsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Job));
            setJobs(jobsData);
        }
    } catch (error) {
        console.error("Failed to fetch or seed jobs from Firestore", error);
        setJobs([]);
    } finally {
        setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);
  
  const addJob = async (jobData: NewJobInput) => {
    const newJob = {
      ...jobData,
      postedAt: new Date().toISOString(),
    };
    const docRef = await addDoc(jobsCollectionRef, newJob);
    setJobs(prev => [...prev, { id: docRef.id, ...newJob } as Job]);
  };

  const getJobById = (id: string): Job | undefined => {
    return jobs.find(j => j.id === id);
  };

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

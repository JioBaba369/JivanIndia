
'use client';

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { collection, onSnapshot, doc, addDoc, updateDoc, deleteDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import { useToast } from './use-toast';
import { useNotifications } from './use-notifications';
import { useCommunities } from './use-communities';

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
  updateJob: (id: string, job: Partial<NewJobInput>) => Promise<void>;
  deleteJob: (id: string) => Promise<void>;
}

const JobsContext = createContext<JobsContextType | undefined>(undefined);

export function JobsProvider({ children }: { children: ReactNode }) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { createNotificationForCommunity } = useNotifications();
  const { communities } = useCommunities();

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
        const newJobForDb = {
          ...jobData,
          postedAt: serverTimestamp(),
        };
        const docRef = await addDoc(collection(firestore, 'jobs'), newJobForDb);
        const newJob = { id: docRef.id, ...newJobForDb, postedAt: { toDate: () => new Date() } } as Job;
        
        const community = communities.find(c => c.id === newJob.companyId);
        if (community) {
            await createNotificationForCommunity(community.id, {
                title: `New Job: ${newJob.title}`,
                description: `A new role at ${community.name} has been posted.`,
                link: `/careers`, // Link to careers page, not specific job
                icon: 'Briefcase',
            });
        }
        
        return newJob;
    } catch (error) {
        console.error("Error adding job:", error);
        toast({ title: "Error", description: "Could not add the new job.", variant: "destructive" });
        throw error;
    }
  }, [toast, communities, createNotificationForCommunity]);
  
  const updateJob = useCallback(async (id: string, jobData: Partial<NewJobInput>) => {
    const jobDocRef = doc(firestore, 'jobs', id);
    try {
        await updateDoc(jobDocRef, jobData);
        toast({ title: 'Job Updated', description: 'The job listing has been saved.' });
    } catch(e) {
        console.error("Error updating job:", e);
        toast({ title: "Error", description: "Could not update the job listing.", variant: "destructive" });
        throw e;
    }
  }, [toast]);
  
  const deleteJob = useCallback(async (id: string) => {
    const jobDocRef = doc(firestore, 'jobs', id);
    try {
        await deleteDoc(jobDocRef);
        toast({ title: 'Job Deleted', description: 'The job listing has been removed.' });
    } catch (e) {
        console.error("Error deleting job:", e);
        toast({ title: "Error", description: "Could not delete the job listing.", variant: "destructive" });
        throw e;
    }
  }, [toast]);

  const getJobById = useCallback((id: string): Job | undefined => {
    if (!id) return undefined;
    return jobs.find(j => j.id === id);
  }, [jobs]);

  const value = { jobs, isLoading, getJobById, addJob, updateJob, deleteJob };

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

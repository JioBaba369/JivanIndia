
'use client';

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { collection, getDocs, writeBatch, doc } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';

export interface Job {
  id: string;
  title: string;
  companyName: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
  salary?: string;
  description: string;
  applicationUrl: string;
  postedAt: string; // ISO 8601 date string
}

const initialJobsData: Omit<Job, 'id'>[] = [
    {
      title: "Senior Frontend Engineer",
      companyName: "Rani's Boutique",
      location: "San Francisco, CA",
      type: "Full-time",
      salary: "$150,000 - $180,000",
      description: "Seeking a passionate Senior Frontend Engineer to build beautiful and performant user interfaces for our e-commerce platform.",
      applicationUrl: "#",
      postedAt: "2024-07-29T10:00:00Z"
    },
    {
      title: "Marketing Manager",
      companyName: "Saffron Spice Restaurant",
      location: "Remote",
      type: "Part-time",
      description: "Join our team to lead marketing campaigns, manage social media, and drive growth for our beloved restaurant.",
      applicationUrl: "#",
      postedAt: "2024-07-28T14:30:00Z"
    },
    {
      title: "Data Scientist",
      companyName: "Bollywood Cinemas",
      location: "New York, NY",
      type: "Full-time",
      salary: "$130,000 - $160,000",
      description: "Analyze viewership data, build recommendation models, and provide insights to optimize our movie distribution strategy.",
      applicationUrl: "#",
      postedAt: "2024-07-27T11:00:00Z"
    },
    {
      title: "Content Writer (Internship)",
      companyName: "Nirvana Yoga Studio",
      location: "Austin, TX",
      type: "Internship",
      description: "Create engaging content for our blog, social media, and newsletters. A great opportunity for aspiring writers passionate about wellness.",
      applicationUrl: "#",
      postedAt: "2024-07-25T09:00:00Z"
    }
];


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

  const fetchAndSetJobs = useCallback(async () => {
    try {
        const querySnapshot = await getDocs(jobsCollectionRef);
        const jobsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Job));
        setJobs(jobsData);
        return jobsData;
    } catch (error) {
        console.error("Failed to fetch jobs from Firestore", error);
        setJobs([]);
        return [];
    }
  }, []);

  const seedJobs = useCallback(async () => {
      console.log("Jobs collection is empty, seeding with initial data...");
      const batch = writeBatch(firestore);
      initialJobsData.forEach((jobData) => {
          const docRef = doc(jobsCollectionRef);
          batch.set(docRef, jobData);
      });
      await batch.commit();
      await fetchAndSetJobs();
      console.log("Jobs collection seeded successfully.");
  }, [fetchAndSetJobs]);

  useEffect(() => {
    const initializeJobs = async () => {
        setIsLoading(true);
        const querySnapshot = await getDocs(jobsCollectionRef);
        if (querySnapshot.empty) {
            await seedJobs();
        } else {
            await fetchAndSetJobs();
        }
        setIsLoading(false);
    };
    initializeJobs();
  }, [seedJobs, fetchAndSetJobs]);

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


'use client';

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { collection, getDocs, writeBatch, doc } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';

export interface Job {
  id: string;
  title: string;
  companyName: string;
  companyLogoUrl: string;
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
      companyLogoUrl: "https://placehold.co/100x100.png",
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
      companyLogoUrl: "https://placehold.co/100x100.png",
      location: "Remote",
      type: "Part-time",
      description: "Join our team to lead marketing campaigns, manage social media, and drive growth for our beloved restaurant.",
      applicationUrl: "#",
      postedAt: "2024-07-28T14:30:00Z"
    },
    {
      title: "Data Scientist",
      companyName: "Bollywood Cinemas",
      companyLogoUrl: "https://placehold.co/100x100.png",
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
      companyLogoUrl: "https://placehold.co/100x100.png",
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
            batch.set(docRef, jobData);
            seededJobs.push({ id: docRef.id, ...jobData });
        });
        await batch.commit();
        setJobs(seededJobs);
        console.log("Jobs collection seeded successfully.");
      } else {
        const jobsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Job));
        setJobs(jobsData);
      }
    } catch (error) {
      console.error("Failed to fetch jobs from Firestore", error);
      const localDataWithIds = initialJobsData.map((job, index) => ({...job, id: `local-job-${index}`}));
      setJobs(localDataWithIds);
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

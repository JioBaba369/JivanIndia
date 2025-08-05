
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
    postedAt: string; // ISO date string
}

export const jobs: Job[] = [];

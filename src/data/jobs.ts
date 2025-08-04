
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

export const jobs: Job[] = [
    {
        id: 'job-1',
        title: 'Senior Software Engineer (Backend)',
        companyName: 'Techie Ventures Inc.',
        companyId: 'techie-ventures-inc',
        location: 'San Francisco Bay Area, CA',
        type: 'Full-time',
        salary: '$150,000 - $180,000 per year',
        description: 'Join our innovative team to build the next generation of fintech solutions. We are looking for a skilled backend engineer with experience in Python, Django, and cloud services.',
        applicationUrl: 'https://example.com/apply/job-1',
        postedAt: '2024-07-28T09:00:00Z',
    },
    {
        id: 'job-2',
        title: 'Digital Marketing Manager',
        companyName: 'The Silk Route Boutique',
        companyId: 'the-silk-route-boutique',
        location: 'Artesia, CA',
        type: 'Full-time',
        description: 'We are seeking a creative Digital Marketing Manager to lead our online presence. Responsibilities include managing social media, email campaigns, and SEO/SEM.',
        applicationUrl: 'https://example.com/apply/job-2',
        postedAt: '2024-07-25T14:30:00Z',
    },
    {
        id: 'job-3',
        title: 'Accountant',
        companyName: 'Desi Wealth Management',
        companyId: 'desi-wealth-management',
        location: 'New York, NY (Hybrid)',
        type: 'Part-time',
        salary: '$40 - $50 per hour',
        description: 'Part-time accountant needed for a growing wealth management firm. Duties include bookkeeping, financial reporting, and client account management. CPA preferred.',
        applicationUrl: 'https://example.com/apply/job-3',
        postedAt: '2024-07-22T11:00:00Z',
    },
    {
        id: 'job-4',
        title: 'Restaurant Manager',
        companyName: 'Mumbai Munchies',
        companyId: 'mumbai-munchies-sf',
        location: 'San Francisco, CA',
        type: 'Full-time',
        description: 'Experienced restaurant manager needed to oversee daily operations, staff management, and customer service at our popular downtown location.',
        applicationUrl: 'https://example.com/apply/job-4',
        postedAt: '2024-07-20T18:00:00Z',
    },
     {
        id: 'job-5',
        title: 'Graphic Design Intern',
        companyName: 'Innovate Digital',
        companyId: 'innovate-digital-corp',
        location: 'Remote',
        type: 'Internship',
        salary: '$20 per hour',
        description: 'Paid internship for a creative graphic design student. You will work on a variety of projects for our clients, from social media assets to branding guides.',
        applicationUrl: 'https://example.com/apply/job-5',
        postedAt: '2024-07-29T10:00:00Z',
    }
];

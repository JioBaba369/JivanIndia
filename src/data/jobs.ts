
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
        title: 'Senior Software Engineer',
        companyName: 'Tech Innovations Inc.',
        companyId: 'tech-innovations-inc',
        location: 'San Francisco, CA (Remote options available)',
        type: 'Full-time',
        salary: '$150,000 - $180,000 per year',
        description: 'We are seeking an experienced Senior Software Engineer to join our dynamic team. You will be responsible for designing, developing, and maintaining our core platform. The ideal candidate has over 5 years of experience with React, Node.js, and cloud services like AWS or Google Cloud.',
        applicationUrl: 'https://example.com/apply/job-1',
        postedAt: '2024-07-28T09:00:00Z',
    },
    {
        id: 'job-2',
        title: 'Marketing Coordinator',
        companyName: 'Saffron Spice Restaurant',
        companyId: 'saffron-spice-restaurant',
        location: 'Anytown, USA',
        type: 'Part-time',
        description: 'Saffron Spice is looking for a creative Marketing Coordinator to manage our social media presence, plan promotional events, and engage with the local community. This is a great opportunity for someone passionate about food and marketing. Experience with Canva and social media scheduling tools is a plus.',
        applicationUrl: 'https://example.com/apply/job-2',
        postedAt: '2024-07-25T11:30:00Z',
    },
     {
        id: 'job-3',
        title: 'Financial Analyst Intern',
        companyName: 'Patel Financial Services',
        companyId: 'patel-financial-services',
        location: 'Anytown, USA',
        type: 'Internship',
        salary: '$25 per hour',
        description: 'Join our team for a summer internship! As a Financial Analyst Intern, you will assist our senior analysts with market research, data analysis, and client portfolio management. This is a paid internship open to current university students majoring in Finance, Economics, or a related field.',
        applicationUrl: 'https://example.com/apply/job-3',
        postedAt: '2024-07-22T16:00:00Z',
    },
];

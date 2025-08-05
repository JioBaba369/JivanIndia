
export interface Deal {
    id: string;
    title: string;
    description: string;
    terms: string;
    category: 'Food & Dining' | 'Retail & Shopping' | 'Services' | 'Entertainment' | 'Other';
    business: string;
    businessId: string; // slug of the community
    businessLocation: string;
    businessWebsite: string;
    imageUrl: string;
    expires: string; // Should be a date string e.g. "2024-12-31"
    postedAt: string; // ISO date string
}

export const deals: Deal[] = [];

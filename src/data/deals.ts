
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

export const deals: Deal[] = [
    {
        id: 'deal-1',
        title: '20% Off Your Entire Bill',
        description: 'Enjoy a delicious 20% discount on your entire bill when you dine with us. Experience authentic Indian flavors with our wide range of traditional and contemporary dishes.',
        terms: 'Offer valid for dine-in only. Cannot be combined with other offers. Mention this deal to your server to redeem. Expires December 31, 2024.',
        category: 'Food & Dining',
        business: 'Saffron Spice Restaurant',
        businessId: 'saffron-spice-restaurant',
        businessLocation: '123 Main Street, Anytown, USA',
        businessWebsite: 'saffronspice.com',
        imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxmb29kJTIwaW5kaWFufGVufDB8fHx8MTc1NDE5NzQzNnww&ixlib=rb-4.1.0&q=80&w=1080',
        expires: '2024-12-31',
        postedAt: '2024-07-20T10:00:00Z',
    },
    {
        id: 'deal-2',
        title: 'Buy One, Get One Free Saree',
        description: 'Refresh your wardrobe with our stunning collection of sarees. For a limited time, buy one saree and get another one of equal or lesser value for free.',
        terms: 'Offer valid on select styles only. See in-store for details. Cannot be combined with other offers. Expires August 31, 2024.',
        category: 'Retail & Shopping',
        business: 'Mumbai Fashions',
        businessId: 'mumbai-fashions',
        businessLocation: '456 Market St, Anytown, USA',
        businessWebsite: 'mumbaifashions.com',
        imageUrl: 'https://images.unsplash.com/photo-1620005723220-417433814154?ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBjbG90aGluZ3xlbnwwfHx8fDE3NTQxOTc0MzZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
        expires: '2024-08-31',
        postedAt: '2024-07-15T14:30:00Z',
    },
    {
        id: 'deal-3',
        title: '$50 Off Tax Preparation Services',
        description: 'Get your taxes done right with our professional tax preparation services. New clients get $50 off their first filing with us.',
        terms: 'Offer valid for new clients only. Must mention this deal upon booking. Expires April 15, 2025.',
        category: 'Services',
        business: 'Patel Financial Services',
        businessId: 'patel-financial-services',
        businessLocation: '789 Financial Blvd, Anytown, USA',
        businessWebsite: 'patelfinancial.com',
        imageUrl: 'https://images.unsplash.com/photo-1554224155-8d04421cd6c3?ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxmaW5hbmNlJTIwdGF4fGVufDB8fHx8MTc1NDE5NzQzNnww&ixlib=rb-4.1.0&q=80&w=1080',
        expires: '2025-04-15',
        postedAt: '2024-07-18T11:00:00Z',
    },
];

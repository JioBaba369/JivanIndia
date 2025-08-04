
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
        title: '25% Off Your Entire Meal',
        description: 'Enjoy a delicious 25% discount on your entire bill when you dine with us. Perfect for a family dinner or a night out with friends. Experience authentic Indian flavors at a great price.',
        terms: 'Valid for dine-in only. Cannot be combined with other offers. Mention JivanIndia.co to redeem. Expires December 31, 2024.',
        category: 'Food & Dining',
        business: 'Mumbai Munchies',
        businessId: 'mumbai-munchies-sf',
        businessLocation: 'San Francisco, CA',
        businessWebsite: 'mumbaimunchies.com',
        imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxJbmRpYW4lMjBmb29kfGVufDB8fHx8MTc1NDQxNzQzNnww&ixlib=rb-4.1.0&q=80&w=1080',
        expires: '2024-12-31',
        postedAt: '2024-07-15T10:00:00Z',
    },
    {
        id: 'deal-2',
        title: 'Buy One Saree, Get One 50% Off',
        description: 'Refresh your wardrobe with our stunning collection of traditional and modern sarees. For a limited time, buy one saree and get the second one at half price.',
        terms: 'Discount applied to the saree of equal or lesser value. Offer valid in-store only.',
        category: 'Retail & Shopping',
        business: 'The Silk Route Boutique',
        businessId: 'the-silk-route-boutique',
        businessLocation: 'Artesia, CA',
        businessWebsite: 'silkroute.com',
        imageUrl: 'https://images.unsplash.com/photo-1620799140408-edc6d5f94208?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxJbmRpYW4lMjBjbG90aGluZ3xlbnwwfHx8fDE3NTQ0MTc0MzZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
        expires: '2024-09-30',
        postedAt: '2024-07-20T11:00:00Z',
    },
    {
        id: 'deal-3',
        title: 'Free 30-Minute Financial Consultation',
        description: 'Plan for your future with a free, no-obligation 30-minute consultation with our certified financial planners. We specialize in investment strategies for the Indian diaspora.',
        terms: 'New clients only. Appointment required. Mention this ad when booking.',
        category: 'Services',
        business: 'Desi Wealth Management',
        businessId: 'desi-wealth-management',
        businessLocation: 'New York, NY',
        businessWebsite: 'desiwealth.com',
        imageUrl: 'https://images.unsplash.com/photo-1554224155-1696413565d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxmaW5hbmNpYWwlMjBwbGFubmluZ3xlbnwwfHx8fDE3NTQ0MTc0MzZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
        expires: '2024-10-31',
        postedAt: '2024-07-22T09:00:00Z',
    },
    {
        id: 'deal-4',
        title: '$5 Off Movie Tickets for "Bollywood Beats"',
        description: 'Catch the latest blockbuster, "Bollywood Beats"! Get $5 off your ticket when you book through our community partner link.',
        terms: 'Offer valid for online bookings only. Cannot be used for VIP or 3D screenings.',
        category: 'Entertainment',
        business: 'Cinema Paradiso',
        businessId: 'cinema-paradiso',
        businessLocation: 'Chicago, IL',
        businessWebsite: 'cinemaparadiso.com',
        imageUrl: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxtb3ZpZSUyMHRoZWF0ZXJ8ZW58MHx8fHwxNzU0NDE3NDM2fDA&ixlib=rb-4.1.0&q=80&w=1080',
        expires: '2024-08-31',
        postedAt: '2024-07-25T14:00:00Z',
    },
    {
        id: 'deal-5',
        title: '15% Off All Catering Orders',
        description: 'Planning an event? Let us cater it! Get 15% off all catering orders over $200. We offer a wide range of vegetarian and non-vegetarian options.',
        terms: 'Minimum order of $200 required. Must book at least one week in advance. Delivery charges may apply.',
        category: 'Food & Dining',
        business: 'Tandoori Flames Catering',
        businessId: 'tandoori-flames-catering',
        businessLocation: 'Dallas, TX',
        businessWebsite: 'tandooriflames.com',
        imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxJbmRpYW4lMjBjYXRlcmluZ3xlbnwwfHx8fDE3NTQ0MTc0MzZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
        expires: '2024-11-30',
        postedAt: '2024-07-28T16:00:00Z',
    }
];

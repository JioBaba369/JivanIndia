
export interface Provider {
  id: string;
  name: string;
  category: 'Legal' | 'Health' | 'Finance' | 'Real Estate' | 'Education' | 'Other';
  services: string[];
  description: string;
  fullDescription: string;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  contact: {
    phone: string;
    email: string;
    website: string;
    address: string;
  };
  region: string;
  tags: string[];
  associatedCommunityId?: string;
  associatedCommunityName?: string;
}

export const initialProviders: Provider[] = [
    {
        id: 'provider-1',
        name: 'Gupta & Associates Law Firm',
        category: 'Legal',
        services: ['Immigration Law', 'Business Law', 'Family Law', 'Estate Planning'],
        description: 'Providing comprehensive legal services for the Indian community in the Bay Area for over 20 years.',
        fullDescription: 'Gupta & Associates has been a cornerstone of the legal community for decades, specializing in the unique needs of individuals and businesses within the Indian diaspora. Our team of experienced attorneys is fluent in Hindi, Punjabi, and Gujarati. We are committed to providing personalized and effective legal representation.',
        imageUrl: 'https://images.unsplash.com/photo-1589216532372-1c2a36790039?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxsYXclMjBmaXJtJTIwb2ZmaWNlfGVufDB8fHx8MTc1NDQxNzQzNnww&ixlib=rb-4.1.0&q=80&w=1080',
        rating: 4.9,
        reviewCount: 150,
        isVerified: true,
        contact: {
            phone: '(408) 555-1234',
            email: 'contact@guptalaw.com',
            website: 'guptalaw.com',
            address: '123 Main St, San Jose, CA 95131',
        },
        region: 'San Francisco Bay Area',
        tags: ['immigration', 'h1b', 'green card', 'business formation'],
        associatedCommunityId: 'bay-area-business-network'
    },
    {
        id: 'provider-2',
        name: 'Patel Family Health Clinic',
        category: 'Health',
        services: ['General Pediatrics', 'Internal Medicine', 'Annual Physicals', 'Vaccinations'],
        description: 'Compassionate and culturally sensitive healthcare for the entire family.',
        fullDescription: 'Dr. Anjali Patel and her team provide a welcoming environment for patients of all ages. We understand the importance of culture in healthcare and offer services that respect your values. Our clinic is equipped with modern technology to ensure the best possible care.',
        imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxkb2N0b3IlMjB3aXRoJTIwcGF0aWVudHxlbnwwfHx8fDE3NTQ0MTc0MzZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
        rating: 4.8,
        reviewCount: 210,
        isVerified: true,
        contact: {
            phone: '(732) 555-5678',
            email: 'info@patelhealth.com',
            website: 'patelhealth.com',
            address: '456 Oak Tree Rd, Edison, NJ 08820',
        },
        region: 'New Jersey',
        tags: ['family doctor', 'pediatrician', 'health checkup'],
        associatedCommunityId: 'new-jersey-gujaratis'
    },
    {
        id: 'provider-3',
        name: 'Sharma Financial Planning',
        category: 'Finance',
        services: ['Retirement Planning', 'Investment Management', 'Tax Strategy', '401k Rollovers'],
        description: 'Helping you achieve your financial goals with expert advice and personalized strategies.',
        fullDescription: 'At Sharma Financial Planning, we empower our clients to build a secure financial future. We take the time to understand your unique situation and create a roadmap tailored to your goals, whether it\'s buying a home, saving for education, or planning for retirement.',
        imageUrl: 'https://images.unsplash.com/photo-1665686306574-1ace09918530?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxmaW5hbmNpYWwlMjBhZHZpc29yfGVufDB8fHx8fDE3NTQ0MTc0MzZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
        rating: 4.9,
        reviewCount: 95,
        isVerified: true,
        contact: {
            phone: '(212) 555-9876',
            email: 'contact@sharmafinancial.com',
            website: 'sharmafinancial.com',
            address: '789 Wall St, New York, NY 10005',
        },
        region: 'New York',
        tags: ['finance', 'investment', 'retirement', 'tax'],
        associatedCommunityId: 'ny-finance-professionals'
    },
    {
        id: 'provider-4',
        name: 'Realty Roses',
        category: 'Real Estate',
        services: ['Home Buying', 'Home Selling', 'Property Management', 'Real Estate Investment'],
        description: 'Your trusted partner in the competitive Southern California real estate market.',
        fullDescription: 'The Realty Roses team, led by Sunita Singh, has a deep understanding of the real estate market in Southern California. We guide our clients through every step of the process, ensuring a smooth and successful transaction. We speak Hindi and Punjabi.',
        imageUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxyZWFsJTIwZXN0YXRlJTIwYWdlbnR8ZW58MHx8fHwxNzU0NDE3NDM2fDA&ixlib=rb-4.1.0&q=80&w=1080',
        rating: 4.7,
        reviewCount: 120,
        isVerified: false,
        contact: {
            phone: '(562) 555-1111',
            email: 'sunita@realtyroses.com',
            website: 'realtyroses.com',
            address: '1879 Pioneer Blvd, Artesia, CA 90701',
        },
        region: 'Southern California',
        tags: ['realtor', 'buying home', 'selling home', 'investment property'],
    }
];

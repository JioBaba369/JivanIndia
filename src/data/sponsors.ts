
export interface Sponsor {
  id: string;
  name: string;
  industry: string;
  tier: 'Platinum' | 'Gold' | 'Silver' | 'Bronze';
  logoUrl: string;
  website: string;
  description: string;
  fullDescription: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  socialMedia: {
    twitter?: string;
    linkedin?: string;
    facebook?: string;
  };
  region: string;
  eventsSponsored: Array<{ eventId: string, eventName: string }>;
}


export const initialSponsors: Sponsor[] = [
    {
        id: 'sponsor-1',
        name: 'Innovate Digital Corp',
        industry: 'Technology',
        tier: 'Platinum',
        logoUrl: 'https://placehold.co/400x200.png',
        website: 'innovatedigital.com',
        description: 'Empowering businesses with cutting-edge cloud and AI solutions. Proud supporter of community initiatives.',
        fullDescription: 'Innovate Digital Corp is a leading provider of cloud infrastructure, AI-driven analytics, and enterprise software solutions. We believe in giving back to the communities where we live and work, and are proud to be a platinum sponsor of major cultural and tech events.',
        contactEmail: 'sponsorship@innovatedigital.com',
        contactPhone: '(800) 555-0100',
        address: '555 Tech Park, Palo Alto, CA 94304',
        socialMedia: {
            twitter: 'https://x.com/innovatedigital',
            linkedin: 'https://linkedin.com/company/innovatedigital',
        },
        region: 'San Francisco Bay Area',
        eventsSponsored: [
            { eventId: 'event-1', eventName: 'Annual Diwali Gala' },
            { eventId: 'event-3', eventName: 'Bay Area Holi Festival' }
        ],
    },
    {
        id: 'sponsor-2',
        name: 'Raja Foods International',
        industry: 'Food & Beverage',
        tier: 'Gold',
        logoUrl: 'https://placehold.co/400x200.png',
        website: 'rajafoods.com',
        description: 'Bringing authentic Indian flavors to households across America for over 30 years.',
        fullDescription: 'Raja Foods is a family-owned business dedicated to sourcing the highest quality spices, lentils, and specialty ingredients from India. We are committed to supporting community events that celebrate our rich culinary heritage.',
        contactEmail: 'marketing@rajafoods.com',
        contactPhone: '(888) 555-0101',
        address: '123 Spice Ave, Edison, NJ 08820',
        socialMedia: {
            facebook: 'https://facebook.com/rajafoods',
        },
        region: 'New Jersey',
        eventsSponsored: [
            { eventId: 'event-2', eventName: 'New Jersey Garba Night' },
        ],
    },
    {
        id: 'sponsor-3',
        name: 'State Bank of India (USA)',
        industry: 'Banking & Finance',
        tier: 'Silver',
        logoUrl: 'https://placehold.co/400x200.png',
        website: 'sbi.co.us',
        description: 'Your trusted financial partner, providing banking solutions for individuals and businesses.',
        fullDescription: 'State Bank of India (USA) offers a wide range of services including remittances, deposits, and loans, all tailored to the needs of the Non-Resident Indian (NRI) community. We are honored to sponsor events that bring our community together.',
        contactEmail: 'contact.us@sbi.co.us',
        contactPhone: '(212) 555-0102',
        address: '460 Park Ave, New York, NY 10022',
        socialMedia: {
            linkedin: 'https://linkedin.com/company/sbi-usa',
        },
        region: 'New York',
        eventsSponsored: [
             { eventId: 'event-4', eventName: 'India Day Parade NYC' }
        ],
    },
];

    
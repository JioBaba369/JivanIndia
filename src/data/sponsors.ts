
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
    name: 'Patel Realty Group',
    industry: 'Real Estate',
    tier: 'Platinum',
    logoUrl: 'https://placehold.co/400x200.png',
    website: 'patelrealty.com',
    description: 'Your trusted partner in finding the perfect home for your family.',
    fullDescription: 'Patel Realty Group is a leading real estate firm in the region, specializing in residential and commercial properties. We pride ourselves on our deep community ties and commitment to client satisfaction. As a Platinum sponsor, we are dedicated to supporting community events that bring us all together.',
    contactEmail: 'sponsorship@patelrealty.com',
    contactPhone: '123-555-1234',
    address: '789 Realty Plaza, Anytown, USA',
    socialMedia: {
      linkedin: 'https://linkedin.com/company/patelrealty',
      facebook: 'https://facebook.com/patelrealty'
    },
    region: 'Anytown, USA',
    eventsSponsored: [
      { eventId: 'event-1', eventName: 'Annual Diwali Gala' },
      { eventId: 'event-2', eventName: 'Holi Festival of Colors' }
    ]
  },
  {
    id: 'sponsor-2',
    name: 'Desi Grocers',
    industry: 'Retail',
    tier: 'Gold',
    logoUrl: 'https://placehold.co/400x200.png',
    website: 'desigrocers.com',
    description: 'Bringing you the authentic tastes of India, right to your kitchen.',
    fullDescription: 'Desi Grocers is the largest Indian grocery chain in the state, offering a wide variety of spices, produce, and specialty items. We are proud to be a Gold sponsor and support the cultural fabric of our community.',
    contactEmail: 'community@desigrocers.com',
    contactPhone: '123-555-5678',
    address: '456 Grocery Lane, Anytown, USA',
    socialMedia: {
      facebook: 'https://facebook.com/desigrocers'
    },
    region: 'Anytown, USA',
    eventsSponsored: [
      { eventId: 'event-3', eventName: 'Community Food Festival' }
    ]
  }
];

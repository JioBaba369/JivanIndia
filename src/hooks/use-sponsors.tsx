
'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

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

interface SponsorsContextType {
  sponsors: Sponsor[];
  getSponsorById: (id: string) => Sponsor | undefined;
}

const SponsorsContext = createContext<SponsorsContextType | undefined>(undefined);

const initialSponsors: Sponsor[] = [
    {
    id: '1',
    name: 'Air India',
    industry: 'Travel & Tourism',
    tier: 'Platinum',
    logoUrl: 'https://images.unsplash.com/photo-1622384389022-aa63a2336214?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxBcHBsZSUyMGxvZ298ZW58MHx8fHwxNzU0MTk3NDM2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    website: 'www.airindia.com',
    description: 'The national airline of India, connecting the world to the heart of the nation.',
    fullDescription: 'Air India is the flag carrier airline of India, headquartered in New Delhi. It is owned by Talace Private Limited, a fully owned subsidiary of Tata Sons. The airline operates a fleet of Airbus and Boeing aircraft serving 102 domestic and international destinations. As a proud sponsor of community events, Air India is committed to fostering connections and supporting the Indian diaspora worldwide.',
    contactEmail: 'sponsorships@airindia.com',
    contactPhone: '+1 (800) 223-7776',
    address: 'JFK International Airport, Terminal 4, Jamaica, NY 11430, USA',
    socialMedia: {
      twitter: 'https://twitter.com/airindia',
      linkedin: 'https://www.linkedin.com/company/air-india',
      facebook: 'https://www.facebook.com/AirIndia',
    },
    region: 'North America',
    eventsSponsored: [
      { eventId: '1', eventName: 'Annual Diwali Gala' },
      { eventId: '3', eventName: 'Holi Festival of Colors' }
    ]
  },
  {
    id: '2',
    name: 'State Bank of India (USA)',
    industry: 'Banking & Finance',
    tier: 'Gold',
    logoUrl: 'https://images.unsplash.com/photo-1622384389022-aa63a2336214?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxBcHBsZSUyMGxvZ298ZW58MHx8fHwxNzU0MTk3NDM2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    website: 'us.onlinesbi.sbi',
    description: 'Providing comprehensive banking solutions for individuals and businesses.',
    fullDescription: 'State Bank of India (SBI) is an Indian multinational public sector bank and financial services statutory body. The US operations provide a wide range of services including retail banking, corporate banking, and remittances. SBI is dedicated to supporting the financial well-being of the Indian community abroad and is a proud sponsor of cultural and professional events.',
    contactEmail: 'sponsorship.usa@sbi.co.in',
    contactPhone: '(212) 521-3200',
    address: '460 Park Avenue, New York, NY 10022, USA',
    socialMedia: {
      linkedin: 'https://www.linkedin.com/company/state-bank-of-india',
      facebook: 'https://www.facebook.com/StateBankOfIndia',
    },
    region: 'USA',
    eventsSponsored: [
      { eventId: '2', eventName: 'India Business Conference' }
    ]
  },
  {
    id: '3',
    name: 'Patel Brothers',
    industry: 'Retail & Grocery',
    tier: 'Silver',
    logoUrl: 'https://images.unsplash.com/photo-1622384389022-aa63a2336214?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxBcHBsZSUyMGxvZ298ZW58MHx8fHwxNzU0MTk3NDM2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    website: 'www.patelbros.com',
    description: 'Your one-stop shop for authentic Indian groceries and ingredients.',
    fullDescription: 'Patel Brothers is the largest Indian-American supermarket chain in the United States. With locations across the country, we offer a wide range of authentic groceries, spices, fresh produce, and products from India and South Asia. We are committed to providing the community with a taste of home and proudly support local cultural events and festivals.',
    contactEmail: 'info@patelbros.com',
    contactPhone: '(718) 894-3474',
    address: '42-92 Main St, Flushing, NY 11355, USA',
    socialMedia: {
      facebook: 'https://www.facebook.com/PatelBrothers/',
    },
    region: 'USA',
    eventsSponsored: [
      { eventId: '3', eventName: 'Holi Festival of Colors' }
    ]
  }
];

export function SponsorsProvider({ children }: { children: ReactNode }) {
  const [sponsors, setSponsors] = useState<Sponsor[]>(initialSponsors);

  useEffect(() => {
    setSponsors(initialSponsors);
  }, []);

  const getSponsorById = (id: string) => {
    return sponsors.find(sponsor => sponsor.id === id);
  };

  const value = {
    sponsors,
    getSponsorById,
  };

  return (
    <SponsorsContext.Provider value={value}>
      {children}
    </SponsorsContext.Provider>
  );
}

export function useSponsors() {
  const context = useContext(SponsorsContext);
  if (context === undefined) {
    throw new Error('useSponsors must be used within a SponsorsProvider');
  }
  return context;
}

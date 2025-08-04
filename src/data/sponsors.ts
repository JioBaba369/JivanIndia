
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


export const initialSponsors: Sponsor[] = [];

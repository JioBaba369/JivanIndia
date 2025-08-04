
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

export const initialProviders: Provider[] = [];


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
    name: 'Gupta Law Firm',
    category: 'Legal',
    services: ['Immigration Law', 'Family Law', 'Business Law'],
    description: 'Providing expert legal services for the community.',
    fullDescription: 'Gupta Law Firm has been serving the community for over 20 years, specializing in immigration, family, and business law. Our team of experienced attorneys is dedicated to providing personalized and effective legal solutions.',
    imageUrl: 'https://images.unsplash.com/photo-1589994965851-a8f483d515a4?ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxsYXclMjBvZmZpY2V8ZW58MHx8fHwxNzU0MTk3NDM2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    rating: 4.9,
    reviewCount: 150,
    isVerified: true,
    contact: {
      phone: '123-456-7890',
      email: 'contact@guptalaw.com',
      website: 'guptalaw.com',
      address: '123 Legal Ave, Anytown, USA',
    },
    region: 'Anytown, USA',
    tags: ['immigration', 'attorney', 'legal services'],
    associatedCommunityId: 'bay-area-business-network',
  },
  {
    id: 'provider-2',
    name: 'Sharma Health Clinic',
    category: 'Health',
    services: ['General Checkups', 'Pediatrics', 'Internal Medicine'],
    description: 'Compassionate and comprehensive healthcare for your family.',
    fullDescription: 'Sharma Health Clinic is a state-of-the-art facility offering a wide range of medical services. Our board-certified doctors and friendly staff are committed to providing the highest quality of care to patients of all ages.',
    imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba9996a?ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxoZWFsdGglMjBjbGluaWN8ZW58MHx8fHwxNzU0MTk3NDM2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    rating: 4.8,
    reviewCount: 210,
    isVerified: true,
    contact: {
      phone: '123-555-7891',
      email: 'info@sharmahealth.com',
      website: 'sharmahealth.com',
      address: '456 Wellness Way, Anytown, USA',
    },
    region: 'Anytown, USA',
    tags: ['doctor', 'clinic', 'pediatrician', 'family medicine'],
  },
];

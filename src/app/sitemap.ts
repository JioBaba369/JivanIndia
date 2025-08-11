
import { MetadataRoute } from 'next';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { type Community } from '@/hooks/use-communities';
import { type Event } from '@/hooks/use-events';
import { type User } from '@/hooks/use-auth';
import { type Deal } from '@/hooks/use-deals';
import { type Movie } from '@/hooks/use-movies';
import { type Business } from '@/hooks/use-businesses';
import { type Sponsor } from '@/hooks/use-sponsors';

// Securely initialize Firebase Admin SDK for server-side operations
if (!getApps().length) {
    try {
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT!);
        initializeApp({
            credential: cert(serviceAccount)
        });
    } catch (e) {
        console.error('Firebase Admin initialization error:', e);
        // Fallback for local development if env var is not set, 
        // though it's better to use emulators or have it set.
    }
}


const db = getFirestore();
const BASE_URL = 'https://jivanindia.co';
const FALLBACK_LAST_MOD = new Date('2024-01-01').toISOString();

async function fetchCollection<T>(collectionName: string): Promise<(T & { id: string })[]> {
    try {
        const snapshot = await db.collection(collectionName).get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T & { id: string }));
    } catch (error) {
        console.error(`Error fetching collection ${collectionName}:`, error);
        return [];
    }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 1. Static Pages
  const staticRoutes = [
    '', 
    '/events', 
    '/communities', 
    '/movies', 
    '/deals', 
    '/careers', 
    '/businesses', 
    '/sponsors',
    '/about', 
    '/contact', 
    '/legal', 
    '/legal/privacy', 
    '/legal/terms', 
    '/login', 
    '/signup'
  ].map(route => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as 'weekly',
  }));

  // 2. Dynamic Pages from Firestore
  const events = await fetchCollection<Event>('events');
  const eventRoutes = events
    .filter(event => event.status === 'Approved')
    .map(event => ({
      url: `${BASE_URL}/events/${event.id}`,
      lastModified: (event.updatedAt?.toDate() || event.createdAt?.toDate() || new Date()).toISOString(),
      changeFrequency: 'weekly' as 'weekly',
  }));

  const communities = await fetchCollection<Community>('communities');
  const communityRoutes = communities.map(community => ({
      url: `${BASE_URL}/c/${community.slug}`,
      lastModified: (community.updatedAt?.toDate() || community.createdAt?.toDate() || new Date()).toISOString(),
      changeFrequency: 'daily' as 'daily',
  }));

  const users = await fetchCollection<User>('users');
  const userRoutes = users
    .filter(user => user.username)
    .map(user => ({
        url: `${BASE_URL}/${user.username}`,
        lastModified: FALLBACK_LAST_MOD,
        changeFrequency: 'monthly' as 'monthly',
      }
  ));


  // 3. Dynamic Pages from other collections
  const deals = await fetchCollection<Deal>('deals');
  const dealRoutes = deals.map(deal => ({
    url: `${BASE_URL}/deals/${deal.id}`,
    lastModified: (deal.postedAt?.toDate() || new Date()).toISOString(),
    changeFrequency: 'weekly' as 'weekly',
  }));
  
  const movies = await fetchCollection<Movie>('movies');
  const movieRoutes = movies.map(movie => ({
    url: `${BASE_URL}/movies/${movie.id}`,
    lastModified: (movie.postedAt?.toDate() || new Date()).toISOString(),
    changeFrequency: 'weekly' as 'weekly',
  }));
  
  const businesses = await fetchCollection<Business>('businesses');
  const businessRoutes = businesses
    .filter(b => b.isVerified)
    .map(business => ({
        url: `${BASE_URL}/businesses/${business.id}`,
        lastModified: (business.updatedAt?.toDate() || business.createdAt?.toDate() || new Date()).toISOString(),
        changeFrequency: 'monthly' as 'monthly',
  }));
  
  const sponsors = await fetchCollection<Sponsor>('sponsors');
  const sponsorRoutes = sponsors.map(sponsor => ({
    url: `${BASE_URL}/sponsors/${sponsor.id}`,
    lastModified: (sponsor.createdAt?.toDate() || new Date()).toISOString(),
    changeFrequency: 'monthly' as 'monthly',
  }));

  return [
    ...staticRoutes,
    ...eventRoutes,
    ...communityRoutes,
    ...userRoutes,
    ...dealRoutes,
    ...movieRoutes,
    ...businessRoutes,
    ...sponsorRoutes
  ];
}

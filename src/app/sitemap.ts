
import { MetadataRoute } from 'next';
import { getDocs, collection } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import { type Community } from '@/hooks/use-communities';
import { type Event } from '@/hooks/use-events';
import { type User } from '@/hooks/use-auth';
import { type Deal } from '@/hooks/use-deals';
import { type Movie } from '@/hooks/use-movies';
import { type Provider } from '@/hooks/use-providers';
import { type Sponsor } from '@/hooks/use-sponsors';

const BASE_URL = 'https://jivanindia.co';

async function fetchCollection<T>(collectionName: string): Promise<T[]> {
    const snapshot = await getDocs(collection(firestore, collectionName));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T & { id: string }));
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
    '/providers', 
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
      lastModified: event.updatedAt || event.createdAt,
      changeFrequency: 'weekly' as 'weekly',
  }));

  const communities = await fetchCollection<Community>('communities');
  const communityRoutes = communities.map(community => ({
      url: `${BASE_URL}/c/${community.slug}`,
      lastModified: community.updatedAt || community.createdAt,
      changeFrequency: 'daily' as 'daily',
  }));

  const users = await fetchCollection<User>('users');
  const userRoutes = users.map(user => {
      return user.username ? {
        url: `${BASE_URL}/${user.username}`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'monthly' as 'monthly',
      } : null;
  }).filter(Boolean) as MetadataRoute.Sitemap;


  // 3. Dynamic Pages from other collections
  const deals = await fetchCollection<Deal>('deals');
  const dealRoutes = deals.map(deal => ({
    url: `${BASE_URL}/deals/${deal.id}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as 'weekly',
  }));
  
  const movies = await fetchCollection<Movie>('movies');
  const movieRoutes = movies.map(movie => ({
    url: `${BASE_URL}/movies/${movie.id}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as 'weekly',
  }));
  
  const providers = await fetchCollection<Provider>('providers');
  const providerRoutes = providers.map(provider => ({
    url: `${BASE_URL}/providers/${provider.id}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'monthly' as 'monthly',
  }));
  
  const sponsors = await fetchCollection<Sponsor>('sponsors');
  const sponsorRoutes = sponsors.map(sponsor => ({
    url: `${BASE_URL}/sponsors/${sponsor.id}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'monthly' as 'monthly',
  }));

  return [
    ...staticRoutes,
    ...eventRoutes,
    ...communityRoutes,
    ...userRoutes,
    ...dealRoutes,
    ...movieRoutes,
    ...providerRoutes,
    ...sponsorRoutes
  ];
}

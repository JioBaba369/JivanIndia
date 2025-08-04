
import { MetadataRoute } from 'next';
import { getDocs, collection } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import { Community } from '@/hooks/use-communities';
import { Event } from '@/hooks/use-events';
import { User } from '@/hooks/use-auth';
import { deals } from '@/data/deals';
import { movies } from '@/data/movies';
import { initialProviders as providers } from '@/data/providers';
import { initialSponsors as sponsors } from '@/data/sponsors';

const BASE_URL = 'https://jivanindia.co';

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
  const eventsSnapshot = await getDocs(collection(firestore, 'events'));
  const eventRoutes = eventsSnapshot.docs
    .map(doc => doc.data() as Event)
    .filter(event => event.status === 'Approved')
    .map(event => ({
      url: `${BASE_URL}/events/${event.id}`,
      lastModified: event.updatedAt || event.createdAt,
      changeFrequency: 'weekly' as 'weekly',
  }));

  const communitiesSnapshot = await getDocs(collection(firestore, 'communities'));
  const communityRoutes = communitiesSnapshot.docs.map(doc => {
      const community = doc.data() as Community;
      return {
        url: `${BASE_URL}/c/${community.slug}`,
        lastModified: community.updatedAt || community.createdAt,
        changeFrequency: 'daily' as 'daily',
      }
  });

  const usersSnapshot = await getDocs(collection(firestore, 'users'));
  const userRoutes = usersSnapshot.docs.map(doc => {
      const user = doc.data() as User;
      return user.username ? {
        url: `${BASE_URL}/${user.username}`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'monthly' as 'monthly',
      } : null;
  }).filter(Boolean) as MetadataRoute.Sitemap;


  // 3. Dynamic Pages from local data files
  const dealRoutes = deals.map(deal => ({
    url: `${BASE_URL}/deals/${deal.id}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as 'weekly',
  }));

  const movieRoutes = movies.map(movie => ({
    url: `${BASE_URL}/movies/${movie.id}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as 'weekly',
  }));
  
  const providerRoutes = providers.map(provider => ({
    url: `${BASE_URL}/providers/${provider.id}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'monthly' as 'monthly',
  }));
  
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

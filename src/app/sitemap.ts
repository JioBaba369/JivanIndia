
import { MetadataRoute } from 'next';

const BASE_URL = 'https://jivanindia.co';

export default function sitemap(): MetadataRoute.Sitemap {
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
    '/signup',
    '/calendar',
    '/festivals',
    '/india',
    '/profile'
  ].map(route => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as 'weekly',
  }));

  // In a future iteration, we can add a separate process
  // to dynamically generate routes for events, communities, etc.,
  // without relying on firebase-admin during the build.
  
  return staticRoutes;
}

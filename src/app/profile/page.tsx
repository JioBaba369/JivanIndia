
'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useMemo, useEffect, useCallback } from 'react';
import { useEvents } from '@/hooks/use-events';
import { useCommunities } from '@/hooks/use-communities';
import { useDeals } from '@/hooks/use-deals';
import { useMovies } from '@/hooks/use-movies';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Edit, LogOut, Heart, Users, Tag, Calendar, Building, MapPin, Film, Star, User as UserIcon, Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { getInitials } from '@/lib/utils';
import { useBusinesses } from '@/hooks/use-businesses';

export default function ProfilePage() {
  const { user, logout, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();

  const { events: allEvents, isLoading: isEventsLoading } = useEvents();
  const { communities: allCommunities, isLoading: isCommunitiesLoading } = useCommunities();
  const { deals: allDeals, isLoading: isDealsLoading } = useDeals();
  const { movies: allMovies, isLoading: isMoviesLoading } = useMovies();
  const { businesses: allBusinesses, isLoading: isBusinessesLoading } = useBusinesses();
  
  const isLoading = isAuthLoading || isEventsLoading || isCommunitiesLoading || isDealsLoading || isMoviesLoading || isBusinessesLoading;

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.push('/login');
    }
  }, [user, isAuthLoading, router]);

  const savedEvents = useMemo(() => allEvents.filter(event => user?.savedEvents?.includes(String(event.id))), [allEvents, user]);
  const joinedCommunities = useMemo(() => allCommunities.filter(org => user?.joinedCommunities?.includes(org.id)), [allCommunities, user]);
  const savedDeals = useMemo(() => allDeals.filter(deal => user?.savedDeals?.includes(deal.id)), [allDeals, user]);
  const savedMovies = useMemo(() => allMovies.filter(movie => user?.savedMovies?.includes(movie.id)), [allMovies, user]);
  const savedBusinesses = useMemo(() => allBusinesses.filter(b => user?.savedBusinesses?.includes(b.id)), [allBusinesses, user]);
  

  if (isLoading || !user) {
    return (
        <div className="flex h-[calc(100vh-128px)] items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading Your Profile...</p>
          </div>
        </div>
    );
  }
  
  const handleLogout = () => {
      logout();
  }

  return (
    <div className="bg-muted/40 min-h-[calc(100vh-65px)]">
      <div className="container mx-auto p-4 md:p-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <aside className="md:col-span-1">
                <Card>
                    <CardContent className="p-6 text-center">
                        <Avatar className="h-24 w-24 mx-auto border-4 border-primary">
                            <AvatarImage src={user.profileImageUrl} alt={user.name}/>
                            <AvatarFallback className="text-3xl font-headline">{getInitials(user.name)}</AvatarFallback>
                        </Avatar>
                        <h2 className="font-headline text-2xl font-bold mt-4">{user.name}</h2>
                        <p className="text-muted-foreground text-sm">@{user.username}</p>
                        {user.bio && <p className="text-sm mt-4 text-foreground/80">{user.bio}</p>}
                    </CardContent>
                    <CardContent className="p-4 border-t">
                         <div className="flex flex-col gap-2">
                             {user.username && (
                                <Button asChild className="w-full">
                                    <Link href={`/${user.username}`}>
                                        <UserIcon className="mr-2"/>
                                        View Public Profile
                                    </Link>
                                </Button>
                             )}
                             <Button asChild variant="outline" className="w-full">
                                <Link href="/profile/edit">
                                    <Edit className="mr-2"/>
                                    Edit Profile
                                </Link>
                            </Button>
                            <Button variant="ghost" className="w-full" onClick={handleLogout}>
                                <LogOut className="mr-2"/>
                                Logout
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </aside>
            <main className="md:col-span-3">
                 <Card>
                    <CardHeader>
                        <CardTitle className="font-headline text-3xl">My Dashboard</CardTitle>
                        <CardDescription>Manage your saved items and community involvement.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="saved-events" className="w-full">
                            <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
                                <TabsTrigger value="saved-events"><Heart className="mr-2 h-4 w-4"/>Events ({savedEvents?.length || 0})</TabsTrigger>
                                <TabsTrigger value="saved-movies"><Film className="mr-2 h-4 w-4"/>Movies ({savedMovies?.length || 0})</TabsTrigger>
                                <TabsTrigger value="saved-deals"><Tag className="mr-2 h-4 w-4"/>Deals ({savedDeals?.length || 0})</TabsTrigger>
                                <TabsTrigger value="saved-businesses"><Building className="mr-2 h-4 w-4"/>Businesses ({savedBusinesses?.length || 0})</TabsTrigger>
                                <TabsTrigger value="joined-communities"><Users className="mr-2 h-4 w-4"/>Communities ({joinedCommunities?.length || 0})</TabsTrigger>
                            </TabsList>
                            <TabsContent value="saved-events" className="mt-6">
                                {savedEvents.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {savedEvents.map((event) => (
                                            <Card key={event.id} className="group flex flex-col overflow-hidden transition-all hover:shadow-lg">
                                                <Link href={`/events/${event.id}`} className="flex h-full flex-col">
                                                    <div className="relative h-40 w-full">
                                                        <Image src={event.imageUrl} alt={event.title} fill className="object-cover transition-transform group-hover:scale-105" data-ai-hint="event photo"/>
                                                    </div>
                                                    <CardContent className="flex flex-grow flex-col p-4">
                                                        <h3 className="font-headline text-lg font-semibold group-hover:text-primary flex-grow">{event.title}</h3>
                                                        <div className="mt-3 flex flex-col space-y-2 text-sm text-muted-foreground">
                                                            <div className="flex items-center gap-2"><Calendar className="h-4 w-4" /><span>{format(new Date(event.startDateTime), 'PPp')}</span></div>
                                                            <div className="flex items-center gap-2"><MapPin className="h-4 w-4" /><span>{event.location.venueName}</span></div>
                                                        </div>
                                                    </CardContent>
                                                </Link>
                                            </Card>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="rounded-lg border-2 border-dashed py-12 text-center">
                                        <h3 className="font-headline text-lg">No Saved Events</h3>
                                        <p className="text-muted-foreground mt-2">You haven't saved any events yet.</p>
                                        <Button asChild variant="secondary" className="mt-4"><Link href="/events">Explore Events</Link></Button>
                                    </div>
                                )}
                            </TabsContent>
                             <TabsContent value="saved-movies" className="mt-6">
                                {savedMovies.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {savedMovies.map((movie) => (
                                            <Card key={movie.id} className="group flex flex-col overflow-hidden transition-all hover:shadow-lg">
                                                <Link href={`/movies/${movie.id}`} className="flex h-full flex-col">
                                                    <div className="relative h-40 w-full">
                                                        <Image src={movie.imageUrl} alt={movie.title} fill className="object-cover transition-transform group-hover:scale-105" data-ai-hint="movie poster"/>
                                                    </div>
                                                    <CardContent className="flex flex-grow flex-col p-4">
                                                        <h3 className="font-headline flex-grow text-lg font-semibold group-hover:text-primary">{movie.title}</h3>
                                                        <div className="mt-3 flex flex-col space-y-2 text-sm text-muted-foreground">
                                                             <div className="flex items-center gap-2"><Film className="h-4 w-4" /><span>{movie.genre}</span></div>
                                                             <div className="flex items-center gap-2"><Star className="h-4 w-4 fill-yellow-400 text-yellow-400" /><span>{movie.rating} / 5.0</span></div>
                                                        </div>
                                                    </CardContent>
                                                </Link>
                                            </Card>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="rounded-lg border-2 border-dashed py-12 text-center">
                                        <h3 className="font-headline text-lg">No Saved Movies</h3>
                                        <p className="text-muted-foreground mt-2">You haven't saved any movies yet.</p>
                                        <Button asChild variant="secondary" className="mt-4"><Link href="/movies">Explore Movies</Link></Button>
                                    </div>
                                )}
                            </TabsContent>
                             <TabsContent value="saved-deals" className="mt-6">
                                {savedDeals.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {savedDeals.map((deal) => (
                                            <Card key={deal.id} className="group flex flex-col overflow-hidden transition-all hover:shadow-lg">
                                                <Link href={`/deals/${deal.id}`} className="flex h-full flex-col">
                                                    <div className="relative h-40 w-full">
                                                        <Image src={deal.imageUrl} alt={deal.title} fill className="object-cover transition-transform group-hover:scale-105" data-ai-hint="deal photo"/>
                                                    </div>
                                                    <CardContent className="flex flex-grow flex-col p-4">
                                                        <h3 className="font-headline flex-grow text-lg font-semibold group-hover:text-primary">{deal.title}</h3>
                                                        <div className="mt-3 flex flex-col space-y-2 text-sm text-muted-foreground">
                                                            <div className="flex items-center gap-2"><Building className="h-4 w-4" /><span>{deal.business}</span></div>
                                                        </div>
                                                    </CardContent>
                                                </Link>
                                            </Card>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="rounded-lg border-2 border-dashed py-12 text-center">
                                        <h3 className="font-headline text-lg">No Saved Deals</h3>
                                        <p className="text-muted-foreground mt-2">You haven't saved any deals yet.</p>
                                        <Button asChild variant="secondary" className="mt-4"><Link href="/deals">Explore Deals</Link></Button>
                                    </div>
                                )}
                            </TabsContent>
                            <TabsContent value="saved-businesses" className="mt-6">
                                {savedBusinesses.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {savedBusinesses.map((business) => (
                                            <Card key={business.id} className="group flex flex-col overflow-hidden transition-all hover:shadow-lg">
                                                <Link href={`/businesses/${business.id}`} className="flex h-full flex-col">
                                                    <div className="relative h-40 w-full">
                                                        <Image src={business.imageUrl} alt={business.name} fill className="object-cover transition-transform group-hover:scale-105" data-ai-hint="business photo"/>
                                                    </div>
                                                    <CardContent className="flex flex-grow flex-col p-4">
                                                        <h3 className="font-headline flex-grow text-lg font-semibold group-hover:text-primary">{business.name}</h3>
                                                        <div className="mt-3 flex flex-col space-y-2 text-sm text-muted-foreground">
                                                            <div className="flex items-center gap-2"><Tag className="h-4 w-4" /><span>{business.category}</span></div>
                                                            <div className="flex items-center gap-2"><Star className="h-4 w-4 fill-yellow-400 text-yellow-400" /><span>{business.rating} ({business.reviewCount} reviews)</span></div>
                                                        </div>
                                                    </CardContent>
                                                </Link>
                                            </Card>
                                        ))}
                                    </div>
                                ) : (
                                     <div className="rounded-lg border-2 border-dashed py-12 text-center">
                                        <h3 className="font-headline text-lg">No Saved Businesses</h3>
                                        <p className="text-muted-foreground mt-2">You haven't saved any businesses yet.</p>
                                        <Button asChild variant="secondary" className="mt-4"><Link href="/businesses">Explore Businesses</Link></Button>
                                    </div>
                                )}
                            </TabsContent>
                            <TabsContent value="joined-communities" className="mt-6">
                                {joinedCommunities.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {joinedCommunities.map((community) => (
                                            <Card key={community.id} className="group flex flex-col overflow-hidden transition-all hover:shadow-lg">
                                                <Link href={`/c/${community.slug}`} className="flex h-full flex-col">
                                                    <div className="relative h-40 w-full">
                                                        <Image src={community.imageUrl} alt={community.name} fill className="object-cover transition-transform group-hover:scale-105" data-ai-hint="community photo"/>
                                                    </div>
                                                    <CardContent className="flex flex-grow flex-col p-4">
                                                        <h3 className="font-headline flex-grow text-lg font-semibold group-hover:text-primary">{community.name}</h3>
                                                        <div className="mt-3 flex flex-col space-y-2 text-sm text-muted-foreground">
                                                            <div className="flex items-center gap-2"><Badge variant="outline">{community.type}</Badge></div>
                                                            <div className="flex items-center gap-2"><MapPin className="h-4 w-4" /><span>{community.region}</span></div>
                                                        </div>
                                                    </CardContent>
                                                </Link>
                                            </Card>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="rounded-lg border-2 border-dashed py-12 text-center">
                                        <h3 className="font-headline text-lg">No Joined Communities</h3>
                                        <p className="text-muted-foreground mt-2">You haven't joined any communities yet.</p>
                                        <Button asChild variant="secondary" className="mt-4"><Link href="/communities">Explore Communities</Link></Button>
                                    </div>
                                )}
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                 </Card>
            </main>
        </div>
      </div>
    </div>
  );
}

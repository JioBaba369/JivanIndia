
'use client';

import { useEffect, useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { useEvents } from '@/hooks/use-events';
import dynamic from 'next/dynamic';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building, Calendar, MapPin, Star, Ticket, Share2, Copy, Globe, Loader2, Users, Tag, Flag, Languages, Heart, Film, Edit, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { Tooltip, TooltipProvider, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { useSponsors } from '@/hooks/use-sponsors';
import { useCommunities, type Community } from '@/hooks/use-communities';
import { type User } from '@/hooks/use-auth';
import { useDeals } from '@/hooks/use-deals';
import { useMovies } from '@/hooks/use-movies';
import { getInitials, formatUrl } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { useBusinesses } from '@/hooks/use-businesses';
import CountryFlag from '@/components/feature/country-flag';
import { useCountries } from '@/hooks/use-countries';
import Image from 'next/image';

const QRCode = dynamic(() => import('qrcode.react'), {
  loading: () => <div className="h-48 w-48 flex items-center justify-center"><Loader2 className="animate-spin" /></div>,
});


export default function UserPublicProfilePage() {
    const params = useParams();
    const router = useRouter();
    const { toast } = useToast();
    const username = typeof params.username === 'string' ? params.username : '';

    const { user: currentUser, getUserByUsername } = useAuth();
    const { events: allEvents, getEventById } = useEvents();
    const { businesses: allBusinesses } = useBusinesses();
    const { sponsors } = useSponsors();
    const { communities: allCommunities, getCommunityById } = useCommunities();
    const { deals: allDeals } = useDeals();
    const { movies: allMovies } = useMovies();
    const { countries } = useCountries();

    const [profileUser, setProfileUser] = useState<User | null | undefined>(undefined);
    const [affiliatedCommunity, setAffiliatedCommunity] = useState<Community | null>(null);
    const [pageUrl, setPageUrl] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            if (username) {
                const foundUser = await getUserByUsername(username);
                setProfileUser(foundUser || null);

                if (foundUser?.affiliation?.orgId) {
                    const community = getCommunityById(foundUser.affiliation.orgId);
                    setAffiliatedCommunity(community || null);
                }
            }
        };

        fetchData();
        if (typeof window !== 'undefined') {
            setPageUrl(window.location.href);
        }
    }, [username, getUserByUsername, getCommunityById]);

    const userSavedEvents = useMemo(() => 
        (profileUser?.savedEvents || [])
            .map(eventId => getEventById(eventId))
            .filter((event): event is NonNullable<typeof event> => !!event),
        [profileUser?.savedEvents, getEventById]
    );

    const userJoinedCommunities = useMemo(() => allCommunities.filter(org => profileUser?.joinedCommunities?.includes(org.id)), [allCommunities, profileUser]);
    const userSavedDeals = useMemo(() => allDeals.filter(deal => profileUser?.savedDeals?.includes(deal.id)), [allDeals, profileUser]);
    const userSavedMovies = useMemo(() => allMovies.filter(movie => profileUser?.savedMovies?.includes(movie.id)), [allMovies, profileUser]);
    const userSavedBusinesses = useMemo(() => allBusinesses.filter(b => profileUser?.savedBusinesses?.includes(b.id)), [allBusinesses, profileUser]);

    const userAffiliatedEvents = useMemo(() => (affiliatedCommunity && profileUser?.affiliation)
        ? allEvents.filter(e => e.organizerId === affiliatedCommunity.id && e.status === 'Approved')
        : [], [allEvents, affiliatedCommunity, profileUser]);
    
    const userAffiliatedBusinesses = useMemo(() => (affiliatedCommunity && profileUser?.affiliation)
        ? allBusinesses.filter(p => p.ownerId === profileUser.uid)
        : [], [allBusinesses, affiliatedCommunity, profileUser]);

    const userAffiliatedSponsors = useMemo(() => (affiliatedCommunity && profileUser?.affiliation)
        ? sponsors.filter(s => s.eventsSponsored.some(e => allEvents.find(ev => ev.id === e.eventId)?.organizerId === affiliatedCommunity.id))
        : [], [sponsors, allEvents, affiliatedCommunity, profileUser]);
        
    const copyToClipboard = () => {
        navigator.clipboard.writeText(pageUrl);
        toast({
            title: "Link Copied!",
            description: "Profile URL copied to clipboard.",
        });
    };
    
    const currentCountryCode = useMemo(() => {
        if (!profileUser?.currentLocation?.country) return '';
        return countries.find(c => c.name === profileUser.currentLocation.country)?.code || '';
    }, [profileUser, countries]);
    
    if (profileUser === undefined) {
      return (
        <div className="container mx-auto px-4 py-12 text-center flex items-center justify-center min-h-[calc(100vh-128px)]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }

    if (!profileUser) {
        return (
            <div className="container mx-auto px-4 py-12 text-center">
                <Card className="mx-auto max-w-md">
                    <CardHeader>
                        <CardTitle className="font-headline text-3xl">User Not Found</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>The user profile you are looking for does not exist.</p>
                        <div className="mt-6 flex justify-center gap-4">
                            <Button asChild>
                                <Link href="/">Back to Home</Link>
                            </Button>
                            <Button asChild variant="secondary">
                                <Link href="/signup">Create Your Profile</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }
    
    const isProfileOwner = currentUser?.uid === profileUser?.uid;

    const tabs = [
        { value: 'saved-events', label: 'Saved Events', count: userSavedEvents.length, icon: Calendar, isVisible: true },
        { value: 'saved-movies', label: 'Saved Movies', count: userSavedMovies.length, icon: Film, isVisible: true },
        { value: 'saved-deals', label: 'Saved Deals', count: userSavedDeals.length, icon: Tag, isVisible: true },
        { value: 'saved-businesses', label: 'Saved Businesses', count: userSavedBusinesses.length, icon: Building, isVisible: true },
        { value: 'joined-communities', label: 'Communities', count: userJoinedCommunities.length, icon: Users, isVisible: true },
        { value: 'community-activity', label: 'Affiliation', count: 0, isVisible: !!affiliatedCommunity },
    ].filter(tab => tab.isVisible);

    return (
        <div className="bg-muted/40 min-h-[calc(100vh-65px)]">
             <TooltipProvider>
            <div className="container mx-auto p-4 md:p-12">
                <Card className="max-w-4xl mx-auto shadow-xl">
                    <CardContent className="p-6 md:p-8">
                        <div className="text-center">
                            <div className="inline-flex relative">
                                <Avatar className="h-32 w-32 border-4 border-primary shadow-lg">
                                    <AvatarImage src={profileUser.profileImageUrl} alt={profileUser.name} />
                                    <AvatarFallback className="font-headline text-5xl">{getInitials(profileUser.name)}</AvatarFallback>
                                </Avatar>
                            </div>

                            <h1 className="font-headline text-4xl font-bold mt-4">{profileUser.name}</h1>
                            <p className="text-muted-foreground">@{profileUser.username}</p>
                            {profileUser.bio && <p className="mt-4 max-w-2xl mx-auto text-foreground/80">{profileUser.bio}</p>}

                            <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-muted-foreground text-sm">
                                {profileUser.currentLocation?.city && (
                                    <div className="flex items-center gap-2">
                                        <CountryFlag countryCode={currentCountryCode} />
                                        <span>{profileUser.currentLocation.city}, {profileUser.currentLocation.country}</span>
                                    </div>
                                )}
                                {profileUser.originLocation?.indiaState && (
                                    <div className="flex items-center gap-2">
                                         <CountryFlag countryCode="IN" />
                                         <span>From {profileUser.originLocation.indiaDistrict}, {profileUser.originLocation.indiaState}</span>
                                    </div>
                                )}
                            </div>
                        
                            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-muted-foreground text-sm">
                                {(profileUser.languagesSpoken && profileUser.languagesSpoken.length > 0) && (
                                <div className="flex items-center gap-2"><Languages className="mr-1 h-4 w-4"/> {profileUser.languagesSpoken.join(', ')}</div>
                                )}
                                {profileUser.website && (
                                     <div className="flex items-center gap-2"><Globe className="h-4 w-4"/> <a href={formatUrl(profileUser.website)} target="_blank" rel="noopener noreferrer" className="hover:text-primary">{profileUser.website}</a></div>
                                )}
                            </div>

                             {(profileUser.interests && profileUser.interests.length > 0) && (
                                <div className="mt-4 flex flex-wrap justify-center gap-2">
                                    {profileUser.interests.map(interest => <Badge key={interest} variant="secondary"><Heart className="mr-1 h-3 w-3"/>{interest}</Badge>)}
                                </div>
                             )}
                        </div>

                        <div className="mt-8 flex flex-wrap justify-center gap-4">
                            {affiliatedCommunity && profileUser.affiliation && (
                                <Button asChild>
                                    <Link href={`/c/${affiliatedCommunity.slug}`}>
                                        <Building className="mr-2 h-4 w-4"/> View {profileUser.affiliation.orgName}
                                    </Link>
                                </Button>
                            )}
                             <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="outline"><Share2 className="mr-2 h-4 w-4"/>Share</Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-md">
                                    <DialogHeader>
                                        <DialogTitle>Share this Profile</DialogTitle>
                                    </DialogHeader>
                                    <div className="flex flex-col items-center justify-center gap-4 py-4">
                                        <div className="rounded-lg border p-4">
                                            <QRCode value={pageUrl} size={192} />
                                        </div>
                                        <p className="text-sm text-muted-foreground">Scan this QR code with your phone</p>
                                        <div className="w-full flex items-center space-x-2">
                                            <Input id="copy-url" value={pageUrl} readOnly />
                                            <Button type="submit" size="icon" onClick={copyToClipboard}>
                                                <Copy className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </DialogContent>
                            </Dialog>
                            {isProfileOwner && (
                                <Button asChild variant="secondary">
                                    <Link href="/profile/edit">
                                        <Edit className="mr-2 h-4 w-4"/> Edit Profile
                                    </Link>
                                </Button>
                            )}
                        </div>

                         <div className="mt-12">
                            <Tabs defaultValue={tabs[0]?.value} className="w-full">
                                <TabsList className="grid w-full" style={{gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))`}}>
                                    {tabs.map(tab => (
                                        <TabsTrigger key={tab.value} value={tab.value} className="text-xs md:text-sm whitespace-nowrap px-2">
                                            <tab.icon className="mr-1 md:mr-2 h-4 w-4 hidden md:inline-block" />
                                            {tab.label} {tab.count > 0 ? `(${tab.count})` : ''}
                                        </TabsTrigger>
                                    ))}
                                </TabsList>

                                <TabsContent value="saved-events" className="mt-6">
                                     {userSavedEvents.length > 0 ? (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {userSavedEvents.map((event) => (
                                                <Card key={event.id} className="group flex flex-col overflow-hidden transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10">
                                                    <Link href={`/events/${event.id}`} className="flex h-full flex-col">
                                                        <CardContent className="flex flex-grow flex-col p-4">
                                                            <h3 className="font-headline flex-grow text-lg font-semibold group-hover:text-primary">{event.title}</h3>
                                                            <div className="mt-3 flex flex-col space-y-2 text-sm text-muted-foreground">
                                                                <div className="flex items-center gap-2"><Calendar className="h-4 w-4" /><span>{format(new Date(event.startDateTime), 'eee, MMM d, p')}</span></div>
                                                                <div className="flex items-center gap-2"><MapPin className="h-4 w-4" /><span>{event.location.venueName}</span></div>
                                                            </div>
                                                        </CardContent>
                                                    </Link>
                                                </Card>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="rounded-lg border-2 border-dashed py-12 text-center">
                                            <p className="text-muted-foreground">This user hasn't saved any events yet.</p>
                                        </div>
                                    )}
                                </TabsContent>
                                 <TabsContent value="saved-deals" className="mt-6">
                                     {userSavedDeals.length > 0 ? (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {userSavedDeals.map((deal) => (
                                                <Card key={deal.id} className="group flex flex-col overflow-hidden transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10">
                                                    <Link href={`/deals/${deal.id}`} className="flex h-full flex-col">
                                                        <CardContent className="flex flex-grow flex-col p-4">
                                                            <h3 className="font-headline flex-grow text-lg font-semibold group-hover:text-primary">{deal.title}</h3>
                                                            <div className="mt-3 flex flex-col space-y-2 text-sm text-muted-foreground">
                                                                <div className="flex items-center gap-2"><Tag className="h-4 w-4" /><span>{deal.category}</span></div>
                                                                <div className="flex items-center gap-2"><Building className="h-4 w-4" /><span>{deal.business}</span></div>
                                                            </div>
                                                        </CardContent>
                                                    </Link>
                                                </Card>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="rounded-lg border-2 border-dashed py-12 text-center">
                                            <p className="text-muted-foreground">This user hasn't saved any deals yet.</p>
                                        </div>
                                    )}
                                </TabsContent>
                                <TabsContent value="saved-movies" className="mt-6">
                                     {userSavedMovies.length > 0 ? (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {userSavedMovies.map((movie) => (
                                                <Card key={movie.id} className="group flex flex-col overflow-hidden transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10">
                                                    <Link href={`/movies/${movie.id}`} className="flex h-full flex-col">
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
                                            <p className="text-muted-foreground">This user hasn't saved any movies yet.</p>
                                        </div>
                                    )}
                                </TabsContent>
                                <TabsContent value="saved-businesses" className="mt-6">
                                {userSavedBusinesses.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {userSavedBusinesses.map((business) => (
                                            <Card key={business.id} className="group flex flex-col overflow-hidden transition-all hover:shadow-lg">
                                                <Link href={`/businesses/${business.id}`} className="flex h-full flex-col">
                                                    <div className="relative h-40 w-full">
                                                        {business.logoUrl ? (
                                                          <Image src={business.logoUrl} alt={business.name} fill className="object-contain p-4 transition-transform group-hover:scale-105" data-ai-hint="business logo" />
                                                        ) : (
                                                          <div className="bg-muted h-full w-full flex items-center justify-center">
                                                            <Building className="h-12 w-12 text-muted-foreground"/>
                                                          </div>
                                                        )}
                                                    </div>
                                                    <CardContent className="flex flex-grow flex-col p-4">
                                                        <h3 className="font-headline flex-grow text-lg font-semibold group-hover:text-primary">{business.name}</h3>
                                                        <div className="mt-3 flex flex-col space-y-2 text-sm text-muted-foreground">
                                                            <div className="flex items-center gap-2"><Tag className="h-4 w-4" /><span>{business.category}</span></div>
                                                            <div className="flex items-center gap-2"><Star className="h-4 w-4 fill-yellow-400 text-yellow-400" /><span>{business.rating.toFixed(1)} ({business.reviewCount} reviews)</span></div>
                                                        </div>
                                                    </CardContent>
                                                </Link>
                                            </Card>
                                        ))}
                                    </div>
                                ) : (
                                     <div className="rounded-lg border-2 border-dashed py-12 text-center">
                                        <p className="text-muted-foreground">This user hasn't saved any businesses yet.</p>
                                    </div>
                                )}
                            </TabsContent>
                                <TabsContent value="joined-communities" className="mt-6">
                                     {userJoinedCommunities.length > 0 ? (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {userJoinedCommunities.map((community) => (
                                                <Card key={community.id} className="group flex flex-col overflow-hidden transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10">
                                                    <Link href={`/c/${community.slug}`} className="flex h-full flex-col">
                                                        <CardContent className="flex flex-grow flex-col p-4">
                                                            <h3 className="font-headline flex-grow text-lg font-semibold group-hover:text-primary">{community.name}</h3>
                                                            <div className="mt-3 flex flex-col space-y-2 text-sm text-muted-foreground">
                                                                <div className="flex items-center gap-2"><Users className="h-4 w-4" /><span>{community.type}</span></div>
                                                                <div className="flex items-center gap-2"><MapPin className="h-4 w-4" /><span>{community.region}</span></div>
                                                            </div>
                                                        </CardContent>
                                                    </Link>
                                                </Card>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="rounded-lg border-2 border-dashed py-12 text-center">
                                            <p className="text-muted-foreground">This user hasn't joined any communities yet.</p>
                                        </div>
                                    )}
                                </TabsContent>

                                {affiliatedCommunity && profileUser.affiliation && (
                                <TabsContent value="community-activity" className="mt-6">
                                    <Tabs defaultValue="events" className="w-full">
                                        <TabsList className="grid w-full grid-cols-1 md:grid-cols-3">
                                            <TabsTrigger value="events">Events ({userAffiliatedEvents.length})</TabsTrigger>
                                            <TabsTrigger value="businesses">Businesses ({userAffiliatedBusinesses.length})</TabsTrigger>
                                            <TabsTrigger value="sponsors">Sponsors ({userAffiliatedSponsors.length})</TabsTrigger>
                                        </TabsList>

                                        <TabsContent value="events" className="mt-6">
                                            {userAffiliatedEvents.length > 0 ? (
                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                                    {userAffiliatedEvents.map((event) => (
                                                        <Card key={event.id} className="group flex flex-col overflow-hidden transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10">
                                                            <Link href={`/events/${event.id}`} className="flex h-full flex-col">
                                                                <CardContent className="flex flex-grow flex-col p-4">
                                                                    <h3 className="font-headline flex-grow text-lg font-semibold group-hover:text-primary">{event.title}</h3>
                                                                    <div className="mt-3 flex flex-col space-y-2 text-sm text-muted-foreground">
                                                                        <div className="flex items-center gap-2"><Calendar className="h-4 w-4" /><span>{format(new Date(event.startDateTime), 'eee, MMM d, p')}</span></div>
                                                                        <div className="flex items-center gap-2"><MapPin className="h-4 w-4" /><span>{event.location.venueName}</span></div>
                                                                    </div>
                                                                    <Button variant="outline" size="sm" className="mt-4 w-full"><Ticket className="mr-2 h-4 w-4" />View Event</Button>
                                                                </CardContent>
                                                            </Link>
                                                        </Card>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="rounded-lg border-2 border-dashed py-12 text-center"><p className="text-muted-foreground">No events to display.</p></div>
                                            )}
                                        </TabsContent>
                                        <TabsContent value="businesses" className="mt-6">
                                            {userAffiliatedBusinesses.length > 0 ? (
                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                                    {userAffiliatedBusinesses.map((business) => (
                                                        <Card key={business.id} className="group flex flex-col overflow-hidden transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10">
                                                            <Link href={`/businesses/${business.id}`} className="flex h-full flex-col">
                                                                <CardContent className="flex flex-grow flex-col p-4">
                                                                    <h3 className="font-headline flex-grow text-lg font-semibold group-hover:text-primary">{business.name}</h3>
                                                                    <p className="text-sm font-semibold text-primary">{business.category}</p>
                                                                    <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground"><Star className="h-4 w-4 fill-yellow-400 text-yellow-400" /><span>{business.rating.toFixed(1)} ({business.reviewCount} reviews)</span></div>
                                                                </CardContent>
                                                            </Link>
                                                        </Card>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="rounded-lg border-2 border-dashed py-12 text-center"><p className="text-muted-foreground">No businesses to display.</p></div>
                                            )}
                                        </TabsContent>
                                        <TabsContent value="sponsors" className="mt-6">
                                            {userAffiliatedSponsors.length > 0 ? (
                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                                    {userAffiliatedSponsors.map((sponsor) => (
                                                        <Card key={sponsor.id} className="group flex flex-col overflow-hidden transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10">
                                                            <Link href={`/sponsors/${sponsor.id}`} className="flex h-full flex-col">
                                                                <CardContent className="flex flex-grow flex-col p-4">
                                                                    <h3 className="font-headline flex-grow text-lg font-semibold group-hover:text-primary">{sponsor.name}</h3>
                                                                    <p className="text-sm font-semibold text-primary">{sponsor.industry}</p>
                                                                </CardContent>
                                                            </Link>
                                                        </Card>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="rounded-lg border-2 border-dashed py-12 text-center"><p className="text-muted-foreground">No sponsors to display.</p></div>
                                            )}
                                        </TabsContent>
                                    </Tabs>
                                </TabsContent>
                                )}
                            </Tabs>
                        </div>
                    </CardContent>
                </Card>
            </div>
            </TooltipProvider>
        </div>
    );
}

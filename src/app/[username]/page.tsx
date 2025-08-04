
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { useEvents } from '@/hooks/use-events';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building, Calendar, Globe, Handshake, MapPin, Star, Ticket, Share2, Copy } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { Tooltip, TooltipProvider, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import QRCode from 'qrcode.react';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { useProviders } from '@/hooks/use-providers';
import { useSponsors } from '@/hooks/use-sponsors';

export default function UserPublicProfilePage() {
    const params = useParams();
    const router = useRouter();
    const { toast } = useToast();
    const username = typeof params.username === 'string' ? params.username : '';

    const { getUserByUsername, getInitials } = useAuth();
    const { events } = useEvents();
    const { providers } = useProviders();
    const { sponsors } = useSponsors();


    const [profileUser, setProfileUser] = useState<any | null>(null);
    const [pageUrl, setPageUrl] = useState('');

    useEffect(() => {
        if (username) {
            const foundUser = getUserByUsername(username);
            setProfileUser(foundUser);
        }
        if (typeof window !== 'undefined') {
            setPageUrl(window.location.href);
        }
    }, [username, getUserByUsername]);

    const userAffiliatedEvents = profileUser?.affiliation
        ? events.filter(e => e.organizerId === profileUser.affiliation.orgId && e.status === 'Approved')
        : [];
    
    const userAffiliatedProviders = profileUser?.affiliation
        ? providers.filter(p => p.associatedCommunityId === profileUser.affiliation.orgId)
        : [];

    const userAffiliatedSponsors = profileUser?.affiliation
        ? sponsors.filter(s => s.eventsSponsored.some(e => events.find(ev => ev.id === e.eventId)?.organizerId === profileUser.affiliation.orgId))
        : [];
        
    const copyToClipboard = () => {
        navigator.clipboard.writeText(pageUrl);
        toast({
            title: "Link Copied!",
            description: "Profile URL copied to clipboard.",
        });
    };


    if (!profileUser) {
        return (
            <div className="container mx-auto px-4 py-12 text-center">
                <Card className="mx-auto max-w-md">
                    <CardHeader>
                        <CardTitle className="font-headline text-3xl">User Not Found</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>The user profile you are looking for does not exist.</p>
                        <Button asChild className="mt-6">
                            <Link href="/">Back to Home</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }
    
    const CountryFlag = ({ countryCode }: { countryCode: string }) => {
        if (!countryCode) return null;
        return (
            <Image
                src={`https://flagcdn.com/${countryCode.toLowerCase()}.svg`}
                width={24}
                height={18}
                alt={`${countryCode} flag`}
                className="rounded-sm object-cover"
                unoptimized
            />
        )
    }

    return (
        <div className="bg-muted/40 min-h-[calc(100vh-65px)]">
            <div className="container mx-auto p-4 md:p-12">
                <Card className="max-w-4xl mx-auto shadow-xl">
                    <CardContent className="p-6 md:p-8">
                        <div className="text-center">
                            <div className="inline-flex relative">
                                <Avatar className="h-32 w-32 border-4 border-primary shadow-lg">
                                    {profileUser.profileImageUrl ? (
                                        <AvatarImage src={profileUser.profileImageUrl} alt={profileUser.name} />
                                    ) : (
                                        <AvatarFallback className="font-headline text-5xl">{getInitials(profileUser.name)}</AvatarFallback>
                                    )}
                                </Avatar>
                                <div className="absolute -bottom-2 -right-8 flex gap-2">
                                    {profileUser.currentLocation?.country && (
                                    <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <div className="w-8 h-8 rounded-full bg-background shadow-md flex items-center justify-center">
                                                <CountryFlag countryCode={profileUser.currentLocation.country} />
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Current: {profileUser.currentLocation.city}, {profileUser.currentLocation.state}, {profileUser.currentLocation.country}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                    </TooltipProvider>
                                    )}
                                     {profileUser.originLocation?.indiaState && (
                                     <TooltipProvider>
                                     <Tooltip>
                                        <TooltipTrigger>
                                            <div className="w-8 h-8 rounded-full bg-background shadow-md flex items-center justify-center">
                                                <CountryFlag countryCode="IN" />
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Origin: {profileUser.originLocation.indiaDistrict}, {profileUser.originLocation.indiaState}, India</p>
                                        </TooltipContent>
                                    </Tooltip>
                                    </TooltipProvider>
                                     )}
                                </div>
                            </div>

                            <h1 className="font-headline text-4xl font-bold mt-4">{profileUser.name}</h1>
                            <p className="text-muted-foreground">@{profileUser.username}</p>
                            {profileUser.bio && <p className="mt-4 max-w-2xl mx-auto text-foreground/80">{profileUser.bio}</p>}
                        </div>

                        <div className="mt-8 flex flex-wrap justify-center gap-4">
                            {profileUser.affiliation && (
                                <Button asChild>
                                    <Link href={`/c/${profileUser.affiliation.orgId}`}>
                                        <Building className="mr-2"/> View {profileUser.affiliation.orgName}
                                    </Link>
                                </Button>
                            )}
                             {profileUser.website && (
                                <Button asChild variant="secondary">
                                    <Link href={`https://${profileUser.website}`} target="_blank">
                                        <Globe className="mr-2"/> Website
                                    </Link>
                                </Button>
                            )}
                             <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="outline"><Share2 className="mr-2"/>Share</Button>
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
                        </div>

                         <div className="mt-12">
                            <Tabs defaultValue="events" className="w-full">
                                <TabsList className="grid w-full grid-cols-1 md:grid-cols-3">
                                    <TabsTrigger value="events">Events ({userAffiliatedEvents.length})</TabsTrigger>
                                    <TabsTrigger value="providers">Providers ({userAffiliatedProviders.length})</TabsTrigger>
                                    <TabsTrigger value="sponsors">Sponsors ({userAffiliatedSponsors.length})</TabsTrigger>
                                </TabsList>

                                <TabsContent value="events" className="mt-6">
                                    {userAffiliatedEvents.length > 0 ? (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {userAffiliatedEvents.map((event) => (
                                                <Card key={event.id} className="group flex flex-col overflow-hidden transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10">
                                                    <Link href={`/events/${event.id}`} className="flex h-full flex-col">
                                                        <div className="relative h-40 w-full">
                                                        <Image
                                                            src={event.imageUrl}
                                                            alt={event.title}
                                                            fill
                                                            className="object-cover transition-transform group-hover:scale-105"
                                                        />
                                                        </div>
                                                        <CardContent className="flex flex-grow flex-col p-4">
                                                            <h3 className="font-headline flex-grow text-lg font-semibold group-hover:text-primary">{event.title}</h3>
                                                            <div className="mt-3 flex flex-col space-y-2 text-sm text-muted-foreground">
                                                                <div className="flex items-center gap-2">
                                                                <Calendar className="h-4 w-4" />
                                                                <span>{format(new Date(event.startDateTime), 'eee, MMM d, p')}</span>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                <MapPin className="h-4 w-4" />
                                                                <span>{event.location.venueName}</span>
                                                                </div>
                                                            </div>
                                                            <Button variant="outline" size="sm" className="mt-4 w-full">
                                                                <Ticket className="mr-2 h-4 w-4" />
                                                                View Event
                                                            </Button>
                                                        </CardContent>
                                                    </Link>
                                                </Card>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="rounded-lg border-2 border-dashed py-12 text-center">
                                            <p className="text-muted-foreground">No events to display.</p>
                                        </div>
                                    )}
                                </TabsContent>
                                <TabsContent value="providers" className="mt-6">
                                    {userAffiliatedProviders.length > 0 ? (
                                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {userAffiliatedProviders.map((provider) => (
                                                 <Card key={provider.id} className="group flex flex-col overflow-hidden transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10">
                                                    <Link href={`/providers/${provider.id}`} className="flex h-full flex-col">
                                                        <div className="relative h-40 w-full">
                                                        <Image
                                                            src={provider.imageUrl}
                                                            alt={provider.name}
                                                            fill
                                                            className="object-cover transition-transform group-hover:scale-105"
                                                        />
                                                        </div>
                                                        <CardContent className="flex flex-grow flex-col p-4">
                                                            <h3 className="font-headline flex-grow text-lg font-semibold group-hover:text-primary">{provider.name}</h3>
                                                            <p className="text-sm font-semibold text-primary">{provider.category}</p>
                                                            <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                                                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                                                <span>{provider.rating.toFixed(1)} ({provider.reviewCount} reviews)</span>
                                                            </div>
                                                        </CardContent>
                                                    </Link>
                                                </Card>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="rounded-lg border-2 border-dashed py-12 text-center">
                                            <p className="text-muted-foreground">No providers to display.</p>
                                        </div>
                                    )}
                                </TabsContent>
                                 <TabsContent value="sponsors" className="mt-6">
                                    {userAffiliatedSponsors.length > 0 ? (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {userAffiliatedSponsors.map((sponsor) => (
                                                <Card key={sponsor.id} className="group flex flex-col overflow-hidden transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10">
                                                    <Link href={`/sponsors/${sponsor.id}`} className="flex h-full flex-col">
                                                        <div className="relative h-40 w-full bg-muted flex items-center justify-center p-4">
                                                        <Image
                                                            src={sponsor.logoUrl}
                                                            alt={sponsor.name}
                                                            width={150}
                                                            height={75}
                                                            className="object-contain transition-transform group-hover:scale-105"
                                                        />
                                                        </div>
                                                        <CardContent className="flex flex-grow flex-col p-4">
                                                            <h3 className="font-headline flex-grow text-lg font-semibold group-hover:text-primary">{sponsor.name}</h3>
                                                            <p className="text-sm font-semibold text-primary">{sponsor.industry}</p>
                                                        </CardContent>
                                                    </Link>
                                                </Card>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="rounded-lg border-2 border-dashed py-12 text-center">
                                            <p className="text-muted-foreground">No sponsors to display.</p>
                                        </div>
                                    )}
                                </TabsContent>

                            </Tabs>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

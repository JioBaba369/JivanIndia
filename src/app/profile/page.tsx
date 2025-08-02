
'use client';

import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { Briefcase, Building, MapPin, Trash2, Calendar, Tag, Users, BadgeCheck, Phone, Flag, Mail, Languages, Heart, Globe } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEvents } from '@/hooks/use-events';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';


// Mock data from other pages
import { communities as allCommunities } from '../communities/page';
import { deals as allDeals } from '../deals/page';


export default function ProfilePage() {
  const { user, 
    savedEvents, unsaveEvent,
    joinedCommunities, leaveCommunity,
    savedDeals, unsaveDeal,
  } = useAuth();
  const { toast } = useToast();
  const { events: allEvents } = useEvents();

  const userSavedEvents = allEvents.filter(event => savedEvents.includes(String(event.id)));
  const userJoinedCommunities = allCommunities.filter(org => joinedCommunities.includes(org.id));
  const userSavedDeals = allDeals.filter(deal => savedDeals.includes(deal.id));
  const userOrganizedEvents = user ? allEvents.filter(event => event.submittedByUid === user.uid) : [];

  const handleUnsave = (type: 'event' | 'community' | 'deal', id: string, title: string) => {
    let unsaveFunction;
    let typeName = '';

    switch(type) {
        case 'event':
            unsaveFunction = unsaveEvent;
            typeName = 'Event';
            break;
        case 'community':
            unsaveFunction = leaveCommunity;
            typeName = 'Community';
            break;
        case 'deal':
            unsaveFunction = unsaveDeal;
            typeName = 'Deal';
            break;
        default:
            return;
    }
    
    unsaveFunction(id);
    toast({
        title: `${typeName} Removed`,
        description: `The item "${title}" has been removed from your list.`,
    });
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <Card className="mx-auto max-w-md">
            <CardHeader>
                <CardTitle className="font-headline text-3xl">Access Denied</CardTitle>
                <CardDescription>You must be logged in to view your profile.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button asChild className="mt-2">
                    <Link href="/login">Login</Link>
                </Button>
            </CardContent>
        </Card>
      </div>
    );
  }

  const profileImageUrl = user.profileImageUrl;

  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length > 1) {
        return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  return (
    <div className="min-h-[calc(100vh-128px)] bg-muted/40">
      <TooltipProvider>
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:grid-cols-4">
            <div className="space-y-8 md:col-span-1 lg:col-span-1">
                <Card>
                    <CardHeader className="items-center text-center p-6">
                        <Avatar className="h-24 w-24 border-4 border-primary">
                           {profileImageUrl ? <Image
                            src={profileImageUrl}
                            alt={user.name}
                            width={96}
                            height={96}
                            className="rounded-full object-cover"
                           /> : <AvatarFallback className="font-headline text-3xl">{getInitials(user.name)}</AvatarFallback>}
                        </Avatar>
                        <CardTitle className="font-headline pt-2 text-2xl">{user.name}</CardTitle>
                        <CardDescription>{user.email}</CardDescription>
                        {user.bio && <p className="pt-2 text-sm italic text-muted-foreground">"{user.bio}"</p>}
                         <Button variant="secondary" className="mt-4 w-full" asChild>
                            <Link href="/profile/edit">Edit Profile</Link>
                         </Button>
                    </CardHeader>
                    {user.affiliation && <CardContent className="px-6 pb-6">
                        <Card className="bg-muted">
                            <CardHeader className="p-4">
                                <CardTitle className="font-headline flex items-center justify-center gap-2 text-lg">
                                    <BadgeCheck className="h-5 w-5 text-primary" />
                                    Affiliation
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 pt-0 text-center">
                                <p className="text-sm">You are affiliated with:</p>
                                <Button variant="link" asChild className="h-auto p-0 font-semibold text-base">
                                    <Link href={`/communities/${user.affiliation.orgId}`}>{user.affiliation.orgName}</Link>
                                </Button>
                            </CardContent>
                        </Card>
                    </CardContent>}
                </Card>
                
                 <Card>
                    <CardHeader className="p-6">
                        <CardTitle className="font-headline text-xl">Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6 p-6 pt-0">
                        {(user.languagesSpoken && user.languagesSpoken.length > 0) && (
                            <div className="space-y-2">
                                <h4 className="flex items-center gap-2 text-sm font-semibold"><Languages className="h-4 w-4"/> Languages</h4>
                                <div className="flex flex-wrap gap-1">
                                    {user.languagesSpoken.map(lang => <Badge key={lang} variant="secondary">{lang}</Badge>)}
                                </div>
                            </div>
                        )}
                         {(user.interests && user.interests.length > 0) && (
                            <div className="space-y-2">
                                <h4 className="flex items-center gap-2 text-sm font-semibold"><Heart className="h-4 w-4"/> Interests</h4>
                                 <div className="flex flex-wrap gap-1">
                                    {user.interests.map(interest => <Badge key={interest} variant="secondary">{interest}</Badge>)}
                                </div>
                            </div>
                        )}

                        <div className="space-y-4">
                             <div className="flex items-start gap-4">
                                <Mail className="h-5 w-5 mt-1 flex-shrink-0 text-primary" />
                                <div>
                                    <p className="text-sm font-semibold">Email</p>
                                    <p className="text-sm text-muted-foreground">{user.email}</p>
                                </div>
                            </div>
                            {user.phone && (
                                <div className="flex items-start gap-4">
                                    <Phone className="h-5 w-5 mt-1 flex-shrink-0 text-primary" />
                                    <div>
                                        <p className="text-sm font-semibold">Phone</p>
                                        <p className="text-sm text-muted-foreground">{user.phone}</p>
                                    </div>
                                </div>
                            )}
                             {user.currentLocation?.city && (
                                <div className="flex items-start gap-4">
                                    <Globe className="h-5 w-5 mt-1 flex-shrink-0 text-primary" />
                                    <div>
                                        <p className="text-sm font-semibold">Current Location</p>
                                        <p className="text-sm text-muted-foreground">{`${user.currentLocation.city}, ${user.currentLocation.state}, ${user.currentLocation.country}`}</p>
                                    </div>
                                </div>
                            )}
                            {user.originLocation?.indiaState && (
                                <div className="flex items-start gap-4">
                                    <Flag className="h-5 w-5 mt-1 flex-shrink-0 text-primary" />
                                    <div>
                                        <p className="text-sm font-semibold">Origin in India</p>
                                        <p className="text-sm text-muted-foreground">{`${user.originLocation.indiaDistrict}, ${user.originLocation.indiaState}`}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

            </div>
            <div className="md:col-span-2 lg:col-span-3">
                <Tabs defaultValue="events" className="w-full">
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    <TabsTrigger value="events">Events ({userSavedEvents.length})</TabsTrigger>
                    <TabsTrigger value="organizations">Communities ({userJoinedCommunities.length})</TabsTrigger>
                    <TabsTrigger value="deals">Deals ({userSavedDeals.length})</TabsTrigger>
                    <TabsTrigger value="my-events">My Events ({userOrganizedEvents.length})</TabsTrigger>
                </TabsList>
                
                <TabsContent value="events" className="mt-6">
                    {userSavedEvents.length > 0 ? (
                        <div className="space-y-4">
                            {userSavedEvents.map((event) => {
                                const eventDate = event.startDateTime && !isNaN(new Date(event.startDateTime).getTime()) 
                                    ? format(new Date(event.startDateTime), 'eee, MMM d, p') 
                                    : 'Date not available';

                                return (
                                <Card key={event.id} className="transition-all hover:shadow-sm">
                                    <CardContent className="flex flex-col items-start gap-4 p-4 sm:flex-row">
                                        <Image src={event.imageUrl} alt={event.title} width={80} height={80} className="aspect-video rounded-lg border bg-background object-cover sm:aspect-square" />
                                        <div className="flex-grow">
                                            <Link href={`/events/${event.id}`} className="group"><CardTitle className="font-headline text-xl transition-colors group-hover:text-primary">{event.title}</CardTitle></Link>
                                            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                                                <div className="flex items-center gap-2"><Calendar className="h-4 w-4" /><span>{eventDate}</span></div>
                                                <div className="flex items-center gap-2"><MapPin className="h-4 w-4" /><span>{event.location.venueName}</span></div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 pt-2 sm:ml-auto sm:pt-0">
                                            <Button variant="outline" size="sm" asChild><Link href={`/events/${event.id}`}>View</Link></Button>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button variant="destructive" size="icon" onClick={() => handleUnsave('event', String(event.id), event.title)}><Trash2 className="h-4 w-4" /></Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Unsave</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </div>
                                    </CardContent>
                                </Card>
                            )})}
                        </div>
                    ) : (
                        <div className="rounded-lg border-2 border-dashed py-12 text-center">
                            <p className="text-muted-foreground">You haven't saved any events yet.</p>
                            <Button asChild className="mt-4"><Link href="/events">Find Events</Link></Button>
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="organizations" className="mt-6">
                    {userJoinedCommunities.length > 0 ? (
                        <div className="space-y-4">
                            {userJoinedCommunities.map((org) => (
                                <Card key={org.id} className="transition-all hover:shadow-sm">
                                    <CardContent className="flex flex-col items-start gap-4 p-4 sm:flex-row">
                                        <Image src={org.imageUrl} alt={org.name} width={80} height={80} className="aspect-video rounded-lg border bg-background object-cover sm:aspect-square" />
                                        <div className="flex-grow">
                                            <Link href={`/communities/${org.id}`} className="group"><CardTitle className="font-headline text-xl transition-colors group-hover:text-primary">{org.name}</CardTitle></Link>
                                            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                                                <div className="flex items-center gap-2"><Users className="h-4 w-4" /><span>{org.type}</span></div>
                                                <div className="flex items-center gap-2"><MapPin className="h-4 w-4" /><span>{org.region}</span></div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 pt-2 sm:ml-auto sm:pt-0">
                                            <Button variant="outline" size="sm" asChild><Link href={`/communities/${org.id}`}>View</Link></Button>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button variant="destructive" size="icon" onClick={() => handleUnsave('community', org.id, org.name)}><Trash2 className="h-4 w-4" /></Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Leave</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-lg border-2 border-dashed py-12 text-center">
                            <p className="text-muted-foreground">You haven't joined any communities yet.</p>
                            <Button asChild className="mt-4"><Link href="/communities">Find Communities</Link></Button>
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="deals" className="mt-6">
                    {userSavedDeals.length > 0 ? (
                        <div className="space-y-4">
                            {userSavedDeals.map((deal) => (
                                <Card key={deal.id} className="transition-all hover:shadow-sm">
                                    <CardContent className="flex flex-col items-start gap-4 p-4 sm:flex-row">
                                        <Image src={deal.imageUrl} alt={deal.title} width={80} height={80} className="aspect-video rounded-lg border bg-background object-cover sm:aspect-square" />
                                        <div className="flex-grow">
                                            <Link href={`/deals/${deal.id}`} className="group"><CardTitle className="font-headline text-xl transition-colors group-hover:text-primary">{deal.title}</CardTitle></Link>
                                            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                                                <div className="flex items-center gap-2"><Tag className="h-4 w-4" /><span>{deal.category}</span></div>
                                                <div className="flex items-center gap-2"><Building className="h-4 w-4" /><span>{deal.business}</span></div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 pt-2 sm:ml-auto sm:pt-0">
                                            <Button variant="outline" size="sm" asChild><Link href={`/deals/${deal.id}`}>View</Link></Button>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button variant="destructive" size="icon" onClick={() => handleUnsave('deal', deal.id, deal.title)}><Trash2 className="h-4 w-4" /></Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Unsave</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-lg border-2 border-dashed py-12 text-center">
                            <p className="text-muted-foreground">You haven't saved any deals yet.</p>
                            <Button asChild className="mt-4"><Link href="/deals">Find Deals</Link></Button>
                        </div>
                    )}
                </TabsContent>

                 <TabsContent value="my-events" className="mt-6">
                    {userOrganizedEvents.length > 0 ? (
                        <div className="space-y-4">
                            {userOrganizedEvents.map((event) => {
                                const eventDate = event.startDateTime && !isNaN(new Date(event.startDateTime).getTime()) 
                                    ? format(new Date(event.startDateTime), 'eee, MMM d, p') 
                                    : 'Date not available';

                                return (
                                <Card key={event.id} className="transition-all hover:shadow-sm">
                                    <CardContent className="flex flex-col items-start gap-4 p-4 sm:flex-row">
                                        <Image src={event.imageUrl} alt={event.title} width={80} height={80} className="aspect-video rounded-lg border bg-background object-cover sm:aspect-square" />
                                        <div className="flex-grow">
                                            <div className="flex items-start justify-between">
                                                <Link href={`/events/${event.id}`} className="group"><CardTitle className="font-headline text-xl transition-colors group-hover:text-primary">{event.title}</CardTitle></Link>
                                                <Badge variant={event.status === 'Approved' ? 'default' : event.status === 'Pending' ? 'secondary' : 'destructive'}>{event.status}</Badge>
                                            </div>
                                            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                                                <div className="flex items-center gap-2"><Calendar className="h-4 w-4" /><span>{eventDate}</span></div>
                                                <div className="flex items-center gap-2"><MapPin className="h-4 w-4" /><span>{event.location.venueName}</span></div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )})}
                        </div>
                    ) : (
                        <div className="rounded-lg border-2 border-dashed py-12 text-center">
                            <p className="text-muted-foreground">You haven't created any events yet.</p>
                            <Button asChild className="mt-4"><Link href="/events/new">Create an Event</Link></Button>
                        </div>
                    )}
                </TabsContent>
                </Tabs>
            </div>
        </div>
      </div>
      </TooltipProvider>
    </div>
  );
}

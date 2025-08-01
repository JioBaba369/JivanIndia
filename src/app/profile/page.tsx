
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


// Mock data from other pages
import { jobs as allJobs } from '../careers/page';
import { communities as allCommunities } from '../communities/page';
import { deals as allDeals } from '../deals/page';


export default function ProfilePage() {
  const { user, 
    savedJobs, unsaveJob, 
    savedEvents, unsaveEvent,
    joinedCommunities, leaveCommunity,
    savedDeals, unsaveDeal,
  } = useAuth();
  const { toast } = useToast();
  const { events: allEvents } = useEvents();

  const userSavedJobs = allJobs.filter(job => savedJobs.includes(job.id));
  const userSavedEvents = allEvents.filter(event => savedEvents.includes(String(event.id)));
  const userJoinedCommunities = allCommunities.filter(org => joinedCommunities.includes(org.id));
  const userSavedDeals = allDeals.filter(deal => savedDeals.includes(deal.id));
  const userOrganizedEvents = user ? allEvents.filter(event => event.submittedByUid === user.uid) : [];

  const handleUnsave = (type: 'job' | 'event' | 'community' | 'deal', id: string, title: string) => {
    let unsaveFunction;
    let typeName = '';

    switch(type) {
        case 'job':
            unsaveFunction = unsaveJob;
            typeName = 'Job';
            break;
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
        <Card className="max-w-md mx-auto">
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
  const profileImageAiHint = "user avatar";

  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length > 1) {
        return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  return (
    <div className="bg-muted/40 min-h-[calc(100vh-128px)]">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
            <div className="md:col-span-1 lg:col-span-1 space-y-8">
                <Card>
                    <CardHeader className="items-center text-center">
                        <Avatar className="h-24 w-24 border-4 border-primary">
                           {profileImageUrl ? <Image
                            src={profileImageUrl}
                            alt={user.name}
                            width={96}
                            height={96}
                            className="rounded-full object-cover"
                            data-ai-hint={profileImageAiHint}
                           /> : <AvatarFallback className="text-3xl font-headline">{getInitials(user.name)}</AvatarFallback>}
                        </Avatar>
                        <CardTitle className="font-headline text-2xl pt-2">{user.name}</CardTitle>
                        <CardDescription>{user.email}</CardDescription>
                        {user.bio && <p className="text-sm text-muted-foreground pt-2 italic">"{user.bio}"</p>}
                         <Button variant="secondary" className="w-full mt-4" asChild>
                            <Link href="/profile/edit">Edit Profile</Link>
                         </Button>
                    </CardHeader>
                    <CardContent>
                        {user.affiliation && (
                            <Card className="bg-muted">
                                <CardHeader className="p-4">
                                    <CardTitle className="font-headline text-lg flex items-center justify-center gap-2">
                                        <BadgeCheck className="text-primary h-5 w-5" />
                                        Affiliation
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-4 pt-0 text-center">
                                    <p className="text-sm">You are affiliated with:</p>
                                    <Button variant="link" asChild className="p-0 h-auto font-semibold text-base">
                                        <Link href={`/communities/${user.affiliation.orgId}`}>{user.affiliation.orgName}</Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        )}
                    </CardContent>
                </Card>
                
                 <Card>
                    <CardHeader>
                        <CardTitle className="font-headline text-xl">Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {(user.languagesSpoken && user.languagesSpoken.length > 0) && (
                            <div className="space-y-2">
                                <h4 className="font-semibold flex items-center gap-2 text-sm"><Languages className="h-4 w-4"/> Languages</h4>
                                <div className="flex flex-wrap gap-1">
                                    {user.languagesSpoken.map(lang => <Badge key={lang} variant="secondary">{lang}</Badge>)}
                                </div>
                            </div>
                        )}
                         {(user.interests && user.interests.length > 0) && (
                            <div className="space-y-2">
                                <h4 className="font-semibold flex items-center gap-2 text-sm"><Heart className="h-4 w-4"/> Interests</h4>
                                 <div className="flex flex-wrap gap-1">
                                    {user.interests.map(interest => <Badge key={interest} variant="secondary">{interest}</Badge>)}
                                </div>
                            </div>
                        )}

                        <div className="space-y-4">
                             <div className="flex items-start gap-4">
                                <Mail className="h-5 w-5 mt-1 text-primary flex-shrink-0" />
                                <div>
                                    <p className="font-semibold text-sm">Email</p>
                                    <p className="text-muted-foreground text-sm">{user.email}</p>
                                </div>
                            </div>
                            {user.phone && (
                                <div className="flex items-start gap-4">
                                    <Phone className="h-5 w-5 mt-1 text-primary flex-shrink-0" />
                                    <div>
                                        <p className="font-semibold text-sm">Phone</p>
                                        <p className="text-muted-foreground text-sm">{user.phone}</p>
                                    </div>
                                </div>
                            )}
                             {user.currentLocation?.city && (
                                <div className="flex items-start gap-4">
                                    <Globe className="h-5 w-5 mt-1 text-primary flex-shrink-0" />
                                    <div>
                                        <p className="font-semibold text-sm">Current Location</p>
                                        <p className="text-muted-foreground text-sm">{`${user.currentLocation.city}, ${user.currentLocation.state}, ${user.currentLocation.country}`}</p>
                                    </div>
                                </div>
                            )}
                            {user.originLocation?.indiaState && (
                                <div className="flex items-start gap-4">
                                    <Flag className="h-5 w-5 mt-1 text-primary flex-shrink-0" />
                                    <div>
                                        <p className="font-semibold text-sm">Origin in India</p>
                                        <p className="text-muted-foreground text-sm">{`${user.originLocation.indiaDistrict}, ${user.originLocation.indiaState}`}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

            </div>
            <div className="md:col-span-2 lg:col-span-3">
                <Tabs defaultValue="jobs" className="w-full">
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                    <TabsTrigger value="jobs">Jobs ({userSavedJobs.length})</TabsTrigger>
                    <TabsTrigger value="events">Events ({userSavedEvents.length})</TabsTrigger>
                    <TabsTrigger value="organizations">Communities ({userJoinedCommunities.length})</TabsTrigger>
                    <TabsTrigger value="deals">Deals ({userSavedDeals.length})</TabsTrigger>
                    <TabsTrigger value="my-events">My Events ({userOrganizedEvents.length})</TabsTrigger>
                </TabsList>
                
                <TabsContent value="jobs" className="mt-6">
                    {userSavedJobs.length > 0 ? (
                    <div className="space-y-4">
                        {userSavedJobs.map((job) => (
                        <Card key={job.id} className="transition-all hover:shadow-sm">
                            <CardContent className="p-4 flex flex-col sm:flex-row gap-4 items-start">
                                <Image src={job.imageUrl} alt={`${job.company} logo`} width={60} height={60} className="rounded-lg object-cover border bg-background" data-ai-hint={job.aiHint} />
                                <div className="flex-grow">
                                    <Link href={`/careers/${job.id}`} className="group"><CardTitle className="font-headline text-xl group-hover:text-primary transition-colors">{job.title}</CardTitle></Link>
                                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-muted-foreground text-sm">
                                        <div className="flex items-center gap-2"><Building className="h-4 w-4" /><span>{job.company}</span></div>
                                        <div className="flex items-center gap-2"><MapPin className="h-4 w-4" /><span>{job.location}</span></div>
                                        <div className="flex items-center gap-2"><Briefcase className="h-4 w-4" /><span>{job.type}</span></div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 sm:ml-auto pt-2 sm:pt-0">
                                    <Button variant="outline" size="sm" asChild><Link href={`/careers/${job.id}`}>View</Link></Button>
                                    <Button variant="destructive" size="icon" onClick={() => handleUnsave('job', job.id, job.title)}><Trash2 className="h-4 w-4" /><span className="sr-only">Unsave</span></Button>
                                </div>
                            </CardContent>
                        </Card>
                        ))}
                    </div>
                    ) : (
                    <div className="text-center py-12 border-2 border-dashed rounded-lg">
                        <p className="text-muted-foreground">You haven't saved any jobs yet.</p>
                        <Button asChild className="mt-4"><Link href="/careers">Find Jobs</Link></Button>
                    </div>
                    )}
                </TabsContent>

                <TabsContent value="events" className="mt-6">
                    {userSavedEvents.length > 0 ? (
                        <div className="space-y-4">
                            {userSavedEvents.map((event) => {
                                const eventDate = event.startDateTime && !isNaN(new Date(event.startDateTime).getTime()) 
                                    ? format(new Date(event.startDateTime), 'eee, MMM d, p') 
                                    : 'Date not available';

                                return (
                                <Card key={event.id} className="transition-all hover:shadow-sm">
                                    <CardContent className="p-4 flex flex-col sm:flex-row gap-4 items-start">
                                        <Image src={event.imageUrl} alt={event.title} width={80} height={80} className="rounded-lg object-cover border bg-background aspect-video sm:aspect-square" data-ai-hint={event.aiHint} />
                                        <div className="flex-grow">
                                            <Link href={`/events/${event.id}`} className="group"><CardTitle className="font-headline text-xl group-hover:text-primary transition-colors">{event.title}</CardTitle></Link>
                                            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-muted-foreground text-sm">
                                                <div className="flex items-center gap-2"><Calendar className="h-4 w-4" /><span>{eventDate}</span></div>
                                                <div className="flex items-center gap-2"><MapPin className="h-4 w-4" /><span>{event.location.venueName}</span></div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 sm:ml-auto pt-2 sm:pt-0">
                                            <Button variant="outline" size="sm" asChild><Link href={`/events/${event.id}`}>View</Link></Button>
                                            <Button variant="destructive" size="icon" onClick={() => handleUnsave('event', String(event.id), event.title)}><Trash2 className="h-4 w-4" /><span className="sr-only">Unsave</span></Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            )})}
                        </div>
                    ) : (
                        <div className="text-center py-12 border-2 border-dashed rounded-lg">
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
                                    <CardContent className="p-4 flex flex-col sm:flex-row gap-4 items-start">
                                        <Image src={org.imageUrl} alt={org.name} width={80} height={80} className="rounded-lg object-cover border bg-background aspect-video sm:aspect-square" data-ai-hint={org.aiHint} />
                                        <div className="flex-grow">
                                            <Link href={`/communities/${org.id}`} className="group"><CardTitle className="font-headline text-xl group-hover:text-primary transition-colors">{org.name}</CardTitle></Link>
                                            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-muted-foreground text-sm">
                                                <div className="flex items-center gap-2"><Users className="h-4 w-4" /><span>{org.type}</span></div>
                                                <div className="flex items-center gap-2"><MapPin className="h-4 w-4" /><span>{org.region}</span></div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 sm:ml-auto pt-2 sm:pt-0">
                                            <Button variant="outline" size="sm" asChild><Link href={`/communities/${org.id}`}>View</Link></Button>
                                            <Button variant="destructive" size="icon" onClick={() => handleUnsave('community', org.id, org.name)}><Trash2 className="h-4 w-4" /><span className="sr-only">Unsave</span></Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 border-2 border-dashed rounded-lg">
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
                                    <CardContent className="p-4 flex flex-col sm:flex-row gap-4 items-start">
                                        <Image src={deal.imageUrl} alt={deal.title} width={80} height={80} className="rounded-lg object-cover border bg-background aspect-video sm:aspect-square" data-ai-hint={deal.aiHint} />
                                        <div className="flex-grow">
                                            <Link href={`/deals/${deal.id}`} className="group"><CardTitle className="font-headline text-xl group-hover:text-primary transition-colors">{deal.title}</CardTitle></Link>
                                            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-muted-foreground text-sm">
                                                <div className="flex items-center gap-2"><Tag className="h-4 w-4" /><span>{deal.category}</span></div>
                                                <div className="flex items-center gap-2"><Building className="h-4 w-4" /><span>{deal.business}</span></div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 sm:ml-auto pt-2 sm:pt-0">
                                            <Button variant="outline" size="sm" asChild><Link href={`/deals/${deal.id}`}>View</Link></Button>
                                            <Button variant="destructive" size="icon" onClick={() => handleUnsave('deal', deal.id, deal.title)}><Trash2 className="h-4 w-4" /><span className="sr-only">Unsave</span></Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 border-2 border-dashed rounded-lg">
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
                                    <CardContent className="p-4 flex flex-col sm:flex-row gap-4 items-start">
                                        <Image src={event.imageUrl} alt={event.title} width={80} height={80} className="rounded-lg object-cover border bg-background aspect-video sm:aspect-square" data-ai-hint={event.aiHint} />
                                        <div className="flex-grow">
                                            <div className="flex justify-between items-start">
                                                <Link href={`/events/${event.id}`} className="group"><CardTitle className="font-headline text-xl group-hover:text-primary transition-colors">{event.title}</CardTitle></Link>
                                                <Badge variant={event.status === 'Approved' ? 'default' : event.status === 'Pending' ? 'secondary' : 'destructive'}>{event.status}</Badge>
                                            </div>
                                            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-muted-foreground text-sm">
                                                <div className="flex items-center gap-2"><Calendar className="h-4 w-4" /><span>{eventDate}</span></div>
                                                <div className="flex items-center gap-2"><MapPin className="h-4 w-4" /><span>{event.location.venueName}</span></div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )})}
                        </div>
                    ) : (
                        <div className="text-center py-12 border-2 border-dashed rounded-lg">
                            <p className="text-muted-foreground">You haven't created any events yet.</p>
                            <Button asChild className="mt-4"><Link href="/events/new">Create an Event</Link></Button>
                        </div>
                    )}
                </TabsContent>
                </Tabs>
            </div>
        </div>
      </div>
    </div>
  );
}

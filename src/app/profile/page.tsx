
'use client';

import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { Briefcase, Building, MapPin, Trash2, Calendar, Tag, Ticket, Users, BadgeCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEvents } from '@/hooks/use-events';
import { useState } from 'react';

// Mock data from other pages
import { jobs as allJobs } from '../careers/page';
import { organizations as allOrgs } from '../organizations/page';
import { deals as allDeals } from '../deals/page';
import { EditProfileForm } from '@/components/edit-profile-form';


export default function ProfilePage() {
  const { user, 
    savedJobs, unsaveJob, 
    savedEvents, unsaveEvent,
    savedOrgs, unsaveOrg,
    savedDeals, unsaveDeal,
  } = useAuth();
  const { toast } = useToast();
  const { events: allEvents } = useEvents();
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);


  const userSavedJobs = allJobs.filter(job => savedJobs.includes(job.id));
  const userSavedEvents = allEvents.filter(event => savedEvents.includes(String(event.id)));
  const userSavedOrgs = allOrgs.filter(org => savedOrgs.includes(org.id));
  const userSavedDeals = allDeals.filter(deal => savedDeals.includes(deal.id));

  const handleUnsave = (type: string, id: string, title: string) => {
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
        case 'organization':
            unsaveFunction = unsaveOrg;
            typeName = 'Organization';
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
        title: `${typeName} Unsaved`,
        description: `The item "${title}" has been removed from your saved list.`,
    });
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="font-headline text-3xl font-bold">Access Denied</h1>
        <p className="mt-4 text-muted-foreground">Please log in to view your profile.</p>
        <Button asChild className="mt-6">
          <Link href="/login">Login</Link>
        </Button>
      </div>
    );
  }

  const profileImageUrl = user.affiliation?.orgLogoUrl || "https://placehold.co/100x100.png";
  const profileImageAlt = user.affiliation ? `${user.affiliation.orgName} logo` : user.name;
  const profileImageAiHint = user.affiliation?.orgLogoAiHint || "user avatar";

  return (
    <>
    <EditProfileForm isOpen={isEditFormOpen} onOpenChange={setIsEditFormOpen} />
    <div className="bg-muted/40 min-h-[calc(100vh-128px)]">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
                <Card>
                    <CardHeader className="items-center text-center">
                        <div className="relative h-24 w-24">
                           <Image
                            src={profileImageUrl}
                            alt={profileImageAlt}
                            width={96}
                            height={96}
                            className="rounded-full object-cover border-4 border-primary"
                            data-ai-hint={profileImageAiHint}
                           />
                        </div>
                        <CardTitle className="font-headline text-2xl pt-2">{user.name}</CardTitle>
                        <CardDescription>{user.email}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {user.affiliation && (
                            <Card className="bg-muted">
                                <CardHeader>
                                    <CardTitle className="font-headline text-lg flex items-center gap-2">
                                        <BadgeCheck className="text-primary" />
                                        Affiliation
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm">You are affiliated with:</p>
                                    <Button variant="link" asChild className="p-0 h-auto font-semibold text-base">
                                        <Link href={`/organizations/${user.affiliation.orgId}`}>{user.affiliation.orgName}</Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        )}
                    </CardContent>
                    <CardFooter>
                         <Button variant="outline" className="w-full" onClick={() => setIsEditFormOpen(true)}>Edit Profile</Button>
                    </CardFooter>
                </Card>
            </div>
            <div className="md:col-span-2">
                <Tabs defaultValue="jobs" className="w-full">
                <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
                    <TabsTrigger value="jobs">Jobs ({userSavedJobs.length})</TabsTrigger>
                    <TabsTrigger value="events">Events ({userSavedEvents.length})</TabsTrigger>
                    <TabsTrigger value="organizations">Orgs ({userSavedOrgs.length})</TabsTrigger>
                    <TabsTrigger value="deals">Deals ({userSavedDeals.length})</TabsTrigger>
                </TabsList>
                
                <TabsContent value="jobs" className="mt-6">
                    {userSavedJobs.length > 0 ? (
                    <div className="space-y-4">
                        {userSavedJobs.map((job) => (
                        <Card key={job.id} className="transition-all hover:shadow-sm">
                            <CardContent className="p-4 flex flex-col sm:flex-row gap-4 items-start">
                                <Image src={job.imageUrl} alt={`${job.company} logo`} width={60} height={60} className="rounded-lg object-cover border bg-background" data-ai-hint={job.aiHint} />
                                <div className="flex-grow">
                                    <Link href={`/careers/${job.id}`} className="group"><h3 className="font-headline text-xl font-bold group-hover:text-primary transition-colors">{job.title}</h3></Link>
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
                            {userSavedEvents.map((event) => (
                                <Card key={event.id} className="transition-all hover:shadow-sm">
                                    <CardContent className="p-4 flex flex-col sm:flex-row gap-4 items-start">
                                        <Image src={event.imageUrl} alt={event.title} width={80} height={80} className="rounded-lg object-cover border bg-background aspect-video sm:aspect-square" data-ai-hint={event.aiHint} />
                                        <div className="flex-grow">
                                            <Link href={`/events/${event.id}`} className="group"><h3 className="font-headline text-xl font-bold group-hover:text-primary transition-colors">{event.title}</h3></Link>
                                            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-muted-foreground text-sm">
                                                <div className="flex items-center gap-2"><Calendar className="h-4 w-4" /><span>{event.date}</span></div>
                                                <div className="flex items-center gap-2"><MapPin className="h-4 w-4" /><span>{event.location}</span></div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 sm:ml-auto pt-2 sm:pt-0">
                                            <Button variant="outline" size="sm" asChild><Link href={`/events/${event.id}`}>View</Link></Button>
                                            <Button variant="destructive" size="icon" onClick={() => handleUnsave('event', String(event.id), event.title)}><Trash2 className="h-4 w-4" /><span className="sr-only">Unsave</span></Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 border-2 border-dashed rounded-lg">
                            <p className="text-muted-foreground">You haven't saved any events yet.</p>
                            <Button asChild className="mt-4"><Link href="/events">Find Events</Link></Button>
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="organizations" className="mt-6">
                    {userSavedOrgs.length > 0 ? (
                        <div className="space-y-4">
                            {userSavedOrgs.map((org) => (
                                <Card key={org.id} className="transition-all hover:shadow-sm">
                                    <CardContent className="p-4 flex flex-col sm:flex-row gap-4 items-start">
                                        <Image src={org.imageUrl} alt={org.name} width={80} height={80} className="rounded-lg object-cover border bg-background aspect-video sm:aspect-square" data-ai-hint={org.aiHint} />
                                        <div className="flex-grow">
                                            <Link href={`/organizations/${org.id}`} className="group"><h3 className="font-headline text-xl font-bold group-hover:text-primary transition-colors">{org.name}</h3></Link>
                                            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-muted-foreground text-sm">
                                                <div className="flex items-center gap-2"><Users className="h-4 w-4" /><span>{org.category}</span></div>
                                                <div className="flex items-center gap-2"><MapPin className="h-4 w-4" /><span>{org.location}</span></div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 sm:ml-auto pt-2 sm:pt-0">
                                            <Button variant="outline" size="sm" asChild><Link href={`/organizations/${org.id}`}>View</Link></Button>
                                            <Button variant="destructive" size="icon" onClick={() => handleUnsave('organization', org.id, org.name)}><Trash2 className="h-4 w-4" /><span className="sr-only">Unsave</span></Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 border-2 border-dashed rounded-lg">
                            <p className="text-muted-foreground">You haven't saved any organizations yet.</p>
                            <Button asChild className="mt-4"><Link href="/organizations">Find Organizations</Link></Button>
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
                                            <Link href={`/deals/${deal.id}`} className="group"><h3 className="font-headline text-xl font-bold group-hover:text-primary transition-colors">{deal.title}</h3></Link>
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
                </Tabs>
            </div>
        </div>
      </div>
    </div>
    </>
  );
}

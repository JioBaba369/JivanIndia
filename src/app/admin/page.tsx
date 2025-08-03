
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { useEvents, type Event } from '@/hooks/use-events';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { ShieldCheck, Building, CheckCircle2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCommunities, type Community } from '@/hooks/use-communities';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const { events, updateEventStatus } = useEvents();
  const { communities, verifyCommunity } = useCommunities();
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoading && !user?.isAdmin) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  const handleEventStatusChange = (eventId: string, newStatus: Event['status']) => {
    updateEventStatus(eventId, newStatus);
    toast({
        title: `Event ${newStatus}`,
        description: `The event has been successfully updated.`,
    });
  }

  const handleCommunityVerify = (communityId: string) => {
    verifyCommunity(communityId);
    toast({
        title: "Community Verified",
        description: "The community has been marked as verified.",
    });
  };

  const getEventStatusVariant = (status: Event['status']) => {
    switch (status) {
        case 'Approved': return 'default';
        case 'Pending': return 'secondary';
        case 'Archived': return 'destructive';
        default: return 'outline';
    }
  }

  if (isLoading || !user?.isAdmin) {
    return (
        <div className="container mx-auto px-4 py-12 text-center">
            <p>Loading...</p>
        </div>
    );
  }

  const sortedEvents = [...events].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const sortedCommunities = [...communities].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());


  return (
    <div className="container mx-auto px-4 py-12">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-8 w-8 text-primary" />
            <CardTitle className="font-headline text-3xl">Admin Dashboard</CardTitle>
          </div>
          <CardDescription>Manage all submitted content on the platform.</CardDescription>
        </CardHeader>
        <CardContent>
            <Tabs defaultValue="events">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="events">Events ({sortedEvents.length})</TabsTrigger>
                    <TabsTrigger value="communities">Communities ({sortedCommunities.length})</TabsTrigger>
                </TabsList>
                <TabsContent value="events" className="mt-6">
                    <div className="w-full overflow-x-auto">
                        <Table>
                            <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Organizer</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                            </TableHeader>
                            <TableBody>
                            {sortedEvents.map(event => (
                                <TableRow key={event.id}>
                                    <TableCell className="font-medium">
                                        <Link href={`/events/${event.id}`} className="hover:underline" target="_blank">{event.title}</Link>
                                    </TableCell>
                                    <TableCell>{event.organizerName}</TableCell>
                                    <TableCell>{format(new Date(event.startDateTime), 'PPp')}</TableCell>
                                    <TableCell>
                                        <Badge variant={getEventStatusVariant(event.status)}>{event.status}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right space-x-2">
                                        {event.status !== 'Approved' && (
                                            <Button size="sm" onClick={() => handleEventStatusChange(event.id, 'Approved')}>Approve</Button>
                                        )}
                                        {event.status !== 'Archived' && (
                                            <Button size="sm" variant="destructive" onClick={() => handleEventStatusChange(event.id, 'Archived')}>Archive</Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                            </TableBody>
                        </Table>
                    </div>
                    {sortedEvents.length === 0 && (
                        <div className="text-center py-12 text-muted-foreground">
                            <p>No events have been submitted yet.</p>
                        </div>
                    )}
                </TabsContent>
                <TabsContent value="communities" className="mt-6">
                    <div className="w-full overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Region</TableHead>
                                    <TableHead>Founder Email</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {sortedCommunities.map(community => (
                                    <TableRow key={community.id}>
                                        <TableCell className="font-medium">
                                          <Link href={`/communities/${community.id}`} className="hover:underline" target="_blank">{community.name}</Link>
                                        </TableCell>
                                        <TableCell>{community.region}</TableCell>
                                        <TableCell>{community.founderEmail}</TableCell>
                                        <TableCell>
                                            <Badge variant={community.isVerified ? 'default' : 'secondary'}>
                                                {community.isVerified ? 'Verified' : 'Unverified'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {!community.isVerified && (
                                                <Button size="sm" onClick={() => handleCommunityVerify(community.id)}>
                                                    <CheckCircle2 className="mr-2 h-4 w-4"/>
                                                    Verify
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                     {sortedCommunities.length === 0 && (
                        <div className="text-center py-12 text-muted-foreground">
                            <p>No communities have been created yet.</p>
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

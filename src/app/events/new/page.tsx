
'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/use-auth';
import { useEvents, type Event } from '@/hooks/use-events';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function NewEventPage() {
  const router = useRouter();
  const { addEvent } = useEvents();
  const { toast } = useToast();
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [eventType, setEventType] = useState<'Cultural' | 'Religious' | 'Professional' | 'Sports' | 'Festival' | 'Workshop' | 'Food' | 'Other'>('Other');
  const [startDateTime, setStartDateTime] = useState('');
  const [endDateTime, setEndDateTime] = useState('');
  const [venueName, setVenueName] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [organizerName, setOrganizerName] = useState(user?.affiliation?.orgName || '');
  const [tags, setTags] = useState('');
  const [ticketLink, setTicketLink] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.affiliation) {
      toast({
        title: 'Affiliation Required',
        description: 'You must be affiliated with an organization to create an event.',
        variant: 'destructive',
      });
      return;
    }
    if (!user) {
        toast({
            title: 'Authentication Error',
            description: 'You must be logged in to create an event.',
            variant: 'destructive',
        });
        return;
    }
    const newEvent: Omit<Event, 'id' | 'createdAt' | 'status'> = {
      title,
      eventType,
      startDateTime,
      endDateTime,
      location: {
        venueName,
        address,
      },
      description,
      organizerName: user.affiliation.orgName,
      organizerId: user.affiliation.orgId,
      imageUrl: 'https://placehold.co/600x400.png',
      aiHint: 'community event',
      tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
      ticketLink,
      submittedByUid: user.uid,
    };

    addEvent(newEvent, user.affiliation.orgId);

    toast({
      title: 'Event Submitted!',
      description: `Your event "${title}" has been submitted for review.`,
    });

    router.push('/events');
  };

  if (!user) {
    return (
       <div className="container mx-auto px-4 py-12 text-center">
        <Card className="max-w-md mx-auto">
            <CardHeader>
                <CardTitle className="font-headline text-3xl">Access Denied</CardTitle>
                <CardDescription>You must be logged in to create an event. Please log in to continue.</CardDescription>
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

  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Share Your Event</CardTitle>
          <CardDescription>
            Fill out the form below to post your event on the JivanIndia.co community calendar.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Event Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Annual Diwali Gala"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="eventType">Category</Label>
                <select
                  id="eventType"
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value as any)}
                  required
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                >
                    <option>Cultural</option>
                    <option>Religious</option>
                    <option>Professional</option>
                    <option>Sports</option>
                    <option>Festival</option>
                    <option>Workshop</option>
                    <option>Food</option>
                    <option>Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="startDateTime">Start Date & Time</Label>
                <Input
                  id="startDateTime"
                  type="datetime-local"
                  value={startDateTime}
                  onChange={(e) => setStartDateTime(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDateTime">End Date & Time</Label>
                <Input
                  id="endDateTime"
                  type="datetime-local"
                  value={endDateTime}
                  onChange={(e) => setEndDateTime(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
                <Label htmlFor="venueName">Location Name</Label>
                <Input
                id="venueName"
                placeholder="e.g., Grand Park, Downtown LA"
                value={venueName}
                onChange={(e) => setVenueName(e.target.value)}
                required
                />
            </div>

             <div className="space-y-2">
                <Label htmlFor="address">Full Address</Label>
                <Input
                id="address"
                placeholder="e.g., 200 N Grand Ave, Los Angeles, CA 90012"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                />
            </div>
            
            <div className="space-y-2">
                <Label htmlFor="organizerName">Organizer</Label>
                <Input
                    id="organizerName"
                    value={organizerName}
                    disabled
                    readOnly
                />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Event Description</Label>
              <Textarea
                id="description"
                placeholder="Tell us more about the event..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={5}
              />
            </div>
            
            <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <Input
                    id="tags"
                    placeholder="e.g., family-friendly, diwali, free-entry"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">Separate tags with a comma.</p>
            </div>

             <div className="space-y-2">
                <Label htmlFor="ticketLink">Ticket URL (Optional)</Label>
                <Input
                    id="ticketLink"
                    placeholder="e.g., https://www.eventbrite.com/..."
                    value={ticketLink}
                    onChange={(e) => setTicketLink(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">Link to an external ticketing page.</p>
            </div>


            <div className="flex justify-end gap-4 pt-4">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit">Create Event</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

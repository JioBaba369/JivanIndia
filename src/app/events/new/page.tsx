
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
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [organizer, setOrganizer] = useState(user?.affiliation?.orgName || '');
  const [duration, setDuration] = useState('');

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
    const newEvent: Omit<Event, 'id' | 'postedAt'> = {
      title,
      category,
      date,
      time,
      location,
      address,
      description,
      organizer: user.affiliation.orgName,
      organizerId: user.affiliation.orgId,
      imageUrl: 'https://placehold.co/600x400.png',
      aiHint: 'community event',
      duration,
    };

    addEvent(newEvent);

    toast({
      title: 'Event Created!',
      description: `The event "${title}" has been successfully created.`,
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
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  placeholder="e.g., Festival, Workshop"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="text"
                  placeholder="e.g., Saturday, November 4, 2024"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  type="text"
                  placeholder="e.g., 7:00 PM - 11:00 PM PST"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <Label htmlFor="location">Location Name</Label>
                    <Input
                    id="location"
                    placeholder="e.g., Grand Park, Downtown LA"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
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
            </div>
            
            <div className="space-y-2">
                <Label htmlFor="organizer">Organizer</Label>
                <Input
                    id="organizer"
                    value={organizer}
                    disabled
                    readOnly
                />
            </div>
            
             <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <Input
                    id="duration"
                    placeholder="e.g., 3 hours"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    required
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

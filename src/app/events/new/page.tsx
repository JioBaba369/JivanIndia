
'use client';

import type { Metadata } from 'next';
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
import { useState, useRef } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Image from 'next/image';
import { ImageUp } from 'lucide-react';
import ImageCropper from '@/components/feature/image-cropper';

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
  
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setImageSrc(reader.result?.toString() || '');
        setIsCropperOpen(true);
      });
      reader.readAsDataURL(file);
    }
  };

  const handleCropSave = (croppedDataUrl: string) => {
    setCroppedImage(croppedDataUrl);
    setIsCropperOpen(false);
  };

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
     if (!croppedImage) {
      toast({
        title: 'Image Required',
        description: 'Please upload and crop an image for the event banner.',
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
      imageUrl: croppedImage,
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
        <Card className="mx-auto max-w-md">
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
      {imageSrc && (
        <ImageCropper
          isOpen={isCropperOpen}
          onClose={() => setIsCropperOpen(false)}
          imageSrc={imageSrc}
          onSave={handleCropSave}
          aspectRatio={16 / 9}
        />
      )}
      <Card className="mx-auto max-w-3xl shadow-xl shadow-black/5">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Share Your Event</CardTitle>
          <CardDescription>
            Fill out the form below to post your event on the JivanIndia.co community calendar.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="event-image">Event Banner Image</Label>
                <Card 
                  className="flex aspect-[16/9] w-full cursor-pointer flex-col items-center justify-center gap-2 border-2 border-dashed bg-muted hover:bg-muted/80"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {croppedImage ? (
                    <Image src={croppedImage} alt="Event banner preview" fill className="object-cover rounded-lg"/>
                  ) : (
                    <>
                      <ImageUp className="h-8 w-8 text-muted-foreground" />
                      <span className="text-muted-foreground">Click to upload image (16:9 ratio recommended)</span>
                    </>
                  )}
                </Card>
                 <Input 
                  id="event-image" 
                  type="file" 
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/png, image/jpeg"
                />
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
                 <Select value={eventType} onValueChange={(value) => setEventType(value as any)} required>
                    <SelectTrigger id="eventType">
                        <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Cultural">Cultural</SelectItem>
                        <SelectItem value="Religious">Religious</SelectItem>
                        <SelectItem value="Professional">Professional</SelectItem>
                        <SelectItem value="Sports">Sports</SelectItem>
                        <SelectItem value="Festival">Festival</SelectItem>
                        <SelectItem value="Workshop">Workshop</SelectItem>
                        <SelectItem value="Food">Food</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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

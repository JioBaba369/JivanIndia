

'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, MapPin, Ticket, Share2, Bookmark, Users, Clock, History } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useRouter, useParams } from "next/navigation";
import { useEvents } from "@/hooks/use-events";
import { format, formatDistanceToNow, intervalToDuration, isValid } from 'date-fns';
import { useState, useEffect } from 'react';


export default function EventDetailPage() {
  const params = useParams();
  const { getEventById } = useEvents();
  const id = typeof params.id === 'string' ? params.id : '';
  const event = getEventById(id);

  const { toast } = useToast();
  const { user, saveEvent, unsaveEvent, isEventSaved } = useAuth();
  const router = useRouter();
  const [createdAt, setCreatedAt] = useState('');
  const [duration, setDuration] = useState('');

  useEffect(() => {
    if (event?.createdAt) {
      try {
        const date = new Date(event.createdAt);
        if (isValid(date)) {
          setCreatedAt(formatDistanceToNow(date, { addSuffix: true }));
        } else {
            setCreatedAt('a while ago');
        }
      } catch (error) {
        console.error("Failed to parse date:", event.createdAt, error);
        setCreatedAt('a while ago');
      }
    }
    if (event?.startDateTime && event?.endDateTime) {
       try {
            const startDate = new Date(event.startDateTime);
            const endDate = new Date(event.endDateTime);
            if(isValid(startDate) && isValid(endDate)) {
                const d = intervalToDuration({ start: startDate, end: endDate });
                const formattedDuration = [
                    d.days ? `${d.days}d` : '',
                    d.hours ? `${d.hours}h` : '',
                    d.minutes ? `${d.minutes}m` : ''
                ].filter(Boolean).join(' ');
                setDuration(formattedDuration);
            } else {
                 setDuration("N/A");
            }
       } catch(e) {
            console.error("Failed to calculate duration", e);
            setDuration("N/A");
       }
    }
  }, [event]);
  
  if (!event) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="font-headline text-3xl font-bold">Event not found</h1>
        <p className="mt-4 text-muted-foreground">The event you are looking for does not exist.</p>
        <Button asChild className="mt-6">
          <Link href="/events">Back to Events</Link>
        </Button>
      </div>
    );
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link Copied!",
      description: "Event link copied to clipboard.",
    });
  };

  const handleSaveToggle = () => {
    if (!user) {
        toast({
            title: "Please log in",
            description: "You need to be logged in to save events.",
            variant: "destructive",
        });
        router.push("/login");
        return;
    }

    const currentlySaved = isEventSaved(event.id);
    if (currentlySaved) {
        unsaveEvent(event.id);
        toast({
            title: "Event Unsaved",
            description: `"${event.title}" has been removed from your saved events.`,
        });
    } else {
        saveEvent(event.id);
        toast({
            title: "Event Saved!",
            description: `"${event.title}" has been saved to your profile.`,
        });
    }
  }

  const eventIsSaved = user ? isEventSaved(event.id) : false;

  const TicketButton = () => {
    if (event.ticketLink) {
      return (
        <Button size="lg" className="w-full" asChild>
          <a href={event.ticketLink} target="_blank" rel="noopener noreferrer">
            <Ticket className="mr-2"/>
            Get Tickets
          </a>
        </Button>
      );
    }
    return (
      <Button size="lg" className="w-full">
        <Ticket className="mr-2"/>
        Register
      </Button>
    );
  };

  const eventStartDate = event.startDateTime && isValid(new Date(event.startDateTime)) ? new Date(event.startDateTime) : null;
  const eventEndDate = event.endDateTime && isValid(new Date(event.endDateTime)) ? new Date(event.endDateTime) : null;


  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-12">
        <Card className="overflow-hidden">
          <div className="relative h-64 md:h-96 w-full">
            <Image
              src={event.imageUrl}
              alt={event.title}
              fill
              className="object-cover"
              data-ai-hint={event.aiHint}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6 md:p-8">
              <Badge>
                {event.eventType}
              </Badge>
              <h1 className="font-headline text-3xl md:text-5xl font-bold text-white mt-2">
                {event.title}
              </h1>
            </div>
          </div>
          <CardContent className="p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <h2 className="font-headline text-2xl font-semibold mb-4">
                  About this event
                </h2>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                    <History className="h-4 w-4" />
                    <span>Posted {createdAt}</span>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {event.description}
                </p>

                {event.tags && event.tags.length > 0 && (
                  <div className="mt-8">
                    <h3 className="font-headline text-xl font-semibold mb-4 border-b pb-2">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                        {event.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                    </div>
                  </div>
                )}

                <div className="mt-8">
                   <h3 className="font-headline text-xl font-semibold mb-4">
                     Organized by
                   </h3>
                   <div className="flex items-center gap-4">
                     <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
                       <Users className="h-6 w-6 text-secondary-foreground" />
                     </div>
                     <div>
                       <p className="font-semibold">{event.organizerName}</p>
                       <Link href={`/communities/${event.organizerId}`} className="text-sm text-primary hover:underline">
                         View Community
                       </Link>
                     </div>
                   </div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="flex flex-col gap-4">
                    <TicketButton />
                    <Button size="lg" variant={eventIsSaved ? "default" : "secondary"} className="w-full" onClick={handleSaveToggle}>
                        <Bookmark className="mr-2"/>
                        {eventIsSaved ? "Event Saved" : "Save Event"}
                    </Button>
                    <Button size="lg" variant="outline" className="w-full" onClick={handleShare}>
                        <Share2 className="mr-2"/>
                        Share Event
                    </Button>
                </div>
                 <Card>
                  <CardContent className="p-4 space-y-4">
                     <div className="flex items-start gap-4">
                      <Calendar className="h-5 w-5 mt-1 text-primary flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold">Date and time</h4>
                        {eventStartDate && <p className="text-muted-foreground text-sm">{format(eventStartDate, 'eeee, LLLL d, yyyy')}</p>}
                        {eventStartDate && eventEndDate && <p className="text-muted-foreground text-sm">{format(eventStartDate, 'p')} - {format(eventEndDate, 'p')}</p>}
                      </div>
                    </div>
                     <div className="flex items-start gap-4">
                      <Clock className="h-5 w-5 mt-1 text-primary flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold">Duration</h4>
                        <p className="text-muted-foreground text-sm">{duration}</p>
                      </div>
                    </div>
                     <div className="flex items-start gap-4">
                      <MapPin className="h-5 w-5 mt-1 text-primary flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold">Location</h4>
                        <p className="text-muted-foreground text-sm">{event.location.venueName}</p>
                         <p className="text-muted-foreground text-sm">{event.location.address}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                 <div className="relative h-48 w-full rounded-lg overflow-hidden">
                    <Image
                      src="https://images.unsplash.com/photo-1593343882210-5321b18c6742?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxzdHJlZXQlMjBtYXAlMjBvZiUyMGElMjBjaXR5fGVufDB8fHx8MTc1NDE5NzQzNnww&ixlib=rb-4.1.0&q=80&w=1080"
                      alt="Map"
                      fill
                      className="object-cover"
                      data-ai-hint="city map"
                    />
                 </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

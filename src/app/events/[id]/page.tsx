

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
import { formatDistanceToNow } from 'date-fns';
import { useState, useEffect } from 'react';


export default function EventDetailPage() {
  const params = useParams();
  const { getEventById } = useEvents();
  const id = typeof params.id === 'string' ? params.id : '';
  const event = getEventById(id);

  const { toast } = useToast();
  const { user, saveEvent, unsaveEvent, isEventSaved } = useAuth();
  const router = useRouter();
  const [postedAt, setPostedAt] = useState('');

  useEffect(() => {
    if (event?.postedAt) {
      setPostedAt(formatDistanceToNow(new Date(event.postedAt), { addSuffix: true }));
    }
  }, [event?.postedAt]);
  
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
                {event.category}
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
                    <span>Posted {postedAt}</span>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {event.description}
                </p>
                <div className="mt-8">
                   <h3 className="font-headline text-xl font-semibold mb-4">
                     Organized by
                   </h3>
                   <div className="flex items-center gap-4">
                     <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
                       <Users className="h-6 w-6 text-secondary-foreground" />
                     </div>
                     <div>
                       <p className="font-semibold">{event.organizer}</p>
                       <Link href="/organizations" className="text-sm text-primary hover:underline">
                         View Organization
                       </Link>
                     </div>
                   </div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="flex flex-col gap-4">
                    <Button size="lg" className="w-full">
                        <Ticket className="mr-2"/>
                        Register / Get Tickets
                    </Button>
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
                        <p className="text-muted-foreground text-sm">{event.date}</p>
                        <p className="text-muted-foreground text-sm">{event.time}</p>
                      </div>
                    </div>
                     <div className="flex items-start gap-4">
                      <Clock className="h-5 w-5 mt-1 text-primary flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold">Duration</h4>
                        <p className="text-muted-foreground text-sm">{event.duration}</p>
                      </div>
                    </div>
                     <div className="flex items-start gap-4">
                      <MapPin className="h-5 w-5 mt-1 text-primary flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold">Location</h4>
                        <p className="text-muted-foreground text-sm">{event.location}</p>
                         <p className="text-muted-foreground text-sm">{event.address}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                 <div className="relative h-48 w-full rounded-lg overflow-hidden">
                    <Image
                      src="https://images.unsplash.com/photo-1730317195705-8a265a59ed1b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw4fHxjaXR5JTIwbWFwfGVufDB8fHx8MTc1NDA0MjYwNHww&ixlib=rb-4.1.0&q=80&w=1080"
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


'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, MapPin, Search, Ticket, PlusCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { useEvents } from "@/hooks/use-events";
import { useMemo, useState } from "react";
import { format } from 'date-fns';

export default function EventsPage() {
  const { events } = useEvents();
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [category, setCategory] = useState('all');

  const eventCategories = useMemo(() => {
    const categories = new Set(events.filter(e => e.status === 'Approved').map(event => event.eventType));
    return ['all', ...Array.from(categories)];
  }, [events]);

  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      if (event.status !== 'Approved') return false;

      const matchesSearch =
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.organizerName.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesLocation = 
        event.location.venueName.toLowerCase().includes(locationQuery.toLowerCase()) ||
        event.location.address.toLowerCase().includes(locationQuery.toLowerCase());

      const matchesCategory = category === 'all' || event.eventType === category;

      return matchesSearch && matchesLocation && matchesCategory;
    });
  }, [events, searchQuery, locationQuery, category]);

  return (
    <div className="flex flex-col">
      <section className="bg-gradient-to-b from-primary/10 via-background to-background py-20 text-center">
        <div className="container mx-auto px-4">
          <h1 className="font-headline text-4xl font-bold text-shadow-lg md:text-6xl">
            What's On
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Explore cultural, professional, and community events happening near you.
          </p>
           <Button size="lg" className="mt-8" asChild>
              <Link href="/events/new">
                <PlusCircle className="mr-2 h-5 w-5" />
                Post an Event
              </Link>
            </Button>
        </div>
      </section>

      <div className="sticky top-[65px] z-30 border-y bg-background/80 py-4 backdrop-blur-md">
        <div className="container mx-auto px-4">
          <Card>
            <CardContent className="p-4">
               <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
                <div className="relative lg:col-span-2">
                  <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search event, organizer..."
                    className="pl-10 text-base"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                 <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Location"
                    className="pl-10 text-base"
                    value={locationQuery}
                    onChange={(e) => setLocationQuery(e.target.value)}
                  />
                </div>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="text-base">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    {eventCategories.map((cat, index) => (
                      <SelectItem key={index} value={cat}>
                        {cat === 'all' ? 'All Categories' : cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.length > 0 ? filteredEvents.map((event) => (
            <Card key={event.id} className="group flex flex-col overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg">
               <Link href={`/events/${event.id}`} className="flex h-full flex-col">
                <div className="relative h-48 w-full">
                  <Image
                    src={event.imageUrl}
                    alt={event.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                    data-ai-hint={event.aiHint}
                  />
                    <Badge variant="secondary" className="absolute top-2 right-2">{event.eventType}</Badge>
                </div>
                <CardContent className="flex flex-grow flex-col p-6">
                  <h3 className="font-headline flex-grow text-xl font-bold group-hover:text-primary">{event.title}</h3>
                  <div className="mt-4 flex flex-col space-y-2 text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{format(new Date(event.startDateTime), 'eee, MMM d, p')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{event.location.venueName}</span>
                      </div>
                  </div>
                    <Button variant="outline" className="mt-6 w-full">
                      <Ticket className="mr-2 h-4 w-4" />
                      View Event
                    </Button>
                </CardContent>
              </Link>
            </Card>
          )) : (
             <div className="rounded-lg border-2 border-dashed py-12 text-center md:col-span-2 lg:col-span-3">
                <p className="text-muted-foreground">No events found. Please check back later!</p>
                <Button variant="link" onClick={() => {
                    setSearchQuery('');
                    setLocationQuery('');
                    setCategory('all');
                }}>Clear Filters</Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

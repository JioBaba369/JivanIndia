
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
import { Calendar, MapPin, Search, Ticket, PlusCircle, LayoutGrid, List } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { useEvents } from "@/hooks/use-events";
import { useMemo, useState, useEffect } from "react";
import { format } from 'date-fns';
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";

export default function EventsPage() {
  const { events } = useEvents();
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('q') || '';
  
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [locationQuery, setLocationQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [view, setView] = useState<'grid' | 'list'>('grid');

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
               <div className="flex flex-col gap-4 md:flex-row">
                 <div className="grid flex-grow grid-cols-1 gap-4 lg:grid-cols-3">
                    <div className="relative lg:col-span-1">
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
                 <div className="flex items-center gap-2">
                    <Button variant={view === 'grid' ? 'default' : 'outline'} size="icon" onClick={() => setView('grid')}>
                        <LayoutGrid />
                    </Button>
                    <Button variant={view === 'list' ? 'default' : 'outline'} size="icon" onClick={() => setView('list')}>
                        <List />
                    </Button>
                 </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <section className="container mx-auto px-4 py-12">
        {filteredEvents.length > 0 ? (
           <div className={cn(
             "gap-8",
             view === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                : 'flex flex-col'
           )}>
            {filteredEvents.map((event) => {
              const formattedDate = format(new Date(event.startDateTime), 'eee, MMM d, p');
              return view === 'grid' ? (
                 <Card key={event.id} className="group flex flex-col overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg">
                  <Link href={`/events/${event.id}`} className="flex h-full flex-col">
                    <div className="relative h-48 w-full">
                      <Image
                        src={event.imageUrl}
                        alt={event.title}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                        <Badge variant="secondary" className="absolute top-2 right-2">{event.eventType}</Badge>
                    </div>
                    <CardContent className="flex flex-grow flex-col p-6">
                      <h3 className="font-headline flex-grow text-xl font-bold group-hover:text-primary">{event.title}</h3>
                      <div className="mt-4 flex flex-col space-y-2 text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>{formattedDate}</span>
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
              ) : (
                 <Card key={event.id} className="group w-full overflow-hidden border transition-all hover:shadow-lg">
                  <Link href={`/events/${event.id}`}>
                    <div className="flex flex-col sm:flex-row">
                      <div className="relative h-48 w-full sm:h-auto sm:w-64 flex-shrink-0">
                        <Image
                          src={event.imageUrl}
                          alt={event.title}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                        />
                         <Badge variant="secondary" className="absolute top-2 right-2 sm:hidden">{event.eventType}</Badge>
                      </div>
                      <CardContent className="flex flex-grow flex-col justify-center p-6">
                         <Badge variant="secondary" className="hidden sm:inline-flex w-fit">{event.eventType}</Badge>
                         <h3 className="font-headline mt-2 text-xl font-bold group-hover:text-primary">{event.title}</h3>
                         <div className="mt-2 flex flex-col space-y-1 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                <span>{formattedDate}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                <span>{event.location.venueName}</span>
                            </div>
                         </div>
                         <p className="text-sm mt-2 text-muted-foreground line-clamp-2">{event.organizerName}</p>
                      </CardContent>
                       <div className="flex items-center p-6 border-t sm:border-t-0 sm:border-l">
                        <Button variant="outline" className="w-full sm:w-auto">
                            <Ticket className="mr-2 h-4 w-4" />
                            View Event
                        </Button>
                      </div>
                    </div>
                  </Link>
                </Card>
              )
            })}
           </div>
        ) : (
             <div className="rounded-lg border-2 border-dashed py-12 text-center md:col-span-2 lg:col-span-3">
                <p className="text-muted-foreground">No events found. Please check back later!</p>
                <Button variant="link" onClick={() => {
                    setSearchQuery('');
                    setLocationQuery('');
                    setCategory('all');
                }}>Clear Filters</Button>
            </div>
          )}
      </section>
    </div>
  );
}


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
import { Calendar, MapPin, Search, Ticket, PlusCircle, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { useEvents } from "@/hooks/use-events";
import { useMemo, useState, useEffect } from "react";
import { format } from 'date-fns';
import { useSearchParams } from "next/navigation";

export default function EventsPage() {
  const { events } = useEvents();
  const searchParams = useSearchParams();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [category, setCategory] = useState('all');

  useEffect(() => {
    setSearchQuery(searchParams.get('q') || '');
  }, [searchParams]);

  const eventCategories = ['all', ...Array.from(new Set(events.filter(e => e.status === 'Approved').map(event => event.eventType)))];

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
    <div className="container mx-auto py-12">
        <div className="space-y-4 mb-8">
            <h1 className="font-headline text-4xl font-bold">Upcoming Events</h1>
            <p className="text-lg text-muted-foreground">Discover cultural celebrations, professional meetups, concerts, and more.</p>
        </div>
        <Card className="p-4 shadow-md mb-8">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                 <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                    placeholder="Search Events..."
                    className="pl-10 text-base md:text-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                 <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                    placeholder="Location (e.g. San Jose)"
                    className="pl-10 text-base md:text-sm"
                    value={locationQuery}
                    onChange={(e) => setLocationQuery(e.target.value)}
                    />
                </div>
                <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
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
                <Button className="w-full">
                    <Search className="mr-2 h-4 w-4" />
                    Apply Filters
                </Button>
            </div>
        </Card>
        
        {filteredEvents.length > 0 ? (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
            {filteredEvents.map((event) => {
              const formattedDate = format(new Date(event.startDateTime), 'PPp');
              return (
                 <Card key={event.id} className="group flex flex-col overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl">
                    <CardContent className="p-0">
                        <div className="relative h-48 w-full">
                            <Image
                            src={event.imageUrl}
                            alt={event.title}
                            fill
                            className="object-cover"
                            sizes="100vw"
                            data-ai-hint="event photo"
                            />
                            <Badge className="absolute right-3 top-3 bg-primary/80 backdrop-blur-sm">{event.eventType}</Badge>
                        </div>
                    </CardContent>
                    <CardContent className="flex-grow p-4">
                        <h3 className="mb-2 font-headline text-xl">
                            <Link href={`/events/${event.id}`} className="hover:text-primary transition-colors">{event.title}</Link>
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>
                        <div className="mt-4 space-y-2">
                            <div className="flex items-center text-sm text-muted-foreground">
                                <Calendar className="mr-2 h-4 w-4 text-primary"/>
                                <span>{formattedDate}</span>
                            </div>
                             <div className="flex items-center text-sm text-muted-foreground">
                                <MapPin className="mr-2 h-4 w-4 text-primary"/>
                                <span>{event.location.venueName}</span>
                            </div>
                        </div>
                    </CardContent>
                    <div className="flex items-center p-4 pt-0">
                        <Button asChild variant="link" className="p-0 h-auto">
                            <Link href={`/events/${event.id}`}>
                            View Details <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                </Card>
              ) 
            })}
           </div>
        ) : (
             <div className="rounded-lg border-2 border-dashed py-16 text-center">
                <h3 className="font-headline text-xl font-semibold">No Events Found</h3>
                <p className="text-muted-foreground mt-2">No events match your criteria. Try adjusting your search or check back later.</p>
                <Button variant="link" onClick={() => {
                    setSearchQuery('');
                    setLocationQuery('');
                    setCategory('all');
                }}>Clear Filters</Button>
            </div>
          )}
    </div>
  );
}

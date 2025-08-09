
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
import { Calendar, MapPin, Search, PlusCircle, ArrowRight, Megaphone, Star, MoreVertical, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { useEvents } from "@/hooks/use-events";
import { useMemo, useState, useEffect } from "react";
import { format } from 'date-fns';
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import ReportDialog from "@/components/feature/report-dialog";
import { Skeleton } from "@/components/ui/skeleton";

export default function EventsPage() {
  const { events, isLoading } = useEvents();
  const { user } = useAuth();
  const searchParams = useSearchParams();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [category, setCategory] = useState('all');

  useEffect(() => {
    setSearchQuery(searchParams.get('q') || '');
  }, [searchParams]);

  const approvedEvents = useMemo(() => events.filter(e => e.status === 'Approved'), [events]);
  const eventCategories = ['all', ...Array.from(new Set(approvedEvents.map(event => event.eventType)))];

  const filteredEvents = useMemo(() => {
    return approvedEvents
    .filter(event => {
      const matchesSearch =
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.organizerName.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesLocation = 
        event.location.venueName.toLowerCase().includes(locationQuery.toLowerCase()) ||
        event.location.address.toLowerCase().includes(locationQuery.toLowerCase());

      const matchesCategory = category === 'all' || event.eventType === category;

      return matchesSearch && matchesLocation && matchesCategory;
    })
    .sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
  }, [approvedEvents, searchQuery, locationQuery, category]);

  const EventSkeletons = () => (
    Array.from({ length: 6 }).map((_, i) => (
      <Card key={i} className="flex flex-col overflow-hidden">
        <Skeleton className="h-48 w-full" />
        <CardContent className="flex flex-grow flex-col p-4">
          <Skeleton className="h-4 w-1/3 mb-2" />
          <Skeleton className="h-6 w-full mb-4" />
          <Skeleton className="h-4 w-full mb-2" />
           <div className="mt-4 space-y-3 flex-grow">
             <Skeleton className="h-4 w-5/6" />
             <Skeleton className="h-4 w-4/6" />
          </div>
          <div className="mt-4">
            <Skeleton className="h-8 w-24" />
          </div>
        </CardContent>
      </Card>
    ))
  );

  return (
    <div className="container mx-auto py-12">
        <div className="space-y-4 mb-8">
            <h1 className="font-headline text-4xl font-bold">Upcoming Events</h1>
            <p className="text-lg text-muted-foreground">Discover cultural celebrations, professional meetups, concerts, and more.</p>
        </div>
        <Card className="p-4 shadow-md mb-8" style={{backgroundColor: '#FFE00C'}}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                 <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                    placeholder="Search Events..."
                    className="pl-10 text-base md:text-sm text-foreground"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                 <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                    placeholder="Location (e.g. San Jose)"
                    className="pl-10 text-base md:text-sm text-foreground"
                    value={locationQuery}
                    onChange={(e) => setLocationQuery(e.target.value)}
                    />
                </div>
                <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="text-foreground">
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
                 {user?.affiliation && (
                    <Button asChild>
                        <Link href="/events/new">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Post an Event
                        </Link>
                    </Button>
                )}
            </div>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
        {isLoading ? (
            <EventSkeletons />
        ) : approvedEvents.length === 0 ? (
            <div className="rounded-lg border-2 border-dashed py-16 text-center col-span-full">
                <Megaphone className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="font-headline text-xl font-semibold mt-4">No Events Yet</h3>
                <p className="text-muted-foreground mt-2">No upcoming events have been posted. Be the first to share one!</p>
                <Button asChild className="mt-4">
                    <Link href="/events/new">Post an Event</Link>
                </Button>
            </div>
        ) : filteredEvents.length > 0 ? (
            filteredEvents.map((event) => {
              const formattedDate = format(new Date(event.startDateTime), 'PPp');
              return (
                 <Card key={event.id} className={cn("group flex flex-col overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl", event.isFeatured && "border-primary border-2")}>
                      <div className="relative h-48 w-full">
                          <Link href={`/events/${event.id}`}>
                            <Image
                            src={event.imageUrl}
                            alt={event.title}
                            fill
                            className="object-cover"
                            sizes="100vw"
                            data-ai-hint="event photo"
                            />
                          </Link>
                          {event.isFeatured && <Badge className="absolute left-3 top-3"><Star className="mr-1 h-3 w-3" />Featured</Badge>}
                          <div className="absolute top-2 right-2">
                             <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 bg-black/20 hover:bg-black/40 text-white hover:text-white">
                                        <MoreVertical size={20} />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <ReportDialog 
                                        contentId={event.id} 
                                        contentType="Event" 
                                        contentTitle={event.title} 
                                        triggerComponent={<DropdownMenuItem onSelect={(e) => e.preventDefault()}>Report</DropdownMenuItem>}
                                    />
                                </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                      </div>
                      <CardContent className="flex-grow p-4">
                        <Link href={`/events/${event.id}`} className="group/link flex-grow flex flex-col">
                          <Badge variant="secondary" className="w-fit">{event.eventType}</Badge>
                          <h3 className="mb-2 mt-2 font-headline text-xl group-hover/link:text-primary transition-colors flex-grow">{event.title}</h3>
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
                        </Link>
                      </CardContent>
                      <div className="flex items-center p-4 pt-0 mt-auto">
                          <Button asChild variant="link" className="p-0 h-auto">
                              <Link href={`/events/${event.id}`}>
                              View Details <ArrowRight className="ml-2 h-4 w-4" />
                              </Link>
                          </Button>
                      </div>
                </Card>
              ) 
            })
        ) : (
             <div className="rounded-lg border-2 border-dashed py-16 text-center col-span-full">
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
    </div>
  );
}

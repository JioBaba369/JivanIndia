
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar as CalendarIcon, MapPin, Search, PlusCircle, ArrowRight, Megaphone, Star, MoreVertical, LayoutGrid, List } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { useEvents, type Event } from "@/hooks/use-events";
import { useMemo, useState, useEffect } from "react";
import { format, isSameDay } from 'date-fns';
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import ReportDialog from "@/components/feature/report-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar } from "@/components/ui/calendar";

export default function EventsPage() {
  const { events, isLoading } = useEvents();
  const { user } = useAuth();
  const searchParams = useSearchParams();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [view, setView] = useState<'calendar' | 'list'>('calendar');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
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
      
      const matchesDate = !selectedDate || isSameDay(new Date(event.startDateTime), selectedDate);

      return matchesSearch && matchesLocation && matchesCategory && (view === 'list' || matchesDate);
    })
    .sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
  }, [approvedEvents, searchQuery, locationQuery, category, selectedDate, view]);

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
  
  const eventsByDay = useMemo(() => {
    const eventMap = new Map<string, Event[]>();
    approvedEvents.forEach(event => {
      const day = format(new Date(event.startDateTime), 'yyyy-MM-dd');
      if (!eventMap.has(day)) {
        eventMap.set(day, []);
      }
      eventMap.get(day)?.push(event);
    });
    return eventMap;
  }, [approvedEvents]);


  return (
    <div className="container mx-auto py-12">
        <div className="space-y-4 mb-8">
            <h1 className="font-headline text-4xl font-bold">What's On</h1>
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
                 <div className="flex items-center gap-2">
                    <Button variant={view === 'calendar' ? 'default' : 'outline'} onClick={() => setView('calendar')} className="flex-1">
                      <CalendarIcon className="mr-2 h-4 w-4" /> Calendar
                    </Button>
                    <Button variant={view === 'list' ? 'default' : 'outline'} onClick={() => setView('list')} className="flex-1">
                      <List className="mr-2 h-4 w-4" /> List
                    </Button>
                  </div>
            </div>
        </Card>
        
        {view === 'calendar' ? (
          <Card>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="p-0"
              classNames={{
                months: "flex flex-col sm:flex-row",
                month: "space-y-4 p-3",
                caption_label: 'text-xl',
                table: 'w-full border-collapse',
                head_cell: 'w-full text-muted-foreground rounded-md font-normal text-sm',
                cell: 'w-full text-center text-sm p-0 relative first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20',
                day: 'h-24 w-full p-1 rounded-md hover:bg-accent hover:text-accent-foreground',
                day_selected: 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
              }}
              components={{
                DayContent: ({ date }) => {
                  const dayKey = format(date, 'yyyy-MM-dd');
                  const dayEvents = eventsByDay.get(dayKey) || [];
                  return (
                    <div className="flex flex-col h-full w-full items-start p-1">
                      <time dateTime={date.toISOString()}>{date.getDate()}</time>
                      {dayEvents.length > 0 && 
                        <div className="flex flex-col items-start w-full mt-1 overflow-hidden">
                          {dayEvents.slice(0, 2).map(e => (
                             <div key={e.id} className="text-xs truncate rounded-sm px-1 bg-primary/20 text-primary-foreground w-full text-left">{e.title}</div>
                          ))}
                          {dayEvents.length > 2 && <div className="text-xs text-muted-foreground">+{dayEvents.length-2} more</div>}
                        </div>
                      }
                    </div>
                  );
                },
              }}
            />
             <div className="p-4 border-t">
              <h3 className="font-headline text-lg mb-2">Events on {selectedDate ? format(selectedDate, 'PPP') : '...'}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {isLoading ? <EventSkeletons /> : filteredEvents.length > 0 ? filteredEvents.map(event => {
                  const formattedDate = format(new Date(event.startDateTime), 'p');
                  return (
                     <Card key={event.id} className={cn("group flex flex-col overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl", event.isFeatured && "border-primary")}>
                         <Link href={`/events/${event.id}`} className="group/link flex flex-col h-full">
                           <div className="relative h-32 w-full"><Image src={event.imageUrl} alt={event.title} fill className="object-cover" data-ai-hint="event photo"/></div>
                           <CardContent className="p-4 flex flex-col flex-grow">
                             <Badge variant="secondary" className="w-fit">{event.eventType}</Badge>
                             <h3 className="mt-2 font-semibold group-hover/link:text-primary flex-grow">{event.title}</h3>
                             <div className="mt-2 text-sm text-muted-foreground">{formattedDate} @ {event.location.venueName}</div>
                           </CardContent>
                         </Link>
                    </Card>
                  )
                }) : <p className="text-muted-foreground col-span-full">No events found for this day.</p>}
              </div>
            </div>
          </Card>
        ) : (
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
                                      <CalendarIcon className="mr-2 h-4 w-4 text-primary"/>
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
        )}
    </div>
  );
}


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
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar } from "@/components/ui/calendar";

export default function EventsCalendarPage() {
  const { events, isLoading } = useEvents();
  const { user } = useAuth();
  const searchParams = useSearchParams();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [category, setCategory] = useState('all');
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

      return matchesSearch && matchesLocation && matchesCategory && matchesDate;
    })
    .sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
  }, [approvedEvents, searchQuery, locationQuery, category, selectedDate]);

  const EventSkeletons = () => (
    Array.from({ length: 3 }).map((_, i) => (
      <Card key={i} className="flex flex-col overflow-hidden">
        <Skeleton className="h-32 w-full" />
        <CardContent className="flex flex-grow flex-col p-4">
          <Skeleton className="h-4 w-1/3 mb-2" />
          <Skeleton className="h-6 w-full mb-4 flex-grow" />
          <Skeleton className="h-4 w-5/6" />
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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
                <h1 className="font-headline text-4xl font-bold">Event Calendar</h1>
                <p className="text-lg text-muted-foreground">Browse events in a calendar view. Click a date to see what's on.</p>
            </div>
            <Button asChild>
                <Link href="/events">
                    <List className="mr-2 h-4 w-4" />
                    Switch to List View
                </Link>
            </Button>
        </div>
        
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
    </div>
  );
}

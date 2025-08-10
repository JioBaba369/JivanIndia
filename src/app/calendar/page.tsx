
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar as CalendarIcon, MapPin, Search, List, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { useEvents, type Event } from "@/hooks/use-events";
import { useMemo, useState, useEffect } from "react";
import { format, isSameDay } from 'date-fns';
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar } from "@/components/ui/calendar";

export default function EventsCalendarPage() {
  const { events, isLoading } = useEvents();
  
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  const approvedEvents = useMemo(() => events.filter(e => e.status === 'Approved'), [events]);
  
  const eventsByDay = useMemo(() => {
    const eventMap = new Map<string, Event[]>();
    approvedEvents.forEach(event => {
      try {
        const day = format(new Date(event.startDateTime), 'yyyy-MM-dd');
        if (!eventMap.has(day)) {
          eventMap.set(day, []);
        }
        eventMap.get(day)?.push(event);
      } catch (e) {
        console.error("Invalid event date", event.title, event.startDateTime);
      }
    });
    return eventMap;
  }, [approvedEvents]);

  const selectedDayEvents = useMemo(() => {
    if (!selectedDate) return [];
    const dayKey = format(selectedDate, 'yyyy-MM-dd');
    return eventsByDay.get(dayKey) || [];
  }, [selectedDate, eventsByDay]);

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
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
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
                  head_cell: 'w-full text-muted-foreground rounded-md font-normal text-[0.8rem]',
                  cell: 'h-28 w-full text-left align-top p-0 relative focus-within:relative focus-within:z-20',
                  day: 'h-full w-full p-2 rounded-md hover:bg-accent hover:text-accent-foreground font-semibold',
                  day_selected: 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
                }}
                components={{
                  DayContent: ({ date }) => {
                    const dayKey = format(date, 'yyyy-MM-dd');
                    const dayEvents = eventsByDay.get(dayKey) || [];
                    return (
                      <div className="flex flex-col h-full w-full items-start overflow-hidden">
                        <time dateTime={date.toISOString()}>{date.getDate()}</time>
                        {dayEvents.length > 0 && 
                          <div className="flex flex-col items-start w-full mt-1 overflow-hidden space-y-1">
                            {dayEvents.slice(0, 2).map(e => (
                               <div key={e.id} className="text-xs truncate rounded-sm px-1 bg-secondary text-secondary-foreground w-full text-left flex items-center gap-1.5">
                                <div className="h-1.5 w-1.5 rounded-full bg-current" />
                                {e.title}
                               </div>
                            ))}
                            {dayEvents.length > 2 && <div className="text-xs text-muted-foreground pl-1">+{dayEvents.length-2} more</div>}
                          </div>
                        }
                      </div>
                    );
                  },
                }}
              />
            </Card>
          </div>

          <div className="lg:col-span-1">
            <h3 className="font-headline text-2xl mb-4">Events on {selectedDate ? format(selectedDate, 'PPP') : '...'}</h3>
            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
              {isLoading ? <EventSkeletons /> : selectedDayEvents.length > 0 ? selectedDayEvents.map(event => {
                const formattedTime = format(new Date(event.startDateTime), 'p');
                return (
                    <Card key={event.id} className="group overflow-hidden transition-all duration-300 hover:shadow-lg">
                        <Link href={`/events/${event.id}`} className="group/link flex">
                          <div className="w-24 flex-shrink-0 relative">
                             <Image src={event.imageUrl} alt={event.title} fill className="object-cover" data-ai-hint="event photo"/>
                          </div>
                          <CardContent className="p-3 flex flex-col flex-grow">
                            <h3 className="font-semibold group-hover/link:text-primary text-sm line-clamp-2 leading-tight flex-grow">{event.title}</h3>
                            <div className="mt-2 text-xs text-muted-foreground flex items-center gap-2">
                                <CalendarIcon className="h-3 w-3" />
                                <span>{formattedTime}</span>
                            </div>
                          </CardContent>
                        </Link>
                   </Card>
                )
              }) : <p className="text-muted-foreground text-center py-10">No events for this day.</p>}
            </div>
          </div>
        </div>
    </div>
  );
}

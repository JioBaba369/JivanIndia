
'use client';

import 'react-big-calendar/lib/css/react-big-calendar.css';
import './react-big-calendar.css';

import { Calendar as BigCalendar, dateFnsLocalizer, type Event as BigCalendarEvent } from 'react-big-calendar';
import { format as formatDate, parse, startOfWeek, getDay, isValid } from 'date-fns';
import enUS from 'date-fns/locale/en-US';
import { useEvents } from '@/hooks/use-events';
import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { type Event } from '@/hooks/use-events';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';


const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format: formatDate,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const eventTypeColors: Record<Event['eventType'], string> = {
  Cultural: 'hsl(var(--chart-1))',
  Religious: 'hsl(var(--chart-2))',
  Professional: 'hsl(var(--chart-3))',
  Sports: 'hsl(var(--chart-4))',
  Festival: 'hsl(var(--chart-5))',
  Workshop: 'hsl(var(--primary))',
  Food: 'hsl(20, 90%, 55%)',
  Other: 'hsl(var(--muted-foreground))',
};

const eventTypeColorsDark: Record<Event['eventType'], string> = {
  Cultural: 'hsl(var(--chart-1) / 0.8)',
  Religious: 'hsl(var(--chart-2) / 0.8)',
  Professional: 'hsl(var(--chart-3) / 0.8)',
  Sports: 'hsl(var(--chart-4) / 0.8)',
  Festival: 'hsl(var(--chart-5) / 0.8)',
  Workshop: 'hsl(var(--primary) / 0.8)',
  Food: 'hsl(20, 80%, 45%)',
  Other: 'hsl(var(--muted-foreground) / 0.8)',
};

export default function EventsCalendarPage() {
  const { events, isLoading, error } = useEvents();
  const router = useRouter();

  const calendarEvents: BigCalendarEvent[] = useMemo(() => {
    return (events || [])
      .filter(event => event.status === 'Approved')
      .map(event => ({
        title: event.title,
        start: new Date(event.startDateTime),
        end: new Date(event.endDateTime),
        resource: event,
      }))
      .filter(event => isValid(event.start) && isValid(event.end));
  }, [events]);

  const eventStyleGetter = (event: BigCalendarEvent) => {
    const eventType = (event.resource as Event)?.eventType || 'Other';
    const backgroundColor = eventTypeColors[eventType];
    const darkBackgroundColor = eventTypeColorsDark[eventType];
    
    const style = {
      '--event-color': backgroundColor,
      '--event-color-dark': darkBackgroundColor,
      '--event-color-foreground': '#fff',
    } as React.CSSProperties;

    return { style };
  };

  if (isLoading) {
    return (
        <div className="container mx-auto py-12 min-h-screen">
             <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
                <Skeleton className="h-9 w-48" />
                <Skeleton className="h-9 w-64" />
             </div>
             <Skeleton className="rounded-lg border bg-card p-4 h-[80vh]" />
        </div>
    )
  }
  
  if (error) {
     return <div className="container mx-auto py-12 text-center text-destructive">Error loading events. Please try again.</div>
  }

  return (
    <div className="container mx-auto py-12 min-h-screen">
      <BigCalendar
        localizer={localizer}
        events={calendarEvents}
        startAccessor="start"
        endAccessor="end"
        onSelectEvent={event => router.push(`/events/${(event.resource as Event).id}`)}
        eventPropGetter={eventStyleGetter}
        popup
      />
    </div>
  );
}

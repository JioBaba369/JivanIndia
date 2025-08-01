

'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface Event {
  id: string;
  title: string;
  category: string;
  date: string;
  time: string;
  location: string;
  address: string;
  imageUrl: string;
  aiHint: string;
  description: string;
  organizer: string;
  organizerId: string;
  postedAt: string; // ISO 8601 date string
  duration: string;
}

interface EventsContextType {
  events: Event[];
  addEvent: (event: Omit<Event, 'id' | 'postedAt'>) => void;
  getEventById: (id: string) => Event | undefined;
  // In a real app, you'd also have updateEvent and deleteEvent
}

const EventsContext = createContext<EventsContextType | undefined>(undefined);

const initialEvents: Event[] = [
  {
    id: "1",
    title: "Diwali Festival of Lights",
    category: "Festival",
    date: "Sat, Nov 4, 7:00 PM",
    time: "7:00 PM - 11:00 PM PST",
    location: "Grand Park, Downtown LA",
    address: "200 N Grand Ave, Los Angeles, CA 90012",
    imageUrl: "https://images.unsplash.com/photo-1600813633279-997f77a83777?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxkaXdhbGklMjBmZXN0aXZhbHxlbnwwfHx8fDE3NTQxOTc0MzZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    aiHint: "diwali festival",
    description: "Experience the magic of Diwali at the annual Festival of Lights. This family-friendly event will feature traditional music, dance performances, delicious Indian food from local vendors, and a spectacular fireworks display to conclude the evening. Come and celebrate the victory of light over darkness with the community.",
    organizer: "India Cultural Center",
    organizerId: "1",
    postedAt: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(),
    duration: "4 hours",
  },
  {
    id: "2",
    title: "Bollywood Dance Workshop",
    category: "Workshop",
    date: "Sun, Nov 5, 2:00 PM",
    time: "2:00 PM - 4:00 PM PST",
    location: "Mumbai Dance Studio",
    address: "456 Dance Blvd, Artesia, CA 90701",
    imageUrl: "https://images.unsplash.com/photo-1511210100424-03d3623f0010?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxib2xseXdvb2QlMjBkYW5jZXxlbnwwfHx8fDE3NTQxOTc0MzZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    aiHint: "bollywood dance",
     description: "Learn the latest Bollywood moves in this energetic and fun workshop, open to all skill levels. Get ready to dance your heart out to popular tracks.",
    organizer: "Mumbai Dance Studio",
    organizerId: "2", // Assuming an org with this ID exists
    postedAt: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(),
    duration: "2 hours",
  },
  {
    id: "3",
    title: "Indian Food Fair",
    category: "Food",
    date: "Sat, Nov 11, 12:00 PM",
    time: "12:00 PM - 8:00 PM PST",
    location: "Exhibition Center",
    address: "789 Food St, Anaheim, CA 92802",
    imageUrl: "https://images.unsplash.com/photo-1589301760014-d929f39791e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxJbmRpYW4lMjBmb29kfGVufDB8fHx8fDE3NTQxOTc0MzZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    aiHint: "indian food",
    description: "A gastronomic journey through India! Sample a wide variety of regional dishes from dozens of local restaurants and home chefs.",
    organizer: "Community Events Co.",
    organizerId: "3", // Assuming an org with this ID exists
    postedAt: new Date(new Date().setDate(new Date().getDate() - 10)).toISOString(),
    duration: "8 hours",
  },
];

const STORAGE_KEY = 'jivanindia_events';

export function EventsProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    try {
      const storedEvents = localStorage.getItem(STORAGE_KEY);
      if (storedEvents) {
        setEvents(JSON.parse(storedEvents));
      } else {
        // If no events in storage, initialize with mock data
        setEvents(initialEvents);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialEvents));
      }
    } catch (error) {
      console.error("Failed to access localStorage", error);
      setEvents(initialEvents);
    }
  }, []);

  const addEvent = (event: Omit<Event, 'id' | 'postedAt'>) => {
    const newEvent: Event = {
      ...event,
      id: new Date().getTime().toString(),
      postedAt: new Date().toISOString(),
    };
    const newEvents = [...events, newEvent];
    setEvents(newEvents);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newEvents));
    } catch (error) {
      console.error("Failed to save events to localStorage", error);
    }
  };

  const getEventById = (id: string) => {
    return events.find(event => event.id === id);
  };

  const value = {
    events,
    addEvent,
    getEventById,
  };

  return (
    <EventsContext.Provider value={value}>
      {children}
    </EventsContext.Provider>
  );
}

export function useEvents() {
  const context = useContext(EventsContext);
  if (context === undefined) {
    throw new Error('useEvents must be used within an EventsProvider');
  }
  return context;
}

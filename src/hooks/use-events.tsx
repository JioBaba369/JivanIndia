
'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { communities } from '@/app/communities/page';

export interface Event {
  id: string;
  title: string;
  description: string;
  tags?: string[];
  location: {
    venueName: string;
    address: string;
    coordinates?: { lat: number; lng: number };
  };
  timezone?: string;
  startDateTime: string; // ISO 8601
  endDateTime: string; // ISO 8601
  country?: string;
  city?: string;
  stateProvince?: string;
  originFocus?: string;
  eventType: 'Cultural' | 'Religious' | 'Professional' | 'Sports' | 'Festival' | 'Workshop' | 'Food' | 'Other';
  isFree?: boolean;
  ticketLink?: string;
  price?: number;
  imageUrl: string;
  aiHint: string;
  organizerId: string;
  organizerName: string;
  status: 'Pending' | 'Approved' | 'Archived';
  submittedByUid?: string;
  attendeeCount?: number;
  createdAt: string; // ISO 8601
  updatedAt?: string; // ISO 8601
}


interface EventsContextType {
  events: Event[];
  addEvent: (event: Omit<Event, 'id' | 'createdAt' | 'status'>, affiliationId?: string) => void;
  getEventById: (id: string) => Event | undefined;
}

const EventsContext = createContext<EventsContextType | undefined>(undefined);

const initialEvents: Event[] = [
  {
    id: "1",
    title: "Diwali Festival of Lights",
    eventType: "Festival",
    startDateTime: new Date(new Date().setHours(19, 0, 0, 0)).toISOString(),
    endDateTime: new Date(new Date().setHours(23, 0, 0, 0)).toISOString(),
    location: {
      venueName: "Grand Park, Downtown LA",
      address: "200 N Grand Ave, Los Angeles, CA 90012",
    },
    imageUrl: "https://images.unsplash.com/photo-1600813633279-997f77a83777?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxkaXdhbGklMjBmZXN0aXZhbHxlbnwwfHx8fDE3NTQxOTc0MzZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    aiHint: "diwali festival",
    description: "Experience the magic of Diwali at the annual Festival of Lights. This family-friendly event will feature traditional music, dance performances, delicious Indian food from local vendors, and a spectacular fireworks display to conclude the evening. Come and celebrate the victory of light over darkness with the community.",
    organizerName: "India Cultural Center",
    organizerId: "1",
    createdAt: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(),
    tags: ["diwali", "festival", "family-friendly", "los-angeles", "free-entry"],
    status: "Approved",
    ticketLink: "https://www.eventbrite.com/e/diwali-festival-of-lights-tickets-123456789",
    submittedByUid: "user-12345" // Mock UID
  },
  {
    id: "2",
    title: "Bollywood Dance Workshop",
    eventType: "Workshop",
    startDateTime: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(),
    endDateTime: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(),
    location: {
      venueName: "Mumbai Dance Studio",
      address: "456 Dance Blvd, Artesia, CA 90701",
    },
    imageUrl: "https://images.unsplash.com/photo-1511210100424-03d3623f0010?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxib2xseXdvb2QlMjBkYW5jZXxlbnwwfHx8fDE3NTQxOTc0MzZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    aiHint: "bollywood dance",
    description: "Learn the latest Bollywood moves in this energetic and fun workshop, open to all skill levels. Get ready to dance your heart out to popular tracks.",
    organizerName: "Mumbai Dance Studio",
    organizerId: "2", // Assuming an org with this ID exists
    createdAt: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(),
    tags: ["dance", "workshop", "bollywood", "artesia"],
    status: "Approved",
    submittedByUid: "user-67890" // Mock UID
  },
  {
    id: "3",
    title: "Indian Food Fair",
    eventType: "Food",
    startDateTime: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString(),
    endDateTime: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString(),
    location: {
        venueName: "Exhibition Center",
        address: "789 Food St, Anaheim, CA 92802",
    },
    imageUrl: "https://images.unsplash.com/photo-1589301760014-d929f39791e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxJbmRpYW4lMjBmb29kfGVufDB8fHx8fDE3NTQxOTc0MzZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    aiHint: "indian food",
    description: "A gastronomic journey through India! Sample a wide variety of regional dishes from dozens of local restaurants and home chefs.",
    organizerName: "Community Events Co.",
    organizerId: "3", // Assuming an org with this ID exists
    createdAt: new Date(new Date().setDate(new Date().getDate() - 10)).toISOString(),
    tags: ["food", "festival", "anaheim", "taste-of-india"],
    status: "Approved",
    submittedByUid: "user-12345" // Mock UID
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
        setEvents(initialEvents);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialEvents));
      }
    } catch (error) {
      console.error("Failed to access localStorage", error);
      setEvents(initialEvents);
    }
  }, []);

  const addEvent = (event: Omit<Event, 'id' | 'createdAt' | 'status'>, affiliationId?: string) => {
    const affiliatedCommunity = communities.find(c => c.id === affiliationId);
    const status = affiliatedCommunity?.isVerified ? 'Approved' : 'Pending';

    const newEvent: Event = {
      ...event,
      id: new Date().getTime().toString(),
      createdAt: new Date().toISOString(),
      status: status,
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

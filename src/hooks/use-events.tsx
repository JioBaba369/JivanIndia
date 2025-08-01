
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

const initialEvents: Event[] = [];


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

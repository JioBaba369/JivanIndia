
'use client';

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { useCommunities } from '@/hooks/use-communities';

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
  organizerId: string;
  organizerName: string;
  status: 'Pending' | 'Approved' | 'Archived';
  submittedByUid?: string;
  attendeeCount?: number;
  createdAt: string; // ISO 8601
  updatedAt?: string; // ISO 8601
}

export type NewEventInput = Omit<Event, 'id' | 'createdAt' | 'status'>;

interface EventsContextType {
  events: Event[];
  addEvent: (event: NewEventInput) => void;
  getEventById: (id: string) => Event | undefined;
  updateEventStatus: (eventId: string, status: Event['status']) => void;
}

const EventsContext = createContext<EventsContextType | undefined>(undefined);

const initialEvents: Event[] = [];

const STORAGE_KEY = 'jivanindia-events';

export function EventsProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<Event[]>([]);
  const { getCommunityBySlug } = useCommunities();

  useEffect(() => {
    if (typeof window === 'undefined') {
        setEvents(initialEvents);
        return;
    }
    try {
      const storedEvents = window.localStorage.getItem(STORAGE_KEY);
      if (storedEvents) {
        setEvents(JSON.parse(storedEvents));
      } else {
        setEvents(initialEvents);
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(initialEvents));
      }
    } catch (error) {
      console.error("Failed to access localStorage for events", error);
      setEvents(initialEvents);
    }
  }, []);

  const persistEvents = (updatedEvents: Event[]) => {
    setEvents(updatedEvents);
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedEvents));
      } catch (error) {
        console.error("Failed to save events to localStorage", error);
      }
    }
  };

  const addEvent = useCallback((eventData: NewEventInput) => {
    const affiliatedCommunity = getCommunityBySlug(eventData.organizerId);
    const status = affiliatedCommunity?.isVerified ? 'Approved' : 'Pending';

    const newEvent: Event = {
      ...eventData,
      id: new Date().getTime().toString(),
      createdAt: new Date().toISOString(),
      status: status,
    };
    persistEvents([...events, newEvent]);
  }, [events, getCommunityBySlug]);


  const getEventById = useCallback((id: string) => {
    return events.find(event => event.id === id);
  }, [events]);

  const updateEventStatus = useCallback((eventId: string, status: Event['status']) => {
    const updatedEvents = events.map(event => 
      event.id === eventId ? { ...event, status, updatedAt: new Date().toISOString() } : event
    );
    persistEvents(updatedEvents);
  }, [events]);

  const value = {
    events,
    addEvent,
    getEventById,
    updateEventStatus,
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

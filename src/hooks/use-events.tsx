
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

const initialEvents: Event[] = [
    {
    id: '1',
    title: 'Annual Diwali Gala',
    description: 'Join us for a spectacular evening of lights, music, and feasting to celebrate Diwali, the festival of lights. This family-friendly event will feature traditional dance performances, a gourmet Indian buffet, and a dazzling fireworks display. It\'s a perfect opportunity to come together as a community and celebrate one of the most important festivals in Indian culture.',
    tags: ['diwali', 'festival', 'family-friendly', 'cultural', 'music', 'dance'],
    location: {
      venueName: 'Grand Ballroom, Hilton Hotel',
      address: '123 Main Street, New York, NY 10001',
    },
    startDateTime: new Date(new Date().getFullYear(), 10, 5, 18, 0).toISOString(),
    endDateTime: new Date(new Date().getFullYear(), 10, 5, 23, 0).toISOString(),
    eventType: 'Festival',
    ticketLink: '#',
    imageUrl: 'https://images.unsplash.com/photo-1604207863532-a7d56fed6e23?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxkaXdhbGklMjBmZXN0aXZhbHxlbnwwfHx8fDE3NTQxOTc0MzZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    organizerId: 'saffron-restaurant-group',
    organizerName: 'Saffron Restaurant Group',
    status: 'Approved',
    submittedByUid: 'admin-saffron-uid',
    createdAt: '2024-07-20T10:00:00Z',
  },
  {
    id: '2',
    title: 'India Business Conference 2024',
    description: 'A premier networking event for entrepreneurs and professionals in the Indo-American business community. Featuring keynote speeches from industry leaders, panel discussions on emerging market trends, and a startup pitch competition. Connect with investors, mentors, and peers to grow your business and career.',
    tags: ['business', 'networking', 'professional', 'startup', 'conference'],
    location: {
      venueName: 'Silicon Valley Convention Center',
      address: '456 Innovation Drive, Santa Clara, CA 95054',
    },
    startDateTime: new Date(new Date().getFullYear(), 8, 15, 9, 0).toISOString(),
    endDateTime: new Date(new Date().getFullYear(), 8, 15, 17, 0).toISOString(),
    eventType: 'Professional',
    ticketLink: '#',
    imageUrl: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGNvbmZlcmVuY2V8ZW58MHx8fHwxNzU0MTk3NDM2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    organizerId: 'india-cultural-center',
    organizerName: 'India Cultural Center',
    status: 'Approved',
    submittedByUid: 'admin-icc-uid',
    createdAt: '2024-07-15T14:30:00Z',
  },
   {
    id: '3',
    title: 'Holi Festival of Colors',
    description: 'Experience the joy and vibrancy of Holi! Join us at the park for a day of throwing colorful powders, dancing to Bollywood music, and enjoying delicious street food. This event is open to everyone, so bring your friends and family for a memorable celebration of spring.',
    tags: ['holi', 'festival', 'colors', 'family-friendly', 'outdoor'],
    location: {
      venueName: 'Central Park',
      address: '72nd Street and 5th Avenue, New York, NY 10021',
    },
    startDateTime: new Date(new Date().getFullYear() + 1, 2, 25, 11, 0).toISOString(),
    endDateTime: new Date(new Date().getFullYear() + 1, 2, 25, 16, 0).toISOString(),
    eventType: 'Festival',
    isFree: true,
    imageUrl: 'https://images.unsplash.com/photo-1616424232339-01b5a59663e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxIb2xpJTIwZmVzdGl2YWx8ZW58MHx8fHwxNzU0MTk3NDM2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    organizerId: 'india-cultural-center',
    organizerName: 'India Cultural Center',
    status: 'Approved',
    submittedByUid: 'admin-icc-uid',
    createdAt: '2024-06-01T11:00:00Z',
  }
];

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

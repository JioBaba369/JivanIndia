
'use client';

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { collection, addDoc, getDocs, doc, updateDoc } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import { useToast } from './use-toast';
import { useNotifications } from './use-notifications';
import { useAuth } from './use-auth';
import { useCommunities } from './use-communities';

export interface Event {
  id: string;
  title: string;
  description: string;
  tags?: string[];
  location: {
    venueName: string;
    address: string;
  };
  startDateTime: string; 
  endDateTime: string;
  eventType: 'Cultural' | 'Religious' | 'Professional' | 'Sports' | 'Festival' | 'Workshop' | 'Food' | 'Other';
  ticketLink?: string;
  imageUrl: string;
  organizerId: string;
  organizerName: string;
  status: 'Pending' | 'Approved' | 'Archived';
  isFeatured?: boolean;
  submittedByUid?: string;
  createdAt: string; 
  updatedAt?: string; 
}

export type NewEventInput = Omit<Event, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'isFeatured'>;

interface EventsContextType {
  events: Event[];
  isLoading: boolean;
  addEvent: (event: NewEventInput) => Promise<void>;
  getEventById: (id: string) => Event | undefined;
  updateEventStatus: (eventId: string, status: Event['status']) => Promise<void>;
  updateEventFeaturedStatus: (eventId: string, isFeatured: boolean) => Promise<void>;
}

const EventsContext = createContext<EventsContextType | undefined>(undefined);

const eventsCollectionRef = collection(firestore, 'events');

export function EventsProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { createNotificationForCommunity } = useNotifications();
  const { communities } = useCommunities();


  const fetchEvents = useCallback(async () => {
    setIsLoading(true);
    try {
      const querySnapshot = await getDocs(eventsCollectionRef);
      const eventsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Event));
      setEvents(eventsData.sort((a,b) => new Date(b.startDateTime).getTime() - new Date(a.startDateTime).getTime()));
    } catch (error) {
      console.error("Failed to fetch events from Firestore", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const addEvent = async (eventData: NewEventInput) => {
    const now = new Date().toISOString();
    const newEventData = {
      ...eventData,
      createdAt: now,
      updatedAt: now,
      status: 'Pending' as Event['status'], // All events default to Pending
      isFeatured: false,
    };
    
    const docRef = await addDoc(eventsCollectionRef, newEventData);
    const fullEvent = { id: docRef.id, ...newEventData } as Event;

    setEvents(prev => [...prev, fullEvent].sort((a,b) => new Date(b.startDateTime).getTime() - new Date(a.startDateTime).getTime()));
    
    // Create notifications for members of the community
    const organizer = communities.find(c => c.id === eventData.organizerId);
    if (organizer) {
        await createNotificationForCommunity(organizer.id, {
            title: `New Event: ${eventData.title}`,
            description: `A new event has been posted by ${eventData.organizerName}.`,
            link: `/events/${docRef.id}`,
            icon: 'Calendar',
        });
    }
  };

  const getEventById = useCallback((id: string) => {
    if (!id) return undefined;
    return events.find(event => event.id === id);
  }, [events]);

  const updateEventStatus = async (eventId: string, status: Event['status']) => {
    const eventDocRef = doc(firestore, 'events', eventId);
    const updatedData: { status: Event['status'], updatedAt: string, isFeatured?: boolean } = { status, updatedAt: new Date().toISOString() };
    
    // If event is not approved, it cannot be featured
    if (status !== 'Approved') {
        updatedData.isFeatured = false;
    }

    await updateDoc(eventDocRef, updatedData);

    setEvents(prev => prev.map(event =>
      event.id === eventId ? { ...event, ...updatedData } : event
    ));
    toast({ title: 'Event Status Updated', description: `The event has been set to ${status}.` });
  };
  
  const updateEventFeaturedStatus = async (eventId: string, isFeatured: boolean) => {
    const eventDocRef = doc(firestore, 'events', eventId);
    const updatedData = { isFeatured, updatedAt: new Date().toISOString() };
    await updateDoc(eventDocRef, updatedData);
    setEvents(prev => prev.map(event =>
      event.id === eventId ? { ...event, ...updatedData } : event
    ));
     toast({ title: 'Event Updated', description: `The event has been ${isFeatured ? 'featured' : 'un-featured'}.` });
  };

  const value = {
    events,
    isLoading,
    addEvent,
    getEventById,
    updateEventStatus,
    updateEventFeaturedStatus,
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

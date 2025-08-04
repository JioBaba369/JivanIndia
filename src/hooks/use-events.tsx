
'use client';

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { collection, addDoc, getDocs, doc, updateDoc, query, where, Timestamp } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
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
  submittedByUid?: string;
  createdAt: string; 
  updatedAt?: string; 
}

export type NewEventInput = Omit<Event, 'id' | 'createdAt' | 'status'>;

interface EventsContextType {
  events: Event[];
  isLoading: boolean;
  addEvent: (event: NewEventInput) => Promise<void>;
  getEventById: (id: string) => Event | undefined;
  updateEventStatus: (eventId: string, status: Event['status']) => Promise<void>;
}

const EventsContext = createContext<EventsContextType | undefined>(undefined);

const eventsCollectionRef = collection(firestore, 'events');

export function EventsProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { getCommunityById } = useCommunities();

  const fetchEvents = useCallback(async () => {
    setIsLoading(true);
    try {
      const querySnapshot = await getDocs(eventsCollectionRef);
      const eventsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Event));
      setEvents(eventsData);
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
    const affiliatedCommunity = getCommunityById(eventData.organizerId);
    const status: Event['status'] = affiliatedCommunity?.isVerified ? 'Approved' : 'Pending';

    const newEventData = {
      ...eventData,
      createdAt: new Date().toISOString(),
      status: status,
    };
    
    const docRef = await addDoc(eventsCollectionRef, newEventData);
    setEvents(prev => [...prev, { id: docRef.id, ...newEventData }]);
  };

  const getEventById = useCallback((id: string) => {
    return events.find(event => event.id === id);
  }, [events]);

  const updateEventStatus = async (eventId: string, status: Event['status']) => {
    const eventDocRef = doc(firestore, 'events', eventId);
    const updatedData = { status, updatedAt: new Date().toISOString() };
    await updateDoc(eventDocRef, updatedData);
    setEvents(prev => prev.map(event =>
      event.id === eventId ? { ...event, ...updatedData } : event
    ));
  };

  const value = {
    events,
    isLoading,
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

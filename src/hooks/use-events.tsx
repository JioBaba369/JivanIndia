
'use client';

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { collection, addDoc, onSnapshot, doc, updateDoc, deleteDoc, serverTimestamp, query, where, orderBy } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import { useToast } from './use-toast';
import { useAuth } from './use-auth';
import type { SponsorTier } from './use-sponsors';

export interface EventSponsor {
    sponsorId: string;
    tier: SponsorTier;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  tags?: string[];
  imageUrl: string;
  location: {
    venueName: string;
    address: string;
    country: string;
    state: string;
    city: string;
  };
  startDateTime: string; 
  endDateTime: string;
  eventType: 'Cultural' | 'Religious' | 'Professional' | 'Sports' | 'Festival' | 'Workshop' | 'Food' | 'Other';
  ticketLink?: string;
  organizerId: string;
  organizerName: string;
  sponsors: EventSponsor[];
  status: 'Pending' | 'Approved' | 'Archived';
  isFeatured?: boolean;
  submittedByUid?: string;
  createdAt: any; 
  updatedAt?: any;
  attendees?: number;
}

export type NewEventInput = Omit<Event, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'isFeatured' | 'sponsors' | 'attendees'>;

interface EventsContextType {
  events: Event[];
  isLoading: boolean;
  error: Error | null;
  addEvent: (event: NewEventInput, sponsors: EventSponsor[]) => Promise<Event>;
  updateEvent: (eventId: string, eventData: Partial<NewEventInput>, sponsors: EventSponsor[]) => Promise<void>;
  deleteEvent: (eventId: string) => Promise<void>;
  getEventById: (id: string) => Event | undefined;
  updateEventStatus: (eventId: string, status: Event['status']) => Promise<void>;
  updateEventFeaturedStatus: (eventId: string, isFeatured: boolean) => Promise<void>;
  updateEventSponsors: (eventId: string, sponsors: EventSponsor[]) => Promise<void>;
}

const EventsContext = createContext<EventsContextType | undefined>(undefined);

export function EventsProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();
  const { user, isAuthLoading } = useAuth();

  useEffect(() => {
    if (isAuthLoading) {
        return;
    }

    setIsLoading(true);
    setError(null);
    
    const eventsCollectionRef = collection(firestore, 'events');
    const q = query(eventsCollectionRef, orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const fetchedEvents = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Event));
        setEvents(fetchedEvents);
        setIsLoading(false);
    }, (err) => {
        console.error("Failed to fetch events from Firestore:", err);
        setError(new Error("Could not fetch events."));
        toast({ title: 'Error', description: 'Could not fetch events.', variant: 'destructive' });
        setIsLoading(false);
    });

    return () => unsubscribe();
  }, [user, isAuthLoading, toast]);
  

  const addEvent = useCallback(async (eventData: NewEventInput, sponsors: EventSponsor[]) => {
    try {
      const newEventData = {
        ...eventData,
        sponsors: sponsors,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        status: 'Pending' as Event['status'],
        isFeatured: false,
        attendees: 0,
      };
      
      const docRef = await addDoc(collection(firestore, 'events'), newEventData);
      return { id: docRef.id, ...newEventData, createdAt: { toDate: () => new Date() } } as Event;
    } catch (error) {
      console.error("Error adding event:", error);
      toast({ title: "Error", description: "Could not create the event.", variant: "destructive" });
      throw error;
    }
  }, [toast]);
  
  const updateEvent = useCallback(async (eventId: string, eventData: Partial<NewEventInput>, sponsors: EventSponsor[]) => {
    const eventDocRef = doc(firestore, 'events', eventId);
    try {
        await updateDoc(eventDocRef, {
            ...eventData,
            sponsors,
            updatedAt: serverTimestamp()
        });
        toast({ title: 'Event Updated', description: 'Your event has been successfully updated.' });
    } catch (error) {
        console.error("Error updating event:", error);
        toast({ title: 'Update Failed', description: 'Could not update the event.', variant: 'destructive' });
        throw error;
    }
  }, [toast]);

  const deleteEvent = useCallback(async (eventId: string) => {
      const eventDocRef = doc(firestore, 'events', eventId);
      try {
          await deleteDoc(eventDocRef);
          toast({ title: 'Event Deleted', description: 'The event has been permanently removed.' });
      } catch (error) {
          console.error("Error deleting event:", error);
          toast({ title: 'Deletion Failed', description: 'Could not delete the event.', variant: 'destructive' });
          throw error;
      }
  }, [toast]);


  const getEventById = useCallback((id: string) => {
    if (!id) return undefined;
    return events.find(event => event.id === id);
  }, [events]);

  const updateEventStatus = useCallback(async (eventId: string, status: Event['status']) => {
    const eventDocRef = doc(firestore, 'events', eventId);
    const updatedData: { status: Event['status'], updatedAt: any, isFeatured?: boolean } = { status, updatedAt: serverTimestamp() };
    
    if (status !== 'Approved') {
        updatedData.isFeatured = false;
    }

    try {
      await updateDoc(eventDocRef, updatedData);
      toast({ title: 'Event Status Updated', description: `The event has been set to ${status}.` });
    } catch(error) {
       console.error("Error updating event status:", error);
       toast({ title: "Error", description: "Could not update the event status.", variant: "destructive" });
    }
  }, [toast]);
  
  const updateEventFeaturedStatus = useCallback(async (eventId: string, isFeatured: boolean) => {
    const eventDocRef = doc(firestore, 'events', eventId);
    try {
      await updateDoc(eventDocRef, { isFeatured, updatedAt: serverTimestamp() });
      toast({ title: 'Event Updated', description: `The event has been ${isFeatured ? 'featured' : 'un-featured'}.` });
    } catch (error) {
      console.error("Error updating event featured status:", error);
      toast({ title: "Error", description: "Could not update the event's featured status.", variant: "destructive" });
    }
  }, [toast]);
  
  const updateEventSponsors = useCallback(async (eventId: string, sponsors: EventSponsor[]) => {
    const eventDocRef = doc(firestore, 'events', eventId);
    try {
        await updateDoc(eventDocRef, { sponsors, updatedAt: serverTimestamp() });
        toast({ title: 'Event Sponsors Updated' });
    } catch (error) {
        console.error("Error updating sponsors:", error);
        toast({ title: 'Error', description: "Could not update event sponsors.", variant: "destructive" });
    }
  }, [toast]);

  const value = {
    events,
    isLoading,
    error,
    addEvent,
    updateEvent,
    deleteEvent,
    getEventById,
    updateEventStatus,
    updateEventFeaturedStatus,
    updateEventSponsors,
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

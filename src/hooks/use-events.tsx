
'use client';

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { collection, addDoc, onSnapshot, doc, updateDoc, serverTimestamp, query, where, getDocs, orderBy } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import { useToast } from './use-toast';
import { useAuth } from './use-auth';

export interface Event {
  id: string;
  title: string;
  description: string;
  tags?: string[];
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
  imageUrl: string;
  organizerId: string;
  organizerName: string;
  status: 'Pending' | 'Approved' | 'Archived';
  isFeatured?: boolean;
  submittedByUid?: string;
  createdAt: any; 
  updatedAt?: any; 
}

export type NewEventInput = Omit<Event, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'isFeatured'>;

interface EventsContextType {
  events: Event[];
  isLoading: boolean;
  addEvent: (event: NewEventInput) => Promise<Event>;
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
  const { user } = useAuth();

  const fetchEvents = useCallback(async () => {
    setIsLoading(true);
    
    let q;
    const isAdmin = user?.roles?.includes('admin');
    const isManager = user?.roles?.includes('community-manager');

    if (isAdmin) {
        q = query(eventsCollectionRef, orderBy('createdAt', 'desc'));
    } else {
        q = query(eventsCollectionRef, where('status', '==', 'Approved'), orderBy('startDateTime', 'desc'));
    }

    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
        let fetchedEvents: Event[] = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Event));
        
        if (user && isManager && !isAdmin && user.affiliation?.orgId) {
            // Fetch manager-specific events and merge them
            const managerQuery = query(eventsCollectionRef, where('organizerId', '==', user.affiliation.orgId));
            const managerEventsSnapshot = await getDocs(managerQuery);
            const managerEvents = managerEventsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Event));
            
            const combined = [...managerEvents, ...fetchedEvents];
            const uniqueEvents = Array.from(new Map(combined.map(e => [e.id, e])).values());
            setEvents(uniqueEvents);
        } else {
            setEvents(fetchedEvents);
        }

        setIsLoading(false);
    }, (error) => {
        console.error("Failed to fetch events from Firestore", error);
        toast({ title: "Error", description: "Could not fetch events.", variant: "destructive" });
        setIsLoading(false);
    });

    return unsubscribe;

  }, [user, toast]);
  
  useEffect(() => {
    const unsubscribePromise = fetchEvents();
    return () => {
        unsubscribePromise.then(unsub => unsub());
    };
  }, [fetchEvents]);


  const addEvent = async (eventData: NewEventInput) => {
    const newEventData = {
      ...eventData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      status: 'Pending' as Event['status'],
      isFeatured: false,
    };
    
    const docRef = await addDoc(eventsCollectionRef, newEventData);
    const fullEvent = { id: docRef.id, ...newEventData, createdAt: { toDate: () => new Date() } } as Event;
    
    return fullEvent;
  };

  const getEventById = useCallback((id: string) => {
    if (!id) return undefined;
    return events.find(event => event.id === id);
  }, [events]);

  const updateEventStatus = async (eventId: string, status: Event['status']) => {
    const eventDocRef = doc(firestore, 'events', eventId);
    const updatedData: { status: Event['status'], updatedAt: any, isFeatured?: boolean } = { status, updatedAt: serverTimestamp() };
    
    if (status !== 'Approved') {
        updatedData.isFeatured = false;
    }

    await updateDoc(eventDocRef, updatedData);

    toast({ title: 'Event Status Updated', description: `The event has been set to ${status}.` });
  };
  
  const updateEventFeaturedStatus = async (eventId: string, isFeatured: boolean) => {
    const eventDocRef = doc(firestore, 'events', eventId);
    await updateDoc(eventDocRef, { isFeatured, updatedAt: serverTimestamp() });
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

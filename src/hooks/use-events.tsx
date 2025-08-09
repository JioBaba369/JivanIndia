
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
  error: Error | null;
  addEvent: (event: NewEventInput) => Promise<Event>;
  getEventById: (id: string) => Event | undefined;
  updateEventStatus: (eventId: string, status: Event['status']) => Promise<void>;
  updateEventFeaturedStatus: (eventId: string, isFeatured: boolean) => Promise<void>;
}

const EventsContext = createContext<EventsContextType | undefined>(undefined);

export function EventsProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();
  const { user, isLoading: isAuthLoading } = useAuth();

  const fetchEvents = useCallback(() => {
    if (isAuthLoading) {
        // Don't fetch until auth state is resolved
        return () => {};
    }

    setIsLoading(true);
    setError(null);
    
    const eventsCollectionRef = collection(firestore, 'events');
    const isAdmin = user?.roles?.includes('admin');
    const isManager = user?.roles?.includes('community-manager');
    let q;

    if (isAdmin) {
      q = query(eventsCollectionRef, orderBy('createdAt', 'desc'));
    } else if (user && isManager) {
      q = null; 
    } else {
      q = query(eventsCollectionRef, where('status', '==', 'Approved'), orderBy('startDateTime', 'desc'));
    }
    
    let unsubscribe: () => void = () => {};

    if (q) {
        unsubscribe = onSnapshot(q, (querySnapshot) => {
            const fetchedEvents = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Event));
            setEvents(fetchedEvents);
            setIsLoading(false);
        }, (err) => {
            console.error("Failed to fetch events from Firestore:", err);
            setError(new Error("Could not fetch events."));
            setIsLoading(false);
        });
    } else if (user && isManager) {
        const fetchManagerEvents = async () => {
            try {
                const approvedQuery = query(eventsCollectionRef, where('status', '==', 'Approved'));
                const approvedEventsSnap = await getDocs(approvedQuery);
                let fetchedEvents: Event[] = approvedEventsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Event));

                if (user.affiliation?.orgId) {
                    const managerQuery = query(eventsCollectionRef, where('organizerId', '==', user.affiliation.orgId));
                    const managerEventsSnapshot = await getDocs(managerQuery);
                    const managerEvents = managerEventsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Event));
                    
                    const combined = [...managerEvents, ...fetchedEvents];
                    const uniqueEvents = Array.from(new Map(combined.map(e => [e.id, e])).values());
                    setEvents(uniqueEvents.sort((a,b) => b.createdAt.toDate() - a.createdAt.toDate()));
                } else {
                    setEvents(fetchedEvents.sort((a,b) => b.createdAt.toDate() - a.createdAt.toDate()));
                }
            } catch(e) {
                 console.error("Failed to fetch events for manager:", e);
                 setError(new Error("Could not fetch events."));
            } finally {
                 setIsLoading(false);
            }
        };
        fetchManagerEvents();
    } else {
        // For logged-out users, we run the public query
        const publicQuery = query(eventsCollectionRef, where('status', '==', 'Approved'), orderBy('startDateTime', 'desc'));
        unsubscribe = onSnapshot(publicQuery, (querySnapshot) => {
            const fetchedEvents = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Event));
            setEvents(fetchedEvents);
            setIsLoading(false);
        }, (err) => {
            console.error("Failed to fetch public events from Firestore:", err);
            setError(new Error("Could not fetch events."));
            setIsLoading(false);
        });
    }

    return unsubscribe;

  }, [user, isAuthLoading]);
  
  useEffect(() => {
    const unsubscribe = fetchEvents();
    return () => {
        if (unsubscribe) {
            unsubscribe();
        }
    };
  }, [fetchEvents]);

  const addEvent = useCallback(async (eventData: NewEventInput) => {
    try {
      const newEventData = {
        ...eventData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        status: 'Pending' as Event['status'],
        isFeatured: false,
      };
      
      const docRef = await addDoc(collection(firestore, 'events'), newEventData);
      return { id: docRef.id, ...newEventData, createdAt: { toDate: () => new Date() } } as Event;
    } catch (error) {
      console.error("Error adding event:", error);
      toast({ title: "Error", description: "Could not create the event.", variant: "destructive" });
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

  const value = {
    events,
    isLoading,
    error,
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

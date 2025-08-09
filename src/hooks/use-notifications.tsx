
'use client';

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { collection, getDocs, doc, addDoc, updateDoc, serverTimestamp, query, where, writeBatch, limit, orderBy, onSnapshot } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import { useAuth } from './use-auth';
import * as LucideIcons from 'lucide-react';

export type IconName = keyof typeof LucideIcons;

export interface Notification {
  id: string;
  userId: string;
  title: string;
  description: string;
  link: string;
  isRead: boolean;
  createdAt: any; 
  icon: IconName;
}

export type NewNotificationInput = Omit<Notification, 'id' | 'createdAt' | 'isRead'>;
export type CommunityNotificationInput = Omit<NewNotificationInput, 'userId'>;

interface NotificationsContextType {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  createNotificationForCommunity: (communityId: string, notificationData: CommunityNotificationInput) => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const notificationsRef = collection(firestore, 'notifications');
    const q = query(
      notificationsRef, 
      where('userId', '==', user.uid), 
      orderBy('createdAt', 'desc'),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const notificationsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Notification));
      setNotifications(notificationsData);
      setIsLoading(false);
    }, (error) => {
      console.error("Failed to fetch notifications:", error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const createNotificationForCommunity = useCallback(async (communityId: string, notificationData: CommunityNotificationInput) => {
      try {
        const usersRef = collection(firestore, 'users');
        const q = query(usersRef, where('joinedCommunities', 'array-contains', communityId));
        const usersSnapshot = await getDocs(q);
        
        const batch = writeBatch(firestore);
        const notificationsRef = collection(firestore, 'notifications');

        usersSnapshot.forEach(userDoc => {
            const newNotification = {
                ...notificationData,
                userId: userDoc.id,
                isRead: false,
                createdAt: serverTimestamp()
            };
            const notificationDocRef = doc(notificationsRef);
            batch.set(notificationDocRef, newNotification);
        });

        await batch.commit();
      } catch (error) {
        console.error("Error creating community notifications:", error);
      }
  }, []);

  const markAsRead = useCallback(async (notificationId: string) => {
    const notificationRef = doc(firestore, 'notifications', notificationId);
    try {
        await updateDoc(notificationRef, { isRead: true });
    } catch(error) {
        console.error("Error marking notification as read:", error);
    }
  }, []);
  
  const markAllAsRead = useCallback(async () => {
    if (!user || unreadCount === 0) return;
    try {
        const batch = writeBatch(firestore);
        const unreadNotifications = notifications.filter(n => !n.isRead);

        unreadNotifications.forEach(n => {
            const docRef = doc(firestore, 'notifications', n.id);
            batch.update(docRef, { isRead: true });
        });

        await batch.commit();
    } catch (error) {
        console.error("Error marking all notifications as read:", error);
    }
  }, [user, notifications, unreadCount]);

  const value = {
    notifications,
    unreadCount,
    isLoading,
    createNotificationForCommunity,
    markAsRead,
    markAllAsRead,
  };

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationsContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
}

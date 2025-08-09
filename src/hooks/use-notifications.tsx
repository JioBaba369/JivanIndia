
'use client';

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { collection, getDocs, doc, addDoc, updateDoc, serverTimestamp, query, where, writeBatch, limit, orderBy } from 'firebase/firestore';
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

  const fetchNotifications = useCallback(async (userId: string) => {
    setIsLoading(true);
    try {
      const notificationsRef = collection(firestore, 'notifications');
      const q = query(
        notificationsRef, 
        where('userId', '==', userId), 
        orderBy('createdAt', 'desc'),
        limit(50) // Limit to last 50 notifications for performance
      );
      const querySnapshot = await getDocs(q);
      const notificationsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Notification));
      setNotifications(notificationsData);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchNotifications(user.uid);
    } else {
      setNotifications([]);
      setIsLoading(false);
    }
  }, [user, fetchNotifications]);

  const createNotificationForCommunity = async (communityId: string, notificationData: CommunityNotificationInput) => {
      // Find all users who joined this community
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
  };

  const markAsRead = async (notificationId: string) => {
    const notificationRef = doc(firestore, 'notifications', notificationId);
    await updateDoc(notificationRef, { isRead: true });
    setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n));
  };
  
  const markAllAsRead = async () => {
    if (!user) return;
    const batch = writeBatch(firestore);
    const unreadNotifications = notifications.filter(n => !n.isRead);

    unreadNotifications.forEach(n => {
        const docRef = doc(firestore, 'notifications', n.id);
        batch.update(docRef, { isRead: true });
    });

    await batch.commit();
    setNotifications(prev => prev.map(n => ({...n, isRead: true})));
  };

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

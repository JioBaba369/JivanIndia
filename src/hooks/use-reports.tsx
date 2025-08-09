
'use client';

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { collection, getDocs, doc, addDoc, updateDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import { useToast } from './use-toast';

export type ReportStatus = 'pending' | 'resolved' | 'dismissed';
export type ContentType = 'Event' | 'Community' | 'Business' | 'Movie' | 'Deal';

export interface Report {
  id: string;
  contentId: string;
  contentType: ContentType;
  contentTitle: string;
  contentLink: string;
  reason: string;
  reportedByUid: string;
  createdAt: any; // Firestore ServerTimestamp
  status: ReportStatus;
}

export type NewReportInput = Omit<Report, 'id' | 'createdAt' | 'status'>;

interface ReportsContextType {
  reports: Report[];
  isLoading: boolean;
  addReport: (report: NewReportInput) => Promise<void>;
  updateReportStatus: (reportId: string, status: ReportStatus) => Promise<void>;
}

const ReportsContext = createContext<ReportsContextType | undefined>(undefined);

const reportsCollectionRef = collection(firestore, 'reports');

export function ReportsProvider({ children }: { children: ReactNode }) {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchReports = useCallback(async () => {
    setIsLoading(true);
    try {
      const q = query(reportsCollectionRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const reportsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Report));
      setReports(reportsData);
    } catch (error) {
      console.error("Failed to fetch reports from Firestore", error);
      toast({ title: 'Error', description: 'Could not fetch reports.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    // This hook is only used by admins, so we might not need to fetch immediately
    // but for simplicity and consistency, we'll fetch on mount.
    // In a more optimized app, we'd only fetch when the admin page is loaded.
    fetchReports();
  }, [fetchReports]);

  const addReport = async (reportData: NewReportInput) => {
    const newReport = {
      ...reportData,
      status: 'pending' as ReportStatus,
      createdAt: serverTimestamp(),
    };
    await addDoc(reportsCollectionRef, newReport);
  };

  const updateReportStatus = async (reportId: string, status: ReportStatus) => {
    const reportDocRef = doc(firestore, 'reports', reportId);
    await updateDoc(reportDocRef, { status });
    setReports(prev => prev.map(r => r.id === reportId ? { ...r, status } : r));
    toast({
      title: `Report ${status.charAt(0).toUpperCase() + status.slice(1)}`,
      description: `The report has been marked as ${status}.`,
    });
  };

  const value = { reports, isLoading, addReport, updateReportStatus };

  return (
    <ReportsContext.Provider value={value}>
      {children}
    </ReportsContext.Provider>
  );
}

export function useReports() {
  const context = useContext(ReportsContext);
  if (context === undefined) {
    throw new Error('useReports must be used within a ReportsProvider');
  }
  return context;
}

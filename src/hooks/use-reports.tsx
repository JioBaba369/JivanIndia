
'use client';

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { collection, onSnapshot, doc, addDoc, updateDoc, serverTimestamp, query, orderBy, getDocs } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import { useToast } from './use-toast';
import { useAuth } from './use-auth';

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
  createdAt: any;
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

export function ReportsProvider({ children }: { children: ReactNode }) {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchReports = useCallback(async () => {
    if (!user || !user.roles.includes('admin')) {
      setReports([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const q = query(collection(firestore, 'reports'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const reportsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Report));
      setReports(reportsData);
    } catch (error) {
       console.error("Failed to fetch reports from Firestore", error);
       toast({ title: 'Error', description: 'Could not fetch reports.', variant: 'destructive' });
    } finally {
        setIsLoading(false);
    }
  }, [toast, user]);

  useEffect(() => {
    if(user?.roles.includes('admin')) {
        fetchReports();
    } else {
        setIsLoading(false);
    }
  }, [fetchReports, user]);

  const addReport = useCallback(async (reportData: NewReportInput) => {
    try {
      const newReport = {
        ...reportData,
        status: 'pending' as ReportStatus,
        createdAt: serverTimestamp(),
      };
      await addDoc(collection(firestore, 'reports'), newReport);
    } catch(error) {
      console.error("Error adding report:", error);
      toast({ title: "Error", description: "Could not submit your report.", variant: "destructive" });
    }
  }, [toast]);

  const updateReportStatus = useCallback(async (reportId: string, status: ReportStatus) => {
    const reportDocRef = doc(firestore, 'reports', reportId);
    try {
      await updateDoc(reportDocRef, { status });
      // Manually update the state after a successful update
      setReports(prevReports => 
        prevReports.map(report => 
          report.id === reportId ? { ...report, status } : report
        )
      );
      toast({
        title: `Report ${status.charAt(0).toUpperCase() + status.slice(1)}`,
        description: `The report has been marked as ${status}.`,
      });
    } catch (error) {
      console.error("Error updating report status:", error);
      toast({ title: "Error", description: "Could not update the report status.", variant: "destructive" });
    }
  }, [toast]);

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

'use client';

import { AuthProvider, useAuth } from "@/hooks/use-auth";
import { EventsProvider } from "@/hooks/use-events";
import { CommunitiesProvider } from "@/hooks/use-communities";
import { AboutProvider, useAbout } from "@/hooks/use-about";
import { BusinessesProvider } from "@/hooks/use-businesses";
import { SponsorsProvider } from "@/hooks/use-sponsors";
import { JobsProvider } from "@/hooks/use-jobs";
import { MoviesProvider } from "@/hooks/use-movies";
import { DealsProvider } from "@/hooks/use-deals";
import { Loader2 } from 'lucide-react';
import { useEffect } from "react";


function AppContent({ children }: { children: React.ReactNode }) {
  const { user, isLoading: isAuthLoading, setUser } = useAuth();
  const { aboutContent, isLoading: isAboutLoading } = useAbout();

  useEffect(() => {
    if (user && aboutContent.adminUids.length > 0) {
      const isAdmin = aboutContent.adminUids.includes(user.uid);
      if (user.isAdmin !== isAdmin) {
        setUser({ ...user, isAdmin });
      }
    }
  }, [user, aboutContent.adminUids, setUser]);
  
  if (isAuthLoading || isAboutLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading Community...</p>
        </div>
      </div>
    );
  }
  return <>{children}</>;
}


export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <AboutProvider>
                <CommunitiesProvider>
                    <EventsProvider>
                        <BusinessesProvider>
                            <SponsorsProvider>
                                <DealsProvider>
                                    <MoviesProvider>
                                        <JobsProvider>
                                            <AppContent>
                                                {children}
                                            </AppContent>
                                        </JobsProvider>
                                    </MoviesProvider>
                                </DealsProvider>
                            </SponsorsProvider>
                        </BusinessesProvider>
                    </EventsProvider>
                </CommunitiesProvider>
            </AboutProvider>
        </AuthProvider>
    )
}

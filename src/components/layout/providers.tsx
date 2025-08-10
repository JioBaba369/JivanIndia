
'use client';

import React, { Suspense } from 'react';
import { AuthProvider } from "@/hooks/use-auth";
import { EventsProvider } from "@/hooks/use-events";
import { CommunitiesProvider } from "@/hooks/use-communities";
import { AboutProvider } from "@/hooks/use-about";
import { BusinessesProvider } from "@/hooks/use-businesses";
import { SponsorsProvider } from "@/hooks/use-sponsors";
import { JobsProvider } from "@/hooks/use-jobs";
import { MoviesProvider } from "@/hooks/use-movies";
import { DealsProvider } from "@/hooks/use-deals";
import { ReportsProvider } from "@/hooks/use-reports";
import { NotificationsProvider } from '@/hooks/use-notifications';
import { FestivalsProvider } from '@/hooks/use-festivals';
import { CountriesProvider } from '@/hooks/use-countries';
import { IndiaLocationsProvider } from '@/hooks/use-india-locations';
import { SearchProvider } from '@/hooks/use-search';
import { Loader2 } from 'lucide-react';

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
      <Suspense fallback={
          <div className="flex h-screen w-full items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="text-muted-foreground">Loading Community...</p>
            </div>
          </div>
      }>
        <CountriesProvider>
          <IndiaLocationsProvider>
            <AboutProvider>
              <AuthProvider>
                <NotificationsProvider>
                  <SearchProvider>
                    <ReportsProvider>
                        <CommunitiesProvider>
                            <SponsorsProvider>
                                <DealsProvider>
                                    <JobsProvider>
                                        <EventsProvider>
                                            <BusinessesProvider>
                                                <MoviesProvider>
                                                    <FestivalsProvider>
                                                      {children}
                                                    </FestivalsProvider>
                                                </MoviesProvider>
                                            </BusinessesProvider>
                                        </EventsProvider>
                                    </JobsProvider>
                                </DealsProvider>
                            </SponsorsProvider>
                        </CommunitiesProvider>
                    </ReportsProvider>
                  </SearchProvider>
                </NotificationsProvider>
              </AuthProvider>
            </AboutProvider>
          </IndiaLocationsProvider>
        </CountriesProvider>
      </Suspense>
    )
}

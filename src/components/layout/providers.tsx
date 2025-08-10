
'use client';

import React from 'react';
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

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
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
    )
}


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
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Toaster } from '@/components/ui/toaster';
import CookieConsentBanner from '@/components/cookie-consent-banner';
import { CountriesProvider } from '@/hooks/use-countries';

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
      <CountriesProvider>
        <AboutProvider>
            <AuthProvider>
                <ReportsProvider>
                  <CommunitiesProvider>
                      <NotificationsProvider>
                        <EventsProvider>
                            <BusinessesProvider>
                                <SponsorsProvider>
                                    <DealsProvider>
                                        <MoviesProvider>
                                            <JobsProvider>
                                                <FestivalsProvider>
                                                    <div className="relative flex min-h-screen flex-col">
                                                        <Header />
                                                        <main className="flex-1">
                                                            {children}
                                                        </main>
                                                        <Footer />
                                                        <Toaster />
                                                        <CookieConsentBanner />
                                                    </div>
                                                </FestivalsProvider>
                                            </JobsProvider>
                                        </MoviesProvider>
                                    </DealsProvider>
                                </SponsorsProvider>
                            </BusinessesProvider>
                        </EventsProvider>
                      </NotificationsProvider>
                  </CommunitiesProvider>
                </ReportsProvider>
            </AuthProvider>
        </AboutProvider>
      </CountriesProvider>
    )
}
    


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
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Toaster } from '@/components/ui/toaster';
import { PostSheet } from '@/components/layout/post-sheet';
import CookieConsentBanner from '@/components/cookie-consent-banner';

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <AboutProvider>
            <AuthProvider>
                <CommunitiesProvider>
                    <EventsProvider>
                        <BusinessesProvider>
                            <SponsorsProvider>
                                <DealsProvider>
                                    <MoviesProvider>
                                        <JobsProvider>
                                            <div className="relative flex min-h-screen flex-col">
                                                <Header />
                                                <main className="flex-1">
                                                    {children}
                                                </main>
                                                <div className="fixed bottom-6 right-6 z-50 md:hidden">
                                                    <PostSheet />
                                                </div>
                                                <Footer />
                                                <Toaster />
                                                <CookieConsentBanner />
                                            </div>
                                        </JobsProvider>
                                    </MoviesProvider>
                                </DealsProvider>
                            </SponsorsProvider>
                        </BusinessesProvider>
                    </EventsProvider>
                </CommunitiesProvider>
            </AuthProvider>
        </AboutProvider>
    )
}

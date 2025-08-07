'use client';

import { AuthProvider } from "@/hooks/use-auth";
import { EventsProvider } from "@/hooks/use-events";
import { CommunitiesProvider } from "@/hooks/use-communities";
import { AboutProvider } from "@/hooks/use-about";
import { BusinessesProvider } from "@/hooks/use-businesses";
import { SponsorsProvider } from "@/hooks/use-sponsors";
import { JobsProvider } from "@/hooks/use-jobs";
import { MoviesProvider } from "@/hooks/use-movies";
import { DealsProvider } from "@/hooks/use-deals";

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
                                            {children}
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

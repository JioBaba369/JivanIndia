
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
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Toaster } from '@/components/ui/toaster';
import { PostSheet } from '@/components/layout/post-sheet';
import CookieConsentBanner from '@/components/cookie-consent-banner';
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useAbout } from "@/hooks/use-about";


function AppContent({ children }: { children: React.ReactNode }) {
    const { isLoading: isAuthLoading } = useAuth();
    const { isLoading: isAboutLoading } = useAbout();

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
    
    return (
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
    );
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

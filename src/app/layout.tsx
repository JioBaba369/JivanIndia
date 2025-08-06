
'use client';

import type { Metadata } from "next";
import { PT_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import { EventsProvider } from "@/hooks/use-events";
import { CommunitiesProvider } from "@/hooks/use-communities";
import { AboutProvider } from "@/hooks/use-about";
import "@/lib/firebase"; // Import to initialize services
import CookieConsentBanner from "@/components/cookie-consent-banner";
import { BusinessesProvider } from "@/hooks/use-businesses";
import { SponsorsProvider } from "@/hooks/use-sponsors";
import { JobsProvider } from "@/hooks/use-jobs";
import { MoviesProvider } from "@/hooks/use-movies";
import { DealsProvider } from "@/hooks/use-deals";
import { PostSheet } from "@/components/layout/post-sheet";
import { Loader2 } from 'lucide-react';
import { AdminsProvider } from "@/hooks/use-admins";

const ptSans = PT_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-pt-sans",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair-display",
});

function AppContent({ children }: { children: React.ReactNode }) {
  const { isLoading: isAuthLoading } = useAuth();
  
  if (isAuthLoading) {
    return (
      <div className="flex h-[calc(100vh-128px)] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  return <>{children}</>;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
         <title>JivanIndia.co - The Heartbeat of the Indian Community</title>
        <meta name="description" content="Your one-stop destination for discovering events, connecting with community organizations, finding local deals, and exploring movies." />
      </head>
      <body
        className={cn(
          "min-h-screen bg-background font-body antialiased",
          ptSans.variable,
          playfairDisplay.variable
        )}
      >
        <AdminsProvider>
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
                                <AppContent>
                                  {children}
                                </AppContent>
                              </main>
                              <div className="md:hidden fixed bottom-6 right-6 z-50">
                                <PostSheet />
                              </div>
                              <Footer />
                            </div>
                            <Toaster />
                            <CookieConsentBanner />
                          </JobsProvider>
                        </MoviesProvider>
                      </DealsProvider>
                    </SponsorsProvider>
                  </BusinessesProvider>
                </EventsProvider>
              </CommunitiesProvider>
            </AuthProvider>
          </AboutProvider>
        </AdminsProvider>
      </body>
    </html>
  );
}

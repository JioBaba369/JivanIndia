
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
import { CommunitiesProvider, useCommunities } from "@/hooks/use-communities";
import { AboutProvider, useAbout } from "@/hooks/use-about";
import "@/lib/firebase"; // Import to initialize services
import CookieConsentBanner from "@/components/cookie-consent-banner";
import { BusinessesProvider } from "@/hooks/use-businesses";
import { SponsorsProvider } from "@/hooks/use-sponsors";
import { JobsProvider } from "@/hooks/use-jobs";
import { MoviesProvider } from "@/hooks/use-movies";
import { DealsProvider } from "@/hooks/use-deals";
import { PostSheet } from "@/components/layout/post-sheet";
import { useState } from "react";

const ptSans = PT_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-pt-sans",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair-display",
});

// export const metadata: Metadata = {
//   title: "JivanIndia.co - The Heartbeat of the Indian Community",
//   description:
//     "Your one-stop destination for discovering events, connecting with community organizations, finding local deals, and exploring movies.",
//   openGraph: {
//     title: "JivanIndia.co - The Heartbeat of the Indian Community",
//     description: "Your one-stop destination for community events, organizations, deals, and more.",
//     url: "https://jivanindia.co",
//     siteName: "JivanIndia.co",
//     images: [
//       {
//         url: 'https://images.unsplash.com/photo-1594917409245-8a245973c8b4?w=1200&h=630&fit=crop', // A representative image
//         width: 1200,
//         height: 630,
//         alt: 'A vibrant Indian community festival',
//       },
//     ],
//     locale: 'en_US',
//     type: 'website',
//   },
//    twitter: {
//     card: 'summary_large_image',
//     title: 'JivanIndia.co - The Heartbeat of the Indian Community',
//     description: 'Your one-stop destination for community events, organizations, deals, and more.',
//     images: ['https://images.unsplash.com/photo-1594917409245-8a245973c8b4?w=1200&h=630&fit=crop'],
//   },
// };

const AppContent = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="relative flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 pb-20 md:pb-0">{children}</main>
            <div className="md:hidden fixed bottom-6 right-6 z-50">
                <PostSheet />
            </div>
            <Footer />
        </div>
    );
};


function AppProviders({ children }: { children: React.ReactNode }) {
    const [aboutContentLoaded, setAboutContentLoaded] = useState(false);
    const [communitiesLoaded, setCommunitiesLoaded] = useState(false);

    return (
        <AboutProvider setAboutContentLoaded={setAboutContentLoaded}>
            <CommunitiesProvider setCommunitiesLoaded={setCommunitiesLoaded}>
                <DataFetcher>
                    {children}
                </DataFetcher>
            </CommunitiesProvider>
        </AboutProvider>
    );
}

function DataFetcher({ children }: { children: React.ReactNode }) {
    const { aboutContent, isLoading: isAboutLoading } = useAbout();
    const { communities, isLoading: isCommunitiesLoading } = useCommunities();
    const [aboutContentLoaded, setAboutContentLoaded] = useState(false);
    const [communitiesLoaded, setCommunitiesLoaded] = useState(false);

    return (
        <AuthProvider 
            aboutContent={aboutContent} 
            communities={communities} 
            aboutContentLoaded={!isAboutLoading} 
            communitiesLoaded={!isCommunitiesLoading}
        >
            <EventsProvider>
                <BusinessesProvider>
                    <SponsorsProvider>
                        <DealsProvider>
                            <MoviesProvider>
                                <JobsProvider>
                                    {children}
                                    <Toaster />
                                    <CookieConsentBanner />
                                </JobsProvider>
                            </MoviesProvider>
                        </DealsProvider>
                    </SponsorsProvider>
                </BusinessesProvider>
            </EventsProvider>
        </AuthProvider>
    );
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
        <AppProviders>
          <AppContent>{children}</AppContent>
        </AppProviders>
      </body>
    </html>
  );
}

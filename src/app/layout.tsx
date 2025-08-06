
import type { Metadata } from "next";
import { PT_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/use-auth";
import { EventsProvider } from "@/hooks/use-events";
import { CommunitiesProvider } from "@/hooks/use-communities";
import { AboutProvider } from "@/hooks/use-about";
import "@/lib/firebase"; // Import to initialize services
import CookieConsentBanner from "@/components/cookie-consent-banner";
import { ProvidersProvider } from "@/hooks/use-providers";
import { SponsorsProvider } from "@/hooks/use-sponsors";
import MobileNav from "@/components/layout/mobile-nav";
import { JobsProvider } from "@/hooks/use-jobs";
import { MoviesProvider } from "@/hooks/use-movies";
import { DealsProvider } from "@/hooks/use-deals";

const ptSans = PT_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-pt-sans",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair-display",
});

export const metadata: Metadata = {
  title: "JivanIndia.co - The Heartbeat of the Indian Community",
  description:
    "Your one-stop destination for discovering events, connecting with community organizations, finding local deals, and exploring movies.",
  openGraph: {
    title: "JivanIndia.co - The Heartbeat of the Indian Community",
    description: "Your one-stop destination for community events, organizations, deals, and more.",
    url: "https://jivanindia.co",
    siteName: "JivanIndia.co",
    images: [
      {
        url: 'https://images.unsplash.com/photo-1594917409245-8a245973c8b4?w=1200&h=630&fit=crop', // A representative image
        width: 1200,
        height: 630,
        alt: 'A vibrant Indian community festival',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
   twitter: {
    card: 'summary_large_image',
    title: 'JivanIndia.co - The Heartbeat of the Indian Community',
    description: 'Your one-stop destination for community events, organizations, deals, and more.',
    images: ['https://images.unsplash.com/photo-1594917409245-8a245973c8b4?w=1200&h=630&fit=crop'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-body antialiased",
          ptSans.variable,
          playfairDisplay.variable
        )}
      >
        <AuthProvider>
          <AboutProvider>
            <CommunitiesProvider>
              <EventsProvider>
                <ProvidersProvider>
                  <SponsorsProvider>
                    <DealsProvider>
                      <MoviesProvider>
                        <JobsProvider>
                          <div className="relative flex min-h-screen flex-col">
                            <Header />
                            <main className="flex-1 pb-20 md:pb-0">{children}</main>
                            <Footer />
                          </div>
                          <Toaster />
                          <CookieConsentBanner />
                          <MobileNav />
                        </JobsProvider>
                      </MoviesProvider>
                    </DealsProvider>
                  </SponsorsProvider>
                </ProvidersProvider>
              </EventsProvider>
            </CommunitiesProvider>
          </AboutProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

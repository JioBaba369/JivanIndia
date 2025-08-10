
import type { Metadata } from "next";
import { PT_Sans, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Providers from "@/components/layout/providers";
import { getDoc, doc } from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Toaster } from "@/components/ui/toaster";
import CookieConsentBanner from "@/components/cookie-consent-banner";

const ptSans = PT_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-pt-sans",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: "JivanIndia.co - The Heartbeat of the Indian Community",
  description: "Your one-stop destination for discovering events, connecting with community organizations, finding local deals, and exploring movies.",
  icons: {
    icon: '/favicon.ico',
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
          spaceGrotesk.variable
        )}
      >
        <Suspense fallback={
            <div className="flex h-screen w-full items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="text-muted-foreground">Loading Community...</p>
              </div>
            </div>
        }>
          <Providers>
              <div className="relative flex min-h-screen flex-col">
                  <Header />
                  <main className="flex-1">
                      {children}
                  </main>
                  <Footer />
                  <Toaster />
                  <CookieConsentBanner />
              </div>
          </Providers>
        </Suspense>
      </body>
    </html>
  );
}

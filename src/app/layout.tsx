
import type { Metadata } from "next";
import { PT_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Toaster } from "@/components/ui/toaster";
import "@/lib/firebase"; // Import to initialize services
import CookieConsentBanner from "@/components/cookie-consent-banner";
import { PostSheet } from "@/components/layout/post-sheet";
import Providers from "@/components/layout/providers";

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
  description: "Your one-stop destination for discovering events, connecting with community organizations, finding local deals, and exploring movies.",
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
        <Providers>
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <div className="fixed bottom-6 right-6 z-50 md:hidden">
              <PostSheet />
            </div>
            <Footer />
          </div>
          <Toaster />
          <CookieConsentBanner />
        </Providers>
      </body>
    </html>
  );
}


import type { Metadata, Viewport } from "next";
import { PT_Sans, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Providers from "@/components/layout/providers";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Toaster } from "@/components/ui/toaster";
import CookieConsentBanner from "@/components/cookie-consent-banner";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "@/lib/firebase";

const ptSans = PT_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-pt-sans",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export async function generateMetadata(): Promise<Metadata> {
  let faviconUrl = '/favicon.ico';
  try {
    const aboutDoc = await getDoc(doc(firestore, 'about', 'singleton'));
    if (aboutDoc.exists()) {
      const aboutData = aboutDoc.data();
      if (aboutData.faviconUrl) {
        faviconUrl = aboutData.faviconUrl;
      }
    }
  } catch (error) {
    console.error("Failed to fetch favicon, using default.", error);
  }

  return {
    title: "JivanIndia.co - The Heartbeat of the Indian Community",
    description: "Your one-stop destination for discovering events, connecting with community organizations, finding local deals, and exploring movies.",
    icons: {
      icon: faviconUrl,
    },
  };
}


export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}


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
      </body>
    </html>
  );
}

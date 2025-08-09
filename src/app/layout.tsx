import type { Metadata } from "next";
import { PT_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Providers from "@/components/layout/providers";
import { getDoc, doc } from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import { AboutContent } from "@/hooks/use-about";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

const ptSans = PT_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-pt-sans",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair-display",
});

export async function generateMetadata(): Promise<Metadata> {
  let faviconUrl = '/favicon.ico';
  try {
    const aboutDoc = await getDoc(doc(firestore, 'about', 'singleton'));
    if (aboutDoc.exists()) {
      const aboutData = aboutDoc.data() as AboutContent;
      if (aboutData.faviconUrl) {
        faviconUrl = aboutData.faviconUrl;
      }
    }
  } catch (error) {
    console.error("Failed to fetch favicon from Firestore, using default.", error);
  }

  return {
    title: "JivanIndia.co - The Heartbeat of the Indian Community",
    description: "Your one-stop destination for discovering events, connecting with community organizations, finding local deals, and exploring movies.",
    icons: {
      icon: faviconUrl,
    },
  };
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
          playfairDisplay.variable
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
              {children}
          </Providers>
        </Suspense>
      </body>
    </html>
  );
}

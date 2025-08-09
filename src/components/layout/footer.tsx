
import Link from "next/link";
import Logo from "../logo";
import { Github, Twitter, Facebook, Instagram } from "lucide-react";
import { Button } from "../ui/button";

export default function Footer() {
  return (
    <footer className="border-t bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-12 text-center md:grid-cols-3 md:text-left">
          <div className="md:col-span-1">
            <div className="flex justify-center md:justify-start">
              <Logo as={Link} href="/" />
            </div>
            <p className="mt-4 max-w-sm text-secondary-foreground/80 mx-auto md:mx-0">
              The heart of the Indian community, all in one place. Discover events, connect with organizations, and find local deals.
            </p>
            <div className="mt-4 flex space-x-2 justify-center md:justify-start">
              <Button variant="ghost" size="icon" asChild className="text-secondary-foreground hover:bg-white/10 hover:text-secondary-foreground">
                <Link href="https://twitter.com/jivanindia" target="_blank" aria-label="JivanIndia on Twitter"><Twitter /></Link>
              </Button>
               <Button variant="ghost" size="icon" asChild className="text-secondary-foreground hover:bg-white/10 hover:text-secondary-foreground">
                <Link href="https://facebook.com/jivanindia" target="_blank" aria-label="JivanIndia on Facebook"><Facebook /></Link>
              </Button>
               <Button variant="ghost" size="icon" asChild className="text-secondary-foreground hover:bg-white/10 hover:text-secondary-foreground">
                <Link href="https://instagram.com/jivanindia" target="_blank" aria-label="JivanIndia on Instagram"><Instagram /></Link>
              </Button>
               <Button variant="ghost" size="icon" asChild className="text-secondary-foreground hover:bg-white/10 hover:text-secondary-foreground">
                <Link href="https://github.com/firebase/studio-jivan-india" target="_blank" aria-label="JivanIndia on GitHub"><Github /></Link>
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 md:col-span-2">
            <div>
              <h4 className="font-headline font-semibold">Explore</h4>
              <ul className="mt-4 space-y-2">
                <li><Link href="/events" className="text-secondary-foreground/80 hover:text-secondary-foreground">Events</Link></li>
                <li><Link href="/communities" className="text-secondary-foreground/80 hover:text-secondary-foreground">Communities</Link></li>
                <li><Link href="/businesses" className="text-secondary-foreground/80 hover:text-secondary-foreground">Businesses</Link></li>
                 <li><Link href="/movies" className="text-secondary-foreground/80 hover:text-secondary-foreground">Movies</Link></li>
                 <li><Link href="/deals" className="text-secondary-foreground/80 hover:text-secondary-foreground">Deals</Link></li>
                 <li><Link href="/careers" className="text-secondary-foreground/80 hover:text-secondary-foreground">Careers</Link></li>
                 <li><Link href="/sponsors" className="text-secondary-foreground/80 hover:text-secondary-foreground">Sponsors</Link></li>
              </ul>
            </div>
             <div>
              <h4 className="font-headline font-semibold">Resources</h4>
              <ul className="mt-4 space-y-2">
                <li><Link href="/about" className="text-secondary-foreground/80 hover:text-secondary-foreground">About Us</Link></li>
                <li><Link href="/contact" className="text-secondary-foreground/80 hover:text-secondary-foreground">Contact</Link></li>
                <li><Link href="/india" className="text-secondary-foreground/80 hover:text-secondary-foreground">About India</Link></li>
                <li><Link href="/festivals" className="text-secondary-foreground/80 hover:text-secondary-foreground">Festivals</Link></li>
              </ul>
            </div>
             <div>
              <h4 className="font-headline font-semibold">Legal</h4>
              <ul className="mt-4 space-y-2">
                <li><Link href="/legal" className="text-secondary-foreground/80 hover:text-secondary-foreground">Legal Center</Link></li>
                <li><Link href="/legal/privacy" className="text-secondary-foreground/80 hover:text-secondary-foreground">Privacy Policy</Link></li>
                <li><Link href="/legal/terms" className="text-secondary-foreground/80 hover:text-secondary-foreground">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-secondary-foreground/20 pt-8 text-center text-sm text-secondary-foreground/80">
          <p>&copy; {new Date().getFullYear()} JivanIndia.co. Built with love for the community. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

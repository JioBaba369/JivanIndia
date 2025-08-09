
import Link from "next/link";
import Logo from "../logo";
import { Github, Twitter, Facebook, Instagram } from "lucide-react";
import { Button } from "../ui/button";

export default function Footer() {
  return (
    <footer className="border-t text-white" style={{ backgroundColor: '#9D3DF3' }}>
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-12 text-center md:grid-cols-3 md:text-left">
          <div className="md:col-span-1">
            <div className="flex justify-center md:justify-start">
              <Logo as={Link} href="/" />
            </div>
            <p className="mt-4 max-w-sm text-white/80 mx-auto md:mx-0">
              The heart of the Indian community, all in one place. Discover events, connect with organizations, and find local deals.
            </p>
            <div className="mt-4 flex space-x-2 justify-center md:justify-start">
              <Button variant="ghost" size="icon" asChild className="text-white hover:bg-white/10 hover:text-white">
                <Link href="https://twitter.com/jivanindia" target="_blank" aria-label="JivanIndia on Twitter"><Twitter /></Link>
              </Button>
               <Button variant="ghost" size="icon" asChild className="text-white hover:bg-white/10 hover:text-white">
                <Link href="https://facebook.com/jivanindia" target="_blank" aria-label="JivanIndia on Facebook"><Facebook /></Link>
              </Button>
               <Button variant="ghost" size="icon" asChild className="text-white hover:bg-white/10 hover:text-white">
                <Link href="https://instagram.com/jivanindia" target="_blank" aria-label="JivanIndia on Instagram"><Instagram /></Link>
              </Button>
               <Button variant="ghost" size="icon" asChild className="text-white hover:bg-white/10 hover:text-white">
                <Link href="https://github.com/firebase/studio-jivan-india" target="_blank" aria-label="JivanIndia on GitHub"><Github /></Link>
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 md:col-span-2">
            <div>
              <h4 className="font-headline font-semibold">Explore</h4>
              <ul className="mt-4 space-y-2">
                <li><Link href="/events" className="text-white/80 hover:text-white">Events</Link></li>
                <li><Link href="/communities" className="text-white/80 hover:text-white">Communities</Link></li>
                <li><Link href="/businesses" className="text-white/80 hover:text-white">Businesses</Link></li>
                 <li><Link href="/movies" className="text-white/80 hover:text-white">Movies</Link></li>
                 <li><Link href="/deals" className="text-white/80 hover:text-white">Deals</Link></li>
                 <li><Link href="/careers" className="text-white/80 hover:text-white">Careers</Link></li>
                 <li><Link href="/sponsors" className="text-white/80 hover:text-white">Sponsors</Link></li>
              </ul>
            </div>
             <div>
              <h4 className="font-headline font-semibold">Resources</h4>
              <ul className="mt-4 space-y-2">
                <li><Link href="/about" className="text-white/80 hover:text-white">About Us</Link></li>
                <li><Link href="/contact" className="text-white/80 hover:text-white">Contact</Link></li>
                <li><Link href="/india" className="text-white/80 hover:text-white">About India</Link></li>
                <li><Link href="/festivals" className="text-white/80 hover:text-white">Festivals</Link></li>
              </ul>
            </div>
             <div>
              <h4 className="font-headline font-semibold">Legal</h4>
              <ul className="mt-4 space-y-2">
                <li><Link href="/legal" className="text-white/80 hover:text-white">Legal Center</Link></li>
                <li><Link href="/legal/privacy" className="text-white/80 hover:text-white">Privacy Policy</Link></li>
                <li><Link href="/legal/terms" className="text-white/80 hover:text-white">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-white/20 pt-8 text-center text-sm text-white/80">
          <p>&copy; {new Date().getFullYear()} JivanIndia.co. Built with love for the community. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

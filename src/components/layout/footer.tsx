
import Link from "next/link";
import Logo from "../logo";
import { Github, Twitter, Facebook, Instagram, Wand2 } from "lucide-react";
import { Button } from "../ui/button";

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <Logo as={Link} href="/" />
            <p className="mt-4 max-w-sm text-muted-foreground">
              The heart of the Indian community, all in one place. Discover events, connect with organizations, and find local deals.
            </p>
            <div className="mt-4 flex space-x-2">
              <Button variant="ghost" size="icon" asChild>
                <Link href="https://twitter.com/jivanindia" target="_blank"><Twitter /></Link>
              </Button>
               <Button variant="ghost" size="icon" asChild>
                <Link href="https://facebook.com/jivanindia" target="_blank"><Facebook /></Link>
              </Button>
               <Button variant="ghost" size="icon" asChild>
                <Link href="https://instagram.com/jivanindia" target="_blank"><Instagram /></Link>
              </Button>
               <Button variant="ghost" size="icon" asChild>
                <Link href="https://github.com/firebase/studio-jivan-india" target="_blank"><Github /></Link>
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8 md:col-span-2">
            <div>
              <h4 className="font-headline font-semibold">Explore</h4>
              <ul className="mt-4 space-y-2">
                <li><Link href="/" className="text-muted-foreground hover:text-primary">What's On</Link></li>
                <li><Link href="/communities" className="text-muted-foreground hover:text-primary">Communities</Link></li>
                <li><Link href="/providers" className="text-muted-foreground hover:text-primary">Providers</Link></li>
                <li><Link href="/movies" className="text-muted-foreground hover:text-primary">Movies</Link></li>
                <li><Link href="/deals" className="text-muted-foreground hover:text-primary">Deals</Link></li>
                <li><Link href="/sponsors" className="text-muted-foreground hover:text-primary">Sponsors</Link></li>
                <li><Link href="/careers" className="text-muted-foreground hover:text-primary">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-headline font-semibold">Resources</h4>
              <ul className="mt-4 space-y-2">
                <li><Link href="/about" className="text-muted-foreground hover:text-primary">About Us</Link></li>
                <li><Link href="/contact" className="text-muted-foreground hover:text-primary">Contact Us</Link></li>
                <li><Link href="/legal" className="text-muted-foreground hover:text-primary">Legal Center</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} JivanIndia.co. Built with love for the community. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

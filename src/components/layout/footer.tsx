
import Link from "next/link";
import Logo from "../logo";

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <Logo />
            </Link>
            <p className="mt-4 text-muted-foreground">
              The heart of the Indian community, all in one place.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 md:col-span-3 md:grid-cols-3">
            <div>
              <h4 className="font-headline font-semibold">Explore</h4>
              <ul className="mt-4 space-y-2">
                <li><Link href="/" className="text-muted-foreground hover:text-primary">What's On</Link></li>
                <li><Link href="/organizations" className="text-muted-foreground hover:text-primary">Organizations</Link></li>
                <li><Link href="/providers" className="text-muted-foreground hover:text-primary">Providers</Link></li>
                <li><Link href="/sponsors" className="text-muted-foreground hover:text-primary">Sponsors</Link></li>
                <li><Link href="/movies" className="text-muted-foreground hover:text-primary">Movies</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-headline font-semibold">Resources</h4>
              <ul className="mt-4 space-y-2">
                <li><Link href="/deals" className="text-muted-foreground hover:text-primary">Deals</Link></li>
                <li><Link href="/careers" className="text-muted-foreground hover:text-primary">Careers</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-primary">Help Center</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-headline font-semibold">Legal</h4>
              <ul className="mt-4 space-y-2">
                <li><Link href="#" className="text-muted-foreground hover:text-primary">Privacy Policy</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-primary">Terms of Service</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-primary">Disclaimer</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} JivanIndia.co. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

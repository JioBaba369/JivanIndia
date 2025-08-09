'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, MapPin, Search, Ticket, Tag, ArrowRight, Users, Building, Film, Briefcase, Megaphone, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { useEvents } from "@/hooks/use-events";
import { useDeals } from "@/hooks/use-deals";
import { format } from "date-fns";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

// Define TypeScript interfaces for events and deals
interface Event {
  id: string;
  status: string;
  startDateTime: string;
  imageUrl: string;
  title: string;
  eventType: string;
  location: { venueName: string };
  isFeatured?: boolean;
}

interface Deal {
  id: string;
  imageUrl: string;
  title: string;
  description: string;
  category: string;
  business: string;
  expires: string;
}

export default function HomePage() {
  const { events, isLoading: isLoadingEvents, error: eventsError } = useEvents();
  const { deals, isLoading: isLoadingDeals, error: dealsError } = useDeals();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCategory, setSearchCategory] = useState('events');

  // Filter and sort events
  const approvedEvents = (events as Event[] || []).filter(e => e?.status === 'Approved');
  const latestEvents = approvedEvents
    .filter(e => e?.startDateTime && new Date(e.startDateTime) > new Date())
    .sort((a, b) => new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime())
    .slice(0, 3);
  const latestDeals = (deals as Deal[] || []).slice(0, 3);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const basePath = `/${searchCategory}`;
    const query = searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : '';
    router.push(`${basePath}${query}`);
  };

  // Reusable Skeleton Component
  const CardSkeleton = ({ count = 3 }: { count?: number }) => (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="flex flex-col overflow-hidden">
          <Skeleton className="h-56 w-full" />
          <CardContent className="flex flex-grow flex-col p-6">
            <Skeleton className="h-5 w-1/4 mb-4" />
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2 flex-grow mt-2" />
            <Skeleton className="h-10 w-full mt-6" />
          </CardContent>
        </Card>
      ))}
    </>
  );

  const categoryLinks = [
    { href: '/events', icon: Calendar, label: 'Events' },
    { href: '/deals', icon: Tag, label: 'Deals' },
    { href: '/communities', icon: Users, label: 'Communities' },
    { href: '/businesses', icon: Building, label: 'Businesses' },
    { href: '/careers', icon: Briefcase, label: 'Careers' },
    { href: '/movies', icon: Film, label: 'Movies' },
  ];

  return (
    <div className="flex flex-col bg-background">
      {/* Hero Section */}
      <section className="relative h-[60vh] md:h-[70vh] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://placehold.co/1920x1080.png"
            alt="Community events background"
            fill
            className="object-cover"
            priority
            data-ai-hint="indian festival crowd"
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>
        <div className="container relative z-10 mx-auto flex h-full flex-col items-center justify-center text-center text-white">
          <div className="bg-black/40 p-8 rounded-lg backdrop-blur-sm">
            <h1 className="font-headline text-5xl md:text-7xl font-bold leading-tight">The Heartbeat of Our Community</h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-slate-200">
              Discover local events, connect with community groups, support businesses, and find deals all in one place.
            </p>
            <form onSubmit={handleSearch} className="mt-8 max-w-2xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-2">
                <label htmlFor="search-input" className="sr-only">Search for events, businesses, or more</label>
                <Input
                  id="search-input"
                  type="search"
                  placeholder="Search for events, businesses..."
                  className="flex-grow text-lg text-black"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Select value={searchCategory} onValueChange={setSearchCategory}>
                  <SelectTrigger className="w-full sm:w-[180px] text-lg text-black" aria-label="Select search category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryLinks.map(cat => (
                      <SelectItem key={cat.label} value={cat.href.substring(1)}>{cat.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button type="submit" size="lg" className="text-lg" aria-label="Search">
                  <Search className="mr-2" />
                  Search
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Category Links */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-center">
            {categoryLinks.map(({ href, icon: Icon, label }) => (
              <Link key={href} href={href} className="group" aria-label={`Explore ${label}`}>
                <Card className="p-6 h-full flex flex-col items-center justify-center transition-all duration-300 hover:bg-accent hover:text-accent-foreground hover:-translate-y-2 shadow-sm hover:shadow-lg">
                  <Icon className="h-10 w-10 mb-2 text-primary" />
                  <h3 className="font-semibold">{label}</h3>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="bg-muted/40 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="font-headline text-3xl font-bold">Upcoming Events</h2>
            <Button variant="link" asChild>
              <Link href="/events" aria-label="View all events">View All <ArrowRight className="ml-2" /></Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {eventsError ? (
              <div className="col-span-full text-center text-destructive">Unable to load events. Please try again later.</div>
            ) : isLoadingEvents ? (
              <CardSkeleton />
            ) : latestEvents.length > 0 ? (
              latestEvents.map((event) => (
                <Card
                  key={event.id}
                  className={cn(
                    "group flex flex-col overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl",
                    event.isFeatured && "border-primary border-2"
                  )}
                >
                  <Link href={`/events/${event.id}`} className="flex h-full flex-col" aria-label={`View ${event.title}`}>
                    <div className="relative aspect-video w-full">
                      <Image
                        src={event.imageUrl || 'https://placehold.co/600x400.png'}
                        alt={`Event: ${event.title}`}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      {event.isFeatured && (
                        <Badge className="absolute left-3 top-3">
                          <Star className="mr-1 h-3 w-3" /> Featured
                        </Badge>
                      )}
                    </div>
                    <CardContent className="flex flex-grow flex-col p-6">
                      <Badge variant="secondary" className="w-fit">{event.eventType}</Badge>
                      <h3 className="font-headline flex-grow text-xl font-semibold mt-4 group-hover:text-primary">{event.title}</h3>
                      <div className="mt-4 flex flex-col space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {(() => {
                              try {
                                return format(new Date(event.startDateTime), 'eee, MMM d, p');
                              } catch {
                                return 'Invalid date';
                              }
                            })()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span>{event.location?.venueName || 'Unknown location'}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              ))
            ) : (
              <div className="rounded-lg border-2 border-dashed border-muted-foreground/20 py-12 text-center col-span-full">
                <div className="flex justify-center mb-4">
                  <Megaphone className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="font-headline text-xl font-semibold">Your Community's Stage is Empty</h3>
                <p className="text-muted-foreground mt-2">Be the first to share an event and bring everyone together.</p>
                <Button asChild className="mt-4">
                  <Link href="/events/new" aria-label="Post a new event">Post an Event</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Latest Deals */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="font-headline text-4xl font-bold mb-8 text-center">Latest Deals</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {dealsError ? (
              <div className="col-span-full text-center text-destructive">Unable to load deals. Please try again later.</div>
            ) : isLoadingDeals ? (
              <CardSkeleton />
            ) : latestDeals.length > 0 ? (
              latestDeals.map((deal) => (
                <Card
                  key={deal.id}
                  className="group flex flex-col overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1"
                >
                  <div className="relative aspect-video w-full">
                    <Link href={`/deals/${deal.id}`} aria-label={`View ${deal.title}`}>
                      <Image
                        src={deal.imageUrl || 'https://placehold.co/600x400.png'}
                        alt={`Deal: ${deal.title}`}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </Link>
                    <Badge variant="secondary" className="absolute top-3 right-3">{deal.category}</Badge>
                  </div>
                  <CardContent className="flex flex-grow flex-col p-4">
                    <Link href={`/deals/${deal.id}`} className="group/link flex-grow" aria-label={`View ${deal.title}`}>
                      <CardTitle className="mb-2 text-xl group-hover/link:text-primary">{deal.title}</CardTitle>
                      <p className="text-sm text-muted-foreground line-clamp-2 flex-grow">{deal.description}</p>
                    </Link>
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Building className="mr-2 h-4 w-4 text-primary" />
                        <span>{deal.business}</span>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="mr-2 h-4 w-4 text-primary" />
                        <span>
                          {(() => {
                            try {
                              return `Expires ${format(new Date(deal.expires), 'PP')}`;
                            } catch {
                              return 'Invalid date';
                            }
                          })()}
                        </span>
                      </div>
                    </div>
                    <Button asChild variant="link" className="p-0 h-auto justify-start mt-4">
                      <Link href={`/deals/${deal.id}`} aria-label={`View details for ${deal.title}`}>
                        View Details <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="rounded-lg border-2 border-dashed border-muted-foreground/20 py-12 text-center col-span-full">
                <div className="flex justify-center mb-4">
                  <Tag className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="font-headline text-xl font-semibold">Unlock Community Savings</h3>
                <p className="text-muted-foreground mt-2">No deals are available right now. Be the first to post one!</p>
                <Button asChild className="mt-4">
                  <Link href="/deals/new" aria-label="Post a new deal">Post a Deal</Link>
                </Button>
              </div>
            )}
          </div>
          <div className="text-center mt-12">
            <Button asChild>
              <Link href="/deals" aria-label="See all deals">
                See All Deals <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
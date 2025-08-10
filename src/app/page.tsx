
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, MapPin, Search, Tag, ArrowRight, Users, Building, Film, Briefcase, Megaphone, Star } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { useEvents } from "@/hooks/use-events";
import { useDeals } from "@/hooks/use-deals";
import { format, addDays } from "date-fns";
import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import Image from "next/image";

export default function HomePage() {
  const { events, isLoading: isLoadingEvents, error: eventsError } = useEvents();
  const { deals, isLoading: isLoadingDeals, error: dealsError } = useDeals();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCategory, setSearchCategory] = useState('events');

  const approvedEvents = useMemo(() => (events || []).filter(e => e?.status === 'Approved'), [events]);

  const latestEvents = useMemo(() => {
    const now = new Date();
    const ninetyDaysFromNow = addDays(now, 90);
    return approvedEvents
      .filter(e => {
        if (!e?.startDateTime) return false;
        const eventDate = new Date(e.startDateTime);
        return eventDate > now && eventDate < ninetyDaysFromNow;
      })
      .sort((a, b) => new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime())
      .slice(0, 3);
  }, [approvedEvents]);

  const latestDeals = useMemo(() => (deals || []).slice(0, 3), [deals]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const basePath = `/${searchCategory}`;
    const query = searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : '';
    router.push(`${basePath}${query}`);
  };

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
      <section className="relative h-[70vh] md:h-[80vh] flex items-center justify-center bg-primary/10">
         <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        <div className="container relative z-10 mx-auto flex h-full flex-col items-center justify-center text-center px-4">
          <div className="p-4 md:p-8 rounded-lg">
            <h1 className="font-body text-4xl sm:text-5xl md:text-7xl font-bold leading-tight text-shadow-lg">Jivan: An Indian Community, For The People, By The People</h1>
            <p className="mt-4 max-w-3xl mx-auto text-base sm:text-lg md:text-xl text-foreground/90 text-shadow">
              Discover local events, connect with community groups, support businesses, and find deals all in one place.
            </p>
            <form onSubmit={handleSearch} className="mt-8 max-w-2xl mx-auto">
              <Card className="p-2 rounded-full shadow-lg">
              <div className="flex items-center">
                <div className="relative flex-grow">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="search-input"
                      type="search"
                      placeholder="Search for events, businesses..."
                      className="pl-11 pr-2 w-full border-0 focus-visible:ring-0 text-base bg-transparent"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <Select value={searchCategory} onValueChange={setSearchCategory}>
                  <SelectTrigger className="w-auto border-0 bg-transparent focus:ring-0 focus:bg-muted" aria-label="Select search category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryLinks.map(cat => (
                      <SelectItem key={cat.label} value={cat.href.substring(1)}>{cat.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button type="submit" size="icon" className="rounded-full w-10 h-10 sm:w-12 sm:h-12" aria-label="Search">
                  <Search />
                </Button>
              </div>
              </Card>
            </form>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-center">
            {categoryLinks.map(({ href, icon: Icon, label }) => (
              <Link key={href} href={href} className="group" aria-label={`Explore ${label}`}>
                <Card className="p-4 sm:p-6 h-full flex flex-col items-center justify-center transition-all duration-300 hover:bg-card hover:-translate-y-2 shadow-sm hover:shadow-primary/20 hover:border-primary/50">
                  <Icon className="h-8 w-8 sm:h-10 sm:w-10 mb-2 text-primary" />
                  <h3 className="font-semibold text-sm sm:text-base">{label}</h3>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20 bg-background">
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
                    "group flex flex-col overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl bg-card",
                    event.isFeatured && "border-primary border-2 shadow-primary/10"
                  )}
                >
                  <Link href={`/events/${event.id}`} className="flex h-full flex-col" aria-label={`View ${event.title}`}>
                    <div className="relative h-48 w-full">
                        <Image src={event.imageUrl} alt={event.title} fill className="object-cover" data-ai-hint="event photo"/>
                    </div>
                    <CardContent className="flex flex-grow flex-col p-6">
                      <Badge variant="secondary" className="w-fit">{event.eventType}</Badge>
                      <h3 className="font-headline flex-grow text-xl font-semibold mt-4 group-hover:text-primary">{event.title}</h3>
                      <div className="mt-4 flex flex-col space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-primary" />
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
                          <MapPin className="h-4 w-4 text-primary" />
                          <span>{event.location?.venueName || 'Unknown location'}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              ))
            ) : (
              <div className="rounded-lg border-2 border-dashed py-12 text-center col-span-full">
                <div className="flex justify-center mb-4">
                  <Megaphone className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="font-headline text-xl font-semibold">Your Community's Stage is Empty</h3>
                <p className="text-muted-foreground mt-2">Be the first to share an event and bring everyone together.</p>
                <Button asChild className="mt-4" variant="secondary">
                  <Link href="/events/new" aria-label="Post a new event">Post an Event</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20 bg-muted/20">
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
                  <CardContent className="flex flex-grow flex-col p-4">
                    <Link href={`/deals/${deal.id}`} className="group/link flex-grow" aria-label={`View ${deal.title}`}>
                      <h3 className="mb-2 text-xl font-bold group-hover/link:text-primary">{deal.title}</h3>
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

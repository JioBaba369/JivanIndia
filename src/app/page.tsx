
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
import { Calendar, MapPin, Search, Ticket, Tag, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { useEvents } from "@/hooks/use-events";
import { useDeals } from "@/hooks/use-deals";
import { format } from "date-fns";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Skeleton } from "@/components/ui/skeleton";

export default function HomePage() {
  const { events, isLoading: isLoadingEvents } = useEvents();
  const { deals, isLoading: isLoadingDeals } = useDeals();

  const latestEvents = events.filter(e => e.status === 'Approved').slice(0, 3);
  const latestDeals = deals.slice(0, 3);
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCategory, setSearchCategory] = useState('events');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) {
      router.push(`/${searchCategory}`);
    } else {
      router.push(`/${searchCategory}?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const EventSkeletons = () => (
    Array.from({ length: 3 }).map((_, i) => (
      <Card key={i} className="flex flex-col overflow-hidden">
        <Skeleton className="h-56 w-full" />
        <CardContent className="flex flex-grow flex-col p-6">
          <Skeleton className="h-5 w-1/4 mb-4" />
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-6 w-1/2" />
          <div className="mt-4 space-y-3">
             <Skeleton className="h-4 w-full" />
             <Skeleton className="h-4 w-5/6" />
          </div>
        </CardContent>
      </Card>
    ))
  );

  const DealSkeletons = () => (
    Array.from({ length: 3 }).map((_, i) => (
       <Card key={i} className="flex flex-col overflow-hidden">
        <Skeleton className="h-56 w-full" />
        <CardContent className="flex flex-grow flex-col p-6">
          <Skeleton className="h-5 w-1/4 mb-4" />
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2 flex-grow mt-2" />
          <Skeleton className="h-10 w-full mt-6" />
        </CardContent>
      </Card>
    ))
  );


  return (
    <div className="flex flex-col bg-background">
      <section className="relative bg-background py-24 md:py-32">
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://images.unsplash.com/photo-1594917409245-8a245973c8b4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw0fHxJbmRpYW4lMjBmZXN0aXZhbCUyMGNyb3dkfGVufDB8fHx8MTc1NDE5NzQzNnww&ixlib=rb-4.1.0&q=80&w=1080"
            alt="A vibrant Indian festival with a large, joyful crowd"
            fill
            className="object-cover opacity-10"
            priority
            data-ai-hint="festival crowd"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        </div>
        <div className="container relative mx-auto px-4 text-center">
          <h1 className="font-headline text-5xl font-bold md:text-7xl text-foreground text-shadow">
            The Heart of the Indian Community
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg text-foreground/80 text-shadow">
            Your one-stop destination for discovering events, connecting with community organizations, finding local deals, and exploring movies.
          </p>
          <div className="mt-10 max-w-2xl mx-auto">
            <form onSubmit={handleSearch}>
              <div className="grid grid-cols-1 gap-2 md:grid-cols-[1fr_auto_auto] p-2 rounded-lg bg-card/80 backdrop-blur-sm border shadow-lg">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                      placeholder="Search for events, deals, and more..."
                      className="h-12 rounded-md border-0 bg-transparent pl-12 text-base focus-visible:ring-0 focus-visible:ring-offset-0"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={searchCategory} onValueChange={setSearchCategory}>
                  <SelectTrigger className="h-12 rounded-md border-0 text-base focus:ring-0 focus:ring-offset-0 bg-transparent">
                      <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                      <SelectItem value="events">Events</SelectItem>
                      <SelectItem value="communities">Communities</SelectItem>
                      <SelectItem value="deals">Deals</SelectItem>
                      <SelectItem value="movies">Movies</SelectItem>
                  </SelectContent>
                </Select>
                <Button type="submit" size="lg" className="h-12 w-full text-base">
                    Search
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>

      <section className="bg-muted/40 py-16 md:py-24">
        <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
                <h2 className="font-headline text-3xl font-bold">Upcoming Events</h2>
                <Button variant="link" asChild>
                    <Link href="/events">View All <ArrowRight className="ml-2" /></Link>
                </Button>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {isLoadingEvents ? <EventSkeletons /> : (
                latestEvents.length > 0 ? (
                    latestEvents.map((event) => (
                      <Card key={event.id} className="group flex flex-col overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1">
                        <Link href={`/events/${event.id}`} className="flex h-full flex-col">
                          <div className="relative h-56 w-full">
                            <Image
                              src={event.imageUrl}
                              alt={event.title}
                              fill
                              className="object-cover transition-transform duration-300 group-hover:scale-105"
                              data-ai-hint="event photo"
                            />
                          </div>
                          <CardContent className="flex flex-grow flex-col p-6">
                            <Badge variant="secondary" className="w-fit">{event.eventType}</Badge>
                            <h3 className="font-headline flex-grow text-xl font-semibold mt-4 group-hover:text-primary">{event.title}</h3>
                            <div className="mt-4 flex flex-col space-y-2 text-sm text-muted-foreground">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                <span>{format(new Date(event.startDateTime), 'eee, MMM d, p')}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                <span>{event.location.venueName}</span>
                              </div>
                            </div>
                          </CardContent>
                        </Link>
                      </Card>
                    ))
                ) : (
                    <div className="rounded-lg border-2 border-dashed border-muted-foreground/20 py-12 text-center col-span-full">
                      <h3 className="font-headline text-xl font-semibold">No Events Yet</h3>
                      <p className="text-muted-foreground mt-2">No upcoming events right now. Check back soon or be the first to post one!</p>
                    </div>
                )
              )}
            </div>
        </div>
      </section>
      
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
                <h2 className="font-headline text-3xl font-bold">Latest Community Deals</h2>
                <Button variant="link" asChild>
                    <Link href="/deals">View All <ArrowRight className="ml-2" /></Link>
                </Button>
            </div>
             <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {isLoadingDeals ? <DealSkeletons /> : (
                latestDeals.length > 0 ? (
                  latestDeals.map((deal) => (
                    <Card key={deal.id} className="group flex flex-col overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1">
                      <Link href={`/deals/${deal.id}`} className="flex h-full flex-col">
                        <div className="relative h-56 w-full">
                          <Image
                            src={deal.imageUrl}
                            alt={deal.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            data-ai-hint="deal photo"
                          />
                        </div>
                        <CardContent className="flex flex-grow flex-col p-6">
                          <Badge variant="secondary" className="w-fit">{deal.category}</Badge>
                          <h3 className="font-headline mt-4 text-xl font-semibold group-hover:text-primary">{deal.title}</h3>
                          <p className="flex-grow mt-2 text-muted-foreground text-sm">{deal.business}</p>
                          <Button variant="secondary" className="mt-6 w-full">
                            <Tag className="mr-2 h-4 w-4" />
                            View Deal
                          </Button>
                        </CardContent>
                      </Link>
                    </Card>
                  ))
              ) : (
                <div className="rounded-lg border-2 border-dashed border-muted-foreground/20 py-12 text-center col-span-full">
                  <h3 className="font-headline text-xl font-semibold">No Deals Available</h3>
                  <p className="text-muted-foreground mt-2">No active deals right now. Check back soon or post a deal for your business!</p>
                </div>
              ))}
            </div>
        </div>
      </section>
    </div>
  );
}

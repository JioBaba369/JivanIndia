
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
import { deals } from "@/data/deals";
import { format } from "date-fns";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const { events } = useEvents();
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


  return (
    <div className="flex flex-col bg-background">
      <section className="relative bg-background py-24 md:py-32">
        <div className="container relative mx-auto px-4 text-center">
          <h1 className="font-headline text-5xl font-bold md:text-7xl text-foreground">
            The Heart of the Indian Community
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg text-foreground/80">
            Your one-stop destination for discovering events, connecting with community organizations, finding local deals, and exploring movies.
          </p>
          <div className="mt-10 max-w-2xl mx-auto">
            <form onSubmit={handleSearch}>
              <div className="grid grid-cols-1 gap-2 md:grid-cols-[1fr_auto_auto] p-2 rounded-lg bg-card/60 backdrop-blur-sm border">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                      placeholder="Search for events, communities, deals..."
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

      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="space-y-16 md:space-y-24">
          <div>
            <div className="flex justify-between items-center mb-8">
                <h2 className="font-headline text-3xl font-bold">Upcoming Events</h2>
                <Button variant="link" asChild>
                    <Link href="/events">View All <ArrowRight className="ml-2" /></Link>
                </Button>
            </div>
            {latestEvents.length > 0 ? (
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {latestEvents.map((event) => (
                    <Card key={event.id} className="group flex flex-col overflow-hidden transition-all hover:shadow-xl">
                      <Link href={`/events/${event.id}`} className="flex h-full flex-col">
                        <div className="relative h-56 w-full">
                          <Image
                            src={event.imageUrl}
                            alt={event.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
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
                  ))}
                </div>
            ) : (
                <div className="rounded-lg border-2 border-dashed border-muted py-12 text-center">
                  <h3 className="font-headline text-xl font-semibold">No Events Yet</h3>
                  <p className="text-muted-foreground mt-2">No upcoming events right now. Check back soon or be the first to post one!</p>
                </div>
            )}
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-8">
                <h2 className="font-headline text-3xl font-bold">Latest Community Deals</h2>
                <Button variant="link" asChild>
                    <Link href="/deals">View All <ArrowRight className="ml-2" /></Link>
                </Button>
            </div>
             {latestDeals.length > 0 ? (
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {latestDeals.map((deal) => (
                    <Card key={deal.id} className="group flex flex-col overflow-hidden transition-all hover:shadow-xl">
                      <Link href={`/deals/${deal.id}`} className="flex h-full flex-col">
                        <div className="relative h-56 w-full">
                          <Image
                            src={deal.imageUrl}
                            alt={deal.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
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
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border-2 border-dashed border-muted py-12 text-center">
                  <h3 className="font-headline text-xl font-semibold">No Deals Available</h3>
                  <p className="text-muted-foreground mt-2">No active deals right now. Check back soon or post a deal for your business!</p>
                </div>
              )}
          </div>
        </div>
      </section>
    </div>
  );
}

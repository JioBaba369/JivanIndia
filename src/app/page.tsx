
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
import { Calendar, MapPin, Search, Ticket, Tag, ArrowRight, Users, Building, Film, Briefcase, Heart, Handshake, Megaphone, Star } from "lucide-react";
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

export default function HomePage() {
  const { events, isLoading: isLoadingEvents } = useEvents();
  const { deals, isLoading: isLoadingDeals } = useDeals();
  
  const approvedEvents = events.filter(e => e.status === 'Approved');
  const latestEvents = approvedEvents.filter(e => new Date(e.startDateTime) > new Date()).sort((a, b) => new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime()).slice(0, 3);
  const latestDeals = deals.slice(0, 3);
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCategory, setSearchCategory] = useState('events');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const basePath = `/${searchCategory}`;
    const query = searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : '';
    router.push(`${basePath}${query}`);
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
      <section className="relative h-[60vh] md:h-[70vh] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://images.unsplash.com/photo-1594917409245-8a245973c8b4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw0fHxJbmRpYW4lMjBmZXN0aXZhbCUyMGNyb3dkfGVufDB8fHx8MTc1NDE5NzQzNnww&ixlib=rb-4.1.0&q=80&w=1080"
            alt="A vibrant Indian festival with a large, joyful crowd"
            fill
            className="object-cover"
            priority
            data-ai-hint="festival crowd"
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>
        <div className="container relative z-10 mx-auto flex h-full flex-col items-center justify-center text-center text-white">
            <div className="bg-black/40 p-8 rounded-lg backdrop-blur-sm">
                <h1 className="font-headline text-5xl md:text-7xl font-bold leading-tight">The Heartbeat of Our Community</h1>
                <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-slate-200">Discover local events, connect with community groups, support businesses, and find deals all in one place.</p>
                 <form onSubmit={handleSearch} className="mt-8 max-w-2xl mx-auto">
                    <div className="flex flex-col sm:flex-row gap-2">
                        <Input 
                            type="search"
                            placeholder="Search for events, businesses..."
                            className="flex-grow text-lg text-black"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                         <Select value={searchCategory} onValueChange={setSearchCategory}>
                            <SelectTrigger className="w-full sm:w-[180px] text-lg text-black">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {categoryLinks.map(cat => <SelectItem key={cat.label} value={cat.href.substring(1)}>{cat.label}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <Button type="submit" size="lg" className="text-lg">
                            <Search className="mr-2"/>
                            Search
                        </Button>
                    </div>
                </form>
            </div>
        </div>
      </section>

       <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-center">
            {categoryLinks.map(({ href, icon: Icon, label }) => (
              <Link key={href} href={href} className="group">
                <Card className="p-6 h-full flex flex-col items-center justify-center transition-all duration-300 hover:bg-accent hover:text-accent-foreground hover:-translate-y-2 shadow-sm hover:shadow-lg">
                  <Icon className="h-10 w-10 mb-2 text-primary" />
                  <h3 className="font-semibold">{label}</h3>
                </Card>
              </Link>
            ))}
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
                      <Card key={event.id} className={cn("group flex flex-col overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl", event.isFeatured && "border-primary border-2")}>
                        <Link href={`/events/${event.id}`} className="flex h-full flex-col">
                          <div className="relative h-56 w-full">
                            <Image
                              src={event.imageUrl}
                              alt={event.title}
                              fill
                              className="object-cover transition-transform duration-300 group-hover:scale-105"
                              data-ai-hint="event photo"
                            />
                             {event.isFeatured && <Badge className="absolute left-3 top-3"><Star className="mr-1 h-3 w-3" />Featured</Badge>}
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
                        <div className="flex justify-center mb-4">
                            <Megaphone className="h-12 w-12 text-muted-foreground" />
                        </div>
                        <h3 className="font-headline text-xl font-semibold">Your Community's Stage is Empty</h3>
                        <p className="text-muted-foreground mt-2">Be the first to share an event and bring everyone together.</p>
                        <Button asChild className="mt-4">
                            <Link href="/events/new">Post an Event</Link>
                        </Button>
                    </div>
                )
              )}
            </div>
        </div>
      </section>
      
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
            <h2 className="font-headline text-4xl font-bold mb-8 text-center">Latest Deals</h2>
             <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {isLoadingDeals ? <DealSkeletons /> : (
                latestDeals.length > 0 ? (
                  latestDeals.map((deal) => (
                    <Card key={deal.id} className="group flex flex-col overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1">
                      <Link href={`/deals/${deal.id}`} className="flex h-full flex-col">
                        <div className="relative h-48 w-full">
                           <Image
                            src={deal.imageUrl}
                            alt={deal.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            data-ai-hint="deal photo"
                          />
                          <Badge variant="secondary" className="absolute top-3 right-3">{deal.category}</Badge>
                        </div>
                        <CardContent className="flex flex-grow flex-col p-4">
                            <CardTitle className="mb-2 text-xl group-hover:text-primary">{deal.title}</CardTitle>
                            <p className="text-sm text-muted-foreground line-clamp-2">{deal.description}</p>
                            <div className="mt-4 space-y-2">
                                <div className="flex items-center text-sm text-muted-foreground">
                                    <Building className="mr-2 h-4 w-4 text-primary"/>
                                    <span>{deal.business}</span>
                                </div>
                                <div className="flex items-center text-sm text-muted-foreground">
                                    <Calendar className="mr-2 h-4 w-4 text-primary"/>
                                    <span>Expires {format(new Date(deal.expires), 'PP')}</span>
                                </div>
                            </div>
                        </CardContent>
                        <div className="flex items-center p-4 pt-0 mt-auto">
                            <span className="text-primary font-semibold hover:underline">
                                View Details <ArrowRight className="ml-1 inline-block h-4 w-4" />
                            </span>
                        </div>
                      </Link>
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
                        <Link href="/deals/new">Post a Deal</Link>
                    </Button>
                </div>
              ))}
            </div>
             <div className="text-center mt-12">
                <Button asChild>
                    <Link href="/deals">
                    See All Deals <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
            </div>
        </div>
      </section>
    </div>
  );
}


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
import { Calendar, MapPin, Search, Ticket, Briefcase, Tag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useEvents } from "@/hooks/use-events";
import { deals } from "./deals/page";
import { jobs } from "./careers/page";
import { format } from "date-fns";

export default function HomePage() {
  const { events } = useEvents();
  const latestEvents = events.filter(e => e.status === 'Approved').slice(0, 3);
  const latestDeals = deals.slice(0, 3);
  const latestJobs = jobs.slice(0, 3);

  return (
    <div className="flex flex-col">
      <section className="relative bg-background text-white">
        <div className="absolute inset-0">
            <Image 
                src="https://images.unsplash.com/photo-1594917409245-8a245973c8b4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw0fHxJbmRpYW4lMjBmZXN0aXZhbCUyMGNyb3dkfGVufDB8fHx8MTc1NDE5NzQzNnww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Indian festival crowd"
                fill
                className="object-cover"
                priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
        </div>
        <div className="container relative mx-auto px-4 py-24 text-center">
          <h1 className="font-headline text-4xl font-bold text-shadow-lg md:text-6xl">
            Discover What's On
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-shadow">
            The heart of the Indian community, all in one place. Explore
            events, connect with organizations, and find what you need.
          </p>
          <div className="mt-8">
            <Card className="mx-auto max-w-4xl text-foreground">
                <CardContent className="p-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="relative md:col-span-2">
                    <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search for events, communities, deals..."
                        className="pl-10"
                    />
                    </div>
                    <Select>
                    <SelectTrigger>
                        <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="events">Events</SelectItem>
                        <SelectItem value="communities">Communities</SelectItem>
                        <SelectItem value="deals">Deals</SelectItem>
                        <SelectItem value="careers">Careers</SelectItem>
                    </SelectContent>
                    </Select>
                     <Button className="w-full">
                        Search
                    </Button>
                </div>
                </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <Tabs defaultValue="events" className="w-full">
          <div className="mb-10 flex justify-center">
            <TabsList className="grid w-full max-w-lg grid-cols-3">
              <TabsTrigger value="events">Upcoming Events</TabsTrigger>
              <TabsTrigger value="deals">Community Deals</TabsTrigger>
              <TabsTrigger value="careers">Job Openings</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="events">
             {latestEvents.length > 0 ? <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {latestEvents.map((event) => (
                <Card key={event.id} className="group flex flex-col overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg">
                  <Link href={`/events/${event.id}`} className="flex h-full flex-col">
                    <div className="relative h-48 w-full">
                      <Image
                        src={event.imageUrl}
                        alt={event.title}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                      <Badge variant="secondary" className="absolute top-2 right-2">{event.eventType}</Badge>
                    </div>
                    <CardContent className="flex flex-grow flex-col p-6">
                      <h3 className="font-headline flex-grow text-xl font-bold group-hover:text-primary">{event.title}</h3>
                      <div className="mt-4 flex flex-col space-y-2 text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>{format(new Date(event.startDateTime), 'eee, MMM d, p')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span>{event.location.venueName}</span>
                        </div>
                      </div>
                      <Button variant="outline" className="mt-6 w-full">
                        <Ticket className="mr-2 h-4 w-4" />
                        View Event
                      </Button>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div> : (
                 <div className="rounded-lg border-2 border-dashed py-12 text-center">
                    <p className="text-muted-foreground">No upcoming events right now. Check back soon!</p>
                </div>
            )}
             <div className="mt-12 text-center">
                <Button asChild>
                    <Link href="/events">View All Events</Link>
                </Button>
            </div>
          </TabsContent>

          <TabsContent value="deals">
             {latestDeals.length > 0 ? <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {latestDeals.map((deal) => (
                <Card key={deal.id} className="group flex flex-col overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg">
                  <Link href={`/deals/${deal.id}`} className="flex h-full flex-col">
                    <div className="relative h-48 w-full">
                      <Image
                        src={deal.imageUrl}
                        alt={deal.title}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                    <CardContent className="flex flex-grow flex-col p-6">
                        <Badge variant="secondary" className="w-fit">{deal.category}</Badge>
                      <h3 className="font-headline mt-2 flex-grow text-xl font-bold group-hover:text-primary">{deal.title}</h3>
                      <div className="mt-4 flex items-center gap-2 text-muted-foreground">
                          <span className="text-sm">{deal.business}</span>
                      </div>
                        <Button variant="outline" className="mt-6 w-full">
                          <Tag className="mr-2 h-4 w-4" />
                          View Deal
                        </Button>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div> : (
                <div className="rounded-lg border-2 border-dashed py-12 text-center">
                    <p className="text-muted-foreground">No active deals right now. Check back soon!</p>
                </div>
            )}
             <div className="mt-12 text-center">
                <Button asChild>
                    <Link href="/deals">View All Deals</Link>
                </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="careers">
             {latestJobs.length > 0 ? <div className="space-y-6">
              {latestJobs.map((job) => (
                 <Card key={job.id} className="group transition-all hover:border-primary/50 hover:shadow-lg">
                   <Link href={`/careers/${job.id}`} className="block">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                             <div className="flex-shrink-0">
                               <Image
                                src={job.imageUrl}
                                alt={`${job.company} logo`}
                                width={60}
                                height={60}
                                className="rounded-lg object-cover"
                                />
                            </div>
                             <div className="flex-grow">
                                <h3 className="font-headline text-lg font-bold transition-colors group-hover:text-primary">{job.title}</h3>
                                <p className="text-muted-foreground">{job.company} - {job.location}</p>
                            </div>
                            <Button variant="secondary">
                                <Briefcase className="mr-2 h-4 w-4" />
                                Apply
                            </Button>
                        </div>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div> : (
                 <div className="rounded-lg border-2 border-dashed py-12 text-center">
                    <p className="text-muted-foreground">No job openings right now. Check back soon!</p>
                </div>
            )}
             <div className="mt-12 text-center">
                <Button asChild>
                    <Link href="/careers">View All Careers</Link>
                </Button>
            </div>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}



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
import { Calendar, MapPin, Search, Ticket, Briefcase, Tag, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

const events = [
  {
    id: 1,
    title: "Diwali Festival of Lights",
    category: "Festival",
    date: "Sat, Nov 4, 7:00 PM",
    location: "Grand Park, Downtown LA",
    imageUrl: "https://images.unsplash.com/photo-1600813633279-997f77a83777?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxkaXdhbGklMjBmZXN0aXZhbHxlbnwwfHx8fDE3NTQxOTc0MzZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    aiHint: "diwali festival",
  },
  {
    id: 2,
    title: "Bollywood Dance Workshop",
    category: "Workshop",
    date: "Sun, Nov 5, 2:00 PM",
    location: "Mumbai Dance Studio",
    imageUrl: "https://images.unsplash.com/photo-1511210100424-03d3623f0010?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxib2xseXdvb2QlMjBkYW5jZXxlbnwwfHx8fDE3NTQxOTc0MzZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    aiHint: "bollywood dance",
  },
  {
    id: 3,
    title: "Indian Food Fair",
    category: "Food",
    date: "Sat, Nov 11, 12:00 PM",
    location: "Exhibition Center",
    imageUrl: "https://images.unsplash.com/photo-1589301760014-d929f39791e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxJbmRpYW4lMjBmb29kfGVufDB8fHx8fDE3NTQxOTc0MzZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    aiHint: "indian food",
  },
];

const deals = [
    {
    id: "1",
    title: "20% Off Lunch Buffet",
    business: "Taste of India Restaurant",
    category: "Food",
    imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxJbmRpYW4lMjBidWZmZXR8ZW58MHx8fHwxNzU0MDQyNjA0fDA&ixlib=rb-4.1.0&q=80&w=1080",
    aiHint: "indian buffet"
  },
  {
    id: "2",
    title: "Buy One Get One Free Saree",
    business: "Bollywood Styles Boutique",
    category: "Shopping",
    imageUrl: "https://images.unsplash.com/photo-1617196020993-9417f77b8a7f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxzYXJlZSUyMHNob3B8ZW58MHx8fHwxNzU0MDQyNjA0fDA&ixlib=rb-4.1.0&q=80&w=1080",
    aiHint: "saree shop"
  },
  {
    id: "3",
    title: "$50 Off International Flights",
    business: "Fly High Travel Agency",
    category: "Travel",
    imageUrl: "https://images.unsplash.com/photo-1549922572-80b6245f7895?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxmbGlnaHQlMjB0byUyMEluZGliaWVufDB8fHx8MTc1NDE5NzQzNnww&ixlib=rb-4.1.0&q=80&w=1080",
    aiHint: "travel agency"
  },
];

const jobs = [
   {
    id: "1",
    title: "Software Engineer",
    company: "InnovateTech Solutions",
    location: "San Francisco, CA",
    type: "Full-time",
    imageUrl: "https://placehold.co/100x100.png",
    aiHint: "tech company logo"
  },
  {
    id: "2",
    title: "Marketing Manager",
    company: "Desi Grocers Inc.",
    location: "New York, NY",
    type: "Full-time",
    imageUrl: "https://placehold.co/100x100.png",
    aiHint: "retail logo"
  },
  {
    id: "3",
    title: "Restaurant Chef",
    company: "Saffron Restaurant Group",
    location: "Chicago, IL",
    type: "Part-time",
    imageUrl: "https://placehold.co/100x100.png",
    aiHint: "restaurant logo"
  },
]

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <section className="relative bg-background text-white">
        <div className="absolute inset-0">
            <Image 
                src="https://images.unsplash.com/photo-1594917409245-8a245973c8b4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw0fHxJbmRpYW4lMjBmZXN0aXZhbCUyMGNyb3dkfGVufDB8fHx8MTc1NDE5NzQzNnww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Indian festival crowd"
                fill
                className="object-cover"
                data-ai-hint="Indian festival crowd"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
        </div>
        <div className="relative container mx-auto px-4 py-24 text-center">
          <h1 className="font-headline text-4xl font-bold md:text-6xl text-shadow-lg">
            Discover What's On
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-shadow">
            The heart of the Indian community, all in one place. Explore
            events, connect with organizations, and find what you need.
          </p>
          <div className="mt-8">
            <Card className="max-w-4xl mx-auto text-foreground">
                <CardContent className="p-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                    <div className="relative md:col-span-2">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                        placeholder="Search for an event, organization, or provider..."
                        className="pl-10"
                    />
                    </div>
                    <Select>
                    <SelectTrigger>
                        <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="festivals">Festivals</SelectItem>
                        <SelectItem value="workshops">Workshops</SelectItem>
                        <SelectItem value="food">Food</SelectItem>
                        <SelectItem value="concerts">Concerts</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                    </SelectContent>
                    </Select>
                     <Button className="w-full">
                        <Sparkles className="mr-2"/>
                        AI Search
                    </Button>
                </div>
                </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <Tabs defaultValue="events" className="w-full">
          <div className="flex justify-center mb-10">
            <TabsList className="grid grid-cols-3 w-full max-w-lg">
              <TabsTrigger value="events">Upcoming Events</TabsTrigger>
              <TabsTrigger value="deals">Community Deals</TabsTrigger>
              <TabsTrigger value="careers">Job Openings</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="events">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <Card key={event.id} className="overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1 group flex flex-col">
                  <Link href={`/events/${event.id}`} className="block h-full flex flex-col">
                    <CardContent className="p-0 flex flex-col h-full">
                      <div className="relative h-48 w-full">
                        <Image
                          src={event.imageUrl}
                          alt={event.title}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                          data-ai-hint={event.aiHint}
                        />
                        <Badge className="absolute top-2 right-2">{event.category}</Badge>
                      </div>
                      <div className="p-6 flex flex-col flex-grow">
                        <h3 className="font-headline text-xl font-bold group-hover:text-primary flex-grow">{event.title}</h3>
                        <div className="mt-4 flex flex-col space-y-2 text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>{event.date}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span>{event.location}</span>
                          </div>
                        </div>
                        <Button variant="outline" className="mt-6 w-full">
                          <Ticket className="mr-2 h-4 w-4" />
                          View Event
                        </Button>
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>
             <div className="text-center mt-12">
                <Button asChild>
                    <Link href="/events">View All Events</Link>
                </Button>
            </div>
          </TabsContent>

          <TabsContent value="deals">
             <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {deals.map((deal) => (
                <Card key={deal.id} className="overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1 group flex flex-col">
                  <Link href={`/deals/${deal.id}`} className="block h-full flex flex-col">
                     <CardContent className="p-0 h-full flex flex-col">
                       <div className="relative h-48 w-full">
                        <Image
                          src={deal.imageUrl}
                          alt={deal.title}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                          data-ai-hint={deal.aiHint}
                        />
                      </div>
                      <div className="p-6 flex-grow flex flex-col">
                         <Badge variant="secondary" className="w-fit">{deal.category}</Badge>
                        <h3 className="font-headline text-xl font-bold mt-2 flex-grow group-hover:text-primary">{deal.title}</h3>
                        <div className="mt-4 flex items-center gap-2 text-muted-foreground">
                           <span className="text-sm">{deal.business}</span>
                        </div>
                         <Button variant="outline" className="mt-6 w-full">
                            <Tag className="mr-2 h-4 w-4" />
                            View Deal
                         </Button>
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>
             <div className="text-center mt-12">
                <Button asChild>
                    <Link href="/deals">View All Deals</Link>
                </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="careers">
             <div className="space-y-6">
              {jobs.map((job) => (
                 <Card key={job.id} className="transition-all hover:shadow-lg hover:border-primary/50 group">
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
                                data-ai-hint={job.aiHint}
                                />
                            </div>
                             <div className="flex-grow">
                                <h3 className="font-headline text-lg font-bold group-hover:text-primary transition-colors">{job.title}</h3>
                                <p className="text-muted-foreground">{job.company} - {job.location}</p>
                            </div>
                            <Button variant="outline">
                                <Briefcase className="mr-2 h-4 w-4" />
                                Apply
                            </Button>
                        </div>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>
             <div className="text-center mt-12">
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

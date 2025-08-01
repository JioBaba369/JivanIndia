
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
import { Calendar, MapPin, Search, Ticket } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const events = [
  {
    id: 1,
    title: "Diwali Festival of Lights",
    category: "Festival",
    date: "Sat, Nov 4, 7:00 PM",
    location: "Grand Park, Downtown LA",
    imageUrl: "https://placehold.co/600x400.png",
    aiHint: "diwali festival"
  },
  {
    id: 2,
    title: "Bollywood Dance Workshop",
    category: "Workshop",
    date: "Sun, Nov 5, 2:00 PM",
    location: "Mumbai Dance Studio",
    imageUrl: "https://placehold.co/600x400.png",
    aiHint: "bollywood dance"
  },
  {
    id: 3,
    title: "Indian Food Fair",
    category: "Food",
    date: "Sat, Nov 11, 12:00 PM",
    location: "Exhibition Center",
    imageUrl: "https://placehold.co/600x400.png",
    aiHint: "indian food"
  },
  {
    id: 4,
    title: "Classical Music Concert",
    category: "Concert",
    date: "Fri, Nov 17, 8:00 PM",
    location: "Royal Albert Hall",
    imageUrl: "https://placehold.co/600x400.png",
    aiHint: "classical music"
  },
  {
    id: 5,
    title: "Startup India Conference",
    category: "Business",
    date: "Wed, Nov 22, 9:00 AM",
    location: "Tech Convention Center",
    imageUrl: "https://placehold.co/600x400.png",
    aiHint: "business conference"
  },
  {
    id: 6,
    title: "Holi Color Festival",
    category: "Festival",
    date: "Sat, Mar 23, 11:00 AM",
    location: "City Beach",
    imageUrl: "https://placehold.co/600x400.png",
    aiHint: "holi festival"
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <section className="bg-gradient-to-b from-primary/10 via-background to-background py-20 text-center">
        <div className="container mx-auto px-4">
          <h1 className="font-headline text-4xl font-bold md:text-6xl">
            Discover What's On
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            The heart of the Indian community, all in one place. Explore
            events, connect with organizations, and find what you need.
          </p>
        </div>
      </section>

      <div className="sticky top-[65px] z-30 bg-background/80 py-4 backdrop-blur-md">
        <div className="container mx-auto px-4">
          <Card>
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
                <Button className="w-full">Search</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <section className="container mx-auto px-4 py-12">
        <h2 className="font-headline text-3xl font-bold mb-8">
          Upcoming Events
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <Card key={event.id} className="overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1 group flex flex-col">
              <Link href={`/events/${event.id}`} className="block h-full">
                <CardContent className="p-0 flex flex-col h-full">
                  <div className="relative h-48 w-full">
                    <Image
                      src={event.imageUrl}
                      alt={event.title}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                      data-ai-hint={event.aiHint}
                    />
                     <div className="absolute top-2 right-2 bg-background/80 text-foreground px-3 py-1 rounded-full text-sm font-semibold">{event.category}</div>
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="font-headline text-xl font-bold group-hover:text-primary">{event.title}</h3>
                    <div className="mt-4 flex flex-col space-y-2 text-muted-foreground flex-grow">
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
      </section>
    </div>
  );
}

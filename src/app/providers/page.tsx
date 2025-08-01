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
import { MapPin, Search, UserCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const providers = [
  {
    name: "Dr. Anjali Sharma",
    category: "Healthcare",
    specialty: "Cardiologist",
    location: "Los Angeles, CA",
    imageUrl: "https://placehold.co/600x400.png",
    aiHint: "doctor portrait"
  },
  {
    name: "Rajesh Kumar & Associates",
    category: "Legal Services",
    specialty: "Immigration Law",
    location: "New York, NY",
    imageUrl: "https://placehold.co/600x400.png",
    aiHint: "law office"
  },
  {
    name: "Priya's Kitchen",
    category: "Catering",
    specialty: "North Indian Cuisine",
    location: "Dallas, TX",
    imageUrl: "https://placehold.co/600x400.png",
    aiHint: "catering food"
  },
  {
    name: "Vikram Singh Photography",
    category: "Event Services",
    specialty: "Wedding Photography",
    location: "Miami, FL",
    imageUrl: "https://placehold.co/600x400.png",
    aiHint: "photographer camera"
  },
  {
    name: "Aisha's Design Studio",
    category: "Creative Services",
    specialty: "Graphic Design",
    location: "Seattle, WA",
    imageUrl: "https://placehold.co/600x400.png",
    aiHint: "design studio"
  },
  {
    name: "Rohan Gupta, CPA",
    category: "Financial Services",
    specialty: "Tax & Accounting",
    location: "San Jose, CA",
    imageUrl: "https://placehold.co/600x400.png",
    aiHint: "accountant office"
  },
];


export default function ProvidersPage() {
  return (
    <div className="flex flex-col">
      <section className="bg-gradient-to-b from-primary/10 via-background to-background py-20 text-center">
        <div className="container mx-auto px-4">
          <h1 className="font-headline text-4xl font-bold md:text-6xl">
            Service Providers
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Find trusted professionals and services within the community.
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
                    placeholder="Search by name, service, or location..."
                    className="pl-10"
                  />
                </div>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="All Services" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="legal">Legal Services</SelectItem>
                    <SelectItem value="catering">Catering</SelectItem>
                    <SelectItem value="event">Event Services</SelectItem>
                  </SelectContent>
                </Select>
                <Button className="w-full">Search</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {providers.map((provider, index) => (
            <Card key={index} className="overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
               <Link href="#" className="block">
                <CardContent className="p-0">
                  <div className="relative h-48 w-full">
                    <Image
                      src={provider.imageUrl}
                      alt={provider.name}
                      layout="fill"
                      objectFit="cover"
                      data-ai-hint={provider.aiHint}
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-headline text-xl font-bold">{provider.name}</h3>
                    <p className="font-semibold text-primary">{provider.specialty}</p>
                    <div className="mt-4 flex flex-col space-y-2 text-muted-foreground">
                       <div className="flex items-center gap-2">
                         <UserCheck className="h-4 w-4" />
                         <span>{provider.category}</span>
                       </div>
                       <div className="flex items-center gap-2">
                         <MapPin className="h-4 w-4" />
                         <span>{provider.location}</span>
                       </div>
                    </div>
                     <Button variant="secondary" className="mt-6 w-full">
                      View Profile
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

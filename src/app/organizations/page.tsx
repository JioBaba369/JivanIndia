
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
import { Building2, MapPin, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const organizations = [
  {
    name: "India Cultural Center",
    category: "Community Center",
    location: "San Francisco, CA",
    imageUrl: "https://placehold.co/600x400.png",
    aiHint: "community center"
  },
  {
    name: "South Asian Arts Society",
    category: "Arts & Culture",
    location: "New York, NY",
    imageUrl: "https://placehold.co/600x400.png",
    aiHint: "art gallery"
  },
  {
    name: "Entrepreneurs of India",
    category: "Business Network",
    location: "Chicago, IL",
    imageUrl: "https://placehold.co/600x400.png",
    aiHint: "modern office"
  },
  {
    name: "Hindu Temple & Cultural Center",
    category: "Religious",
    location: "Houston, TX",
    imageUrl: "https://placehold.co/600x400.png",
    aiHint: "hindu temple"
  },
  {
    name: "Sikh Foundation",
    category: "Charity",
    location: "Fremont, CA",
    imageUrl: "https://placehold.co/600x400.png",
    aiHint: "charity event"
  },
  {
    name: "Indian Students Association",
    category: "Student Group",
    location: "Boston, MA",
    imageUrl: "https://placehold.co/600x400.png",
    aiHint: "university campus"
  },
];


export default function OrganizationsPage() {
  return (
    <div className="flex flex-col">
      <section className="bg-gradient-to-b from-primary/10 via-background to-background py-20 text-center">
        <div className="container mx-auto px-4">
          <h1 className="font-headline text-4xl font-bold md:text-6xl">
            Community Organizations
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Find and connect with cultural, business, and community groups.
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
                    placeholder="Search by name or keyword..."
                    className="pl-10"
                  />
                </div>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="community">Community Center</SelectItem>
                    <SelectItem value="arts">Arts & Culture</SelectItem>
                    <SelectItem value="business">Business Network</SelectItem>
                    <SelectItem value="religious">Religious</SelectItem>
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
          {organizations.map((org, index) => (
            <Card key={index} className="overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1 group flex flex-col">
               <Link href="#" className="block h-full">
                <CardContent className="p-0 flex flex-col h-full">
                  <div className="relative h-48 w-full">
                    <Image
                      src={org.imageUrl}
                      alt={org.name}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                      data-ai-hint={org.aiHint}
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="font-headline text-xl font-bold group-hover:text-primary">{org.name}</h3>
                    <div className="mt-4 flex flex-col space-y-2 text-muted-foreground flex-grow">
                       <div className="flex items-center gap-2">
                         <Building2 className="h-4 w-4" />
                         <span>{org.category}</span>
                       </div>
                       <div className="flex items-center gap-2">
                         <MapPin className="h-4 w-4" />
                         <span>{org.location}</span>
                       </div>
                    </div>
                     <Button variant="secondary" className="mt-6 w-full">
                      Learn More
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

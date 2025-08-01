
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
import { Building2, MapPin, Search, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const featuredOrganizations = [
   {
    id: "1",
    name: "India Cultural Center",
    category: "Community Center",
    location: "San Francisco, CA",
    imageUrl: "https://placehold.co/600x400.png",
    aiHint: "community center",
    description: "The heart of the Bay Area's Indian community, offering cultural events, classes, and support services.",
    members: "5,000+ Members"
  },
   {
    id: "2",
    name: "South Asian Arts Society",
    category: "Arts & Culture",
    location: "New York, NY",
    imageUrl: "https://placehold.co/600x400.png",
    aiHint: "art gallery",
    description: "Promoting and preserving South Asian visual and performing arts through exhibitions, workshops, and performances.",
    members: "2,500+ Members"
  },
  {
    id: "3",
    name: "Entrepreneurs of India",
    category: "Business Network",
    location: "Chicago, IL",
    imageUrl: "https://placehold.co/600x400.png",
    aiHint: "modern office",
    description: "A professional network fostering innovation and collaboration among Indian entrepreneurs in the Midwest.",
    members: "1,200+ Members"
  },
];


const organizations = [
  ...featuredOrganizations,
  {
    id: "4",
    name: "Hindu Temple & Cultural Center",
    category: "Religious",
    location: "Houston, TX",
    imageUrl: "https://placehold.co/600x400.png",
    aiHint: "hindu temple",
    description: "A spiritual and cultural anchor for the Hindu community in Houston, offering religious services and educational programs.",
    members: "8,000+ Members"
  },
  {
    id: "5",
    name: "Sikh Foundation",
    category: "Charity",
    location: "Fremont, CA",
    imageUrl: "https://placehold.co/600x400.png",
    aiHint: "charity event",
    description: "A non-profit organization dedicated to philanthropic work and promoting Sikh culture and heritage.",
    members: "3,000+ Members"
  },
  {
    id: "6",
    name: "Indian Students Association",
    category: "Student Group",
    location: "Boston, MA",
    imageUrl: "https://placehold.co/600x400.png",
    aiHint: "university campus",
    description: "Supporting Indian students in Boston, organizing social events, and celebrating Indian festivals on campus.",
    members: "800+ Members"
  },
];


export default function OrganizationsPage() {
  return (
    <div className="flex flex-col">
      <section className="bg-gradient-to-b from-primary/10 via-background to-background pt-20 pb-12 text-center">
        <div className="container mx-auto px-4">
          <h1 className="font-headline text-4xl font-bold md:text-6xl">
            Community Organizations
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Find and connect with cultural, business, and community groups.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-12">
        <h2 className="font-headline text-3xl font-bold mb-8">Featured Organizations</h2>
         <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {featuredOrganizations.map((org) => (
              <CarouselItem key={org.id} className="md:basis-1/2 lg:basis-1/3">
                 <Card className="overflow-hidden transition-all hover:shadow-lg h-full flex flex-col">
                    <Link href={`/organizations/${org.id}`} className="block h-full">
                        <CardContent className="p-0 flex flex-col h-full">
                        <div className="relative h-48 w-full">
                            <Image
                            src={org.imageUrl}
                            alt={org.name}
                            fill
                            className="object-cover"
                            data-ai-hint={org.aiHint}
                            />
                        </div>
                        <div className="p-6 flex flex-col flex-grow">
                            <h3 className="font-headline text-xl font-bold">{org.name}</h3>
                            <p className="text-sm text-primary font-semibold">{org.category}</p>
                            <p className="mt-2 text-sm text-muted-foreground flex-grow">{org.description}</p>
                             <div className="mt-4 flex items-center gap-2 text-muted-foreground text-sm">
                                <MapPin className="h-4 w-4" />
                                <span>{org.location}</span>
                            </div>
                        </div>
                        </CardContent>
                    </Link>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:flex" />
          <CarouselNext  className="hidden sm:flex" />
        </Carousel>
      </section>

      <div className="sticky top-[65px] z-30 bg-background/80 py-4 backdrop-blur-md border-t">
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
                     <SelectItem value="charity">Charity</SelectItem>
                    <SelectItem value="student">Student Group</SelectItem>
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
          {organizations.map((org) => (
            <Card key={org.id} className="overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1 group flex flex-col border">
                <CardContent className="p-0 flex flex-col h-full">
                   <Link href={`/organizations/${org.id}`} className="block h-full flex flex-col">
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
                        <p className="text-sm font-semibold text-primary">{org.category}</p>
                        <h3 className="font-headline text-xl font-bold group-hover:text-primary mt-1">{org.name}</h3>
                        <p className="mt-2 text-sm text-muted-foreground flex-grow line-clamp-3">{org.description}</p>
                        
                        <div className="mt-4 flex flex-col space-y-2 text-muted-foreground text-sm">
                           <div className="flex items-center gap-2">
                             <Users className="h-4 w-4" />
                             <span>{org.members}</span>
                           </div>
                           <div className="flex items-center gap-2">
                             <MapPin className="h-4 w-4" />
                             <span>{org.location}</span>
                           </div>
                        </div>
                      </div>
                    </Link>
                     <div className="p-6 pt-0 mt-auto flex gap-2">
                        <Button asChild className="flex-1">
                            <Link href={`/organizations/${org.id}`}>View</Link>
                        </Button>
                        <Button variant="secondary" asChild className="flex-1">
                            <Link href="#">Join Now</Link>
                        </Button>
                     </div>
                </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

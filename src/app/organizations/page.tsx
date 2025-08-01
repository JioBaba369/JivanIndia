
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Building2, MapPin, Search, Users, Bookmark } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { MouseEvent } from 'react';
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const featuredOrganizations = [
   {
    id: "1",
    name: "India Cultural Center",
    type: "Community Center",
    location: "San Francisco, CA",
    imageUrl: "https://images.unsplash.com/photo-1583445063483-392a2596e7e9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHxjb21tdW5pdHklMjBjZW50ZXJ8ZW58MHx8fHwxNzU0MDUxODgxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    aiHint: "community center",
    description: "The heart of the Bay Area's Indian community, offering cultural events, classes, and support services.",
    members: "5,000+ Members"
  },
   {
    id: "2",
    name: "South Asian Arts Society",
    type: "Arts & Culture",
    location: "New York, NY",
    imageUrl: "https://images.unsplash.com/photo-1531028362699-7335dbd25515?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxJbmRpYW4lMjBhcnQlMjBnYWxsZXJ5fGVufDB8fHx8fDE3NTQxOTc0MzZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    aiHint: "art gallery",
    description: "Promoting and preserving South Asian visual and performing arts through exhibitions, workshops, and performances.",
    members: "2,500+ Members"
  },
  {
    id: "3",
    name: "Entrepreneurs of India",
    type: "Business Network",
    location: "Chicago, IL",
    imageUrl: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBjb3dvcmtpbmclMjBzcGFjZXxlbnwwfHx8fDE3NTQxOTc0MzZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    aiHint: "modern office",
    description: "A professional network fostering innovation and collaboration among Indian entrepreneurs in the Midwest.",
    members: "1,200+ Members"
  },
];


export const organizations = [
  ...featuredOrganizations,
  {
    id: "4",
    name: "Hindu Temple & Cultural Center",
    type: "Religious",
    location: "Houston, TX",
    imageUrl: "https://images.unsplash.com/photo-1587143621495-2a298aa35624?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxoaW5kdSUyMHRlbXBsZXxlbnwwfHx8fDE3NTQxOTc0MzZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    aiHint: "hindu temple",
    description: "A spiritual and cultural anchor for the Hindu community in Houston, offering religious services and educational programs.",
    members: "8,000+ Members"
  },
  {
    id: "5",
    name: "Sikh Foundation",
    type: "Charity",
    location: "Fremont, CA",
    imageUrl: "https://images.unsplash.com/photo-1617812000789-a5909f24b1f6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxTaWtoJTIwZ3VydGR3YXJhJTIwZXh0ZXJpb3J8ZW58MHx8fHwxNzU0MTk3NDM2fDA&ixlib=rb-4.1.0&q=80&w=1080",
    aiHint: "charity event",
    description: "A non-profit organization dedicated to philanthropic work and promoting Sikh culture and heritage.",
    members: "3,000+ Members"
  },
  {
    id: "6",
    name: "Indian Students Association",
    type: "Student Group",
    location: "Boston, MA",
    imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxzdHVkZW50cyUyMG9uJTIwYSUyMHVuaXZlcnNpdHklMjBjYW1wdXN8ZW58MHx8fHwxNzU0MTk3NDM2fDA&ixlib=rb-4.1.0&q=80&w=1080",
    aiHint: "university campus",
    description: "Supporting Indian students in Boston, organizing social events, and celebrating Indian festivals on campus.",
    members: "800+ Members"
  },
  {
    id: "7",
    name: "Yash Raj Films",
    type: "Film Distributor",
    location: "Mumbai, IN",
    imageUrl: "https://images.unsplash.com/photo-1594904523995-18b0831c26ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxmaWxtJTIwc3R1ZGlvfGVufDB8fHx8fDE3NTQxOTc0MzZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    aiHint: "film studio",
    description: "A leading film production and distribution company, bringing Bollywood cinema to the world.",
    members: "N/A"
  },
];


export default function OrganizationsPage() {
    const { toast } = useToast();
    const { user, joinCommunity, isCommunityJoined } = useAuth();
    const router = useRouter();

    const handleSave = (e: MouseEvent<HTMLButtonElement>, orgName: string, orgId: string) => {
        e.preventDefault();
        e.stopPropagation();
         if (!user) {
            toast({
                title: "Please log in",
                description: "You must be logged in to join communities.",
                variant: "destructive"
            });
            router.push('/login');
            return;
        }

        if (!isCommunityJoined(orgId)) {
            joinCommunity(orgId);
            toast({
            title: "Community Joined!",
            description: `You have joined ${orgName}.`,
            });
        } else {
             toast({
                title: "Already Joined",
                description: "You are already a member of this community.",
            });
        }
    };


  return (
    <div className="flex flex-col">
      <section className="bg-gradient-to-b from-primary/10 via-background to-background pt-20 pb-12 text-center">
        <div className="container mx-auto px-4">
          <h1 className="font-headline text-4xl font-bold md:text-6xl text-shadow-lg">
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
                    <Link href={`/organizations/${org.id}`} className="block h-full flex flex-col">
                        <CardContent className="p-0 flex flex-col flex-grow">
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
                            <p className="text-sm text-primary font-semibold">{org.type}</p>
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
                    <SelectItem value="film">Film Distributor</SelectItem>
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
                <Link href={`/organizations/${org.id}`} className="block h-full flex flex-col flex-grow">
                    <CardContent className="p-0 flex flex-col flex-grow">
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
                        <p className="text-sm font-semibold text-primary">{org.type}</p>
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
                    </CardContent>
                </Link>
                 <CardFooter className="p-6 pt-0 mt-auto flex gap-2">
                    <Button asChild className="flex-1">
                        <Link href={`/organizations/${org.id}`}>View</Link>
                    </Button>
                    <Button variant="secondary" className="flex-1" onClick={(e) => handleSave(e, org.name, org.id)} disabled={isCommunityJoined(org.id)}>
                        <Bookmark className="mr-2" />
                        {isCommunityJoined(org.id) ? "Joined" : "Join"}
                    </Button>
                 </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

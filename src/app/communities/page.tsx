
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
import { Building2, MapPin, Search, Users, Bookmark, BadgeCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { type MouseEvent, useState, useMemo } from 'react';
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export const communities: any[] = [];

const featuredCommunities = communities.slice(0, 3);


export default function CommunitiesPage() {
    const { toast } = useToast();
    const { user, joinCommunity, isCommunityJoined } = useAuth();
    const router = useRouter();

    const [searchQuery, setSearchQuery] = useState('');
    const [locationQuery, setLocationQuery] = useState('');
    const [category, setCategory] = useState('all');

    const communityCategories = useMemo(() => {
      const categories = new Set(communities.map(c => c.type));
      return ['all', ...Array.from(categories)];
    }, []);

    const filteredCommunities = useMemo(() => {
        return communities.filter(community => {
          const matchesSearch =
            community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            community.description.toLowerCase().includes(searchQuery.toLowerCase());
          
          const matchesLocation = community.region.toLowerCase().includes(locationQuery.toLowerCase());
    
          const matchesCategory = category === 'all' || community.type === category;
    
          return matchesSearch && matchesLocation && matchesCategory;
        });
    }, [searchQuery, locationQuery, category]);


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
          <h1 className="font-headline text-4xl font-bold text-shadow-lg md:text-6xl">
            Community Hub
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Find and connect with cultural, business, and community groups.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-12">
        <h2 className="font-headline mb-8 text-3xl font-bold">Featured Communities</h2>
         <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {featuredCommunities.map((org) => (
              <CarouselItem key={org.id} className="md:basis-1/2 lg:basis-1/3">
                 <Card className="flex h-full flex-col overflow-hidden transition-all hover:shadow-lg">
                    <Link href={`/communities/${org.id}`} className="flex h-full flex-col">
                        <div className="relative h-48 w-full">
                            <Image
                            src={org.imageUrl}
                            alt={org.name}
                            fill
                            className="object-cover"
                            data-ai-hint={org.aiHint}
                            priority
                            />
                        </div>
                        <CardContent className="flex flex-grow flex-col p-6">
                             <div className="flex items-center gap-2">
                                <h3 className="font-headline text-xl font-bold">{org.name}</h3>
                                {org.isVerified && <BadgeCheck className="h-5 w-5 text-primary" />}
                            </div>
                            <p className="font-semibold text-primary">{org.type}</p>
                            <p className="mt-2 flex-grow text-sm text-muted-foreground">{org.description}</p>
                             <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                                <MapPin className="h-4 w-4" />
                                <span>{org.region}</span>
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

      <div className="sticky top-[65px] z-30 border-t bg-background/80 py-4 backdrop-blur-md">
        <div className="container mx-auto px-4">
          <Card>
            <CardContent className="p-4">
               <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                <div className="relative md:col-span-2">
                  <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search by name or keyword..."
                    className="pl-10 text-base"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                 <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Location"
                    className="pl-10 text-base"
                    value={locationQuery}
                    onChange={(e) => setLocationQuery(e.target.value)}
                  />
                </div>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="text-base">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                     {communityCategories.map((cat, index) => (
                      <SelectItem key={index} value={cat}>
                        {cat === 'all' ? 'All Categories' : cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredCommunities.length > 0 ? filteredCommunities.map((org) => (
            <Card key={org.id} className="group flex flex-col overflow-hidden border transition-all hover:-translate-y-1 hover:shadow-lg">
                <Link href={`/communities/${org.id}`} className="flex h-full flex-grow flex-col">
                    <div className="relative h-48 w-full">
                    <Image
                        src={org.imageUrl}
                        alt={org.name}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                        data-ai-hint={org.aiHint}
                    />
                    </div>
                    <CardContent className="flex flex-grow flex-col p-6">
                    <p className="font-semibold text-primary">{org.type}</p>
                     <div className="mt-1 flex items-center gap-2">
                        <h3 className="font-headline text-xl font-bold group-hover:text-primary">{org.name}</h3>
                        {org.isVerified && <BadgeCheck className="h-5 w-5 text-primary" />}
                    </div>
                    <p className="mt-2 flex-grow text-sm text-muted-foreground line-clamp-3">{org.description}</p>
                    
                    <div className="mt-4 flex flex-col space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            <span>{org.membersCount}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span>{org.region}</span>
                        </div>
                    </div>
                    </CardContent>
                </Link>
                 <CardFooter className="mt-auto flex gap-2 p-6 pt-0">
                    <Button asChild className="flex-1">
                        <Link href={`/communities/${org.id}`}>View</Link>
                    </Button>
                    <Button variant="secondary" className="flex-1" onClick={(e) => handleSave(e, org.name, org.id)} disabled={isCommunityJoined(org.id)}>
                        <Bookmark className="mr-2 h-4 w-4" />
                        {isCommunityJoined(org.id) ? "Joined" : "Join"}
                    </Button>
                 </CardFooter>
            </Card>
          )) : (
            <div className="rounded-lg border-2 border-dashed py-12 text-center md:col-span-2 lg:col-span-3">
                <p className="text-muted-foreground">No communities found that match your criteria.</p>
                <Button variant="link" onClick={() => {
                    setSearchQuery('');
                    setLocationQuery('');
                    setCategory('all');
                }}>Clear Filters</Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

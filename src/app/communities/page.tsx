
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Building2, MapPin, Search, Users, Bookmark, BadgeCheck, PlusCircle, LayoutGrid, List, Star, MoreVertical } from "lucide-react";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { MouseEvent } from 'react';
import { useState, useMemo, useEffect } from 'react';
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { useCommunities } from "@/hooks/use-communities";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import ReportDialog from "@/components/feature/report-dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import Image from "next/image";

export default function CommunitiesPage() {
    const { toast } = useToast();
    const { user, isCommunityJoined, joinCommunity, leaveCommunity } = useAuth();
    const router = useRouter();
    const { communities, isLoading } = useCommunities();
    const searchParams = useSearchParams();

    const [searchQuery, setSearchQuery] = useState('');
    const [locationQuery, setLocationQuery] = useState('');
    const [category, setCategory] = useState('all');
    const [view, setView] = useState<'grid' | 'list'>('grid');
    
    useEffect(() => {
        setSearchQuery(searchParams.get('q') || '');
    }, [searchParams]);

    const featuredCommunities = useMemo(() => {
      return communities.filter(c => c.isFeatured || c.isVerified).sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0)).slice(0, 5);
    }, [communities]);

    const communityCategories = useMemo(() => {
      const categories = new Set(communities.map(c => c.type));
      return ['all', ...Array.from(categories)];
    }, [communities]);

    const filteredCommunities = useMemo(() => {
        return communities.filter(community => {
          const matchesSearch =
            community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            community.description.toLowerCase().includes(searchQuery.toLowerCase());
          
          const matchesLocation = community.region.toLowerCase().includes(locationQuery.toLowerCase());
    
          const matchesCategory = category === 'all' || community.type === category;
    
          return matchesSearch && matchesLocation && matchesCategory;
        }).sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }, [communities, searchQuery, locationQuery, category]);


    const handleJoinToggle = (e: MouseEvent<HTMLButtonElement>, orgName: string, orgId: string) => {
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
        
        const currentlyJoined = isCommunityJoined(orgId);
        if (currentlyJoined) {
            leaveCommunity(orgId);
            toast({
                title: "Community Left",
                description: `You have left ${orgName}.`,
            });
        } else {
            joinCommunity(orgId);
            toast({
                title: "Community Joined!",
                description: `You have joined ${orgName}.`,
            });
        }
    };
    
    const CommunitySkeletons = () => (
      Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="flex flex-col overflow-hidden">
          <Skeleton className="h-48 w-full" />
          <CardContent className="flex flex-grow flex-col p-4">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/4 mb-4" />
            <Skeleton className="h-4 w-full mb-2 flex-grow" />
             <div className="mt-4 space-y-3">
               <Skeleton className="h-4 w-1/2" />
               <Skeleton className="h-4 w-1/3" />
            </div>
            <div className="mt-4 flex gap-2">
              <Skeleton className="h-10 w-1/2" />
              <Skeleton className="h-10 w-1/2" />
            </div>
          </CardContent>
        </Card>
      ))
    );


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
          <Button asChild size="lg" className="mt-8">
            <Link href="/communities/new">
              <PlusCircle className="mr-2 h-5 w-5"/>
              Register Your Community
            </Link>
          </Button>
        </div>
      </section>

      {communities.length > 0 && featuredCommunities.length > 0 && (
        <section className="container mx-auto px-4 py-16">
          <h2 className="font-headline mb-8 text-3xl font-bold text-center">Featured Communities</h2>
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
                  <Card className={cn("flex h-full flex-col overflow-hidden transition-all hover:shadow-lg", org.isFeatured && "border-primary border-2")}>
                      <Link href={`/c/${org.slug}`} className="flex h-full flex-col">
                          <div className="relative h-48 w-full bg-muted flex items-center justify-center">
                              {org.logoUrl ? (
                                <Image src={org.logoUrl} alt={`${org.name} logo`} fill className="object-contain p-4" />
                              ) : (
                                <Building2 className="h-16 w-16 text-muted-foreground" />
                              )}
                              {org.isFeatured && <Badge variant="default" className="absolute left-3 top-3"><Star className="mr-1 h-3 w-3" />Featured</Badge>}
                          </div>
                          <CardContent className="flex flex-grow flex-col p-4">
                              <div className="flex items-center gap-2">
                                  <CardTitle className="font-headline">{org.name}</CardTitle>
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
      )}

      <div className="sticky top-[65px] z-30 border-y bg-background/95 backdrop-blur-sm py-4">
        <div className="container mx-auto px-4">
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                  placeholder="Search by name or keyword..."
                  className="pl-10 text-base h-12"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
              />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <Input
                      placeholder="Location"
                      className="pl-4 text-base h-12"
                      value={locationQuery}
                      onChange={(e) => setLocationQuery(e.target.value)}
                  />
                  <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger className="text-base h-12">
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
                  <div className="flex items-center gap-2">
                      <Button variant={view === 'grid' ? 'secondary' : 'outline'} size="lg" onClick={() => setView('grid')} className="w-full h-12">
                          <LayoutGrid />
                      </Button>
                      <Button variant={view === 'list' ? 'secondary' : 'outline'} size="lg" onClick={() => setView('list')} className="w-full h-12">
                          <List />
                      </Button>
                  </div>
              </div>
            </div>
        </div>
      </div>
      
      <section className="container mx-auto px-4 py-12">
        <div className={cn(
            "gap-8",
            view === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
            : 'flex flex-col'
        )}>
        {isLoading ? <CommunitySkeletons /> : (
            filteredCommunities.length > 0 ? (
                filteredCommunities.map((org) => {
                    const isJoined = isCommunityJoined(org.id);
                    return view === 'grid' ? (
                    <Card key={org.id} className={cn("group flex flex-col overflow-hidden border transition-all hover:-translate-y-1 hover:shadow-xl", org.isFeatured && "border-primary border-2")}>
                        <div className="relative h-48 w-full bg-muted flex items-center justify-center">
                             <Link href={`/c/${org.slug}`} className="flex h-full w-full items-center justify-center flex-grow flex-col">
                                {org.logoUrl ? (
                                    <Image src={org.logoUrl} alt={`${org.name} logo`} fill className="object-contain p-4 transition-transform group-hover:scale-105" />
                                ) : (
                                    <Building2 className="h-16 w-16 text-muted-foreground" />
                                )}
                                {org.isFeatured && <Badge variant="default" className="absolute left-3 top-3"><Star className="mr-1 h-3 w-3" />Featured</Badge>}
                             </Link>
                             <div className="absolute top-2 right-2">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 bg-black/20 hover:bg-black/40 text-white hover:text-white">
                                            <MoreVertical size={20} />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <ReportDialog 
                                            contentId={org.id} 
                                            contentType="Community" 
                                            contentTitle={org.name} 
                                            triggerComponent={<DropdownMenuItem onSelect={(e) => e.preventDefault()}>Report</DropdownMenuItem>}
                                        />
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                        <CardContent className="flex flex-grow flex-col p-4">
                            <Link href={`/c/${org.slug}`} className="flex-grow">
                                <CardTitle className="font-headline text-xl font-bold group-hover:text-primary">
                                    {org.isVerified && <BadgeCheck className="mr-2 h-5 w-5 inline-block text-primary" />}
                                    {org.name}
                                </CardTitle>
                                <p className="font-semibold text-primary">{org.type}</p>
                                <p className="mt-2 flex-grow text-sm text-muted-foreground line-clamp-3">{org.description}</p>
                                <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                                    <Users className="h-4 w-4" />
                                    <span>{org.membersCount}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <MapPin className="h-4 w-4" />
                                    <span>{org.region}</span>
                                </div>
                            </Link>
                        </CardContent>
                        <div className="mt-auto flex gap-2 p-4 pt-0">
                            <Button asChild className="flex-1">
                                <Link href={`/c/${org.slug}`}>View</Link>
                            </Button>
                            <Button variant="secondary" className="flex-1" onClick={(e) => handleJoinToggle(e, org.name, org.id)}>
                                <Bookmark className="mr-2 h-4 w-4" />
                                {isJoined ? "Joined" : "Join"}
                            </Button>
                        </div>
                    </Card>
                ) : (
                    <Card key={org.id} className={cn("group w-full overflow-hidden border transition-all hover:shadow-xl", org.isFeatured && "border-primary border-2")}>
                    <div className="flex flex-col sm:flex-row">
                        <Link href={`/c/${org.slug}`} className="flex h-48 w-full sm:h-auto sm:w-48 flex-shrink-0 items-center justify-center bg-muted">
                           <Avatar className="h-24 w-24">
                              <AvatarImage src={org.logoUrl} alt={org.name} />
                              <AvatarFallback className="text-3xl font-headline">{getInitials(org.name)}</AvatarFallback>
                           </Avatar>
                        </Link>
                        <CardContent className="flex flex-grow flex-col p-4 sm:p-6">
                            <Link href={`/c/${org.slug}`} className="flex-grow">
                                <p className="font-semibold text-primary">{org.type}</p>
                                <CardTitle className="group-hover:text-primary mt-1">
                                    {org.isFeatured && <Star className="mr-2 h-5 w-5 inline-block text-yellow-400 fill-yellow-400" />}
                                    {org.isVerified && <BadgeCheck className="mr-2 h-5 w-5 inline-block text-primary" />}
                                    {org.name}
                                </CardTitle>
                                <p className="mt-2 flex-grow text-sm text-muted-foreground line-clamp-2">{org.description}</p>
                                <div className="mt-4 flex flex-col space-y-2 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-2">
                                        <Users className="h-4 w-4" />
                                        <span>{org.membersCount} Members</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4" />
                                        <span>{org.region}</span>
                                    </div>
                                </div>
                            </Link>
                        </CardContent>
                        <div className="flex flex-col justify-center gap-2 p-4 sm:p-6 border-t sm:border-t-0 sm:border-l">
                             <div className="flex items-center gap-2">
                                <Button asChild className="flex-1">
                                    <Link href={`/c/${org.slug}`}>View</Link>
                                </Button>
                                 <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-10 w-10">
                                            <MoreVertical size={20} />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={(e) => { e.preventDefault(); handleJoinToggle(e, org.name, org.id); }}>
                                            <Bookmark className="mr-2 h-4 w-4" />
                                            {isJoined ? "Leave" : "Join"}
                                        </DropdownMenuItem>
                                        <ReportDialog 
                                            contentId={org.id} 
                                            contentType="Community" 
                                            contentTitle={org.name} 
                                            triggerComponent={<DropdownMenuItem onSelect={(e) => e.preventDefault()}>Report</DropdownMenuItem>}
                                        />
                                    </DropdownMenuContent>
                                </DropdownMenu>
                             </div>
                        </div>
                    </div>
                    </Card>
                )
                })
            ) : (
                <div className="rounded-lg border-2 border-dashed py-16 text-center col-span-full">
                    <h3 className="font-headline text-xl font-semibold">No Communities Found</h3>
                    <p className="text-muted-foreground mt-2">No communities match your criteria. Try adjusting your search or check back later.</p>
                    <Button variant="link" onClick={() => {
                        setSearchQuery('');
                        setLocationQuery('');
                        setCategory('all');
                    }}>Clear Filters</Button>
                </div>
            )
        )}
        </div>
      </section>
    </div>
  );
}

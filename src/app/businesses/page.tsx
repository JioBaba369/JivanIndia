
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
import { MapPin, Search, BadgeCheck, ArrowRight, MoreVertical, Building, Star, PlusCircle } from "lucide-react";
import Link from "next/link";
import { useState, useMemo } from "react";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { useBusinesses } from "@/hooks/use-businesses";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import ReportDialog from "@/components/feature/report-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

export default function BusinessesPage() {
    const { businesses, isLoading } = useBusinesses();
    const { user } = useAuth();

    const [searchQuery, setSearchQuery] = useState('');
    const [locationQuery, setLocationQuery] = useState('');
    const [category, setCategory] = useState('all');

    const approvedBusinesses = useMemo(() => businesses.filter(b => b.isVerified), [businesses]);

    const businessCategories = useMemo(() => {
        const categories = new Set(approvedBusinesses.map(p => p.category));
        return ['all', ...Array.from(categories)];
    }, [approvedBusinesses]);

    const filteredBusinesses = useMemo(() => {
        return approvedBusinesses
        .filter(business => {
          const matchesSearch =
            business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            business.description.toLowerCase().includes(searchQuery.toLowerCase());
          
          const matchesLocation = business.region.toLowerCase().includes(locationQuery.toLowerCase());
    
          const matchesCategory = category === 'all' || business.category === category;
    
          return matchesSearch && matchesLocation && matchesCategory;
        })
        .sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }, [approvedBusinesses, searchQuery, locationQuery, category]);
    
    const BusinessSkeletons = () => (
      Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="flex flex-col overflow-hidden">
          <Skeleton className="h-48 w-full" />
          <CardContent className="flex flex-grow flex-col p-4">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-full mb-2 flex-grow" />
             <div className="mt-4 space-y-3">
               <Skeleton className="h-4 w-5/6" />
            </div>
            <div className="mt-4">
              <Skeleton className="h-8 w-24" />
            </div>
          </CardContent>
        </Card>
      ))
    );


  return (
    <div className="flex flex-col">
       <section className="bg-gradient-to-b from-primary/10 via-background to-background py-20 text-center">
        <div className="container mx-auto px-4">
          <h1 className="font-headline text-4xl font-bold text-shadow-lg md:text-6xl">
            Businesses & Services
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Find trusted local businesses and professional services in the community.
          </p>
          {user && (
            <Button asChild size="lg" className="mt-8">
              <Link href="/businesses/new">
                <PlusCircle className="mr-2 h-5 w-5"/>
                Add Your Business
              </Link>
            </Button>
          )}
        </div>
      </section>

      <div className="sticky top-[65px] z-30 border-y bg-background/95 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="relative lg:col-span-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                        className="pl-10 text-base h-12"
                        placeholder="Search Businesses..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                        className="pl-10 text-base h-12"
                        placeholder="Location (e.g. San Jose)"
                         value={locationQuery}
                        onChange={(e) => setLocationQuery(e.target.value)}
                    />
                </div>
                 <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="text-base h-12">
                        <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                    {businessCategories.map((cat, index) => (
                        <SelectItem key={index} value={cat}>
                        {cat === 'all' ? 'All Categories' : cat}
                        </SelectItem>
                    ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
      </div>
        
        <section className="container mx-auto py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
        {isLoading ? <BusinessSkeletons /> : (
            approvedBusinesses.length === 0 ? (
                <div className="rounded-lg border-2 border-dashed py-16 text-center col-span-full">
                    <Building className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="font-headline text-xl font-semibold mt-4">No Businesses Listed</h3>
                    <p className="text-muted-foreground mt-2">There are currently no businesses listed. Check back soon for new opportunities!</p>
                    {user && <Button asChild className="mt-4">
                        <Link href="/businesses/new">Add a Business</Link>
                    </Button>}
                </div>
            ) : filteredBusinesses.length > 0 ? (
                filteredBusinesses.map(business => (
                    <Card key={business.id} className={cn("group flex flex-col overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl", business.isFeatured && "border-primary border-2 shadow-lg shadow-primary/20")}>
                        <div className="relative h-48 w-full bg-muted">
                            <Link href={`/businesses/${business.id}`}>
                              {business.imageUrl ? (
                                <Image src={business.imageUrl} alt={business.name} fill className="object-cover" data-ai-hint="business photo" />
                               ) : (
                                <div className="absolute inset-0 bg-muted flex items-center justify-center">
                                  <Building className="h-16 w-16 text-muted-foreground" />
                                </div>
                               )}
                            </Link>
                            {business.isFeatured && <Badge variant="secondary" className="absolute left-3 top-3 border border-primary text-primary">Featured</Badge>}
                            <div className="absolute top-2 right-2">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 bg-black/20 hover:bg-black/40 text-white hover:text-white">
                                            <MoreVertical size={20} />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <ReportDialog 
                                            contentId={business.id} 
                                            contentType="Business" 
                                            contentTitle={business.name} 
                                            triggerComponent={<DropdownMenuItem onSelect={(e) => e.preventDefault()}>Report</DropdownMenuItem>}
                                        />
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                            <Badge variant="secondary" className="absolute right-3 top-3">{business.category}</Badge>
                        </div>
                        <CardContent className="flex-grow p-4">
                            <Link href={`/businesses/${business.id}`} className="group/link">
                                <CardTitle className="mb-2 font-headline text-xl group-hover/link:text-primary">
                                    {business.isVerified && <BadgeCheck className="mr-1 h-5 w-5 inline-block text-primary" />}
                                    {business.name}
                                </CardTitle>
                                <p className="text-sm text-muted-foreground line-clamp-2">{business.description}</p>
                                <div className="mt-4 space-y-2">
                                    <div className="flex items-center text-sm text-muted-foreground">
                                        <MapPin className="mr-2 h-4 w-4 text-primary"/>
                                        <span>{business.region}</span>
                                    </div>
                                    <div className="flex items-center text-sm text-muted-foreground">
                                      <Star className="mr-2 h-4 w-4 text-yellow-400 fill-yellow-400"/>
                                      <span>{business.rating.toFixed(1)} ({business.reviewCount} reviews)</span>
                                    </div>
                                </div>
                            </Link>
                        </CardContent>
                        <div className="flex items-center p-4 pt-0 mt-auto">
                            <Button asChild variant="link" className="p-0 h-auto">
                                <Link href={`/businesses/${business.id}`}>
                                    View Details <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </div>
                    </Card>
                ))
            ) : (
                <div className="rounded-lg border-2 border-dashed py-16 text-center col-span-full">
                    <h3 className="font-headline text-xl font-semibold">No Matching Businesses Found</h3>
                    <p className="text-muted-foreground mt-2">No businesses were found that match your criteria. Check back soon or adjust your filters.</p>
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

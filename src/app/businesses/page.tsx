
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
import { MapPin, Search, Star, BadgeCheck, LayoutGrid, List, Bookmark, PlusCircle, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useMemo, type MouseEvent } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useBusinesses } from "@/hooks/use-businesses";
import type { Business } from "@/hooks/use-businesses";

export default function BusinessesPage() {
    const { businesses } = useBusinesses();
    const { user, saveBusiness, unsaveBusiness, isBusinessSaved } = useAuth();
    const { toast } = useToast();
    const router = useRouter();

    const [searchQuery, setSearchQuery] = useState('');
    const [locationQuery, setLocationQuery] = useState('');
    const [category, setCategory] = useState('all');

    const businessCategories = useMemo(() => {
        const categories = new Set(businesses.map(p => p.category));
        return ['all', ...Array.from(categories)];
    }, [businesses]);

    const filteredBusinesses = useMemo(() => {
        return businesses.filter(business => {
          const matchesSearch =
            business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            business.description.toLowerCase().includes(searchQuery.toLowerCase());
          
          const matchesLocation = business.region.toLowerCase().includes(locationQuery.toLowerCase());
    
          const matchesCategory = category === 'all' || business.category === category;
    
          return matchesSearch && matchesLocation && matchesCategory;
        });
    }, [businesses, searchQuery, locationQuery, category]);
    
    const handleSaveToggle = (e: MouseEvent<HTMLButtonElement>, businessName: string, businessId: string) => {
        e.preventDefault();
        e.stopPropagation();
        if (!user) {
            toast({
                title: "Please log in",
                description: "You must be logged in to save listings.",
                variant: "destructive"
            });
            router.push('/login');
            return;
        }

        if (isBusinessSaved(businessId)) {
            unsaveBusiness(businessId);
            toast({
                title: "Listing Unsaved",
                description: `${businessName} has been removed from your saved listings.`,
            });
        } else {
            saveBusiness(businessId);
            toast({
                title: "Listing Saved!",
                description: `${businessName} has been saved to your profile.`,
            });
        }
    };


  return (
    <div className="container mx-auto py-12">
        <div className="space-y-4 mb-8">
            <h1 className="font-headline text-4xl font-bold">Businesses & Services</h1>
            <p className="text-lg text-muted-foreground">Find trusted local businesses and professional services in the community.</p>
        </div>
        <div className="rounded-lg bg-card p-4 shadow-md">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm pl-10"
                        placeholder="Search Businesses..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm pl-10"
                        placeholder="Location (e.g. San Jose)"
                         value={locationQuery}
                        onChange={(e) => setLocationQuery(e.target.value)}
                    />
                </div>
                 <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
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
                <Button className="w-full">
                    <Search className="mr-2 h-4 w-4" />
                    Apply Filters
                </Button>
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
            {filteredBusinesses.map(business => (
                <Card key={business.id} className="group flex flex-col overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl">
                    <Link href={`/businesses/${business.id}`} className="flex flex-col h-full">
                        <div className="relative h-48 w-full">
                            <Image
                                src={business.imageUrl}
                                alt={business.name}
                                fill
                                className="object-cover transition-transform group-hover:scale-105"
                                sizes="100vw"
                            />
                            <Badge variant="secondary" className="absolute right-3 top-3">{business.category}</Badge>
                        </div>
                        <CardContent className="flex-grow p-4">
                            <CardTitle className="mb-2 font-headline text-xl group-hover:text-primary">
                                {business.name}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground line-clamp-2">{business.description}</p>
                            <div className="mt-4 space-y-2">
                                <div className="flex items-center text-sm text-muted-foreground">
                                    <MapPin className="mr-2 h-4 w-4 text-primary"/>
                                    <span>{business.region}</span>
                                </div>
                            </div>
                        </CardContent>
                        <div className="flex items-center p-4 pt-0 mt-auto">
                            <Button asChild variant="link" className="p-0 h-auto">
                                <Link href={`/businesses/${business.id}`}>
                                    View Details <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </div>
                    </Link>
                </Card>
            ))}
        </div>
    </div>
  );
}

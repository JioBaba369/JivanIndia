
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
import { MapPin, Search, BadgeCheck, ArrowRight, MoreVertical } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useMemo } from "react";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { useBusinesses } from "@/hooks/use-businesses";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import ReportDialog from "@/components/feature/report-dialog";

export default function BusinessesPage() {
    const { businesses } = useBusinesses();
    const { user } = useAuth();

    const [searchQuery, setSearchQuery] = useState('');
    const [locationQuery, setLocationQuery] = useState('');
    const [category, setCategory] = useState('all');

    const businessCategories = useMemo(() => {
        const categories = new Set(businesses.map(p => p.category));
        return ['all', ...Array.from(categories)];
    }, [businesses]);

    const filteredBusinesses = useMemo(() => {
        return businesses
        .filter(business => {
          const matchesSearch =
            business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            business.description.toLowerCase().includes(searchQuery.toLowerCase());
          
          const matchesLocation = business.region.toLowerCase().includes(locationQuery.toLowerCase());
    
          const matchesCategory = category === 'all' || business.category === category;
    
          return matchesSearch && matchesLocation && matchesCategory;
        })
        .sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }, [businesses, searchQuery, locationQuery, category]);


  return (
    <div className="container mx-auto py-12">
        <div className="space-y-4 mb-8">
            <h1 className="font-headline text-4xl font-bold">Businesses & Services</h1>
            <p className="text-lg text-muted-foreground">Find trusted local businesses and professional services in the community.</p>
        </div>
        <div className="rounded-lg bg-card p-4 shadow-md">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="relative lg:col-span-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                        className="pl-10"
                        placeholder="Search Businesses..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                        className="pl-10"
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
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
            {filteredBusinesses.map(business => (
                <Card key={business.id} className={cn("group flex flex-col overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl", business.isFeatured && "border-primary border-2 shadow-lg shadow-primary/20")}>
                    <div className="relative h-48 w-full">
                        <Link href={`/businesses/${business.id}`}>
                            <Image
                                src={business.imageUrl}
                                alt={business.name}
                                fill
                                className="object-cover transition-transform group-hover:scale-105"
                                sizes="100vw"
                            />
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
            ))}
        </div>
    </div>
  );
}

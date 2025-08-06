
'use client';

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
import { MapPin, Search, Star, BadgeCheck, LayoutGrid, List, Bookmark, PlusCircle, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useMemo, type MouseEvent } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useProviders } from "@/hooks/use-providers";
import type { Provider } from "@/hooks/use-providers";

export default function DirectoryPage() {
    const { providers } = useProviders();
    const { user, saveProvider, unsaveProvider, isProviderSaved } = useAuth();
    const { toast } = useToast();
    const router = useRouter();

    const [searchQuery, setSearchQuery] = useState('');
    const [locationQuery, setLocationQuery] = useState('');
    const [category, setCategory] = useState('all');

    const providerCategories = useMemo(() => {
        const categories = new Set(providers.map(p => p.category));
        return ['all', ...Array.from(categories)];
    }, [providers]);

    const filteredProviders = useMemo(() => {
        return providers.filter(provider => {
          const matchesSearch =
            provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            provider.description.toLowerCase().includes(searchQuery.toLowerCase());
          
          const matchesLocation = provider.region.toLowerCase().includes(locationQuery.toLowerCase());
    
          const matchesCategory = category === 'all' || provider.category === category;
    
          return matchesSearch && matchesLocation && matchesCategory;
        });
    }, [providers, searchQuery, locationQuery, category]);
    
    const handleSaveToggle = (e: MouseEvent<HTMLButtonElement>, providerName: string, providerId: string) => {
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

        if (isProviderSaved(providerId)) {
            unsaveProvider(providerId);
            toast({
                title: "Listing Unsaved",
                description: `${providerName} has been removed from your saved listings.`,
            });
        } else {
            saveProvider(providerId);
            toast({
                title: "Listing Saved!",
                description: `${providerName} has been saved to your profile.`,
            });
        }
    };


  return (
    <div className="container mx-auto py-12">
        <div className="space-y-4 mb-8">
            <h1 className="font-headline text-4xl font-bold">Local Businesses</h1>
            <p className="text-lg text-muted-foreground">Support local entrepreneurs and find great services in your community.</p>
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
                    {providerCategories.map((cat, index) => (
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
            {filteredProviders.map(provider => (
                <Card key={provider.id} className="flex flex-col overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-xl">
                    <CardContent className="p-0">
                        <div className="relative h-48 w-full">
                            <Image
                                src={provider.imageUrl}
                                alt={provider.name}
                                fill
                                className="object-cover"
                                sizes="100vw"
                            />
                            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent text-primary-foreground hover:bg-primary/80 absolute right-3 top-3 bg-primary/80 backdrop-blur-sm">{provider.category}</div>
                        </div>
                    </CardContent>
                    <div className="flex-grow p-4">
                        <CardTitle className="mb-2 font-headline text-xl">
                            <Link href={`/directory/${provider.id}`} className="hover:text-primary transition-colors">{provider.name}</Link>
                        </CardTitle>
                        <p className="text-sm text-muted-foreground line-clamp-2">{provider.description}</p>
                        <div className="mt-4 space-y-2">
                            <div className="flex items-center text-sm text-muted-foreground">
                                <MapPin className="mr-2 h-4 w-4 text-primary"/>
                                <span>{provider.region}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center p-4 pt-0">
                        <Button asChild variant="link" className="p-0 h-auto">
                            <Link href={`/directory/${provider.id}`}>
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

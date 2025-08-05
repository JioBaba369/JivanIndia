
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
import { MapPin, Search, Star, BadgeCheck, LayoutGrid, List, Bookmark } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useMemo, type MouseEvent } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useProviders } from "@/hooks/use-providers";
import type { Provider } from "@/hooks/use-providers";

export default function ProvidersPage() {
    const { providers } = useProviders();
    const { user, saveProvider, unsaveProvider, isProviderSaved } = useAuth();
    const { toast } = useToast();
    const router = useRouter();

    const [searchQuery, setSearchQuery] = useState('');
    const [locationQuery, setLocationQuery] = useState('');
    const [category, setCategory] = useState('all');
    const [view, setView] = useState<'grid' | 'list'>('grid');

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
                description: "You must be logged in to save providers.",
                variant: "destructive"
            });
            router.push('/login');
            return;
        }

        if (isProviderSaved(providerId)) {
            unsaveProvider(providerId);
            toast({
                title: "Provider Unsaved",
                description: `${providerName} has been removed from your saved providers.`,
            });
        } else {
            saveProvider(providerId);
            toast({
                title: "Provider Saved!",
                description: `${providerName} has been saved to your profile.`,
            });
        }
    };


  return (
    <div className="flex flex-col">
      <section className="bg-gradient-to-b from-primary/10 via-background to-background py-20 text-center">
        <div className="container mx-auto px-4">
          <h1 className="font-headline text-4xl font-bold text-shadow-lg md:text-6xl">
            Service Providers
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Find trusted professionals for legal, health, financial, and other services.
          </p>
        </div>
      </section>

      <div className="sticky top-[65px] z-30 border-t bg-background/80 py-4 backdrop-blur-md">
        <div className="container mx-auto px-4">
          <Card>
            <CardContent className="p-4">
               <div className="flex flex-col gap-4 md:flex-row">
                 <div className="grid flex-grow grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="relative md:col-span-1">
                      <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Search by name, service..."
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
                        {providerCategories.map((cat, index) => (
                          <SelectItem key={index} value={cat}>
                            {cat === 'all' ? 'All Categories' : cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                 </div>
                  <div className="flex items-center gap-2">
                        <Button variant={view === 'grid' ? 'default' : 'outline'} size="icon" onClick={() => setView('grid')}>
                            <LayoutGrid />
                        </Button>
                        <Button variant={view === 'list' ? 'default' : 'outline'} size="icon" onClick={() => setView('list')}>
                            <List />
                        </Button>
                    </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <section className="container mx-auto px-4 py-12">
       {filteredProviders.length > 0 ? (
          <div className={cn(
            "gap-8",
            view === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                : 'flex flex-col'
            )}>
            {filteredProviders.map((provider) => {
                const isSaved = user ? isProviderSaved(provider.id) : false;
                return view === 'grid' ? (
                <Card key={provider.id} className="group flex flex-col overflow-hidden border transition-all hover:-translate-y-1 hover:shadow-lg">
                    <Link href={`/providers/${provider.id}`} className="flex h-full flex-grow flex-col">
                        <div className="relative h-48 w-full">
                        <Image
                            src={provider.imageUrl}
                            alt={provider.name}
                            fill
                            className="object-cover transition-transform group-hover:scale-105"
                        />
                        </div>
                        <CardContent className="flex flex-grow flex-col p-4">
                        <p className="font-semibold text-primary">{provider.category}</p>
                        <div className="mt-1 flex items-center gap-2">
                            <h3 className="font-headline text-xl font-bold group-hover:text-primary">{provider.name}</h3>
                            {provider.isVerified && <BadgeCheck className="h-5 w-5 text-primary" />}
                        </div>
                        <p className="mt-2 flex-grow text-sm text-muted-foreground line-clamp-3">{provider.description}</p>
                        
                        <div className="mt-4 flex flex-col space-y-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span>{provider.rating.toFixed(1)} ({provider.reviewCount} reviews)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                <span>{provider.region}</span>
                            </div>
                        </div>
                        </CardContent>
                    </Link>
                    <div className="mt-auto flex gap-2 p-4 pt-0">
                        <Button asChild className="flex-1">
                            <Link href={`/providers/${provider.id}`}>View Profile</Link>
                        </Button>
                        <Button variant="secondary" className="flex-1" onClick={(e) => handleSaveToggle(e, provider.name, provider.id)}>
                            <Bookmark className="mr-2 h-4 w-4"/>
                            {isSaved ? "Saved" : "Save"}
                        </Button>
                    </div>
                </Card>
            ) : (
                <Card key={provider.id} className="group w-full overflow-hidden border transition-all hover:shadow-lg">
                   <Link href={`/providers/${provider.id}`}>
                    <div className="flex flex-col sm:flex-row">
                        <div className="relative h-48 w-full sm:h-auto sm:w-48 flex-shrink-0">
                           <Image
                                src={provider.imageUrl}
                                alt={provider.name}
                                fill
                                className="object-cover transition-transform group-hover:scale-105"
                            />
                        </div>
                        <CardContent className="flex flex-grow flex-col p-4 sm:p-6">
                            <p className="font-semibold text-primary">{provider.category}</p>
                            <div className="mt-1 flex items-center gap-2">
                                <h3 className="font-headline text-xl font-bold group-hover:text-primary">{provider.name}</h3>
                                {provider.isVerified && <BadgeCheck className="h-5 w-5 text-primary" />}
                            </div>
                            <p className="mt-2 flex-grow text-sm text-muted-foreground line-clamp-2">{provider.description}</p>
                            <div className="mt-4 flex flex-col space-y-2 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                    <span>{provider.rating.toFixed(1)} ({provider.reviewCount} reviews)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4" />
                                    <span>{provider.region}</span>
                                </div>
                            </div>
                        </CardContent>
                         <div className="flex flex-col justify-center gap-2 p-4 sm:p-6 border-t sm:border-t-0 sm:border-l">
                            <Button asChild className="w-full sm:w-auto">
                               <Link href={`/providers/${provider.id}`}>View</Link>
                            </Button>
                             <Button variant="secondary" className="w-full sm:w-auto" onClick={(e) => handleSaveToggle(e, provider.name, provider.id)}>
                                <Bookmark className="mr-2 h-4 w-4"/>
                                {isSaved ? "Saved" : "Save"}
                            </Button>
                         </div>
                    </div>
                   </Link>
                </Card>
            )
            })}
          </div>
       ) : (
             <div className="rounded-lg border-2 border-dashed py-16 text-center">
                <h3 className="font-headline text-xl font-semibold">No Providers Found</h3>
                <p className="text-muted-foreground mt-2">No providers match your criteria. Please check back later or adjust your filters.</p>
                <Button variant="link" onClick={() => {
                    setSearchQuery('');
                    setLocationQuery('');
                    setCategory('all');
                }}>Clear Filters</Button>
            </div>
          )}
      </section>
    </div>
  );
}

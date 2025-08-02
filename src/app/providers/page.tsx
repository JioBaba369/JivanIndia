
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
import { MapPin, Search, Star, BadgeCheck, Bookmark } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useMemo, type MouseEvent } from "react";
import { useProviders } from "@/hooks/use-providers";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export default function ProvidersPage() {
    const { providers } = useProviders();
    const { user, saveProvider, isProviderSaved } = useAuth();
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
    
    const handleSave = (e: MouseEvent<HTMLButtonElement>, providerName: string, providerId: string) => {
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

        if (!isProviderSaved(providerId)) {
            saveProvider(providerId);
            toast({
                title: "Provider Saved!",
                description: `${providerName} has been saved to your profile.`,
            });
        } else {
             toast({
                title: "Already Saved",
                description: "You have already saved this provider.",
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
            <CardContent>
               <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                <div className="relative md:col-span-2">
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
            </CardContent>
          </Card>
        </div>
      </div>
      
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredProviders.length > 0 ? filteredProviders.map((provider) => (
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
                    <CardContent className="flex flex-grow flex-col">
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
                    <div className="mt-auto flex gap-2 pt-6">
                        <Button asChild className="flex-1">
                            <Link href={`/providers/${provider.id}`}>View Profile</Link>
                        </Button>
                        <Button variant="secondary" className="flex-1" onClick={(e) => handleSave(e, provider.name, provider.id)} disabled={isProviderSaved(provider.id)}>
                            <Bookmark className="mr-2 h-4 w-4" />
                            {isProviderSaved(provider.id) ? "Saved" : "Save"}
                        </Button>
                    </div>
                    </CardContent>
                </Link>
            </Card>
          )) : (
             <div className="rounded-lg border-2 border-dashed py-12 text-center md:col-span-2 lg:col-span-3">
                <p className="text-muted-foreground">No providers found that match your criteria.</p>
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

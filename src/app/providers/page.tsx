
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
import { MapPin, Search, UserCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useMemo } from "react";

export const providers: any[] = [];


export default function ProvidersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('all');

  const providerCategories = useMemo(() => {
    const categories = new Set(providers.map(p => p.category));
    return ['all', ...Array.from(categories)];
  }, []);

  const filteredProviders = useMemo(() => {
    return providers.filter(provider => {
      const matchesSearch =
        provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        provider.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
        provider.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = category === 'all' || provider.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, category]);


  return (
    <div className="flex flex-col">
      <section className="bg-gradient-to-b from-primary/10 via-background to-background py-20 text-center">
        <div className="container mx-auto px-4">
          <h1 className="font-headline text-4xl font-bold text-shadow-lg md:text-6xl">
            Service Providers
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Find trusted professionals and services within the community.
          </p>
        </div>
      </section>

      <div className="sticky top-[65px] z-30 border-y bg-background/80 py-4 backdrop-blur-md">
        <div className="container mx-auto px-4">
          <Card>
            <CardContent className="p-4">
               <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="relative md:col-span-2">
                  <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, service, or location..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Services" />
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
            <Card key={provider.id} className="group flex flex-col overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg">
               <Link href={`/providers/${provider.id}`} className="flex h-full flex-col">
                <div className="relative h-48 w-full">
                  <Image
                    src={provider.imageUrl}
                    alt={provider.name}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-4">
                      <h3 className="font-headline text-xl font-bold text-white text-shadow">{provider.name}</h3>
                      <p className="text-sm font-semibold text-primary-foreground/90 text-shadow">{provider.specialty}</p>
                    </div>
                </div>
                <CardContent className="flex flex-grow flex-col p-6">
                  <div className="flex flex-grow flex-col space-y-2 text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <UserCheck className="h-4 w-4 text-primary" />
                        <span>{provider.category}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span>{provider.location}</span>
                      </div>
                  </div>
                    <Button variant="secondary" className="mt-6 w-full">
                    View Profile
                  </Button>
                </CardContent>
              </Link>
            </Card>
          )) : (
            <div className="rounded-lg border-2 border-dashed py-12 text-center md:col-span-3">
                <p className="text-muted-foreground">No providers found. Please check back later!</p>
                <Button variant="link" onClick={() => { setSearchQuery(''); setCategory('all'); }}>Clear Filters</Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

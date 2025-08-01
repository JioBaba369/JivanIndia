
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

const providers = [
  {
    id: "1",
    name: "Dr. Anjali Sharma, MD",
    category: "Healthcare",
    specialty: "Cardiologist",
    location: "Los Angeles, CA",
    imageUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHx GRsaW5pdGllfGVufDB8fHx8MTc1NDE5NzQzNnww&ixlib=rb-4.1.0&q=80&w=1080",
    aiHint: "doctor portrait"
  },
  {
    id: "2",
    name: "Rajesh Kumar & Associates",
    category: "Legal Services",
    specialty: "Immigration Law",
    location: "New York, NY",
    imageUrl: "https://images.unsplash.com/photo-1505664194779-8beace72944f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxsYXclMjBvZmZpY2V8ZW58MHx8fHwxNzU0MTk3NDM2fDA&ixlib=rb-4.1.0&q=80&w=1080",
    aiHint: "law office"
  },
  {
    id: "3",
    name: "Priya's Kitchen",
    category: "Catering",
    specialty: "North Indian Cuisine",
    location: "Dallas, TX",
    imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBjYXRlcmluZ3xlbnwwfHx8fDE3NTQxOTc0MzZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    aiHint: "catering food"
  },
  {
    id: "4",
    name: "Vikram Singh Photography",
    category: "Event Services",
    specialty: "Wedding Photography",
    location: "Miami, FL",
    imageUrl: "https://images.unsplash.com/photo-1519225421980-715cb0295b73?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxJbmRpYW4lMjB3ZWRkaW5nJTIwcGhvdG9ncmFwaGVyfGVufDB8fHx8fDE3NTQxOTc0MzZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    aiHint: "photographer camera"
  },
  {
    id: "5",
    name: "Aisha's Design Studio",
    category: "Creative Services",
    specialty: "Graphic Design",
    location: "Seattle, WA",
    imageUrl: "https://images.unsplash.com/photo-1569396116180-210c182bedb8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxkZXNpZ24lMjBzdHVkaW98ZW58MHx8fHwxNzU0MTk3NDM2fDA&ixlib-rb-4.1.0&q=80&w=1080",
    aiHint: "design studio"
  },
  {
    id: "6",
    name: "Rohan Gupta, CPA",
    category: "Financial Services",
    specialty: "Tax & Accounting",
    location: "San Jose, CA",
    imageUrl: "https://images.unsplash.com/photo-1554224155-1696413565d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxhY2NvdW50YW50JTIwb2ZmaWNlfGVufDB8fHx8fDE3NTQxOTc0MzZ8MA&ixlib-rb-4.1.0&q=80&w=1080",
    aiHint: "accountant office"
  },
];


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
          <h1 className="font-headline text-4xl font-bold md:text-6xl text-shadow-lg">
            Service Providers
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Find trusted professionals and services within the community.
          </p>
        </div>
      </section>

      <div className="sticky top-[65px] z-30 bg-background/80 py-4 backdrop-blur-md border-y">
        <div className="container mx-auto px-4">
          <Card>
            <CardContent className="p-4">
               <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="relative md:col-span-2">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
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
            <Card key={provider.id} className="overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1 group flex flex-col">
               <Link href={`/providers/${provider.id}`} className="block h-full flex flex-col">
                <CardContent className="p-0 flex flex-col h-full">
                  <div className="relative h-48 w-full">
                    <Image
                      src={provider.imageUrl}
                      alt={provider.name}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                      data-ai-hint={provider.aiHint}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                     <div className="absolute bottom-0 left-0 p-4">
                       <h3 className="font-headline text-xl font-bold text-white text-shadow">{provider.name}</h3>
                       <p className="font-semibold text-primary-foreground/90 text-sm text-shadow">{provider.specialty}</p>
                     </div>
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex flex-col space-y-2 text-muted-foreground flex-grow">
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
                  </div>
                </CardContent>
              </Link>
            </Card>
          )) : (
            <div className="text-center py-12 border-2 border-dashed rounded-lg md:col-span-3">
                <p className="text-muted-foreground">No providers found matching your criteria.</p>
                <Button variant="link" onClick={() => { setSearchQuery(''); setCategory('all'); }}>Clear filters</Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

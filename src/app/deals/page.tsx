
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Search, Tag, Building } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useMemo } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const deals: any[] = [
    {
    id: '1',
    title: '20% Off Lunch Special',
    description: 'Enjoy a delicious 20% discount on our entire lunch menu. Valid Monday to Friday, from 11 AM to 3 PM. Cannot be combined with other offers.',
    terms: 'Offer valid for dine-in only. Mention JivanIndia.co to redeem. Expires end of next month.',
    category: 'Food & Dining',
    imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxJbmRpYW4lMjBmb29kJTIwZGlzaHxlbnwwfHx8fDE3NTQxOTc0MzZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    business: 'Saffron Restaurant Group',
    businessId: '1',
    businessLocation: '123 Saffron Avenue, New York, NY',
    businessWebsite: 'www.saffronrestaurants.com',
    expires: 'August 31, 2024',
    postedAt: '2024-07-20T11:00:00Z',
  },
  {
    id: '2',
    title: 'Free Samosas with Entree',
    description: 'Get a complimentary order of our famous vegetable samosas with the purchase of any two dinner entrees.',
    terms: 'Valid for dine-in or takeout. One per table/order. Not valid with other promotions.',
    category: 'Food & Dining',
    imageUrl: 'https://images.unsplash.com/photo-1601252399679-68d184a8775f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxzYW1vc2FzfGVufDB8fHx8MTc1NDE5NzQzNnww&ixlib=rb-4.1.0&q=80&w=1080',
    business: 'Saffron Restaurant Group',
    businessId: '1',
    businessLocation: '123 Saffron Avenue, New York, NY',
    businessWebsite: 'www.saffronrestaurants.com',
    expires: 'September 15, 2024',
    postedAt: '2024-07-18T18:00:00Z',
  }
];


export default function DealsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('all');

  const dealCategories = useMemo(() => {
    const categories = new Set(deals.map(d => d.category));
    return ['all', ...Array.from(categories)];
  }, []);

  const filteredDeals = useMemo(() => {
    return deals.filter(deal => {
      const matchesSearch =
        deal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deal.business.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = category === 'all' || deal.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, category]);

  return (
    <div className="flex flex-col">
      <section className="bg-gradient-to-b from-primary/10 via-background to-background py-20 text-center">
        <div className="container mx-auto px-4">
          <h1 className="font-headline text-4xl font-bold text-shadow-lg md:text-6xl">
            Community Deals
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Exclusive offers from businesses in our community. Support local, save money.
          </p>
           <Button size="lg" className="mt-8">
              <PlusCircle className="mr-2 h-5 w-5" />
              Post a Deal
            </Button>
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
                    placeholder="Search for a deal or business..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                 <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                     {dealCategories.map((cat, index) => (
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
          {filteredDeals.length > 0 ? filteredDeals.map((deal) => (
            <Card key={deal.id} className="group flex flex-col overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg">
               <Link href={`/deals/${deal.id}`} className="flex h-full flex-col">
                <div className="relative h-48 w-full">
                  <Image
                    src={deal.imageUrl}
                    alt={deal.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <CardContent className="flex flex-grow flex-col p-6">
                  <Badge variant="secondary" className="w-fit">{deal.category}</Badge>
                  <h3 className="font-headline mt-2 flex-grow text-xl font-bold group-hover:text-primary">{deal.title}</h3>
                  <div className="mt-4 flex items-center gap-2 text-muted-foreground">
                      <Building className="h-4 w-4" />
                      <span>{deal.business}</span>
                  </div>
                    <Button variant="outline" className="mt-6 w-full">
                      <Tag className="mr-2 h-4 w-4" />
                      View Deal
                    </Button>
                </CardContent>
              </Link>
            </Card>
          )) : (
            <div className="col-span-full rounded-lg border-2 border-dashed py-12 text-center">
                <p className="text-muted-foreground">No deals found. Please check back later!</p>
                <Button variant="link" onClick={() => { setSearchQuery(''); setCategory('all'); }}>Clear Filters</Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

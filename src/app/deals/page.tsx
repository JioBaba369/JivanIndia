
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Search, Tag, Building, LayoutGrid, List } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useMemo, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDeals } from "@/hooks/use-deals";
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { format, isValid } from 'date-fns';

export default function DealsPage() {
  const { deals } = useDeals();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [view, setView] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    setSearchQuery(searchParams.get('q') || '');
  }, [searchParams]);

  const dealCategories = useMemo(() => {
    const categories = new Set(deals.map(d => d.category));
    return ['all', ...Array.from(categories)];
  }, [deals]);

  const filteredDeals = useMemo(() => {
    return deals.filter(deal => {
      const matchesSearch =
        deal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deal.business.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = category === 'all' || deal.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [deals, searchQuery, category]);

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
           <Button asChild size="lg" className="mt-8">
              <Link href="/deals/new">
                <PlusCircle className="mr-2 h-5 w-5" />
                Post a Deal
              </Link>
            </Button>
        </div>
      </section>

      <div className="sticky top-[65px] z-30 border-y bg-background/80 py-4 backdrop-blur-md">
        <div className="container mx-auto px-4">
          <Card>
            <CardContent className="p-4">
               <div className="flex flex-col gap-4 md:flex-row">
                 <div className="grid flex-grow grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="relative md:col-span-1">
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
        {filteredDeals.length > 0 ? (
          <div className={cn(
            "gap-8",
            view === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                : 'flex flex-col'
            )}>
            {filteredDeals.map((deal) => {
              const expirationDate = isValid(new Date(deal.expires)) ? format(new Date(deal.expires), 'PP') : 'N/A';
              return view === 'grid' ? (
                <Card key={deal.id} className="group flex flex-col overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg">
                  <Link href={`/deals/${deal.id}`} className="flex h-full flex-col">
                    <div className="relative h-48 w-full">
                      <Image
                        src={deal.imageUrl}
                        alt={deal.title}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                        data-ai-hint="deal photo"
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
              ) : (
                <Card key={deal.id} className="group w-full overflow-hidden border transition-all hover:shadow-lg">
                  <Link href={`/deals/${deal.id}`}>
                    <div className="flex flex-col sm:flex-row">
                      <div className="relative h-48 w-full sm:h-auto sm:w-48 flex-shrink-0">
                        <Image
                          src={deal.imageUrl}
                          alt={deal.title}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                          data-ai-hint="deal photo"
                        />
                      </div>
                      <CardContent className="flex flex-grow flex-col p-4 sm:p-6">
                        <Badge variant="secondary" className="w-fit">{deal.category}</Badge>
                        <h3 className="font-headline mt-2 text-xl font-bold group-hover:text-primary">{deal.title}</h3>
                        <div className="mt-2 flex items-center gap-2 text-muted-foreground">
                            <Building className="h-4 w-4" />
                            <span>{deal.business}</span>
                        </div>
                         <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                            <span>Expires: {expirationDate}</span>
                        </div>
                      </CardContent>
                      <div className="flex items-center p-4 sm:p-6 border-t sm:border-t-0 sm:border-l">
                        <Button variant="outline" className="w-full sm:w-auto">
                            <Tag className="mr-2 h-4 w-4" />
                            View Deal
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
                <h3 className="font-headline text-xl font-semibold">No Deals Found</h3>
                <p className="text-muted-foreground mt-2">No deals match your criteria. Please check back later or adjust your filters.</p>
                <Button variant="link" onClick={() => { setSearchQuery(''); setCategory('all'); }}>Clear Filters</Button>
            </div>
          )}
      </section>
    </div>
  );
}

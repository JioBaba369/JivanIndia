
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Search, Tag, Building, ArrowRight, MoreVertical } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useMemo, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDeals } from "@/hooks/use-deals";
import { useSearchParams } from "next/navigation";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import ReportDialog from "@/components/feature/report-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";

export default function DealsPage() {
  const { deals, isLoading } = useDeals();
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('all');

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
  
  const DealSkeletons = () => (
    Array.from({ length: 6 }).map((_, i) => (
      <Card key={i} className="flex flex-col overflow-hidden">
        <Skeleton className="h-48 w-full" />
        <CardContent className="flex flex-grow flex-col p-4">
          <Skeleton className="h-4 w-1/3 mb-2" />
          <Skeleton className="h-6 w-full mb-4" />
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
            Community Deals
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Exclusive offers from businesses in our community. Support local, save money.
          </p>
           {user?.affiliation && (
              <Button asChild size="lg" className="mt-8">
                <Link href="/deals/new">
                  <PlusCircle className="mr-2 h-5 w-5" />
                  Post a Deal
                </Link>
              </Button>
           )}
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
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {isLoading ? <DealSkeletons /> : (
          deals.length === 0 ? (
            <div className="rounded-lg border-2 border-dashed py-16 text-center col-span-full">
                <Tag className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="font-headline text-xl font-semibold mt-4">No Deals Available</h3>
                <p className="text-muted-foreground mt-2">There are currently no deals. Be the first to post one and support local businesses!</p>
                <Button asChild className="mt-4">
                    <Link href="/deals/new">Post a Deal</Link>
                </Button>
            </div>
          ) : filteredDeals.length > 0 ? (
            filteredDeals.map((deal) => (
                <Card key={deal.id} className="group flex flex-col overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg">
                    <div className="relative h-48 w-full">
                        <Link href={`/deals/${deal.id}`}>
                          <Image
                            src={deal.imageUrl}
                            alt={deal.title}
                            fill
                            className="object-cover transition-transform group-hover:scale-105"
                            data-ai-hint="deal photo"
                          />
                        </Link>
                        <div className="absolute top-2 right-2">
                             <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 bg-black/20 hover:bg-black/40 text-white hover:text-white">
                                        <MoreVertical size={20} />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <ReportDialog 
                                        contentId={deal.id} 
                                        contentType="Deal" 
                                        contentTitle={deal.title} 
                                        triggerComponent={<DropdownMenuItem onSelect={(e) => e.preventDefault()}>Report</DropdownMenuItem>}
                                    />
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                    <CardContent className="flex flex-grow flex-col p-4">
                      <Link href={`/deals/${deal.id}`} className="flex-grow group/link">
                          <Badge variant="secondary" className="w-fit">{deal.category}</Badge>
                          <CardTitle className="font-headline mt-2 flex-grow text-xl group-hover/link:text-primary">{deal.title}</CardTitle>
                          <div className="mt-4 flex items-center gap-2 text-muted-foreground">
                              <Building className="h-4 w-4" />
                              <span>{deal.business}</span>
                          </div>
                      </Link>
                    </CardContent>
                    <div className="p-4 pt-0 mt-auto">
                        <Button asChild variant="link" className="p-0 h-auto">
                            <Link href={`/deals/${deal.id}`}>
                                View Details <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                </Card>
            ))
          ) : (
            <div className="rounded-lg border-2 border-dashed py-16 text-center col-span-full">
                <h3 className="font-headline text-xl font-semibold">No Deals Found</h3>
                <p className="text-muted-foreground mt-2">No deals match your criteria. Please check back later or adjust your filters.</p>
                <Button variant="link" onClick={() => { setSearchQuery(''); setCategory('all'); }}>Clear Filters</Button>
            </div>
          )
        )}
        </div>
      </section>
    </div>
  );
}

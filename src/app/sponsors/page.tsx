
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
import { Handshake, Search, LayoutGrid, List } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { useState, useMemo } from 'react';
import { cn } from "@/lib/utils";
import { type Sponsor, initialSponsors } from "@/data/sponsors";

export default function SponsorsPage() {
    const [sponsors] = useState<Sponsor[]>(initialSponsors);
    const [searchQuery, setSearchQuery] = useState('');
    const [industry, setIndustry] = useState('all');
    const [view, setView] = useState<'grid' | 'list'>('grid');

    const sponsorIndustries = useMemo(() => {
        const industries = new Set(sponsors.map(s => s.industry));
        return ['all', ...Array.from(industries)];
    }, [sponsors]);

    const filteredSponsors = useMemo(() => {
        return sponsors.filter(sponsor => {
            const matchesSearch = sponsor.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesIndustry = industry === 'all' || sponsor.industry === industry;
            return matchesSearch && matchesIndustry;
        });
    }, [sponsors, searchQuery, industry]);

  return (
    <div className="flex flex-col">
      <section className="bg-gradient-to-b from-primary/10 via-background to-background py-20 text-center">
        <div className="container mx-auto px-4">
          <h1 className="font-headline text-4xl font-bold text-shadow-lg md:text-6xl">
            Community Sponsors
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Meet the organizations whose generous support helps our community thrive.
          </p>
        </div>
      </section>

      <div className="sticky top-[65px] z-30 border-t bg-background/80 py-4 backdrop-blur-md">
        <div className="container mx-auto px-4">
          <Card>
            <CardContent className="p-4">
               <div className="flex flex-col gap-4 md:flex-row">
                 <div className="grid flex-grow grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="relative md:col-span-1">
                      <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Search by sponsor name..."
                        className="pl-10 text-base"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <Select value={industry} onValueChange={setIndustry}>
                      <SelectTrigger className="text-base">
                        <SelectValue placeholder="All Industries" />
                      </SelectTrigger>
                      <SelectContent>
                        {sponsorIndustries.map((ind, index) => (
                          <SelectItem key={index} value={ind}>
                            {ind === 'all' ? 'All Industries' : ind}
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
        {filteredSponsors.length > 0 ? (
           <div className={cn(
            "gap-8",
            view === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                : 'flex flex-col'
            )}>
            {filteredSponsors.map((sponsor) => (
              view === 'grid' ? (
                <Card key={sponsor.id} className="group flex flex-col overflow-hidden border transition-all hover:-translate-y-1 hover:shadow-lg">
                    <Link href={`/sponsors/${sponsor.id}`} className="flex h-full flex-grow flex-col">
                        <div className="relative h-48 w-full bg-muted flex items-center justify-center p-4">
                        <Image
                            src={sponsor.logoUrl}
                            alt={`${sponsor.name} logo`}
                            width={200}
                            height={100}
                            className="object-contain transition-transform group-hover:scale-105"
                        />
                        <Badge variant={sponsor.tier === 'Platinum' ? 'default' : 'secondary'} className="absolute top-3 right-3">{sponsor.tier}</Badge>
                        </div>
                        <CardContent className="flex flex-grow flex-col p-4">
                        <h3 className="font-headline text-xl font-bold group-hover:text-primary mt-4">{sponsor.name}</h3>
                        <p className="font-semibold text-primary">{sponsor.industry}</p>
                        <p className="mt-2 flex-grow text-sm text-muted-foreground line-clamp-3">{sponsor.description}</p>
                        
                        <div className="mt-auto pt-6">
                            <Button variant="outline" className="w-full">
                                <Handshake className="mr-2 h-4 w-4" />
                                View Sponsor
                            </Button>
                        </div>
                        </CardContent>
                    </Link>
                </Card>
              ) : (
                 <Card key={sponsor.id} className="group w-full overflow-hidden border transition-all hover:shadow-lg">
                    <Link href={`/sponsors/${sponsor.id}`}>
                        <div className="flex flex-col sm:flex-row">
                            <div className="relative h-48 w-full sm:h-auto sm:w-48 flex-shrink-0 bg-muted flex items-center justify-center p-4">
                               <Image
                                    src={sponsor.logoUrl}
                                    alt={`${sponsor.name} logo`}
                                    width={200}
                                    height={100}
                                    className="object-contain transition-transform group-hover:scale-105"
                                />
                            </div>
                            <CardContent className="flex-grow p-4 sm:p-6">
                                <Badge variant={sponsor.tier === 'Platinum' ? 'default' : 'secondary'} className="w-fit">{sponsor.tier}</Badge>
                                <h3 className="font-headline text-xl font-bold group-hover:text-primary mt-2">{sponsor.name}</h3>
                                <p className="font-semibold text-primary">{sponsor.industry}</p>
                                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{sponsor.description}</p>
                            </CardContent>
                             <div className="flex items-center p-4 sm:p-6 border-t sm:border-t-0 sm:border-l">
                                <Button variant="outline" className="w-full sm:w-auto">
                                    <Handshake className="mr-2 h-4 w-4" />
                                    View
                                </Button>
                            </div>
                        </div>
                    </Link>
                 </Card>
              )
            ))}
           </div>
        ) : (
             <div className="rounded-lg border-2 border-dashed py-16 text-center">
                <h3 className="font-headline text-xl font-semibold">No Sponsors Found</h3>
                <p className="text-muted-foreground mt-2">No sponsors match your criteria. Please check back later or adjust your filters.</p>
                <Button variant="link" onClick={() => {
                    setSearchQuery('');
                    setIndustry('all');
                }}>Clear Filters</Button>
            </div>
          )}
      </section>
    </div>
  );
}

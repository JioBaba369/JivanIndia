
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Handshake, Search, Building } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { useState, useMemo } from 'react';
import { useSponsors } from "@/hooks/use-sponsors";

export default function SponsorsPage() {
    const { sponsors } = useSponsors();
    const [searchQuery, setSearchQuery] = useState('');
    const [industry, setIndustry] = useState('all');

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
            <CardContent>
               <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="relative md:col-span-2">
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
            </CardContent>
          </Card>
        </div>
      </div>
      
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredSponsors.length > 0 ? filteredSponsors.map((sponsor) => (
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
                    <CardContent className="flex flex-grow flex-col">
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
          )) : (
             <div className="rounded-lg border-2 border-dashed py-12 text-center md:col-span-2 lg:col-span-3">
                <p className="text-muted-foreground">No sponsors found that match your criteria.</p>
                <Button variant="link" onClick={() => {
                    setSearchQuery('');
                    setIndustry('all');
                }}>Clear Filters</Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

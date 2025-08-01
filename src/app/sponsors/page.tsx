
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { HeartHandshake, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export const sponsors: any[] = [];


export default function SponsorsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const filteredSponsors = sponsors.filter(sponsor => 
    sponsor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sponsor.industry.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col">
      <section className="bg-gradient-to-b from-primary/10 via-background to-background py-20 text-center">
        <div className="container mx-auto px-4">
          <h1 className="font-headline text-4xl font-bold md:text-6xl text-shadow-lg">
            Our Valued Sponsors
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            The businesses and individuals powering our community.
          </p>
        </div>
      </section>

      <div className="sticky top-[65px] z-30 bg-background/80 py-4 backdrop-blur-md border-y">
        <div className="container mx-auto px-4">
          <Card>
            <CardContent className="p-4">
               <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="Search for a sponsor by name or industry..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredSponsors.length > 0 ? filteredSponsors.map((sponsor) => (
            <Card key={sponsor.id} className="overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1 group flex flex-col">
               <Link href={`/sponsors/${sponsor.id}`} className="block h-full flex flex-col">
                <div className="relative h-48 w-full">
                  <Image
                    src={sponsor.imageUrl}
                    alt={sponsor.name}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                    data-ai-hint={sponsor.aiHint}
                  />
                </div>
                <CardContent className="p-6 text-center flex flex-col flex-grow">
                  <h3 className="font-headline text-xl font-bold group-hover:text-primary">{sponsor.name}</h3>
                  <div className="mt-2 flex items-center justify-center gap-2 text-muted-foreground flex-grow">
                      <HeartHandshake className="h-4 w-4" />
                      <span>{sponsor.industry}</span>
                  </div>
                  <Button variant="secondary" className="mt-6 w-full">
                    View Profile
                  </Button>
                </CardContent>
              </Link>
            </Card>
          )) : (
             <div className="text-center py-12 border-2 border-dashed rounded-lg col-span-full">
                <p className="text-muted-foreground">No sponsors found that match your criteria.</p>
                <Button variant="link" onClick={() => setSearchQuery('')}>Clear search</Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

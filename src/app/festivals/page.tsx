
'use client';

import { useState, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Search, Globe, MapPin } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { useFestivals } from '@/hooks/use-festivals';
import { Skeleton } from '@/components/ui/skeleton';

interface GroupedFestivals {
    [key: string]: ReturnType<typeof useFestivals>['festivals'];
}

export default function FestivalsPage() {
    const { festivals, isLoading } = useFestivals();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCountry, setSelectedCountry] = useState('All');
    const [selectedState, setSelectedState] = useState('All');
    const [selectedMonth, setSelectedMonth] = useState('All');

    const countries = useMemo(() => ['All', ...new Set(festivals.map(f => f.country).flat())], [festivals]);
    const states = useMemo(() => ['All', ...new Set(festivals.map(f => f.state).flat())], [festivals]);
    const months = useMemo(() => ['All', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'], []);

    const filteredFestivals = useMemo(() => {
        return festivals.filter(festival => {
            const matchesSearch = festival.name.toLowerCase().includes(searchQuery.toLowerCase()) || festival.description.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCountry = selectedCountry === 'All' || festival.country.includes(selectedCountry);
            const matchesState = selectedState === 'All' || festival.state.includes(selectedState);
            const matchesMonth = selectedMonth === 'All' || new Date(festival.date).toLocaleString('default', { month: 'long' }) === selectedMonth;
            return matchesSearch && matchesCountry && matchesState && matchesMonth;
        });
    }, [festivals, searchQuery, selectedCountry, selectedState, selectedMonth]);

    const groupedFestivals = useMemo(() => {
        return filteredFestivals.reduce((acc: GroupedFestivals, festival) => {
            const monthYear = new Date(festival.date).toLocaleString('default', { month: 'long', year: 'numeric' });
            if (!acc[monthYear]) {
                acc[monthYear] = [];
            }
            acc[monthYear].push(festival);
            return acc;
        }, {});
    }, [filteredFestivals]);

    const sortedMonths = useMemo(() => {
        return Object.keys(groupedFestivals).sort((a, b) => new Date(a) as any - (new Date(b) as any));
    }, [groupedFestivals]);

  return (
    <div className="flex flex-col">
      <section className="relative py-20 md:py-32 text-center bg-primary/10">
         <div className="absolute inset-0">
            <Image 
                src="https://images.unsplash.com/photo-1617634667363-554158b4e76a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxJbmRpYW4lMjBmZXN0aXZhbCUyMGRlY29yYXRpb25zfGVufDB8fHx8MTc1NDE5NzQzNnww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Colorful Indian festival decorations"
                fill
                className="object-cover opacity-10"
                priority
                data-ai-hint="festival decorations"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        </div>
        <div className="container mx-auto px-4 relative">
          <h1 className="font-headline text-4xl font-bold md:text-6xl text-shadow-lg">
            Indian Festivals & Important Days
          </h1>
          <p className="mx-auto mt-4 max-w-3xl text-lg text-foreground/80 text-shadow">
            Explore the vibrant celebrations, holidays, and significant dates in the Indian calendar.
          </p>
        </div>
      </section>

      <div className="sticky top-[65px] z-30 border-y bg-background/80 py-4 backdrop-blur-md">
        <div className="container mx-auto px-4">
          <Card>
            <CardContent className="p-4">
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                    <Input placeholder="Search festivals..." className="pl-10" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                  </div>
                  <Select value={selectedMonth === 'All' ? undefined : selectedMonth} onValueChange={setSelectedMonth}>
                    <SelectTrigger><SelectValue placeholder="Filter by Month..."/></SelectTrigger>
                    <SelectContent>{months.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
                  </Select>
                   <Select value={selectedCountry === 'All' ? undefined : selectedCountry} onValueChange={setSelectedCountry}>
                    <SelectTrigger><SelectValue placeholder="Filter by Country..."/></SelectTrigger>
                    <SelectContent>{countries.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                   <Select value={selectedState === 'All' ? undefined : selectedState} onValueChange={setSelectedState}>
                    <SelectTrigger><SelectValue placeholder="Filter by State..."/></SelectTrigger>
                    <SelectContent>{states.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <section className="container mx-auto px-4 py-12">
       {isLoading ? (
          <div className="space-y-8">
            {Array.from({length: 3}).map((_, i) => (
                <div key={i}>
                    <Skeleton className="h-8 w-48 mb-6" />
                    <div className="grid md:grid-cols-2 gap-6">
                        <Skeleton className="h-40 w-full"/>
                        <Skeleton className="h-40 w-full"/>
                    </div>
                </div>
            ))}
          </div>
       ) : sortedMonths.length > 0 ? (
          <div className="space-y-12">
            {sortedMonths.map(month => (
                <div key={month}>
                    <h2 className="font-headline text-3xl font-bold mb-6 border-b pb-3">{month}</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        {groupedFestivals[month].map(festival => {
                           const festivalDate = new Date(festival.date);
                           const day = festivalDate.getDate();
                           const weekday = festivalDate.toLocaleDateString('en-US', { weekday: 'long' });

                           return (
                            <Card key={festival.name} className="overflow-hidden">
                                <CardContent className="p-6 flex gap-6 items-start">
                                    <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-muted">
                                        <span className="text-3xl font-bold text-primary">{day}</span>
                                        <span className="text-sm text-muted-foreground">{weekday.substring(0,3)}</span>
                                    </div>
                                    <div className="flex-grow">
                                        <Badge variant="secondary">{festival.type}</Badge>
                                        <h3 className="font-headline text-xl font-bold mt-1">{festival.name}</h3>
                                        <p className="mt-2 text-sm text-foreground/80">{festival.description}</p>
                                        <div className="mt-4 pt-4 border-t space-y-2">
                                            <div className="flex items-center gap-2 text-sm">
                                                <Globe className="h-4 w-4 text-primary" />
                                                <span className="font-semibold">Countries:</span>
                                                <span className="text-muted-foreground">{festival.country.join(', ')}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <MapPin className="h-4 w-4 text-primary" />
                                                <span className="font-semibold">States:</span>
                                                <span className="text-muted-foreground">{festival.state.join(', ')}</span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                           )
                        })}
                    </div>
                </div>
            ))}
          </div>
       ) : (
        <div className="rounded-lg border-2 border-dashed py-16 text-center">
            <h3 className="font-headline text-xl font-semibold">No Dates Found</h3>
            <p className="text-muted-foreground mt-2">No dates match your criteria. Try adjusting your search.</p>
        </div>
       )}
      </section>
    </div>
  );
}

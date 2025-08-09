
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
                  <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                    <SelectTrigger><SelectValue/></SelectTrigger>
                    <SelectContent>{months.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
                  </Select>
                   <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                    <SelectTrigger><SelectValue/></SelectTrigger>
                    <SelectContent>{countries.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                   <Select value={selectedState} onValueChange={setSelectedState}>
                    <SelectTrigger><SelectValue/></SelectTrigger>
                    <SelectContent>{states.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <section className="container mx-auto px-4 py-12">
       {isLoading ? (
         <div className="text-center"><p>Loading calendar...</p></div>
       ) : filteredFestivals.length > 0 ? (
          <div className="space-y-6">
            {filteredFestivals.map(festival => (
                <Card key={festival.name} className="overflow-hidden">
                    <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="flex-grow">
                                <Badge variant="secondary">{festival.type}</Badge>
                                <h2 className="font-headline text-2xl font-bold mt-2">{festival.name}</h2>
                                <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                                    <Calendar className="h-5 w-5 text-primary" />
                                    <span>{new Date(festival.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                </div>
                                <p className="mt-4 text-foreground/80">{festival.description}</p>
                            </div>
                            <div className="flex-shrink-0 md:w-64">
                                <h3 className="font-semibold mb-2">Primarily Celebrated In:</h3>
                                <div className="space-y-2">
                                     <div className="flex items-center gap-2 text-sm">
                                        <Globe className="h-4 w-4 text-primary" />
                                        <span>{festival.country.join(', ')}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <MapPin className="h-4 w-4 text-primary" />
                                        <span>{festival.state.join(', ')}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
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

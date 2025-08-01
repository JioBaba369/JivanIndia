
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
import { Film, MapPin, Search, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useMemo } from "react";

export const movies: any[] = [];


export default function MoviesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('all');

  const filteredMovies = useMemo(() => {
    return movies.filter(movie => {
      const matchesSearch = movie.title.toLowerCase().includes(searchQuery.toLowerCase());
      // Location filter is not applied as there's no location data in the mock
      return matchesSearch;
    });
  }, [searchQuery, location]);

  return (
    <div className="flex flex-col">
      <section className="relative bg-background py-20 text-white">
        <div className="absolute inset-0">
             <Image 
                src="https://images.unsplash.com/photo-1579581454848-8af8a268926b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxtb3ZpZSUyMHBvc3RlcnMlMjBjb2xsYWdlfGVufDB8fHx8MTc1NDE5NzQzNnww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Movie posters collage"
                fill
                className="object-cover"
                priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
        </div>
        <div className="container relative mx-auto px-4 text-center">
          <h1 className="font-headline text-4xl font-bold text-shadow-lg md:text-6xl">
            Movies In Theaters
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-shadow">
            Catch the latest Bollywood and regional hits near you.
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
                    placeholder="Search for a movie..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={location} onValueChange={setLocation}>
                  <SelectTrigger>
                    <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <SelectValue placeholder="Select Location" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    <SelectItem value="sf">San Francisco, CA</SelectItem>
                    <SelectItem value="ny">New York, NY</SelectItem>
                    <SelectItem value="la">Los Angeles, CA</SelectItem>
                    <SelectItem value="tx">Houston, TX</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredMovies.length > 0 ? filteredMovies.map((movie) => (
            <Card key={movie.id} className="group overflow-hidden border transition-all hover:-translate-y-1 hover:shadow-lg">
               <Link href={`/movies/${movie.id}`} className="block">
                <div className="relative aspect-[2/3] w-full">
                  <Image
                    src={movie.imageUrl}
                    alt={movie.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-headline truncate text-lg font-bold group-hover:text-primary">{movie.title}</h3>
                  <div className="mt-2 flex flex-col space-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Film className="h-4 w-4" />
                        <span>{movie.genre}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{movie.rating} / 5.0</span>
                      </div>
                  </div>
                    <Button variant="secondary" className="mt-4 w-full">
                    Get Showtimes
                  </Button>
                </CardContent>
              </Link>
            </Card>
          )) : (
            <div className="col-span-full rounded-lg border-2 border-dashed py-12 text-center">
                <p className="text-muted-foreground">No movies found. Please check back later!</p>
                <Button variant="link" onClick={() => { setSearchQuery(''); setLocation('all'); }}>Clear Filters</Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

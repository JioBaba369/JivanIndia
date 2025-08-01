
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

const movies = [
  {
    id: "1",
    title: "Jawan",
    genre: "Action/Thriller",
    rating: 4.5,
    imageUrl: "https://images.unsplash.com/photo-1694029283196-861d8f3a39e3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxib2xseXdvb2QlMjBtb3ZpZSUyMHBvc3RlcnxlbnwwfHx8fDE3NTQxOTc0MzZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    aiHint: "action movie poster",
    postedAt: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
  },
  {
    id: "2",
    title: "Pathaan",
    genre: "Action/Spy",
    rating: 4.2,
    imageUrl: "https://images.unsplash.com/photo-1598122678255-737b42048598?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxzcHklMjBtb3ZpZSUyMHBvc3RlcnxlbnwwfHx8fDE3NTQxOTc0MzZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    aiHint: "spy movie poster",
    postedAt: new Date(new Date().setDate(new Date().getDate() - 3)).toISOString(),
  },
  {
    id: "3",
    title: "RRR",
    genre: "Action/Drama",
    rating: 4.8,
    imageUrl: "https://images.unsplash.com/photo-1620188467123-64355428675a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxtb3ZpZSUyMHRoZWF0ZXIlMjBjdXJ0YWlufGVufDB8fHx8MTc1NDE5NzQzNnww&ixlib=rb-4.1.0&q=80&w=1080",
    aiHint: "historical drama poster",
    postedAt: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString(),
  },
  {
    id: "4",
    title: "Brahmāstra: Part One – Shiva",
    genre: "Fantasy/Action",
    rating: 4.0,
    imageUrl: "https://images.unsplash.com/photo-1574755122132-36e3de135934?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxmYW50YXN5JTIwbW92aWUlMjBwb3N0ZXJ8ZW58MHx8fHwxNzU0MTk3NDM2fDA&ixlib=rb-4.1.0&q=80&w=1080",
    aiHint: "fantasy movie poster",
    postedAt: new Date(new Date().setDate(new Date().getDate() - 14)).toISOString(),
  },
  {
    id: "5",
    title: "3 Idiots",
    genre: "Comedy/Drama",
    rating: 4.9,
    imageUrl: "https://images.unsplash.com/photo-1541600384332-3512be500afc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxjb2xsZWdlJTIwY29tZWR5JTIwbW92aWV8ZW58MHx8fHwxNzU0MTk3NDM2fDA&ixlib=rb-4.1.0&q=80&w=1080",
    aiHint: "college comedy poster",
    postedAt: new Date(new Date().setDate(new Date().getDate() - 20)).toISOString(),
  },
  {
    id: "6",
    title: "Dangal",
    genre: "Biographical/Sports",
    imageUrl: "https://images.unsplash.com/photo-1517649763968-09e40b18086e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHx3cmVzdGxpbmclMjBtYXRjaHxlbnwwfHx8fDE3NTQxOTc0MzZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.7,
    aiHint: "wrestling movie poster",
    postedAt: new Date(new Date().setDate(new Date().getDate() - 25)).toISOString(),
  },
   {
    id: "7",
    title: "My Name is Khan",
    genre: "Drama/Romance",
    rating: 4.6,
    imageUrl: "https://images.unsplash.com/photo-1531804055935-76743b53495a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxkcmFtYXRpYyUyMG1vdmllJTIwcG9zdGVyfGVufDB8fHx8MTc1NDE5NzQzNnww&ixlib=rb-4.1.0&q=80&w=1080",
    aiHint: "dramatic movie poster",
    postedAt: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString(),
  },
   {
    id: "8",
    title: "Gully Boy",
    genre: "Musical/Drama",
    rating: 4.4,
    imageUrl: "https://images.unsplash.com/photo-1589993386698-3331f5000574?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxoaXAlMjBob3AlMjBjb25jZXJ0fGVufDB8fHx8fDE3NTQxOTc0MzZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    aiHint: "hip hop movie poster",
    postedAt: new Date(new Date().setDate(new Date().getDate() - 40)).toISOString(),
  },
];


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
      <section className="relative bg-background text-white py-20">
        <div className="absolute inset-0">
             <Image 
                src="https://images.unsplash.com/photo-1579581454848-8af8a268926b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxtb3ZpZSUyMHBvc3RlcnMlMjBjb2xsYWdlfGVufDB8fHx8MTc1NDE5NzQzNnww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Movie posters collage"
                fill
                className="object-cover"
                data-ai-hint="movie posters collage"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
        </div>
        <div className="relative container mx-auto px-4 text-center">
          <h1 className="font-headline text-4xl font-bold md:text-6xl text-shadow-lg">
            Movies In Theaters
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-shadow">
            Catch the latest Bollywood and regional hits near you.
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
            <Card key={movie.id} className="overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1 group border">
               <Link href={`/movies/${movie.id}`} className="block">
                <CardContent className="p-0">
                  <div className="relative aspect-[2/3] w-full">
                    <Image
                      src={movie.imageUrl}
                      alt={movie.title}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                      data-ai-hint={movie.aiHint}
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-headline text-lg font-bold truncate group-hover:text-primary">{movie.title}</h3>
                    <div className="mt-2 flex flex-col space-y-1 text-sm text-muted-foreground">
                       <div className="flex items-center gap-2">
                         <Film className="h-4 w-4" />
                         <span>{movie.genre}</span>
                       </div>
                       <div className="flex items-center gap-2">
                         <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                         <span>{movie.rating} / 5.0</span>
                       </div>
                    </div>
                     <Button variant="secondary" className="mt-4 w-full">
                      Get Showtimes
                    </Button>
                  </div>
                </CardContent>
              </Link>
            </Card>
          )) : (
            <div className="text-center py-12 border-2 border-dashed rounded-lg col-span-full">
                <p className="text-muted-foreground">No movies found matching your criteria.</p>
                <Button variant="link" onClick={() => { setSearchQuery(''); setLocation('all'); }}>Clear filters</Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

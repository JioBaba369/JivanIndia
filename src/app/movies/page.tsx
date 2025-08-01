

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

const movies = [
  {
    id: "1",
    title: "Jawan",
    genre: "Action/Thriller",
    rating: 4.5,
    imageUrl: "https://placehold.co/600x900.png",
    aiHint: "action movie poster"
  },
  {
    id: "2",
    title: "Pathaan",
    genre: "Action/Spy",
    rating: 4.2,
    imageUrl: "https://placehold.co/600x900.png",
    aiHint: "spy movie poster"
  },
  {
    id: "3",
    title: "RRR",
    genre: "Action/Drama",
    rating: 4.8,
    imageUrl: "https://placehold.co/600x900.png",
    aiHint: "historical drama poster"
  },
  {
    id: "4",
    title: "Brahmāstra: Part One – Shiva",
    genre: "Fantasy/Action",
    rating: 4.0,
    imageUrl: "https://placehold.co/600x900.png",
    aiHint: "fantasy movie poster"
  },
  {
    id: "5",
    title: "3 Idiots",
    genre: "Comedy/Drama",
    rating: 4.9,
    imageUrl: "https://placehold.co/600x900.png",
    aiHint: "college comedy poster"
  },
  {
    id: "6",
    title: "Dangal",
    genre: "Biographical/Sports",
    rating: 4.7,
    imageUrl: "https://placehold.co/600x900.png",
    aiHint: "wrestling movie poster"
  },
   {
    id: "7",
    title: "My Name is Khan",
    genre: "Drama/Romance",
    rating: 4.6,
    imageUrl: "https://placehold.co/600x900.png",
    aiHint: "dramatic movie poster"
  },
   {
    id: "8",
    title: "Gully Boy",
    genre: "Musical/Drama",
    rating: 4.4,
    imageUrl: "https://placehold.co/600x900.png",
    aiHint: "hip hop movie poster"
  },
];


export default function MoviesPage() {
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
               <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                <div className="relative md:col-span-2">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="Search for a movie..."
                    className="pl-10"
                  />
                </div>
                <Select>
                  <SelectTrigger>
                    <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <SelectValue placeholder="Select Location" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sf">San Francisco, CA</SelectItem>
                    <SelectItem value="ny">New York, NY</SelectItem>
                    <SelectItem value="la">Los Angeles, CA</SelectItem>
                    <SelectItem value="tx">Houston, TX</SelectItem>
                  </SelectContent>
                </Select>
                <Button className="w-full">Find Movies</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {movies.map((movie) => (
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
          ))}
        </div>
      </section>
    </div>
  );
}

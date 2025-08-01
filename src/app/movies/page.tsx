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
    title: "Jawan",
    genre: "Action/Thriller",
    rating: 4.5,
    imageUrl: "https://placehold.co/600x400.png",
    aiHint: "action movie"
  },
  {
    title: "Pathaan",
    genre: "Action/Spy",
    rating: 4.2,
    imageUrl: "https://placehold.co/600x400.png",
    aiHint: "spy movie"
  },
  {
    title: "RRR",
    genre: "Action/Drama",
    rating: 4.8,
    imageUrl: "https://placehold.co/600x400.png",
    aiHint: "historical drama"
  },
  {
    title: "Brahmāstra: Part One – Shiva",
    genre: "Fantasy/Action",
    rating: 4.0,
    imageUrl: "https://placehold.co/600x400.png",
    aiHint: "fantasy movie"
  },
  {
    title: "3 Idiots",
    genre: "Comedy/Drama",
    rating: 4.9,
    imageUrl: "https://placehold.co/600x400.png",
    aiHint: "college friends"
  },
  {
    title: "Dangal",
    genre: "Biographical/Sports",
    rating: 4.7,
    imageUrl: "https://placehold.co/600x400.png",
    aiHint: "wrestling match"
  },
];


export default function MoviesPage() {
  return (
    <div className="flex flex-col">
      <section className="bg-gradient-to-b from-primary/10 via-background to-background py-20 text-center">
        <div className="container mx-auto px-4">
          <h1 className="font-headline text-4xl font-bold md:text-6xl">
            Movies In Theaters
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Catch the latest Bollywood and regional hits near you.
          </p>
        </div>
      </section>

      <div className="sticky top-[65px] z-30 bg-background/80 py-4 backdrop-blur-md">
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
                        <MapPin className="h-4 w-4" />
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
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {movies.map((movie, index) => (
            <Card key={index} className="overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
               <Link href="#" className="block">
                <CardContent className="p-0">
                  <div className="relative h-64 w-full">
                    <Image
                      src={movie.imageUrl}
                      alt={movie.title}
                      layout="fill"
                      objectFit="cover"
                      data-ai-hint={movie.aiHint}
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-headline text-lg font-bold truncate">{movie.title}</h3>
                    <div className="mt-2 flex flex-col space-y-1 text-sm text-muted-foreground">
                       <div className="flex items-center gap-2">
                         <Film className="h-4 w-4" />
                         <span>{movie.genre}</span>
                       </div>
                       <div className="flex items-center gap-2">
                         <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
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

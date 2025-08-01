
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

export const movies = [
  {
    id: "1",
    title: "Jawan",
    genre: "Action/Thriller",
    rating: 4.5,
    imageUrl: "https://images.unsplash.com/photo-1694029283196-861d8f3a39e3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxib2xseXdvb2QlMjBtb3ZpZSUyMHBvc3RlcnxlbnwwfHx8fDE3NTQxOTc0MzZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    aiHint: "action movie poster",
    postedAt: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
    details: {
      duration: "2h 49m",
      releaseDate: "September 7, 2023",
      backdropUrl: "https://images.unsplash.com/photo-1620188467123-64355428675a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxtb3ZpZSUyMHRoZWF0ZXIlMjBjdXJ0YWlufGVufDB8fHx8MTc1NDE5NzQzNnww&ixlib=rb-4.1.0&q=80&w=1080",
      aiHintBackdrop: "movie theater curtain",
      synopsis: "A high-octane action thriller which outlines the emotional journey of a man who is set to rectify the wrongs in the society. He is accompanied by a core team of six women, and they are up against a deadly outlaw who has caused suffering to many.",
      cast: ["Shah Rukh Khan", "Nayanthara", "Vijay Sethupathi", "Deepika Padukone"],
      distributor: "Yash Raj Films",
      distributorId: "7",
      trailerUrl: "https://www.youtube.com/embed/COv52Qyctws",
      theaters: [
          { name: "AMC Bay Street 16", location: "Emeryville, CA", showtimes: ["1:30 PM", "4:45 PM", "8:00 PM", "10:15 PM"] },
          { name: "Regal Jack London", location: "Oakland, CA", showtimes: ["2:00 PM", "5:15 PM", "8:30 PM"] },
          { name: "Century San Francisco Centre 9", location: "San Francisco, CA", showtimes: ["1:00 PM", "4:10 PM", "7:20 PM", "10:30 PM"] }
      ]
    }
  },
  {
    id: "2",
    title: "Pathaan",
    genre: "Action/Spy",
    rating: 4.2,
    imageUrl: "https://images.unsplash.com/photo-1598122678255-737b42048598?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxzcHklMjBtb3ZpZSUyMHBvc3RlcnxlbnwwfHx8fDE3NTQxOTc0MzZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    aiHint: "spy movie poster",
    postedAt: new Date(new Date().setDate(new Date().getDate() - 3)).toISOString(),
    details: {
      duration: "2h 26m",
      releaseDate: "January 25, 2023",
      backdropUrl: "https://images.unsplash.com/photo-1598122678255-737b42048598?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxzcHklMjBtb3ZpZSUyMHBvc3RlcnxlbnwwfHx8fDE3NTQxOTc0MzZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      aiHintBackdrop: "spy movie backdrop",
      synopsis: "An Indian spy takes on the leader of a private terrorist organization who has a vendetta against his country.",
      cast: ["Shah Rukh Khan", "Deepika Padukone", "John Abraham"],
      distributor: "Yash Raj Films",
      distributorId: "7",
      trailerUrl: "https://www.youtube.com/embed/vqu4z34wENw",
      theaters: [
          { name: "AMC Metreon 16", location: "San Francisco, CA", showtimes: ["3:00 PM", "6:15 PM", "9:30 PM"] }
      ]
    }
  },
  {
    id: "3",
    title: "RRR",
    genre: "Action/Drama",
    rating: 4.8,
    imageUrl: "https://images.unsplash.com/photo-1620188467123-64355428675a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxtb3ZpZSUyMHRoZWF0ZXIlMjBjdXJ0YWlufGVufDB8fHx8MTc1NDE5NzQzNnww&ixlib=rb-4.1.0&q=80&w=1080",
    aiHint: "historical drama poster",
    postedAt: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString(),
     details: {
      duration: "3h 7m",
      releaseDate: "March 24, 2022",
      backdropUrl: "https://images.unsplash.com/photo-1620188467123-64355428675a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxtb3ZpZSUyMHRoZWF0ZXIlMjBjdXJ0YWlufGVufDB8fHx8MTc1NDE5NzQzNnww&ixlib=rb-4.1.0&q=80&w=1080",
      aiHintBackdrop: "historical movie backdrop",
      synopsis: "A fictitious story about two legendary revolutionaries and their journey away from home before they started fighting for their country in the 1920s.",
      cast: ["N. T. Rama Rao Jr.", "Ram Charan", "Alia Bhatt"],
      distributor: "Pen Studios",
      distributorId: "7",
      trailerUrl: "https://www.youtube.com/embed/gyLqes0zm_s",
      theaters: [
          { name: "Cinemark Egyptian 24", location: "Los Angeles, CA", showtimes: ["1:00 PM", "5:00 PM", "9:00 PM"] }
      ]
    }
  },
  {
    id: "4",
    title: "Brahmāstra: Part One – Shiva",
    genre: "Fantasy/Action",
    rating: 4.0,
    imageUrl: "https://images.unsplash.com/photo-1574755122132-36e3de135934?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxmYW50YXN5JTIwbW92aWUlMjBwb3N0ZXJ8ZW58MHx8fHwxNzU0MTk3NDM2fDA&ixlib=rb-4.1.0&q=80&w=1080",
    aiHint: "fantasy movie poster",
    postedAt: new Date(new Date().setDate(new Date().getDate() - 14)).toISOString(),
     details: {
      duration: "2h 47m",
      releaseDate: "September 9, 2022",
      backdropUrl: "https://images.unsplash.com/photo-1574755122132-36e3de135934?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxmYW50YXN5JTIwbW92aWUlMjBwb3N0ZXJ8ZW58MHx8fHwxNzU0MTk3NDM2fDA&ixlib=rb-4.1.0&q=80&w=1080",
      aiHintBackdrop: "fantasy movie backdrop",
      synopsis: "A DJ with a unique connection to fire, embarks on a journey to discover the origins of his special powers with the help of a secret society.",
      cast: ["Ranbir Kapoor", "Alia Bhatt", "Amitabh Bachchan", "Mouni Roy"],
      distributor: "Star Studios",
      distributorId: "7",
      trailerUrl: "https://www.youtube.com/embed/s5o4-f_L2c4",
      theaters: [
          { name: "Regal Union Square", location: "New York, NY", showtimes: ["2:30 PM", "6:00 PM", "9:30 PM"] }
      ]
    }
  },
  {
    id: "5",
    title: "3 Idiots",
    genre: "Comedy/Drama",
    rating: 4.9,
    imageUrl: "https://images.unsplash.com/photo-1541600384332-3512be500afc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxjb2xsZWdlJTIwY29tZWR5JTIwbW92aWV8ZW58MHx8fHwxNzU0MTk3NDM2fDA&ixlib=rb-4.1.0&q=80&w=1080",
    aiHint: "college comedy poster",
    postedAt: new Date(new Date().setDate(new Date().getDate() - 20)).toISOString(),
     details: {
      duration: "2h 50m",
      releaseDate: "December 25, 2009",
      backdropUrl: "https://images.unsplash.com/photo-1541600384332-3512be500afc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxjb2xsZWdlJTIwY29tZWR5JTIwbW92aWV8ZW58MHx8fHwxNzU0MTk3NDM2fDA&ixlib=rb-4.1.0&q=80&w=1080",
      aiHintBackdrop: "college campus",
      synopsis: "Two friends are searching for their long lost companion. They revisit their college days and recall the memories of their friend who inspired them to think differently, even as the rest of the world called them 'idiots'.",
      cast: ["Aamir Khan", "R. Madhavan", "Sharman Joshi", "Kareena Kapoor"],
      distributor: "Vinod Chopra Films",
      distributorId: "7",
      trailerUrl: "https://www.youtube.com/embed/K0e-N_R-paa",
      theaters: [
          { name: "AMC DINE-IN Sunnyvale 12", location: "Sunnyvale, CA", showtimes: ["7:00 PM"] }
      ]
    }
  },
  {
    id: "6",
    title: "Dangal",
    genre: "Biographical/Sports",
    imageUrl: "https://images.unsplash.com/photo-1517649763968-09e40b18086e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHx3cmVzdGxpbmclMjBtYXRjaHxlbnwwfHx8fDE3NTQxOTc0MzZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.7,
    aiHint: "wrestling movie poster",
    postedAt: new Date(new Date().setDate(new Date().getDate() - 25)).toISOString(),
     details: {
      duration: "2h 41m",
      releaseDate: "December 21, 2016",
      backdropUrl: "https://images.unsplash.com/photo-1517649763968-09e40b18086e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHx3cmVzdGxpbmclMjBtYXRjaHxlbnwwfHx8fDE3NTQxOTc0MzZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      aiHintBackdrop: "wrestling ring",
      synopsis: "Former wrestler Mahavir Singh Phogat and his two wrestler daughters struggle towards glory at the Commonwealth Games in the face of societal oppression.",
      cast: ["Aamir Khan", "Fatima Sana Shaikh", "Sanya Malhotra"],
      distributor: "UTV Motion Pictures",
      distributorId: "7",
      trailerUrl: "https://www.youtube.com/embed/x_7YlGv9u1g",
      theaters: [
          { name: "Regal Edwards Houston Marq'E", location: "Houston, TX", showtimes: ["8:00 PM"] }
      ]
    }
  },
   {
    id: "7",
    title: "My Name is Khan",
    genre: "Drama/Romance",
    rating: 4.6,
    imageUrl: "https://images.unsplash.com/photo-1531804055935-76743b53495a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxkcmFtYXRpYyUyMG1vdmllJTIwcG9zdGVyfGVufDB8fHx8MTc1NDE5NzQzNnww&ixlib=rb-4.1.0&q=80&w=1080",
    aiHint: "dramatic movie poster",
    postedAt: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString(),
     details: {
      duration: "2h 45m",
      releaseDate: "February 12, 2010",
      backdropUrl: "https://images.unsplash.com/photo-1531804055935-76743b53495a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxkcmFtYXRpYyUyMG1vdmllJTIwcG9zdGVyfGVufDB8fHx8MTc1NDE5NzQzNnww&ixlib=rb-4.1.0&q=80&w=1080",
      aiHintBackdrop: "romantic movie backdrop",
      synopsis: "An Indian Muslim man with Asperger's syndrome takes a challenge to speak to the President of the United States, and embarks on a cross-country journey.",
      cast: ["Shah Rukh Khan", "Kajol"],
      distributor: "Dharma Productions",
      distributorId: "7",
      trailerUrl: "https://www.youtube.com/embed/J_3giDw-A-I",
      theaters: [
          { name: "AMC Empire 25", location: "New York, NY", showtimes: ["4:00 PM"] }
      ]
    }
  },
   {
    id: "8",
    title: "Gully Boy",
    genre: "Musical/Drama",
    rating: 4.4,
    imageUrl: "https://images.unsplash.com/photo-1589993386698-3331f5000574?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxoaXAlMjBob3AlMjBjb25jZXJ0fGVufDB8fHx8fDE3NTQxOTc0MzZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    aiHint: "hip hop movie poster",
    postedAt: new Date(new Date().setDate(new Date().getDate() - 40)).toISOString(),
     details: {
      duration: "2h 34m",
      releaseDate: "February 14, 2019",
      backdropUrl: "https://images.unsplash.com/photo-1589993386698-3331f5000574?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxoaXAlMjBob3AlMjBjb25jZXJ0fGVufDB8fHx8fDE3NTQxOTc0MzZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      aiHintBackdrop: "music concert",
      synopsis: "A coming-of-age story based on the lives of street rappers in Mumbai.",
      cast: ["Ranveer Singh", "Alia Bhatt", "Siddhant Chaturvedi"],
      distributor: "Excel Entertainment",
      distributorId: "7",
      trailerUrl: "https://www.youtube.com/embed/JfbxcD6biOk",
      theaters: [
          { name: "Cinépolis Chelsea", location: "New York, NY", showtimes: ["1:45 PM", "5:00 PM"] }
      ]
    }
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

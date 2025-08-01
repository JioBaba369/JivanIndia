
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Film, Star, Ticket, Clock, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

// Mock data - in a real app, you'd fetch this based on the `params.id`
const movieDetails = {
    id: "1",
    title: "Jawan",
    genre: "Action/Thriller",
    rating: 4.5,
    duration: "2h 49m",
    releaseDate: "September 7, 2023",
    backdropUrl: "https://images.unsplash.com/photo-1620188467123-64355428675a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxtb3ZpZSUyMHRoZWF0ZXIlMjBjdXJ0YWlufGVufDB8fHx8MTc1NDE5NzQzNnww&ixlib=rb-4.1.0&q=80&w=1080",
    aiHintBackdrop: "movie theater curtain",
    posterUrl: "https://placehold.co/600x900.png",
    aiHintPoster: "action movie poster",
    synopsis: "A high-octane action thriller which outlines the emotional journey of a man who is set to rectify the wrongs in the society. He is accompanied by a core team of six women, and they are up against a deadly outlaw who has caused suffering to many.",
    cast: ["Shah Rukh Khan", "Nayanthara", "Vijay Sethupathi", "Deepika Padukone"],
    distributor: "Yash Raj Films",
    distributorId: "7",
    trailerUrl: "https://www.youtube.com/embed/COv52Qyctws",
    theaters: [
        {
            name: "AMC Bay Street 16",
            location: "Emeryville, CA",
            showtimes: ["1:30 PM", "4:45 PM", "8:00 PM", "10:15 PM"]
        },
        {
            name: "Regal Jack London",
            location: "Oakland, CA",
            showtimes: ["2:00 PM", "5:15 PM", "8:30 PM"]
        },
        {
            name: "Century San Francisco Centre 9",
            location: "San Francisco, CA",
            showtimes: ["1:00 PM", "4:10 PM", "7:20 PM", "10:30 PM"]
        }
    ]
};

export default function MovieDetailPage({ params }: { params: { id: string } }) {
  // You can use params.id to fetch the correct movie data from your backend
  const movie = movieDetails;

  return (
    <div className="bg-background">
      <div className="relative h-[40vh] md:h-[50vh] w-full">
        <Image
          src={movie.backdropUrl}
          alt={`Backdrop for ${movie.title}`}
          fill
          className="object-cover"
          data-ai-hint={movie.aiHintBackdrop}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
      </div>

      <div className="container mx-auto px-4 pb-12 -mt-24 md:-mt-48 relative">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
            <div className="md:col-span-1 lg:col-span-1">
                <Card className="overflow-hidden sticky top-24">
                    <div className="aspect-[2/3] w-full relative">
                        <Image
                        src={movie.posterUrl}
                        alt={`Poster for ${movie.title}`}
                        fill
                        className="object-cover"
                        data-ai-hint={movie.aiHintPoster}
                        />
                    </div>
                </Card>
            </div>
            <div className="md:col-span-2 lg:col-span-3">
                 <div className="bg-background/80 backdrop-blur-sm p-6 rounded-lg">
                    <h1 className="font-headline text-4xl md:text-5xl font-bold">{movie.title}</h1>
                    <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                            <span className="font-bold text-lg text-foreground">{movie.rating} / 5.0</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Film className="h-5 w-5" />
                            <span>{movie.genre}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="h-5 w-5" />
                            <span>{movie.duration}</span>
                        </div>
                    </div>
                </div>

                <div className="mt-8">
                    <Card>
                        <CardContent className="p-6">
                            <h2 className="font-headline text-2xl font-semibold">Synopsis</h2>
                            <p className="mt-4 text-muted-foreground leading-relaxed">{movie.synopsis}</p>
                             <h3 className="font-headline text-lg font-semibold mt-6 mb-3">Starring</h3>
                             <div className="flex flex-wrap gap-2">
                                {movie.cast.map(actor => <Badge key={actor} variant="secondary">{actor}</Badge>)}
                            </div>
                             <div className="mt-6">
                               <h3 className="font-headline text-lg font-semibold mb-3">
                                 Distributed By
                               </h3>
                               <div className="flex items-center gap-4">
                                 <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
                                   <Users className="h-6 w-6 text-secondary-foreground" />
                                 </div>
                                 <div>
                                   <p className="font-semibold">{movie.distributor}</p>
                                   <Link href={`/organizations/${movie.distributorId}`} className="text-sm text-primary hover:underline">
                                     View Distributor
                                   </Link>
                                 </div>
                               </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                 <div className="mt-8">
                    <Card>
                        <CardContent className="p-6">
                           <h2 className="font-headline text-2xl font-semibold mb-4">Watch Trailer</h2>
                            <div className="aspect-video w-full">
                                <iframe
                                    className="w-full h-full rounded-lg"
                                    src={movie.trailerUrl}
                                    title={`Trailer for ${movie.title}`}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div className="mt-8">
                     <h2 className="font-headline text-2xl font-semibold mb-4">Showtimes & Theaters</h2>
                     <div className="space-y-4">
                        {movie.theaters.map(theater => (
                            <Card key={theater.name}>
                                <CardContent className="p-4 sm:p-6">
                                    <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                                        <div>
                                            <h3 className="font-bold text-lg">{theater.name}</h3>
                                            <p className="text-sm text-muted-foreground">{theater.location}</p>
                                        </div>
                                        <div className="mt-4 sm:mt-0 flex flex-wrap gap-2">
                                            {theater.showtimes.map(time => (
                                                <Button key={time} variant="outline" asChild>
                                                    <Link href="#">
                                                        <Ticket className="mr-2 h-4 w-4" />
                                                        {time}
                                                    </Link>
                                                </Button>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                     </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}

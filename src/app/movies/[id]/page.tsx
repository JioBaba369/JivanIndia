
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Film, Star, Ticket, Clock, Users, History, Building, Flag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow, isValid } from "date-fns";
import { useState, useEffect } from 'react';
import { useParams } from "next/navigation";
import { useMovies } from "@/hooks/use-movies";
import { useCommunities } from "@/hooks/use-communities";
import ReportDialog from "@/components/feature/report-dialog";

export default function MovieDetailPage() {
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : '';
  const { getMovieById } = useMovies();
  const movie = getMovieById(id);
  const [postedAt, setPostedAt] = useState('');
  const { getCommunityBySlug } = useCommunities();
  const distributor = getCommunityBySlug(movie?.details.distributorId || '');


  useEffect(() => {
    if (movie?.postedAt) {
        try {
            const date = new Date(movie.postedAt);
            if (isValid(date)) {
                setPostedAt(formatDistanceToNow(date, { addSuffix: true }));
            } else {
                setPostedAt('a while ago');
            }
        } catch (error) {
            console.error("Failed to parse date:", movie.postedAt);
            setPostedAt('a while ago');
        }
    }
  }, [movie?.postedAt]);

  if (!movie) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="font-headline text-3xl font-bold">Movie Not Found</h1>
        <p className="mt-4 text-muted-foreground">The movie you are looking for does not exist or may have been removed.</p>
        <Button asChild className="mt-6">
          <Link href="/movies">Back to Movies</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-background">
      <div className="relative h-[40vh] md:h-[50vh] w-full">
        <Image
          src={movie.details.backdropUrl}
          alt={`Backdrop for ${movie.title}`}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
      </div>

      <div className="container mx-auto px-4 pb-12 -mt-24 md:-mt-48 relative">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
            <div className="md:col-span-1 lg:col-span-1">
                <Card className="overflow-hidden sticky top-24">
                    <div className="aspect-[2/3] w-full relative">
                        <Image
                        src={movie.imageUrl}
                        alt={`Poster for ${movie.title}`}
                        fill
                        className="object-cover"
                        priority
                        />
                    </div>
                </Card>
            </div>
            <div className="md:col-span-2 lg:col-span-3">
                 <div className="bg-background/80 backdrop-blur-sm p-6 rounded-lg">
                    <div className="flex justify-between items-start">
                        <div>
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
                                    <span>{movie.details.duration}</span>
                                </div>
                            </div>
                        </div>
                        <ReportDialog contentId={movie.id} contentType="Movie" contentTitle={movie.title} />
                    </div>
                </div>

                <div className="mt-8">
                    <Card>
                        <CardContent className="p-6">
                            <h2 className="font-headline text-2xl font-semibold border-b pb-2">Synopsis</h2>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground my-4">
                                <History className="h-4 w-4" />
                                <span>Posted {postedAt}</span>
                            </div>
                            <p className="text-muted-foreground leading-relaxed">{movie.details.synopsis}</p>
                             <h3 className="font-headline text-lg font-semibold mt-6 mb-3">Starring</h3>
                             <div className="flex flex-wrap gap-2">
                                {movie.details.cast.map(actor => <Badge key={actor} variant="secondary">{actor}</Badge>)}
                            </div>
                             <div className="mt-6">
                               <h3 className="font-headline text-lg font-semibold mb-3 border-b pb-2">
                                 Distributed By
                               </h3>
                               <Card>
                                 <CardContent className="p-4 pt-0">
                                   <Link href={distributor ? `/c/${distributor.slug}` : '#'} className="group flex items-center gap-4">
                                     <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                                       <Building className="h-6 w-6 text-muted-foreground" />
                                     </div>
                                     <div>
                                       <p className="font-semibold group-hover:text-primary">{movie.details.distributor}</p>
                                       <p className="text-sm text-muted-foreground">
                                         View Distributor Profile
                                       </p>
                                     </div>
                                   </Link>
                                 </CardContent>
                               </Card>
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
                                    src={movie.details.trailerUrl}
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
                        {movie.details.theaters.map(theater => (
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
                                                    <a href="#"><Ticket className="mr-2 h-4 w-4" />{time}</a>
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

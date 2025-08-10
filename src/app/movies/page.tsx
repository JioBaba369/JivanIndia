
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Film, Search, Star, MoreVertical, Bookmark, PlusCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useMemo, type MouseEvent } from "react";
import { useMovies } from "@/hooks/use-movies";
import { useSearchParams, useRouter } from "next/navigation";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import ReportDialog from "@/components/feature/report-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

export default function MoviesPage() {
  const { movies, isLoading } = useMovies();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, isItemSaved, saveItem, unsaveItem } = useAuth();
  const { toast } = useToast();
  
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setSearchQuery(searchParams.get('q') || '');
  }, [searchParams]);

  const filteredMovies = useMemo(() => movies.filter(movie => {
    const matchesSearch = movie.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  }), [movies, searchQuery]);

  const handleSaveToggle = (e: MouseEvent, movie: typeof movies[0]) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to save movies.",
        variant: "destructive",
      });
      router.push('/login');
      return;
    }
    
    const currentlySaved = isItemSaved('savedMovies', movie.id);
    if (currentlySaved) {
        unsaveItem('savedMovies', movie.id);
        toast({ title: "Removed from Watchlist", description: `${movie.title} has been removed from your saved movies.` });
    } else {
        saveItem('savedMovies', movie.id);
        toast({ title: "Added to Watchlist!", description: `${movie.title} has been saved to your profile.` });
    }
  };
  
  const MovieSkeletons = () => (
    Array.from({ length: 8 }).map((_, i) => (
      <Card key={i} className="overflow-hidden border">
        <Skeleton className="aspect-[2/3] w-full" />
        <CardContent className="p-4">
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2 mb-2" />
          <Skeleton className="h-4 w-1/3" />
        </CardContent>
      </Card>
    ))
  );

  return (
    <div className="flex flex-col">
      <section className="bg-gradient-to-b from-primary/10 via-background to-background py-20 text-center">
        <div className="container mx-auto px-4">
          <h1 className="font-headline text-4xl font-bold text-shadow-lg md:text-6xl">
            Movies In Theaters
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Catch the latest Bollywood and regional hits near you.
          </p>
        </div>
      </section>

      <div className="sticky top-[65px] z-30 border-y bg-background/95 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
           <div className="flex flex-col gap-4 md:flex-row">
             <div className="relative flex-grow">
               <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
               <Input
                 placeholder="Search for a movie..."
                 className="pl-10 text-base h-12"
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
               />
             </div>
              {user?.roles.includes('admin') && (
                <Button asChild className="h-12">
                  <Link href="/movies/new">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Movie
                  </Link>
                </Button>
              )}
          </div>
        </div>
      </div>
      
      <section className="container mx-auto px-4 py-12">
       <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
       {isLoading ? <MovieSkeletons /> : (
        movies.length === 0 ? (
          <div className="rounded-lg border-2 border-dashed py-16 text-center col-span-full">
            <Film className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="font-headline text-xl font-semibold mt-4">No Movies Listed</h3>
            <p className="text-muted-foreground mt-2">There are currently no movies listed. Please check back later.</p>
            {user?.roles.includes('admin') && (
              <Button asChild className="mt-4"><Link href="/movies/new">Add a Movie</Link></Button>
            )}
          </div>
       ) : filteredMovies.length > 0 ? (
            filteredMovies.map((movie) => {
                const isSaved = user ? isItemSaved('savedMovies', movie.id) : false;
                return (
                <Card key={movie.id} className="group overflow-hidden border-none shadow-none bg-transparent transition-all hover:-translate-y-1">
                    <div className="relative aspect-[2/3] w-full rounded-lg overflow-hidden shadow-xl">
                       <Link href={`/movies/${movie.id}`}>
                        <Image
                            src={movie.imageUrl}
                            alt={movie.title}
                            fill
                            className="object-cover transition-transform group-hover:scale-105"
                            data-ai-hint="movie poster"
                        />
                       </Link>
                       <div className="absolute top-2 right-2 flex gap-1">
                             <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 bg-black/20 hover:bg-black/40 text-white hover:text-white">
                                        <MoreVertical size={20} />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={(e) => handleSaveToggle(e, movie)}>
                                      <Bookmark className="mr-2 h-4 w-4" />
                                      {isSaved ? 'Saved' : 'Save'}
                                    </DropdownMenuItem>
                                    <ReportDialog 
                                        contentId={movie.id} 
                                        contentType="Movie" 
                                        contentTitle={movie.title} 
                                        triggerComponent={<DropdownMenuItem onSelect={(e) => e.preventDefault()}>Report</DropdownMenuItem>}
                                    />
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                    <CardContent className="p-2 pt-3">
                      <Link href={`/movies/${movie.id}`} className="group/link">
                        <h3 className="font-headline truncate text-lg font-bold group-hover/link:text-primary">{movie.title}</h3>
                        <div className="mt-1 flex flex-col space-y-1 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <Film className="h-4 w-4" />
                                <span>{movie.genre}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span>{movie.rating} / 5.0</span>
                            </div>
                        </div>
                      </Link>
                    </CardContent>
                </Card>
                )
            })
       ) : (
            <div className="rounded-lg border-2 border-dashed py-16 text-center col-span-full">
                <h3 className="font-headline text-xl font-semibold">No Movies Found</h3>
                <p className="text-muted-foreground mt-2">No movies match your criteria. Please check back later or adjust your filters.</p>
                <Button variant="link" onClick={() => { setSearchQuery(''); }}>Clear Filters</Button>
            </div>
          )
        )}
        </div>
      </section>
    </div>
  );
}

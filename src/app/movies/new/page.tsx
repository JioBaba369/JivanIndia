
'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTransition, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, PlusCircle, Trash2 } from 'lucide-react';
import { useMovies, type NewMovieInput } from '@/hooks/use-movies';
import { useCommunities } from '@/hooks/use-communities';
import ImageUpload from '@/components/feature/image-upload';

const theaterSchema = z.object({
  name: z.string().min(3, "Theater name is required."),
  location: z.string().min(3, "Theater location is required."),
  showtimes: z.string().min(1, "Please provide at least one showtime."),
});

const formSchema = z.object({
  title: z.string().min(2, "Title is required."),
  genre: z.string().min(3, "Genre is required."),
  rating: z.coerce.number().min(0).max(5, "Rating must be between 0 and 5."),
  imageUrl: z.string().url("A valid poster image URL is required."),
  synopsis: z.string().min(50, "Synopsis must be at least 50 characters."),
  duration: z.string().min(3, "Duration is required (e.g., 2h 30m)."),
  releaseDate: z.string().refine((val) => !isNaN(Date.parse(val)), "A valid release date is required."),
  distributorId: z.string().min(1, "Distributor is required."),
  director: z.string().min(2, "Director's name is required."),
  cast: z.string().min(3, "Please list at least one cast member."),
  trailerUrl: z.string().url("A valid YouTube embed URL for the trailer is required."),
  backdropUrl: z.string().url("A valid backdrop image URL is required."),
  theaters: z.array(theaterSchema).min(1, "Please add at least one theater."),
});

type MovieFormValues = z.infer<typeof formSchema>;

export default function NewMoviePage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();
  const { addMovie } = useMovies();
  const { communities } = useCommunities();
  const [isPending, startTransition] = useTransition();

  const form = useForm<MovieFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      genre: '',
      rating: 0,
      imageUrl: '',
      synopsis: '',
      duration: '',
      releaseDate: '',
      distributorId: '',
      director: '',
      cast: '',
      trailerUrl: '',
      backdropUrl: '',
      theaters: [{ name: '', location: '', showtimes: '' }],
    },
    mode: 'onChange',
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "theaters",
  });

  const onSubmit = (values: MovieFormValues) => {
    if (!user?.isAdmin) {
      toast({ title: 'Admin Access Required', variant: 'destructive' });
      return;
    }

    startTransition(async () => {
      const distributor = communities.find(c => c.id === values.distributorId);
      if (!distributor) {
        toast({ title: 'Invalid Distributor', description: 'Please select a valid community as the distributor.', variant: 'destructive' });
        return;
      }

      const newMovieData: NewMovieInput = {
        title: values.title,
        genre: values.genre,
        rating: values.rating,
        imageUrl: values.imageUrl,
        details: {
          synopsis: values.synopsis,
          duration: values.duration,
          releaseDate: new Date(values.releaseDate).toISOString(),
          distributor: distributor.name,
          distributorId: values.distributorId,
          director: values.director,
          cast: values.cast.split(',').map(s => s.trim()).filter(Boolean),
          trailerUrl: values.trailerUrl,
          backdropUrl: values.backdropUrl,
          theaters: values.theaters.map(t => ({
            ...t,
            showtimes: t.showtimes.split(',').map(s => s.trim()).filter(Boolean),
          })),
        }
      };

      try {
        await addMovie(newMovieData);
        toast({ title: 'Movie Added!', description: `${values.title} has been added to the listings.` });
        router.push('/movies');
      } catch (error) {
        console.error("Movie submission error:", error);
        toast({ title: 'Submission Failed', description: 'An unexpected error occurred.', variant: 'destructive' });
      }
    });
  };

  if (!user || !user.isAdmin) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <Card className="mx-auto max-w-md">
          <CardHeader>
            <CardTitle className="font-headline text-3xl">Access Denied</CardTitle>
            <CardDescription>This page is restricted to platform administrators.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="mt-2"><Link href="/">Return Home</Link></Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="mx-auto max-w-3xl">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Add a New Movie</CardTitle>
          <CardDescription>Fill out the form to add a new movie to the listings.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField control={form.control} name="title" render={({ field }) => (<FormItem><FormLabel>Movie Title *</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="genre" render={({ field }) => (<FormItem><FormLabel>Genre *</FormLabel><FormControl><Input {...field} placeholder="e.g., Action, Comedy" /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="rating" render={({ field }) => (<FormItem><FormLabel>Rating (out of 5) *</FormLabel><FormControl><Input type="number" step="0.1" min="0" max="5" {...field} /></FormControl><FormMessage /></FormItem>)} />
              </div>
              <FormField control={form.control} name="imageUrl" render={({ field }) => (<FormItem><FormLabel>Poster Image URL *</FormLabel><FormControl><ImageUpload value={field.value} onChange={field.onChange} aspectRatio={2/3} toast={toast} folderName="movie-posters" /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="backdropUrl" render={({ field }) => (<FormItem><FormLabel>Backdrop Image URL *</FormLabel><FormControl><ImageUpload value={field.value} onChange={field.onChange} aspectRatio={16/9} toast={toast} folderName="movie-backdrops" /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="synopsis" render={({ field }) => (<FormItem><FormLabel>Synopsis *</FormLabel><FormControl><Textarea {...field} rows={4} /></FormControl><FormMessage /></FormItem>)} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <FormField control={form.control} name="duration" render={({ field }) => (<FormItem><FormLabel>Duration *</FormLabel><FormControl><Input {...field} placeholder="e.g., 2h 30m" /></FormControl><FormMessage /></FormItem>)} />
                 <FormField control={form.control} name="releaseDate" render={({ field }) => (<FormItem><FormLabel>Release Date *</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>)} />
              </div>
               <FormField control={form.control} name="distributorId" render={({ field }) => (<FormItem><FormLabel>Distributor *</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a distributor" /></SelectTrigger></FormControl><SelectContent>{communities.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="director" render={({ field }) => (<FormItem><FormLabel>Director *</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="cast" render={({ field }) => (<FormItem><FormLabel>Main Cast *</FormLabel><FormControl><Input {...field} placeholder="Actor One, Actor Two" /></FormControl><FormDescription>Separate names with a comma.</FormDescription><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="trailerUrl" render={({ field }) => (<FormItem><FormLabel>Trailer URL *</FormLabel><FormControl><Input {...field} placeholder="https://www.youtube.com/embed/..." /></FormControl><FormDescription>Must be a YouTube embeddable link.</FormDescription><FormMessage /></FormItem>)} />

              <div>
                <h3 className="font-headline text-lg font-semibold border-b pb-2 mb-4">Theaters & Showtimes</h3>
                {fields.map((field, index) => (
                  <Card key={field.id} className="p-4 mb-4 bg-muted/50">
                    <div className="space-y-4">
                      <FormField control={form.control} name={`theaters.${index}.name`} render={({ field }) => (<FormItem><FormLabel>Theater Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                      <FormField control={form.control} name={`theaters.${index}.location`} render={({ field }) => (<FormItem><FormLabel>Theater Location</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                      <FormField control={form.control} name={`theaters.${index}.showtimes`} render={({ field }) => (<FormItem><FormLabel>Showtimes</FormLabel><FormControl><Input {...field} placeholder="e.g., 1:00 PM, 4:00 PM, 7:00 PM" /></FormControl><FormDescription>Separate times with a comma.</FormDescription><FormMessage /></FormItem>)} />
                    </div>
                    <div className="flex justify-end mt-2">
                      <Button type="button" variant="ghost" size="sm" onClick={() => remove(index)}><Trash2 className="mr-2 h-4 w-4" /> Remove Theater</Button>
                    </div>
                  </Card>
                ))}
                <Button type="button" variant="outline" onClick={() => append({ name: '', location: '', showtimes: '' })}><PlusCircle className="mr-2 h-4 w-4" /> Add Theater</Button>
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <Button type="button" variant="outline" onClick={() => router.back()} disabled={isPending}>Cancel</Button>
                <Button type="submit" disabled={isPending || !form.formState.isValid}>{isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Adding...</> : "Add Movie"}</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}


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
import { useEvents, type NewEventInput } from '@/hooks/use-events';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
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
import ImageUpload from '@/components/feature/image-upload';


const eventTypes = ['Cultural', 'Religious', 'Professional', 'Sports', 'Festival', 'Workshop', 'Food', 'Other'] as const;

const formSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters.").max(100),
  eventType: z.enum(eventTypes),
  startDateTime: z.string().refine((val) => val && !isNaN(Date.parse(val)), { message: "A valid start date is required." }),
  endDateTime: z.string().refine((val) => val && !isNaN(Date.parse(val)), { message: "A valid end date is required." }),
  venueName: z.string().min(3, "Venue name is required.").max(100),
  address: z.string().min(10, "A full address is required.").max(200),
  description: z.string().min(50, "Description must be at least 50 characters.").max(2000),
  tags: z.string().optional(),
  ticketLink: z.string().url().optional().or(z.literal('')),
  imageUrl: z.string({ required_error: "An event banner image is required." }).url({ message: "An event banner image is required." }),
}).refine(data => new Date(data.endDateTime) > new Date(data.startDateTime), {
  message: "End date must be after start date.",
  path: ["endDateTime"], 
});

type EventFormValues = z.infer<typeof formSchema>;

export default function NewEventPage() {
  const router = useRouter();
  const { addEvent } = useEvents();
  const { toast } = useToast();
  const { user } = useAuth();

  const [isPending, startTransition] = useTransition();

  const form = useForm<EventFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      eventType: 'Other',
      startDateTime: '',
      endDateTime: '',
      venueName: '',
      address: '',
      description: '',
      tags: '',
      ticketLink: '',
      imageUrl: undefined
    },
    mode: 'onChange'
  });


  const onSubmit = async (values: EventFormValues) => {
    if (!user?.affiliation) {
      toast({
        title: 'Affiliation Required',
        description: 'You must be affiliated with an organization to create an event.',
        variant: 'destructive',
      });
      return;
    }
    if (!user) {
        toast({
            title: 'Authentication Error',
            description: 'You must be logged in to create an event.',
            variant: 'destructive',
        });
        return;
    }
    
    startTransition(async () => {
        const newEventData: NewEventInput = {
          title: values.title,
          eventType: values.eventType,
          startDateTime: new Date(values.startDateTime).toISOString(),
          endDateTime: new Date(values.endDateTime).toISOString(),
          location: {
            venueName: values.venueName,
            address: values.address,
          },
          description: values.description,
          organizerName: user.affiliation!.orgName,
          organizerId: user.affiliation!.orgId,
          imageUrl: values.imageUrl,
          tags: values.tags?.split(',').map(tag => tag.trim()).filter(Boolean),
          ticketLink: values.ticketLink,
          submittedByUid: user.uid,
        };
        
        try {
            await addEvent(newEventData);

            toast({
              title: 'Event Submitted!',
              description: `Your event "${values.title}" has been submitted for review.`,
            });
            
            router.push('/events');
        } catch (error) {
             toast({
                title: 'Submission Failed',
                description: 'An unexpected error occurred. Please try again.',
                variant: 'destructive',
            });
        }
    });
  };

  if (!user) {
    return (
       <div className="container mx-auto px-4 py-12 text-center">
        <Card className="mx-auto max-w-md">
            <CardHeader>
                <CardTitle className="font-headline text-3xl">Access Denied</CardTitle>
                <CardDescription>You must be logged in to create an event. Please log in to continue.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button asChild className="mt-2">
                    <Link href="/login">Login</Link>
                </Button>
            </CardContent>
        </Card>
      </div>
    );
  }
  
  if (!user.affiliation) {
     return (
       <div className="container mx-auto px-4 py-12 text-center">
        <Card className="mx-auto max-w-md">
            <CardHeader>
                <CardTitle className="font-headline text-3xl">Affiliation Required</CardTitle>
                <CardDescription>You must be part of a community to post an event. Register your community first.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button asChild className="mt-2">
                    <Link href="/communities/new">Register a Community</Link>
                </Button>
            </CardContent>
        </Card>
      </div>
    );
  }


  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="mx-auto max-w-3xl shadow-xl shadow-black/5">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Share Your Event</CardTitle>
          <CardDescription>
            Fill out the form below to post your event on the JivanIndia.co community calendar. Fields marked with * are required.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-4">
                <h3 className="font-headline text-lg font-semibold border-b pb-2">Event Media</h3>
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                        <FormLabel>Event Banner Image *</FormLabel>
                        <FormControl>
                            <ImageUpload
                                value={field.value}
                                onChange={field.onChange}
                                aspectRatio={16 / 9}
                                toast={toast}
                                folderName="event-banners"
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                  )}
                />
            </div>

            <div className="space-y-4">
                <h3 className="font-headline text-lg font-semibold border-b pb-2">Core Details</h3>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                   <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Event Title *</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Annual Diwali Gala" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                   <FormField
                      control={form.control}
                      name="eventType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {eventTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                </div>
                 <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Event Description *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tell us more about the event, its purpose, and who should attend."
                            {...field}
                            rows={5}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
            </div>
            
            <div className="space-y-4">
                <h3 className="font-headline text-lg font-semibold border-b pb-2">Date, Time & Location</h3>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                   <FormField
                      control={form.control}
                      name="startDateTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start Date & Time *</FormLabel>
                          <FormControl>
                            <Input type="datetime-local" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  <FormField
                      control={form.control}
                      name="endDateTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>End Date & Time *</FormLabel>
                          <FormControl>
                            <Input type="datetime-local" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                </div>
                
                <FormField
                    control={form.control}
                    name="venueName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location / Venue Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Grand Park, Downtown LA" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                 <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Address *</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 200 N Grand Ave, Los Angeles, CA 90012" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
            </div>
            
            <div className="space-y-4">
                <h3 className="font-headline text-lg font-semibold border-b pb-2">Additional Information</h3>
                <div className="space-y-2">
                    <FormLabel>Organizer</FormLabel>
                    <Input
                        id="organizerName"
                        value={user.affiliation.orgName}
                        disabled
                        readOnly
                    />
                    <p className="text-xs text-muted-foreground">This is based on your community affiliation.</p>
                </div>
                
                <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tags / Keywords</FormLabel>
                        <FormControl>
                           <Input placeholder="e.g., family-friendly, diwali, free-entry, networking" {...field} />
                        </FormControl>
                         <FormDescription>Separate keywords with a comma to help users discover your event.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                 <FormField
                    control={form.control}
                    name="ticketLink"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ticket / Registration URL (Optional)</FormLabel>
                        <FormControl>
                           <Input placeholder="e.g., https://www.eventbrite.com/..." {...field} />
                        </FormControl>
                        <FormDescription>Link to an external page for tickets or registration.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Button type="button" variant="outline" onClick={() => router.back()} disabled={isPending}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending || !form.formState.isValid}>
                {isPending ? <><Loader2 className="mr-2 animate-spin"/>Creating...</> : "Create Event"}
              </Button>
            </div>
          </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

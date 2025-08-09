
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
import { useEvents, type NewEventInput, type EventSponsor } from '@/hooks/use-events';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useTransition, useMemo } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, PlusCircle, Trash2 } from 'lucide-react';
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
import { useNotifications } from '@/hooks/use-notifications';
import { useCommunities } from '@/hooks/use-communities';
import { useSponsors, type SponsorTier } from '@/hooks/use-sponsors';
import CountrySelector from '@/components/layout/country-selector';


const eventTypes = ['Cultural', 'Religious', 'Professional', 'Sports', 'Festival', 'Workshop', 'Food', 'Other'] as const;
const sponsorTiers: SponsorTier[] = ['Platinum', 'Gold', 'Silver', 'Bronze', 'Supporter'];

const sponsorSchema = z.object({
  sponsorId: z.string().min(1, "Please select a sponsor."),
  tier: z.enum(sponsorTiers, { required_error: "Please select a tier." }),
});

const formSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters.").max(100),
  eventType: z.enum(eventTypes),
  startDateTime: z.string().refine((val) => val && !isNaN(Date.parse(val)), { message: "A valid start date is required." }),
  endDateTime: z.string().refine((val) => val && !isNaN(Date.parse(val)), { message: "A valid end date is required." }),
  venueName: z.string().min(3, "Venue name is required.").max(100),
  address: z.string().min(10, "A full address is required.").max(200),
  country: z.string().min(1, "Country is required."),
  state: z.string().min(2, "State/Province is required."),
  city: z.string().min(2, "City is required."),
  description: z.string().min(50, "Description must be at least 50 characters.").max(2000),
  tags: z.string().optional(),
  ticketLink: z.string().url().optional().or(z.literal('')),
  imageUrl: z.string({ required_error: "An event banner image is required." }).url({ message: "An event banner image is required." }),
  sponsors: z.array(sponsorSchema).optional(),
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
  const { createNotificationForCommunity } = useNotifications();
  const { communities } = useCommunities();
  const { sponsors: allSponsors } = useSponsors();

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
      country: user?.currentLocation?.country || '',
      state: user?.currentLocation?.state || '',
      city: user?.currentLocation?.city || '',
      description: '',
      tags: '',
      ticketLink: '',
      imageUrl: undefined,
      sponsors: [],
    },
    mode: 'onChange'
  });

  const sponsorsField = form.watch('sponsors') || [];
  const selectedSponsorIds = useMemo(() => sponsorsField.map(s => s.sponsorId), [sponsorsField]);
  
  const addSponsorField = () => {
    form.setValue('sponsors', [...sponsorsField, { sponsorId: '', tier: 'Supporter' }]);
  }

  const removeSponsorField = (index: number) => {
    const newSponsors = [...sponsorsField];
    newSponsors.splice(index, 1);
    form.setValue('sponsors', newSponsors);
  }


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
            country: values.country,
            state: values.state,
            city: values.city,
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
            const newEvent = await addEvent(newEventData, values.sponsors || []);

            toast({
              title: 'Event Submitted!',
              description: `Your event "${values.title}" has been submitted for review.`,
            });
            
             // Create notifications for members of the community
            const organizer = communities.find(c => c.id === newEvent.organizerId);
            if (organizer) {
                await createNotificationForCommunity(organizer.id, {
                    title: `New Event: ${newEvent.title}`,
                    description: `A new event has been posted by ${newEvent.organizerName}.`,
                    link: `/events/${newEvent.id}`,
                    icon: 'Calendar',
                });
            }
            
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
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField control={form.control} name="country" render={({ field }) => (<FormItem><FormLabel>Country *</FormLabel><FormControl><CountrySelector value={field.value} onValueChange={field.onChange} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="state" render={({ field }) => (<FormItem><FormLabel>State/Province *</FormLabel><FormControl><Input placeholder="e.g., California" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="city" render={({ field }) => (<FormItem><FormLabel>City *</FormLabel><FormControl><Input placeholder="e.g., San Francisco" {...field} /></FormControl><FormMessage /></FormItem>)} />
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
                        <FormLabel>Full Street Address *</FormLabel>
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
            
             <div className="space-y-4">
                <h3 className="font-headline text-lg font-semibold border-b pb-2">Sponsorships (Optional)</h3>
                {sponsorsField.map((field, index) => (
                  <Card key={field.id} className="p-4 bg-muted/50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                       <FormField
                        control={form.control}
                        name={`sponsors.${index}.sponsorId`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Sponsor</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger><SelectValue placeholder="Select a sponsor" /></SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {allSponsors.filter(s => !selectedSponsorIds.includes(s.id) || s.id === field.value).map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                       <FormField
                        control={form.control}
                        name={`sponsors.${index}.tier`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tier</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger><SelectValue placeholder="Select a tier" /></SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {sponsorTiers.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="flex justify-end mt-2">
                        <Button type="button" variant="ghost" size="sm" onClick={() => removeSponsorField(index)}><Trash2 className="mr-2 h-4 w-4"/> Remove</Button>
                    </div>
                  </Card>
                ))}
                <Button type="button" variant="outline" onClick={addSponsorField}><PlusCircle className="mr-2 h-4 w-4"/> Add Sponsor</Button>
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

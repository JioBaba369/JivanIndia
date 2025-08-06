
'use client';

import { useEffect, useTransition } from 'react';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { Textarea } from '@/components/ui/textarea';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import ImageUpload from '@/components/feature/image-upload';
import { getInitials } from '@/lib/utils';
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

const profileFormSchema = (isUsernameUnique: (username: string, currentUid?: string) => Promise<boolean>, currentUid?: string) => z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  username: z.string().min(3, { message: "Username must be at least 3 characters." })
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores.')
    .refine(async (username) => {
        if (!username) return true; // Let min handle empty
        return await isUsernameUnique(username, currentUid);
    }, {
        message: "This username is already taken.",
    }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  bio: z.string().max(280, { message: "Bio cannot exceed 280 characters." }).optional(),
  phone: z.string().optional(),
  website: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
  profileImageUrl: z.string().url().optional().or(z.literal('')),
  currentCountry: z.string().optional(),
  currentState: z.string().optional(),
  currentCity: z.string().optional(),
  originState: z.string().optional(),
  originDistrict: z.string().optional(),
  languagesSpoken: z.string().optional(),
  interests: z.string().optional(),
});


export default function EditProfilePage() {
  const { toast } = useToast();
  const { user, updateUser, isLoading: isAuthLoading, isUsernameUnique } = useAuth();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<ReturnType<typeof profileFormSchema>>>({
    resolver: zodResolver(profileFormSchema(isUsernameUnique, user?.uid)),
    mode: 'onChange',
  });

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name || '',
        username: user.username || '',
        email: user.email || '',
        bio: user.bio || '',
        phone: user.phone || '',
        website: user.website || '',
        profileImageUrl: user.profileImageUrl || '',
        currentCountry: user.currentLocation?.country || '',
        currentState: user.currentLocation?.state || '',
        currentCity: user.currentLocation?.city || '',
        originState: user.originLocation?.indiaState || '',
        originDistrict: user.originLocation?.indiaDistrict || '',
        languagesSpoken: user.languagesSpoken?.join(', ') || '',
        interests: user.interests?.join(', ') || '',
      });
    }
  }, [user, form]);


  if (isAuthLoading || !user) {
    return (
      <div className="flex h-[calc(100vh-128px)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const onSubmit = (data: z.infer<ReturnType<typeof profileFormSchema>>) => {
    if (!user) return;
    
    startTransition(async () => {
        try {
            const languagesSpoken = data.languagesSpoken?.split(',').map(s => s.trim()).filter(Boolean);
            const interests = data.interests?.split(',').map(s => s.trim()).filter(Boolean);
            
            await updateUser({
              name: data.name,
              username: data.username,
              email: data.email,
              bio: data.bio,
              phone: data.phone,
              website: data.website,
              profileImageUrl: data.profileImageUrl,
              currentLocation: {
                country: data.currentCountry || '',
                state: data.currentState || '',
                city: data.currentCity || '',
              },
              originLocation: {
                indiaState: data.originState || '',
                indiaDistrict: data.originDistrict || '',
              },
              languagesSpoken,
              interests,
            });

            toast({
              title: "Profile Updated!",
              description: "Your profile information has been successfully updated.",
            });
            router.push('/profile');
        } catch (error) {
             toast({
              title: "Update Failed",
              description: "There was an error updating your profile. Please try again.",
              variant: "destructive",
            });
        }
    });
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Update Your Profile</CardTitle>
          <CardDescription>
            Make changes to your public and private profile information here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
               <div className="space-y-4">
                  <h3 className="font-headline text-lg font-semibold border-b pb-2">Profile Picture</h3>
                  <div className="flex items-center gap-6">
                    <Avatar className="h-24 w-24 border-4 border-primary">
                        <AvatarImage src={form.watch('profileImageUrl')} alt={form.watch('name')} />
                        <AvatarFallback className="font-headline text-3xl">{getInitials(form.watch('name'))}</AvatarFallback>
                    </Avatar>
                    <div className="w-full">
                      <FormField
                          control={form.control}
                          name="profileImageUrl"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <ImageUpload
                                  value={field.value}
                                  onChange={field.onChange}
                                  aspectRatio={1}
                                  toast={toast}
                                  folderName="profile-pictures"
                                  iconType="picture"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-headline text-lg font-semibold border-b pb-2">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="name" render={({ field }) => (<FormItem><FormLabel>Full Name *</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="username" render={({ field }) => (<FormItem><FormLabel>Username *</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="email" render={({ field }) => (<FormItem><FormLabel>Email Address *</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="phone" render={({ field }) => (<FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input type="tel" placeholder="+1 123 456 7890" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  </div>
                   <FormField control={form.control} name="website" render={({ field }) => (<FormItem><FormLabel>Website URL</FormLabel><FormControl><Input type="url" placeholder="https://your-portfolio.com" {...field} /></FormControl><FormMessage /></FormItem>)} />
                   <FormField control={form.control} name="bio" render={({ field }) => (<FormItem><FormLabel>About You (Bio)</FormLabel><FormControl><Textarea placeholder="Tell the community a little bit about yourself." {...field} rows={3} /></FormControl><FormMessage /></FormItem>)} />
                </div>
            
                <div className="space-y-4">
                  <h3 className="font-headline text-lg font-semibold border-b pb-2">Location</h3>
                   <p className="text-sm text-muted-foreground">Your current location helps us personalize your experience.</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField control={form.control} name="currentCountry" render={({ field }) => (<FormItem><FormLabel>Country</FormLabel><FormControl><Input placeholder="e.g., USA" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="currentState" render={({ field }) => (<FormItem><FormLabel>State / Province</FormLabel><FormControl><Input placeholder="e.g., California" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="currentCity" render={({ field }) => (<FormItem><FormLabel>City</FormLabel><FormControl><Input placeholder="e.g., San Francisco" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-headline text-lg font-semibold border-b pb-2">Origin in India (Optional)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="originState" render={({ field }) => (<FormItem><FormLabel>State</FormLabel><FormControl><Input placeholder="e.g., Kerala, Punjab" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="originDistrict" render={({ field }) => (<FormItem><FormLabel>District</FormLabel><FormControl><Input placeholder="e.g., Kollam, Ludhiana" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-headline text-lg font-semibold border-b pb-2">Personal Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="languagesSpoken" render={({ field }) => (<FormItem><FormLabel>Languages Spoken</FormLabel><FormControl><Input placeholder="e.g., Hindi, English" {...field} /></FormControl><FormDescription>Separate languages with a comma.</FormDescription><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="interests" render={({ field }) => (<FormItem><FormLabel>Interests</FormLabel><FormControl><Input placeholder="e.g., Volunteering, Music" {...field} /></FormControl><FormDescription>Separate interests with a comma.</FormDescription><FormMessage /></FormItem>)} />
                  </div>
                </div>

                <div className="flex justify-end gap-4 pt-4">
                  <Button type="button" variant="outline" asChild>
                    <Link href="/profile">Cancel</Link>
                  </Button>
                  <Button type="submit" disabled={isPending || !form.formState.isValid}>
                    {isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : "Save Changes"}
                  </Button>
                </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}


'use client';

import { useState, useEffect } from 'react';
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
import { useAuth, type User } from '@/hooks/use-auth';
import { Textarea } from '@/components/ui/textarea';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import ImageUpload from '@/components/feature/image-upload';
import { getInitials } from '@/lib/utils';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const profileSchema = (isUsernameUnique: (username: string) => Promise<boolean>, originalUsername?: string) => z.object({
  name: z.string().min(2, "Name must be at least 2 characters.").max(50),
  username: z.string().min(3, "Username must be at least 3 characters.").max(30)
    .regex(/^[a-zA-Z0-9_.]+$/, "Username can only contain letters, numbers, underscores, and periods.")
    .refine(async (username) => {
        if (username === originalUsername) return true;
        return await isUsernameUnique(username);
    }, { message: "This username is already taken." }),
  email: z.string().email("Please enter a valid email address."),
  bio: z.string().max(160, "Bio cannot be longer than 160 characters.").optional(),
  phone: z.string().optional(),
  website: z.string().url("Please enter a valid URL.").or(z.literal('')).optional(),
  profileImageUrl: z.string().optional(),
  
  currentCountry: z.string().optional(),
  currentState: z.string().optional(),
  currentCity: z.string().optional(),
  
  originState: z.string().optional(),
  originDistrict: z.string().optional(),
  
  languages: z.string().optional(),
  interests: z.string().optional(),
});

type ProfileFormValues = z.infer<ReturnType<typeof profileSchema>>;


export default function EditProfilePage() {
  const { toast } = useToast();
  const { user, updateUser, getUserByUsername, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();

  const isUsernameUnique = async (username: string) => {
    const existingUser = await getUserByUsername(username);
    return !existingUser;
  };
  
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema(isUsernameUnique, user?.username)),
    mode: 'onChange',
  });

  useEffect(() => {
    if (isAuthLoading) return;
    if (!user) {
        router.push('/login');
        return;
    }
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
        languages: user.languagesSpoken?.join(', ') || '',
        interests: user.interests?.join(', ') || '',
    });
  }, [user, router, isAuthLoading, form]);

  const onSubmit = async (values: ProfileFormValues) => {
    if (!user) return;

    try {
        const updatedData: Partial<User> = {
            name: values.name,
            username: values.username,
            email: values.email,
            bio: values.bio,
            phone: values.phone,
            website: values.website,
            profileImageUrl: values.profileImageUrl,
            currentLocation: {
                country: values.currentCountry || '',
                state: values.currentState || '',
                city: values.currentCity || ''
            },
            originLocation: {
                indiaState: values.originState || '',
                indiaDistrict: values.originDistrict || '',
            },
            languagesSpoken: values.languages?.split(',').map(s => s.trim()).filter(Boolean),
            interests: values.interests?.split(',').map(s => s.trim()).filter(Boolean),
        };
        
        await updateUser(updatedData);
        
        toast({
            title: "Profile Updated!",
            description: "Your profile information has been successfully updated.",
        });

        router.push('/profile');
        router.refresh();

    } catch (error) {
        console.error("Update failed", error);
        toast({
            title: "Update Failed",
            description: "There was an error updating your profile. Please try again.",
            variant: "destructive",
        });
    }
  };

  if (isAuthLoading || !user) {
    return (
         <div className="flex h-[calc(100vh-128px)] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
    );
  }
  
  const isSubmitting = form.formState.isSubmitting;
  const profileImageUrl = form.watch('profileImageUrl');
  const nameValue = form.watch('name');

  return (
    <div className="container mx-auto px-4 py-12">
        <Card className="max-w-3xl mx-auto">
            <CardHeader>
                <CardTitle className="font-headline text-3xl">Update Your Profile</CardTitle>
                <CardDescription>
                    Feel free to make any changes you need. Just hit "Save" when you're finished.
                </CardDescription>
            </CardHeader>
            <CardContent>
             <Form {...form}>
             <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                
                <div className="space-y-4">
                  <h3 className="font-headline text-lg font-semibold border-b pb-2">Profile Picture</h3>
                   <FormField
                    control={form.control}
                    name="profileImageUrl"
                    render={({ field }) => (
                        <FormItem>
                            <div className="flex items-center gap-6">
                                <Avatar className="h-24 w-24 border-4 border-primary">
                                    <AvatarImage src={profileImageUrl} alt={nameValue} />
                                    <AvatarFallback className="font-headline text-3xl">{getInitials(nameValue)}</AvatarFallback>
                                </Avatar>
                                <div className="w-full">
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
                                <FormDescription className="mt-2">Upload a new picture. Square images work best.</FormDescription>
                                </div>
                            </div>
                            <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-headline text-lg font-semibold border-b pb-2">Profile Identity</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField control={form.control} name="name" render={({field}) => (<FormItem><FormLabel>Full Name *</FormLabel><FormControl><Input {...field} required /></FormControl><FormMessage/></FormItem>)}/>
                      <FormField control={form.control} name="username" render={({field}) => (<FormItem><FormLabel>Username *</FormLabel><FormControl><Input {...field} required /></FormControl><FormMessage/></FormItem>)}/>
                      <FormField control={form.control} name="email" render={({field}) => (<FormItem><FormLabel>Email Address *</FormLabel><FormControl><Input type="email" {...field} required /></FormControl><FormMessage/></FormItem>)}/>
                      <FormField control={form.control} name="website" render={({field}) => (<FormItem><FormLabel>Website URL</FormLabel><FormControl><Input type="url" {...field} placeholder="e.g., https://your-portfolio.com"/></FormControl><FormMessage/></FormItem>)}/>
                  </div>
                </div>

                <div className="space-y-4">
                   <h3 className="font-headline text-lg font-semibold border-b pb-2">Personal Details</h3>
                    <FormField control={form.control} name="phone" render={({field}) => (<FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input type="tel" {...field} placeholder="e.g., +1 123 456 7890"/></FormControl><FormMessage/></FormItem>)}/>
                    <FormField control={form.control} name="bio" render={({field}) => (<FormItem><FormLabel>A Little About You</FormLabel><FormControl><Textarea {...field} placeholder="This is a good place to put your bio..." rows={3}/></FormControl><FormMessage/></FormItem>)}/>
                </div>

                <div className="space-y-4">
                    <h3 className="font-headline text-lg font-semibold border-b pb-2">Current Location</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                         <FormField control={form.control} name="currentCountry" render={({field}) => (<FormItem><FormLabel>Country</FormLabel><FormControl><Input {...field} placeholder="e.g., USA" /></FormControl><FormMessage/></FormItem>)}/>
                         <FormField control={form.control} name="currentState" render={({field}) => (<FormItem><FormLabel>State / Province</FormLabel><FormControl><Input {...field} placeholder="e.g., California" /></FormControl><FormMessage/></FormItem>)}/>
                         <FormField control={form.control} name="currentCity" render={({field}) => (<FormItem><FormLabel>City</FormLabel><FormControl><Input {...field} placeholder="e.g., San Francisco" /></FormControl><FormMessage/></FormItem>)}/>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="font-headline text-lg font-semibold border-b pb-2">Origin in India (Optional)</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <FormField control={form.control} name="originState" render={({field}) => (<FormItem><FormLabel>State</FormLabel><FormControl><Input {...field} placeholder="e.g., Kerala, Punjab" /></FormControl><FormMessage/></FormItem>)}/>
                         <FormField control={form.control} name="originDistrict" render={({field}) => (<FormItem><FormLabel>District</FormLabel><FormControl><Input {...field} placeholder="e.g., Kollam, Ludhiana" /></FormControl><FormMessage/></FormItem>)}/>
                    </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-headline text-lg font-semibold border-b pb-2">Interests & Languages</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField control={form.control} name="languages" render={({field}) => (<FormItem><FormLabel>Languages Spoken</FormLabel><FormControl><Input {...field} placeholder="e.g., Hindi, English, Gujarati"/></FormControl><FormDescription>Separate with a comma.</FormDescription><FormMessage/></FormItem>)}/>
                      <FormField control={form.control} name="interests" render={({field}) => (<FormItem><FormLabel>Interests</FormLabel><FormControl><Input {...field} placeholder="e.g., Volunteering, Music, Sports"/></FormControl><FormDescription>Separate with a comma.</FormDescription><FormMessage/></FormItem>)}/>
                  </div>
                </div>
                
                <div className="flex justify-end gap-4 pt-4">
                    <Button type="button" variant="outline" asChild>
                        <Link href="/profile">Cancel</Link>
                    </Button>
                    <Button type="submit" disabled={isSubmitting || !form.formState.isValid}>
                        {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : "Save Changes"}
                    </Button>
                </div>
            </form>
            </Form>
            </CardContent>
        </Card>
    </div>
  );
}

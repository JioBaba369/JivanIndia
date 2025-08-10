
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
import { KeyRound, Loader2 } from 'lucide-react';
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
import CountrySelector from '@/components/layout/country-selector';
import IndiaStateDistrictSelector from '@/components/feature/india-state-district-selector';


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

const passwordFormSchema = z.object({
  currentPassword: z.string().min(1, { message: "Current password is required." }),
  newPassword: z.string().min(6, { message: "New password must be at least 6 characters." }),
  confirmPassword: z.string()
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "New passwords do not match.",
  path: ["confirmPassword"],
});


export default function EditProfilePage() {
  const { toast } = useToast();
  const { user, updateUser, changePassword, isLoading: isAuthLoading, isUsernameUnique } = useAuth();
  const router = useRouter();
  const [isProfilePending, startProfileTransition] = useTransition();
  const [isPasswordPending, startPasswordTransition] = useTransition();

  const profileForm = useForm<z.infer<ReturnType<typeof profileFormSchema>>>({
    resolver: zodResolver(profileFormSchema(isUsernameUnique, user?.uid)),
    mode: 'onChange',
  });

  const passwordForm = useForm<z.infer<typeof passwordFormSchema>>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    mode: 'onChange'
  });

  useEffect(() => {
    if (user) {
      profileForm.reset({
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
  }, [user, profileForm]);


  if (isAuthLoading || !user) {
    return (
      <div className="flex h-[calc(100vh-128px)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const onProfileSubmit = (data: z.infer<ReturnType<typeof profileFormSchema>>) => {
    if (!user) return;
    
    startProfileTransition(async () => {
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
  };

  const onPasswordSubmit = (data: z.infer<typeof passwordFormSchema>) => {
    startPasswordTransition(async () => {
      try {
        await changePassword(data.currentPassword, data.newPassword);
        toast({
          title: "Password Changed!",
          description: "Your password has been updated successfully.",
        });
        passwordForm.reset();
      } catch (error: any) {
        toast({
          title: "Password Change Failed",
          description: error.message || "An unexpected error occurred.",
          variant: "destructive",
        });
      }
    });
  }

  return (
    <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-3xl space-y-8">
            <Card>
                <CardHeader>
                <CardTitle className="font-headline text-3xl">Update Your Profile</CardTitle>
                <CardDescription>
                    Make changes to your public and private profile information here.
                </CardDescription>
                </CardHeader>
                <CardContent>
                <Form {...profileForm}>
                    <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-8">
                    <div className="space-y-4">
                        <h3 className="font-headline text-lg font-semibold border-b pb-2">Profile Avatar</h3>
                        <div className="flex items-center gap-6">
                            <Avatar className="h-24 w-24 border-4 border-primary">
                                <AvatarImage src={profileForm.watch('profileImageUrl')} alt={profileForm.watch('name')} />
                                <AvatarFallback className="font-headline text-3xl">{getInitials(profileForm.watch('name'))}</AvatarFallback>
                            </Avatar>
                            <FormField
                                control={profileForm.control}
                                name="profileImageUrl"
                                render={({ field }) => (
                                <FormItem className="flex-grow">
                                    <FormControl>
                                        <ImageUpload
                                            value={field.value}
                                            onChange={field.onChange}
                                            aspectRatio={1/1}
                                            folderName="profile-images"
                                            toast={toast}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                        </div>
                        </div>

                        <div className="space-y-4">
                        <h3 className="font-headline text-lg font-semibold border-b pb-2">Basic Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField control={profileForm.control} name="name" render={({ field }) => (<FormItem><FormLabel>Full Name *</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={profileForm.control} name="username" render={({ field }) => (<FormItem><FormLabel>Username *</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={profileForm.control} name="email" render={({ field }) => (<FormItem><FormLabel>Email Address *</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={profileForm.control} name="phone" render={({ field }) => (<FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input type="tel" placeholder="+1 123 456 7890" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        </div>
                        <FormField control={profileForm.control} name="website" render={({ field }) => (<FormItem><FormLabel>Website URL</FormLabel><FormControl><Input type="url" placeholder="https://your-portfolio.com" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={profileForm.control} name="bio" render={({ field }) => (<FormItem><FormLabel>About You (Bio)</FormLabel><FormControl><Textarea placeholder="Tell the community a little bit about yourself." {...field} rows={3} /></FormControl><FormMessage /></FormItem>)} />
                        </div>
                    
                        <div className="space-y-4">
                        <h3 className="font-headline text-lg font-semibold border-b pb-2">Location</h3>
                        <p className="text-sm text-muted-foreground">Your current location helps us personalize your experience.</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <FormField control={profileForm.control} name="currentCountry" render={({ field }) => (<FormItem><FormLabel>Country</FormLabel><FormControl><CountrySelector value={field.value || ''} onValueChange={field.onChange} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={profileForm.control} name="currentState" render={({ field }) => (<FormItem><FormLabel>State / Province</FormLabel><FormControl><Input placeholder="e.g., California" {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={profileForm.control} name="currentCity" render={({ field }) => (<FormItem><FormLabel>City</FormLabel><FormControl><Input placeholder="e.g., San Francisco" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        </div>
                        </div>

                        <div className="space-y-4">
                        <h3 className="font-headline text-lg font-semibold border-b pb-2">Origin in India (Optional)</h3>
                        <IndiaStateDistrictSelector
                            stateValue={profileForm.watch('originState')}
                            districtValue={profileForm.watch('originDistrict')}
                            onStateChange={(value) => profileForm.setValue('originState', value, { shouldValidate: true })}
                            onDistrictChange={(value) => profileForm.setValue('originDistrict', value, { shouldValidate: true })}
                        />
                        </div>

                        <div className="space-y-4">
                        <h3 className="font-headline text-lg font-semibold border-b pb-2">Personal Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField control={profileForm.control} name="languagesSpoken" render={({ field }) => (<FormItem><FormLabel>Languages Spoken</FormLabel><FormControl><Input placeholder="e.g., Hindi, English" {...field} /></FormControl><FormDescription>Separate languages with a comma.</FormDescription><FormMessage /></FormItem>)} />
                            <FormField control={profileForm.control} name="interests" render={({ field }) => (<FormItem><FormLabel>Interests</FormLabel><FormControl><Input placeholder="e.g., Volunteering, Music" {...field} /></FormControl><FormDescription>Separate interests with a comma.</FormDescription><FormMessage /></FormItem>)} />
                        </div>
                        </div>

                        <div className="flex justify-end gap-4 pt-4">
                        <Button type="button" variant="outline" asChild>
                            <Link href="/profile">Cancel</Link>
                        </Button>
                        <Button type="submit" disabled={isProfilePending || !profileForm.formState.isValid}>
                            {isProfilePending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : "Save Changes"}
                        </Button>
                        </div>
                    </form>
                </Form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-3xl">Change Password</CardTitle>
                    <CardDescription>
                        Update your password here. For security, you will need to enter your current password.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...passwordForm}>
                        <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
                            <FormField
                                control={passwordForm.control}
                                name="currentPassword"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Current Password *</FormLabel>
                                    <FormControl>
                                        <Input type="password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={passwordForm.control}
                                    name="newPassword"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>New Password *</FormLabel>
                                        <FormControl>
                                            <Input type="password" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                                <FormField
                                    control={passwordForm.control}
                                    name="confirmPassword"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Confirm New Password *</FormLabel>
                                        <FormControl>
                                            <Input type="password" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                            </div>
                             <div className="flex justify-end gap-4 pt-4">
                                <Button type="submit" disabled={isPasswordPending || !passwordForm.formState.isValid}>
                                    {isPasswordPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...</> : <><KeyRound className="mr-2"/> Change Password</>}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}

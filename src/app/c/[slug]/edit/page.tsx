
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
import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect, useTransition, useCallback } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, X, Linkedin, Facebook, Edit } from 'lucide-react';
import { useCommunities, type Community } from '@/hooks/use-communities';
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

const NAME_MAX_LENGTH = 100;
const DESC_MAX_LENGTH = 160;
const FULL_DESC_MAX_LENGTH = 2000;

const formSchema = (isSlugUnique: (slug: string, currentId: string) => boolean) => z.object({
  name: z.string().min(3, "Community name must be at least 3 characters.").max(NAME_MAX_LENGTH),
  type: z.enum(['Cultural & Arts', 'Business & Commerce', 'Social & Non-Profit', 'Educational', 'Religious', 'Other']),
  description: z.string().min(10, "Short description must be at least 10 characters.").max(DESC_MAX_LENGTH, `Short description must be ${DESC_MAX_LENGTH} characters or less.`),
  fullDescription: z.string().min(50, "Full description must be at least 50 characters.").max(FULL_DESC_MAX_LENGTH, `Full description must be ${FULL_DESC_MAX_LENGTH} characters or less.`),
  region: z.string().min(2, "Region is required."),
  founded: z.string().min(4, "Please enter a valid year.").max(4, "Please enter a valid year."),
  tags: z.string().optional(),
  logoUrl: z.string({ required_error: "A logo image is required." }).url({ message: "A logo image is required." }),
  bannerUrl: z.string({ required_error: "A banner image is required." }).url({ message: "A banner image is required." }),
  website: z.string().url("Please enter a valid URL.").optional().or(z.literal('')),
  contactEmail: z.string().email("Please enter a valid email address."),
  phone: z.string().min(10, "Please enter a valid phone number.").optional().or(z.literal('')),
  address: z.string().min(10, "Please enter a valid address.").optional().or(z.literal('')),
  socialTwitter: z.string().url().optional().or(z.literal('')),
  socialFacebook: z.string().url().optional().or(z.literal('')),
  socialLinkedin: z.string().url().optional().or(z.literal('')),
});

type CommunityFormValues = z.infer<ReturnType<typeof formSchema>>;

const communityTypes = ['Cultural & Arts', 'Business & Commerce', 'Social & Non-Profit', 'Educational', 'Religious', 'Other'] as const;

export default function EditCommunityPage() {
  const router = useRouter();
  const params = useParams();
  const slug = typeof params.slug === 'string' ? params.slug : '';

  const { getCommunityBySlug, updateCommunity, isSlugUnique } = useCommunities();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [isPending, startTransition] = useTransition();
  const [community, setCommunity] = useState<Community | null>(null);

  const memoizedIsSlugUnique = useCallback((slug: string) => {
    if (!community || slug.length < 3) return true;
    return isSlugUnique(slug, community.id);
  }, [isSlugUnique, community]);
  
  const form = useForm<CommunityFormValues>({
    resolver: zodResolver(formSchema(memoizedIsSlugUnique)),
    mode: 'onChange',
    defaultValues: {
      name: '',
      type: 'Other',
      description: '',
      fullDescription: '',
      region: '',
      founded: '',
      tags: '',
      logoUrl: '',
      bannerUrl: '',
      website: '',
      contactEmail: '',
      phone: '',
      address: '',
      socialTwitter: '',
      socialFacebook: '',
      socialLinkedin: '',
    },
  });

  useEffect(() => {
      const foundCommunity = getCommunityBySlug(slug);
      if (foundCommunity) {
          setCommunity(foundCommunity);
          form.reset({
              name: foundCommunity.name || '',
              type: foundCommunity.type || 'Other',
              description: foundCommunity.description || '',
              fullDescription: foundCommunity.fullDescription || '',
              region: foundCommunity.region || '',
              founded: foundCommunity.founded || '',
              tags: foundCommunity.tags?.join(', ') || '',
              logoUrl: foundCommunity.logoUrl || '',
              bannerUrl: foundCommunity.imageUrl || '',
              website: foundCommunity.website || '',
              contactEmail: foundCommunity.contactEmail || '',
              phone: foundCommunity.phone || '',
              address: foundCommunity.address || '',
              socialTwitter: foundCommunity.socialMedia?.twitter || '',
              socialFacebook: foundCommunity.socialMedia?.facebook || '',
              socialLinkedin: foundCommunity.socialMedia?.linkedin || '',
          });
      }
  }, [slug, getCommunityBySlug, form]);

  if (!user || (community && user.uid !== community.founderUid)) {
    return (
       <div className="container mx-auto px-4 py-12 text-center">
        <Card className="mx-auto max-w-md">
            <CardHeader>
                <CardTitle className="font-headline text-3xl">Access Denied</CardTitle>
                <CardDescription>You do not have permission to edit this community.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button asChild className="mt-2">
                    <Link href={`/c/${slug}`}>Back to Community</Link>
                </Button>
            </CardContent>
        </Card>
      </div>
    );
  }


  const onSubmit = async (values: CommunityFormValues) => {
    if (!community) return;
    
    startTransition(async () => {
        const updatedData: Partial<Community> = {
          name: values.name,
          type: values.type,
          description: values.description,
          fullDescription: values.fullDescription,
          region: values.region,
          imageUrl: values.bannerUrl,
          logoUrl: values.logoUrl,
          tags: values.tags?.split(',').map(tag => tag.trim()).filter(Boolean) || [],
          address: values.address || '',
          phone: values.phone || '',
          contactEmail: values.contactEmail,
          website: values.website || '',
          founded: values.founded,
          socialMedia: {
            twitter: values.socialTwitter,
            linkedin: values.socialLinkedin,
            facebook: values.socialFacebook,
          },
        };

        try {
          updateCommunity(community.id, updatedData);
          toast({
            title: 'Community Updated!',
            description: `Your community "${values.name}" has been successfully updated.`,
          });
          
          router.push(`/c/${community.slug}`);

        } catch (error) {
           toast({
            title: 'Update Failed',
            description: 'An unexpected error occurred. Please try again.',
            variant: 'destructive',
          });
        }
    });
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="mx-auto max-w-3xl shadow-xl shadow-black/5">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Edit Your Community</CardTitle>
          <CardDescription>
            Update your community's information below. Changes will be reflected publicly once you save.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="space-y-4">
                <h3 className="font-headline text-lg font-semibold border-b pb-2">Community Branding</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                   <FormField
                    control={form.control}
                    name="logoUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Community Logo (1:1 Ratio) *</FormLabel>
                        <FormControl>
                          <ImageUpload
                            value={field.value}
                            onChange={field.onChange}
                            aspectRatio={1}
                            toast={toast}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="bannerUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Community Banner (16:9 Ratio) *</FormLabel>
                        <FormControl>
                           <ImageUpload
                            value={field.value}
                            onChange={field.onChange}
                            aspectRatio={16/9}
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
                <h3 className="font-headline text-lg font-semibold border-b pb-2">Community Identity</h3>
                 <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Community Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Bay Area Tamil Sangam" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
              </div>
              
              <div className="space-y-6">
                  <h3 className="font-headline text-lg font-semibold border-b pb-2">Community Details & Purpose</h3>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <FormField
                          control={form.control}
                          name="type"
                          render={({ field }) => (
                              <FormItem>
                                  <FormLabel>Community Category *</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                      <FormControl>
                                          <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                          {communityTypes.map(type => (
                                              <SelectItem key={type} value={type}>{type}</SelectItem>
                                          ))}
                                      </SelectContent>
                                  </Select>
                                  <FormMessage />
                              </FormItem>
                          )}
                      />
                       <FormField
                          control={form.control}
                          name="region"
                          render={({ field }) => (
                              <FormItem>
                                  <FormLabel>Region *</FormLabel>
                                  <FormControl>
                                      <Input placeholder="e.g., San Francisco Bay Area" {...field} />
                                  </FormControl>
                                  <FormMessage />
                              </FormItem>
                          )}
                      />
                  </div>
                   <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <FormField
                            control={form.control}
                            name="founded"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Year Founded *</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., 2010" {...field} />
                                    </FormControl>
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
                              <FormLabel>Short Description *</FormLabel>
                              <FormControl>
                                  <Textarea placeholder="A brief, one-sentence summary for listing pages." {...field} rows={2} />
                              </FormControl>
                              <FormDescription className="flex justify-between">
                                <span>Max {DESC_MAX_LENGTH} characters.</span>
                                <span>{(field.value || '').length} / {DESC_MAX_LENGTH}</span>
                              </FormDescription>
                              <FormMessage />
                          </FormItem>
                      )}
                  />
                   <FormField
                      control={form.control}
                      name="fullDescription"
                      render={({ field }) => (
                          <FormItem>
                              <FormLabel>Full Description *</FormLabel>
                              <FormControl>
                                  <Textarea placeholder="Provide a detailed description of your community's mission, activities, history, and who it's for." {...field} rows={5} />
                              </FormControl>
                              <FormDescription className="flex justify-between">
                                <span>This will appear on your main community profile page.</span>
                                <span>{(field.value || '').length} / {FULL_DESC_MAX_LENGTH}</span>
                              </FormDescription>
                              <FormMessage />
                          </FormItem>
                      )}
                  />
                   <FormField
                      control={form.control}
                      name="tags"
                      render={({ field }) => (
                          <FormItem>
                              <FormLabel>Tags / Keywords</FormLabel>
                              <FormControl>
                                  <Input placeholder="e.g., cultural, family-friendly, south-indian" {...field} />
                              </FormControl>
                              <FormDescription>Separate with commas. Helps users discover your community.</FormDescription>
                              <FormMessage />
                          </FormItem>
                      )}
                  />
              </div>

               <div className="space-y-6">
                <h3 className="font-headline text-lg font-semibold border-b pb-2">Contact & Social Media</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="contactEmail" render={({ field }) => (<FormItem><FormLabel>Contact Email *</FormLabel><FormControl><Input placeholder="e.g., contact@yourcommunity.org" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="phone" render={({ field }) => (<FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input placeholder="e.g., (123) 456-7890" {...field} /></FormControl><FormMessage /></FormItem>)} />
                </div>
                 <FormField control={form.control} name="address" render={({ field }) => (<FormItem><FormLabel>Public Address</FormLabel><FormControl><Input placeholder="e.g., 123 Community Lane, City, State" {...field} /></FormControl><FormMessage /></FormItem>)} />
                 <FormField control={form.control} name="website" render={({ field }) => (<FormItem><FormLabel>Website URL</FormLabel><FormControl><Input placeholder="e.g., https://yourcommunity.org" {...field} /></FormControl><FormMessage /></FormItem>)} />
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField control={form.control} name="socialTwitter" render={({ field }) => (<FormItem><FormLabel><div className="flex items-center gap-2"><X className="h-4 w-4"/> X (Twitter)</div></FormLabel><FormControl><Input placeholder="https://x.com/" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="socialLinkedin" render={({ field }) => (<FormItem><FormLabel><div className="flex items-center gap-2"><Linkedin /> LinkedIn</div></FormLabel><FormControl><Input placeholder="https://linkedin.com/company/" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="socialFacebook" render={({ field }) => (<FormItem><FormLabel><div className="flex items-center gap-2"><Facebook /> Facebook</div></FormLabel><FormControl><Input placeholder="https://facebook.com/" {...field} /></FormControl><FormMessage /></FormItem>)} />
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-4">
                 <Button type="button" variant="outline" onClick={() => router.back()} disabled={isPending}>
                    Cancel
                </Button>
                <Button type="submit" disabled={!form.formState.isValid || isPending}>
                  {isPending ? <><Loader2 className="mr-2 animate-spin" /> Saving...</> : 'Save Changes'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

    

    
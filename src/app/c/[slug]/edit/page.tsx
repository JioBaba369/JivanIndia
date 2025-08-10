
'use client';

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAuth, type User } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect, useTransition } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Linkedin, Facebook, Twitter, Trash2, UserPlus, Shield, Settings, Users, Instagram } from 'lucide-react';
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
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { collection, getDocs, query, where } from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import { Badge } from "@/components/ui/badge";
import { EmailInput } from "@/components/feature/user-search";
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

const ImageUpload = dynamic(() => import('@/components/feature/image-upload'), {
    loading: () => <Skeleton className="h-48 w-full" />,
    ssr: false
});
const CountrySelector = dynamic(() => import('@/components/layout/country-selector'), {
    loading: () => <Skeleton className="h-10 w-full" />,
});


const NAME_MAX_LENGTH = 100;
const DESC_MAX_LENGTH = 160;
const FULL_DESC_MAX_LENGTH = 2000;
const SLUG_MAX_LENGTH = 50;
const communityTypes = ['Social', 'Cultural', 'Business', 'Religious', 'Charitable', 'Regional', 'Professional', 'Other'] as const;

const formSchema = (isSlugUnique: (slug: string, currentId?: string) => Promise<boolean>) => z.object({
  id: z.string(),
  name: z.string().min(3, "Community name must be at least 3 characters.").max(NAME_MAX_LENGTH),
  slug: z.string().min(3, "URL must be at least 3 characters.").max(SLUG_MAX_LENGTH)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "URL must be lowercase with dashes, no spaces.")
    .refine(async (slug, ctx) => {
        const id = (ctx.parent as CommunityFormValues).id;
        return await isSlugUnique(slug, id)
    }, {
        message: "This URL is already taken.",
    }),
  type: z.enum(communityTypes),
  description: z.string().min(10, "Short description must be at least 10 characters.").max(DESC_MAX_LENGTH, `Short description must be ${DESC_MAX_LENGTH} characters or less.`),
  fullDescription: z.string().min(50, "Full description must be at least 50 characters.").max(FULL_DESC_MAX_LENGTH, `Full description must be ${FULL_DESC_MAX_LENGTH} characters or less.`),
  country: z.string().min(1, "Country is required."),
  region: z.string().min(2, "Region is required."),
  founded: z.string().min(4, "Please enter a valid year.").max(4, "Please enter a valid year."),
  tags: z.string().optional(),
  logoUrl: z.string().url().optional().or(z.literal('')),
  bannerUrl: z.string().url().optional().or(z.literal('')),
  website: z.string().url("Please enter a valid URL.").optional().or(z.literal('')),
  contactEmail: z.string().email("Please enter a valid email address."),
  phone: z.string().min(10, "Please enter a valid phone number.").optional().or(z.literal('')),
  address: z.string().min(10, "Please enter a valid address.").optional().or(z.literal('')),
  socialTwitter: z.string().optional(),
  socialFacebook: z.string().optional(),
  socialLinkedin: z.string().optional(),
  socialInstagram: z.string().optional(),
  socialFacebookGroup: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
});

type CommunityFormValues = z.infer<ReturnType<typeof formSchema>>;

const stripUsernameFromUrl = (fullUrl?: string) => {
    if (!fullUrl) return '';
    try {
        const url = new URL(fullUrl);
        const pathParts = url.pathname.split('/').filter(p => p && p !== 'company' && p !== 'groups');
        return pathParts.pop() || '';
    } catch (e) {
      // if it's not a valid URL, it might be just the handle
      return fullUrl.split('/').pop() || '';
    }
}

export default function EditCommunityPage() {
  const router = useRouter();
  const params = useParams();
  const slug = typeof params.slug === 'string' ? params.slug : '';

  const { getCommunityBySlug, updateCommunity, deleteCommunity, isLoading: isLoadingCommunities, isSlugUnique, addManager, removeManager, canManageCommunity } = useCommunities();
  const { toast } = useToast();
  const { user, setAffiliation } = useAuth();
  
  const [isPending, startTransition] = useTransition();
  const [isDeleting, setIsDeleting] = useState(false);
  const [community, setCommunity] = useState<Community | null>(null);
  
  const form = useForm<CommunityFormValues>({
    resolver: zodResolver(formSchema(isSlugUnique)),
    mode: 'onChange',
  });

  useEffect(() => {
      if (isLoadingCommunities) return;
      const foundCommunity = getCommunityBySlug(slug);
      if (foundCommunity) {
          setCommunity(foundCommunity);
          form.reset({
              id: foundCommunity.id,
              name: foundCommunity.name || '',
              slug: foundCommunity.slug || '',
              type: foundCommunity.type || 'Other',
              description: foundCommunity.description || '',
              fullDescription: foundCommunity.fullDescription || '',
              country: foundCommunity.country || '',
              region: foundCommunity.region || '',
              founded: foundCommunity.founded || '',
              tags: foundCommunity.tags?.join(', ') || '',
              logoUrl: foundCommunity.logoUrl || '',
              bannerUrl: foundCommunity.bannerUrl || '',
              website: foundCommunity.website || '',
              contactEmail: foundCommunity.contactEmail || '',
              phone: foundCommunity.phone || '',
              address: foundCommunity.address || '',
              socialTwitter: stripUsernameFromUrl(foundCommunity.socialMedia?.twitter),
              socialFacebook: stripUsernameFromUrl(foundCommunity.socialMedia?.facebook),
              socialLinkedin: stripUsernameFromUrl(foundCommunity.socialMedia?.linkedin),
              socialInstagram: stripUsernameFromUrl(foundCommunity.socialMedia?.instagram),
              socialFacebookGroup: foundCommunity.socialMedia?.facebookGroup || '',
          });
      }
  }, [slug, getCommunityBySlug, form, isLoadingCommunities]);


  if (isLoadingCommunities) {
    return (
        <div className="container mx-auto px-4 py-12 text-center flex items-center justify-center min-h-[calc(100vh-128px)]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    );
  }

  const canEdit = user && community && canManageCommunity(community, user);
  const isFounder = user && community && user.uid === community.founderUid;

  if (!user || !canEdit) {
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
        const socialMedia: { [key: string]: string | undefined } = {};
        if (values.socialTwitter) socialMedia.twitter = `https://x.com/${values.socialTwitter.replace('@', '')}`;
        if (values.socialInstagram) socialMedia.instagram = `https://instagram.com/${values.socialInstagram.replace('@', '')}`;
        if (values.socialLinkedin) socialMedia.linkedin = `https://linkedin.com/company/${values.socialLinkedin}`;
        if (values.socialFacebook) socialMedia.facebook = `https://facebook.com/${values.socialFacebook}`;
        if (values.socialFacebookGroup) socialMedia.facebookGroup = values.socialFacebookGroup;

        const updatedData: Partial<Community> = {
          name: values.name,
          slug: values.slug,
          type: values.type,
          description: values.description,
          fullDescription: values.fullDescription,
          country: values.country,
          region: values.region,
          tags: values.tags?.split(',').map(tag => tag.trim()).filter(Boolean) || [],
          logoUrl: values.logoUrl || '',
          bannerUrl: values.bannerUrl || '',
          address: values.address || '',
          phone: values.phone || '',
          contactEmail: values.contactEmail,
          website: values.website || '',
          founded: values.founded,
          socialMedia: Object.fromEntries(Object.entries(socialMedia).filter(([_, v]) => v)),
        };

        try {
          await updateCommunity(community.id, updatedData);
          if (user && user.affiliation?.orgId === community.id && (values.name !== community.name || values.slug !== community.slug)) {
            await setAffiliation(
              community.id,
              values.name,
              values.slug
            );
          }
          toast({
            title: 'Community Updated!',
            description: `Your community "${values.name}" has been successfully updated.`,
          });
          
          if (slug !== values.slug) {
            router.push(`/c/${values.slug}/edit`);
          }
          router.refresh();

        } catch (error) {
           toast({
            title: 'Update Failed',
            description: 'An unexpected error occurred. Please try again.',
            variant: 'destructive',
          });
        }
    });
  };

  const handleDelete = async () => {
      if (!community) return;
      setIsDeleting(true);
      try {
          await deleteCommunity(community.id);
          if (user && user.affiliation?.orgId === community.id) {
              await setAffiliation('', '', '');
          }
          toast({
              title: "Community Deleted",
              description: `The community "${community.name}" has been permanently deleted.`
          });
          router.push('/communities');
          router.refresh();
      } catch (error) {
          toast({
              title: "Deletion Failed",
              description: "An unexpected error occurred. Please try again.",
              variant: 'destructive'
          });
          setIsDeleting(false);
      }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-3xl space-y-8">
        <Card className="shadow-xl shadow-black/5">
          <CardHeader>
            <CardTitle className="font-headline text-3xl">Edit Your Community</CardTitle>
            <CardDescription>
              Update your community's information below. Changes will be reflected publicly once you save.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isFounder && (
                <div className="mb-8 p-4 bg-muted/50 rounded-lg">
                    <h3 className="font-headline text-lg font-semibold mb-4 flex items-center gap-2"><Settings className="h-5 w-5"/>Community Management</h3>
                    <div className="flex flex-wrap gap-3">
                        <Button asChild variant="outline">
                            <Link href={`/c/${slug}/managers`}>
                                <Users className="mr-2 h-4 w-4"/>Manage Community Managers
                            </Link>
                        </Button>
                    </div>
                </div>
            )}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="space-y-4">
                  <h3 className="font-headline text-lg font-semibold border-b pb-2">Branding &amp; Media</h3>
                  <FormField control={form.control} name="logoUrl" render={({ field }) => (<FormItem><FormLabel>Community Logo</FormLabel><FormControl><ImageUpload value={field.value} onChange={field.onChange} aspectRatio={1 / 1} toast={toast} folderName="community-logos" /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="bannerUrl" render={({ field }) => (<FormItem><FormLabel>Community Banner Image</FormLabel><FormControl><ImageUpload value={field.value} onChange={field.onChange} aspectRatio={16 / 9} toast={toast} folderName="community-banners" /></FormControl><FormMessage /></FormItem>)} />
                </div>
                <div className="space-y-4">
                  <h3 className="font-headline text-lg font-semibold border-b pb-2">Community Identity</h3>
                  <FormField control={form.control} name="name" render={({ field }) => (<FormItem><FormLabel>Community Name *</FormLabel><FormControl><Input placeholder="e.g., Bay Area Tamil Sangam" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="slug" render={({ field }) => (<FormItem><FormLabel>Community URL *</FormLabel><FormControl><Input placeholder="e.g., bay-area-tamil-sangam" {...field} /></FormControl><FormDescription>jivanindia.co/c/{form.getValues('slug') || '{your-url}'}</FormDescription><FormMessage /></FormItem>)} />
                </div>
                <div className="space-y-6">
                    <h3 className="font-headline text-lg font-semibold border-b pb-2">Community Details & Purpose</h3>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <FormField control={form.control} name="type" render={({ field }) => (<FormItem><FormLabel>Community Category *</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger></FormControl><SelectContent>{communityTypes.map(type => (<SelectItem key={type} value={type}>{type}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="founded" render={({ field }) => (<FormItem><FormLabel>Year Founded *</FormLabel><FormControl><Input placeholder="e.g., 2010" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField control={form.control} name="country" render={({ field }) => (<FormItem><FormLabel>Country *</FormLabel><FormControl><CountrySelector value={field.value} onValueChange={field.onChange} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="region" render={({ field }) => (<FormItem><FormLabel>Region *</FormLabel><FormControl><Input placeholder="e.g., San Francisco Bay Area" {...field} /></FormControl><FormDescription>State, province, or metropolitan area.</FormDescription><FormMessage /></FormItem>)} />
                    </div>
                    <FormField control={form.control} name="description" render={({ field }) => (<FormItem><FormLabel>Short Description *</FormLabel><FormControl><Textarea placeholder="A brief, one-sentence summary for listing pages." {...field} rows={2} /></FormControl><FormDescription className="flex justify-between"><span>Max {DESC_MAX_LENGTH} characters.</span><span>{(field.value || '').length} / {DESC_MAX_LENGTH}</span></FormDescription><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="fullDescription" render={({ field }) => (<FormItem><FormLabel>Full Description *</FormLabel><FormControl><Textarea placeholder="Provide a detailed description of your community's mission, activities, history, and who it's for." {...field} rows={5} /></FormControl><FormDescription className="flex justify-between"><span>This will appear on your main community profile page.</span><span>{(field.value || '').length} / {FULL_DESC_MAX_LENGTH}</span></FormDescription><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="tags" render={({ field }) => (<FormItem><FormLabel>Tags / Keywords</FormLabel><FormControl><Input placeholder="e.g., cultural, family-friendly, south-indian" {...field} /></FormControl><FormDescription>Separate with commas. Helps users discover your community.</FormDescription><FormMessage /></FormItem>)} />
                </div>
                <div className="space-y-6">
                  <h3 className="font-headline text-lg font-semibold border-b pb-2">Contact & Social Media</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField control={form.control} name="contactEmail" render={({ field }) => (<FormItem><FormLabel>Contact Email *</FormLabel><FormControl><Input placeholder="e.g., contact@yourcommunity.org" {...field} /></FormControl><FormMessage /></FormItem>)} />
                      <FormField control={form.control} name="phone" render={({ field }) => (<FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input placeholder="e.g., (123) 456-7890" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  </div>
                  <FormField control={form.control} name="address" render={({ field }) => (<FormItem><FormLabel>Public Address</FormLabel><FormControl><Input placeholder="e.g., 123 Community Lane, City, State" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="website" render={({ field }) => (<FormItem><FormLabel>Website URL</FormLabel><FormControl><Input placeholder="e.g., https://yourcommunity.org" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField control={form.control} name="socialTwitter" render={({ field }) => (<FormItem><FormLabel><div className="flex items-center gap-2"><Twitter/> X (Twitter)</div></FormLabel><div className="flex items-center"><span className="text-sm text-muted-foreground px-2 py-1 rounded-l-md border border-r-0 h-10 flex items-center bg-muted">x.com/</span><FormControl><Input className="rounded-l-none" placeholder="yourhandle" {...field} /></FormControl></div><FormMessage /></FormItem>)} />
                      <FormField control={form.control} name="socialInstagram" render={({ field }) => (<FormItem><FormLabel><div className="flex items-center gap-2"><Instagram /> Instagram</div></FormLabel><div className="flex items-center"><span className="text-sm text-muted-foreground px-2 py-1 rounded-l-md border border-r-0 h-10 flex items-center bg-muted">instagram.com/</span><FormControl><Input className="rounded-l-none" placeholder="yourhandle" {...field} /></FormControl></div><FormMessage /></FormItem>)} />
                      <FormField control={form.control} name="socialLinkedin" render={({ field }) => (<FormItem><FormLabel><div className="flex items-center gap-2"><Linkedin /> LinkedIn</div></FormLabel><div className="flex items-center"><span className="text-sm text-muted-foreground px-2 py-1 rounded-l-md border border-r-0 h-10 flex items-center bg-muted">linkedin.com/company/</span><FormControl><Input className="rounded-l-none" placeholder="yourhandle" {...field} /></FormControl></div><FormMessage /></FormItem>)} />
                      <FormField control={form.control} name="socialFacebook" render={({ field }) => (<FormItem><FormLabel><div className="flex items-center gap-2"><Facebook /> Facebook Page</div></FormLabel><div className="flex items-center"><span className="text-sm text-muted-foreground px-2 py-1 rounded-l-md border border-r-0 h-10 flex items-center bg-muted">facebook.com/</span><FormControl><Input className="rounded-l-none" placeholder="yourhandle" {...field} /></FormControl></div><FormMessage /></FormItem>)} />
                  </div>
                   <FormField control={form.control} name="socialFacebookGroup" render={({ field }) => (<FormItem><FormLabel><div className="flex items-center gap-2"><Users /> Facebook Group</div></FormLabel><FormControl><Input {...field} type="url" placeholder="https://www.facebook.com/groups/yourgroup" /></FormControl><FormMessage /></FormItem>)}/>
                </div>
                <div className="flex justify-end gap-4 pt-4">
                    <Button type="button" variant="outline" onClick={() => router.back()} disabled={isPending}>Cancel</Button>
                    <Button type="submit" disabled={!form.formState.isValid || isPending}>{isPending ? <><Loader2 className="mr-2 animate-spin" /> Saving...</> : 'Save Changes'}</Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {isFounder && (
            <Card>
                <CardHeader>
                    <CardTitle className="text-destructive">Danger Zone</CardTitle>
                    <CardDescription>These actions are irreversible. Please proceed with caution.</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-between items-center p-6 border rounded-lg border-destructive bg-destructive/5">
                    <div>
                        <h4 className="font-semibold text-destructive">Delete this Community</h4>
                        <p className="text-sm text-muted-foreground">This will permanently delete the community and all of its data.</p>
                    </div>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button type="button" variant="destructive" disabled={isDeleting}>
                                {isDeleting ? <><Loader2 className="mr-2 animate-spin"/> Deleting...</> : <><Trash2 className="mr-2"/> Delete Community</>}
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete your
                                    community, <span className="font-bold">{community?.name}</span>, and remove all of its associated data from our servers.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
                                    {isDeleting ? 'Deleting...' : 'Yes, delete it'}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </CardContent>
            </Card>
        )}
      </div>
    </div>
  );
}

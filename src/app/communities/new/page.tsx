
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
import { useEffect, useTransition, useCallback, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Linkedin, Facebook, X } from 'lucide-react';
import { useCommunities, type NewCommunityInput } from '@/hooks/use-communities';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogFooter,
} from '@/components/ui/alert-dialog';
import ImageUpload from '@/components/feature/image-upload';
import { generateSlug } from '@/lib/utils';

// Constants
const NAME_MAX_LENGTH = 100;
const SLUG_MAX_LENGTH = 50;
const DESC_MAX_LENGTH = 160;
const FULL_DESC_MAX_LENGTH = 2000;
const COMMUNITY_DOMAIN = process.env.NEXT_PUBLIC_COMMUNITY_DOMAIN || 'https://jivanindia.co'; // Configurable domain

// Explicitly define community types for TypeScript safety
const communityTypes = ['Social', 'Cultural', 'Business', 'Religious', 'Charitable', 'Regional', 'Professional', 'Other'] as const;
type CommunityType = typeof communityTypes[number];

// Zod schema for form validation
const formSchema = (isSlugUnique: (slug: string) => Promise<boolean>) =>
  z.object({
    name: z.string().min(3, 'Community name must be at least 3 characters.').max(NAME_MAX_LENGTH),
    slug: z
      .string()
      .min(3, 'URL must be at least 3 characters.')
      .max(SLUG_MAX_LENGTH)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'URL must be lowercase with dashes, no spaces.')
      .refine(async (slug) => (slug.length < 3 ? true : await isSlugUnique(slug)), {
        message: 'This URL is already taken.',
      }),
    type: z.enum(communityTypes),
    description: z
      .string()
      .min(10, 'Short description must be at least 10 characters.')
      .max(DESC_MAX_LENGTH, `Short description must be ${DESC_MAX_LENGTH} characters or less.`),
    fullDescription: z
      .string()
      .min(50, 'Full description must be at least 50 characters.')
      .max(FULL_DESC_MAX_LENGTH, `Full description must be ${FULL_DESC_MAX_LENGTH} characters or less.`),
    country: z.string().min(2, 'Country is required.'),
    region: z.string().min(2, 'Region is required.'),
    founded: z
      .string()
      .regex(/^\d{4}$/, 'Please enter a valid 4-digit year.')
      .refine((val) => parseInt(val) <= new Date().getFullYear(), 'Year cannot be in the future.'),
    tags: z.string().optional(),
    logoUrl: z.string({ required_error: 'A logo image is required.' }).url({ message: 'A logo image is required.' }),
    bannerUrl: z.string({ required_error: 'A banner image is required.' }).url({ message: 'A banner image is required.' }),
    website: z.string().url('Please enter a valid URL.').optional().or(z.literal('')),
    contactEmail: z.string().email('Please enter a valid email address.'),
    phone: z.string().min(10, 'Please enter a valid phone number.').optional().or(z.literal('')),
    address: z.string().min(10, 'Please enter a valid address.').optional().or(z.literal('')),
    socialTwitter: z
      .string()
      .optional()
      .refine((val) => !val || /^[a-zA-Z0-9_]+$/.test(val), 'Invalid Twitter handle.'),
    socialFacebook: z
      .string()
      .optional()
      .refine((val) => !val || /^[a-zA-Z0-9.]+$/.test(val), 'Invalid Facebook handle.'),
    socialLinkedin: z
      .string()
      .optional()
      .refine((val) => !val || /^[a-zA-Z0-9-]+$/.test(val), 'Invalid LinkedIn handle.'),
  });

// Type for form values
type CommunityFormValues = z.infer<ReturnType<typeof formSchema>>;

export default function NewCommunityPage() {
  const router = useRouter();
  const { addCommunity, isSlugUnique } = useCommunities();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isPending, startTransition] = useTransition();
  const [isCheckingSlug, setIsCheckingSlug] = useState(false); // Track slug validation state

  // Memoize isSlugUnique to handle async validation
  const memoizedIsSlugUnique = useCallback(
    async (slug: string) => {
      if (slug.length < 3) return true;
      setIsCheckingSlug(true);
      try {
        const isUnique = await isSlugUnique(slug);
        return isUnique;
      } finally {
        setIsCheckingSlug(false);
      }
    },
    [isSlugUnique]
  );

  // Initialize form with zod resolver
  const form = useForm<CommunityFormValues>({
    resolver: zodResolver(formSchema(memoizedIsSlugUnique)),
    defaultValues: {
      name: '',
      slug: '',
      type: 'Other',
      description: '',
      fullDescription: '',
      country: user?.currentLocation?.country || '',
      region: '',
      founded: '',
      tags: '',
      logoUrl: '',
      bannerUrl: '',
      website: '',
      contactEmail: user?.email || '',
      phone: '',
      address: '',
      socialTwitter: '',
      socialFacebook: '',
      socialLinkedin: '',
    },
    mode: 'onChange',
  });

  const nameValue = form.watch('name');
  const slugValue = form.watch('slug');
  const isSlugTouched = form.formState.touchedFields.slug;

  // Auto-generate slug based on name
  useEffect(() => {
    if (!isSlugTouched && nameValue) {
      form.setValue('slug', generateSlug(nameValue), { shouldValidate: true });
    }
  }, [nameValue, isSlugTouched, form]);

  // Handle form submission
  const onSubmit = async (values: CommunityFormValues) => {
    if (!user) {
      toast({
        title: 'Authentication Error',
        description: 'You must be logged in to create a community.',
        variant: 'destructive',
      });
      return;
    }

    startTransition(async () => {
      const newCommunity: NewCommunityInput = {
        name: values.name,
        slug: values.slug,
        type: values.type,
        description: values.description,
        fullDescription: values.fullDescription,
        country: values.country,
        region: values.region,
        imageUrl: values.bannerUrl,
        logoUrl: values.logoUrl,
        tags: values.tags?.split(',').map((tag) => tag.trim()).filter(Boolean) || [],
        membersCount: 1,
        address: values.address || '',
        phone: values.phone || '',
        contactEmail: values.contactEmail,
        website: values.website || '',
        socialMedia: {
          twitter: values.socialTwitter ? `https://x.com/${values.socialTwitter}` : undefined,
          linkedin: values.socialLinkedin ? `https://linkedin.com/company/${values.socialLinkedin}` : undefined,
          facebook: values.socialFacebook ? `https://facebook.com/${values.socialFacebook}` : undefined,
        },
        founded: values.founded,
        founderUid: user.uid,
      };

      try {
        const addedCommunity = await addCommunity(newCommunity, user);
        toast({
          title: 'Community Submitted!',
          description: `Your community "${values.name}" has been submitted for review.`,
        });
        form.reset(); // Reset form after successful submission
        router.push(`/c/${addedCommunity.slug}`);
      } catch (error) {
        toast({
          title: 'Submission Failed',
          description: error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.',
          variant: 'destructive',
        });
      }
    });
  };

  // Handle cancel action
  const handleCancel = () => {
    form.reset(); // Reset form state
    router.back();
  };

  // Render access denied for unauthenticated users
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <Card className="mx-auto max-w-md">
          <CardHeader>
            <CardTitle className="font-headline text-3xl">Access Denied</CardTitle>
            <CardDescription>
              You must be logged in to create a community. Please log in to continue.
            </CardDescription>
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

  // Render affiliation error for users already in a community
  if (user.affiliation) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <Card className="mx-auto max-w-md">
          <CardHeader>
            <CardTitle className="font-headline text-3xl">Already Affiliated</CardTitle>
            <CardDescription>
              You are already affiliated with a community and cannot create a new one.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="font-semibold">{user.affiliation.orgName}</p>
            <Button asChild className="mt-4">
              <Link href={`/c/${user.affiliation.orgSlug}`}>View Your Community</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="mx-auto max-w-3xl">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Register Your Community</CardTitle>
          <CardDescription>
            Fill out the form to add your community to our hub. Required fields are marked with an asterisk (*).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8"
              aria-describedby="form-description"
            >
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
                            folderName="community-logos"
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
                            aspectRatio={16 / 9}
                            toast={toast}
                            folderName="community-banners"
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
                        <Input
                          placeholder="e.g., Bay Area Tamil Sangam"
                          {...field}
                          aria-required="true"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Community URL *</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input
                            placeholder="e.g., bay-area-tamil-sangam"
                            {...field}
                            aria-required="true"
                          />
                        </FormControl>
                        {isCheckingSlug && (
                          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin" />
                        )}
                      </div>
                      <FormDescription>
                        {COMMUNITY_DOMAIN}/c/{slugValue || '{your-url}'}
                      </FormDescription>
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
                            <SelectTrigger aria-label="Select community category">
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {communityTypes.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="founded"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Year Founded *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="e.g., 2010"
                            min="1900"
                            max={new Date().getFullYear()}
                            {...field}
                            aria-required="true"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country *</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., USA, Canada" {...field} aria-required="true" />
                        </FormControl>
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
                          <Input
                            placeholder="e.g., San Francisco Bay Area"
                            {...field}
                            aria-required="true"
                          />
                        </FormControl>
                        <FormDescription>State, province, or metropolitan area.</FormDescription>
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
                        <Textarea
                          placeholder="A brief, one-sentence summary for listing pages."
                          {...field}
                          rows={2}
                          maxLength={DESC_MAX_LENGTH}
                          aria-required="true"
                        />
                      </FormControl>
                      <FormDescription className="flex justify-between">
                        <span>Max {DESC_MAX_LENGTH} characters.</span>
                        <span>{(form.watch('description') || '').length} / {DESC_MAX_LENGTH}</span>
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
                        <Textarea
                          placeholder="Provide a detailed description of your community's mission, activities, history, and who it's for."
                          {...field}
                          rows={5}
                          maxLength={FULL_DESC_MAX_LENGTH}
                          aria-required="true"
                        />
                      </FormControl>
                      <FormDescription className="flex justify-between">
                        <span>This will appear on your main community profile page.</span>
                        <span>
                          {(form.watch('fullDescription') || '').length} / {FULL_DESC_MAX_LENGTH}
                        </span>
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
                        <Input
                          placeholder="e.g., cultural, family-friendly, south-indian"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Separate with commas. Helps users discover your community.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-6">
                <h3 className="font-headline text-lg font-semibold border-b pb-2">
                  Contact & Social Media
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="contactEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Email *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., contact@yourcommunity.org"
                            type="email"
                            {...field}
                            aria-required="true"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., (123) 456-7890" type="tel" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Public Address</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 123 Community Lane, City, State" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website URL</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., https://yourcommunity.org" type="url" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="socialTwitter"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          <div className="flex items-center gap-2">
                            <X aria-hidden="true" /> X (Twitter)
                          </div>
                        </FormLabel>
                        <div className="flex items-center">
                          <span className="text-sm text-muted-foreground px-2 py-1 rounded-l-md border border-r-0 h-10 flex items-center bg-muted">
                            x.com/
                          </span>
                          <FormControl>
                            <Input
                              className="rounded-l-none"
                              placeholder="yourhandle"
                              {...field}
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="socialLinkedin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          <div className="flex items-center gap-2">
                            <Linkedin aria-hidden="true" /> LinkedIn
                          </div>
                        </FormLabel>
                        <div className="flex items-center">
                          <span className="text-sm text-muted-foreground px-2 py-1 rounded-l-md border border-r-0 h-10 flex items-center bg-muted">
                            linkedin.com/company/
                          </span>
                          <FormControl>
                            <Input
                              className="rounded-l-none"
                              placeholder="yourhandle"
                              {...field}
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="socialFacebook"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          <div className="flex items-center gap-2">
                            <Facebook aria-hidden="true" /> Facebook
                          </div>
                        </FormLabel>
                        <div className="flex items-center">
                          <span className="text-sm text-muted-foreground px-2 py-1 rounded-l-md border border-r-0 h-10 flex items-center bg-muted">
                            facebook.com/
                          </span>
                          <FormControl>
                            <Input
                              className="rounded-l-none"
                              placeholder="yourhandle"
                              {...field}
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button type="button" variant="outline" disabled={isPending}>
                      Cancel
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure you want to leave?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Any unsaved changes on this form will be lost.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Continue Editing</AlertDialogCancel>
                      <AlertDialogAction onClick={handleCancel}>Cancel Anyway</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                <Button type="submit" disabled={isPending || !form.formState.isValid || isCheckingSlug}>
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 animate-spin" /> Submitting...
                    </>
                  ) : (
                    'Submit for Review'
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

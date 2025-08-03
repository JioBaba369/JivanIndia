
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
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect, useCallback, useTransition } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Image from 'next/image';
import { ImageUp, Loader2, CheckCircle, AlertTriangle, UploadCloud, Check } from 'lucide-react';
import ImageCropper from '@/components/feature/image-cropper';
import { useCommunities, type NewCommunityInput } from '@/hooks/use-communities';
import { useForm, Controller } from 'react-hook-form';
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
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const generateSlug = (value: string) => {
  return value
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

const NAME_MAX_LENGTH = 100;
const SLUG_MAX_LENGTH = 50;
const DESC_MAX_LENGTH = 160;
const FULL_DESC_MAX_LENGTH = 2000;
const IMAGE_MAX_SIZE_MB = 4;

const formSchema = (isSlugUnique: (slug: string) => Promise<boolean>) => z.object({
  name: z.string().min(3, "Community name must be at least 3 characters.").max(NAME_MAX_LENGTH),
  slug: z.string().min(3, "URL must be at least 3 characters.").max(SLUG_MAX_LENGTH)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "URL must be lowercase with dashes, no spaces.")
    .refine(isSlugUnique, {
      message: "This URL is already taken.",
    }),
  type: z.enum(['Cultural & Arts', 'Business & Commerce', 'Social & Non-Profit', 'Educational', 'Religious', 'Other']),
  description: z.string().min(10, "Short description must be at least 10 characters.").max(DESC_MAX_LENGTH, `Short description must be ${DESC_MAX_LENGTH} characters or less.`),
  fullDescription: z.string().min(50, "Full description must be at least 50 characters.").max(FULL_DESC_MAX_LENGTH, `Full description must be ${FULL_DESC_MAX_LENGTH} characters or less.`),
  region: z.string().min(2, "Region is required."),
  tags: z.string().optional(),
  logoUrl: z.string({ required_error: "A logo image is required." }).url({ message: "A logo image is required." }),
  bannerUrl: z.string({ required_error: "A banner image is required." }).url({ message: "A banner image is required." }),
});

type CommunityFormValues = z.infer<ReturnType<typeof formSchema>>;

const communityTypes = ['Cultural & Arts', 'Business & Commerce', 'Social & Non-Profit', 'Educational', 'Religious', 'Other'] as const;

export default function NewCommunityPage() {
  const router = useRouter();
  const { addCommunity, isSlugUnique, getInitials } = useCommunities();
  const { toast } = useToast();
  const { user, setAffiliation } = useAuth();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [cropperConfig, setCropperConfig] = useState({ 
    aspectRatio: 16/9, 
    onSave: (img: string) => {},
  });
  
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const memoizedIsSlugUnique = useCallback(async (slug: string) => {
    if (slug.length < 3) return true; // Don't validate until it's a valid length
    return isSlugUnique(slug);
  }, [isSlugUnique]);

  const form = useForm<CommunityFormValues>({
    resolver: zodResolver(formSchema(memoizedIsSlugUnique)),
    defaultValues: {
      name: '',
      slug: '',
      type: 'Other',
      description: '',
      fullDescription: '',
      region: '',
      tags: '',
      logoUrl: undefined,
      bannerUrl: undefined,
    },
    mode: 'onChange',
  });

  const nameValue = form.watch('name');
  const slugValue = form.watch('slug');
  const isSlugChecking = form.formState.isValidating && form.getFieldState('slug').isDirty;

  useEffect(() => {
    if (!slugManuallyEdited && nameValue) {
      const newSlug = generateSlug(nameValue);
      form.setValue('slug', newSlug, { shouldValidate: true });
    }
  }, [nameValue, slugManuallyEdited, form]);


  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: 'bannerUrl' | 'logoUrl',
    aspectRatio: number,
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.size > IMAGE_MAX_SIZE_MB * 1024 * 1024) { 
          toast({ title: 'Image Too Large', description: `Please select an image smaller than ${IMAGE_MAX_SIZE_MB}MB.`, variant: 'destructive'});
          return;
      }
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setImageSrc(reader.result?.toString() || '');
        setCropperConfig({ 
            onSave: (url) => {
                form.setValue(field, url, { shouldValidate: true, shouldDirty: true });
                toast({ title: 'Image Uploaded!', description: 'Your image is ready.', icon: <Check className="h-5 w-5 text-green-500" /> });
            }, 
            aspectRatio,
        });
        setIsCropperOpen(true);
        if (e.target) e.target.value = '';
      });
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (values: CommunityFormValues) => {
    if (!user) {
        toast({ title: 'Authentication Error', description: 'You must be logged in to create a community.', variant: 'destructive' });
        return;
    }
    
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    // In a real app, this would be handled by the backend.
    const newCommunity: NewCommunityInput = {
      name: values.name,
      slug: values.slug,
      type: values.type,
      description: values.description,
      fullDescription: values.fullDescription,
      region: values.region,
      imageUrl: values.bannerUrl,
      logoUrl: values.logoUrl,
      tags: values.tags?.split(',').map(tag => tag.trim()).filter(Boolean) || [],
      membersCount: 1,
      address: '',
      phone: '',
      contactEmail: '',
      website: '',
      founded: new Date().getFullYear().toString(),
      founderUid: user.uid,
    };

    try {
      const addedCommunity = addCommunity(newCommunity, user.email);
      setAffiliation(addedCommunity.id, addedCommunity.name);

      setIsSuccess(true);
      toast({
        title: 'Community Submitted!',
        description: `Your community "${values.name}" has been submitted for review.`,
      });
      
      router.push(`/c/${addedCommunity.slug}`);

    } catch (error) {
       toast({
        title: 'Submission Failed',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!user) {
    return (
       <div className="container mx-auto px-4 py-12 text-center">
        <Card className="mx-auto max-w-md">
            <CardHeader>
                <CardTitle className="font-headline text-3xl">Access Denied</CardTitle>
                <CardDescription>You must be logged in to create a community. Please log in to continue.</CardDescription>
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
  
  if (user.affiliation) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <Card className="mx-auto max-w-md">
          <CardHeader>
            <CardTitle className="font-headline text-3xl">Already Affiliated</CardTitle>
            <CardDescription>You are already affiliated with a community and cannot create a new one.</CardDescription>
          </CardHeader>
          <CardContent>
             <p className="font-semibold">{user.affiliation.orgName}</p>
            <Button asChild className="mt-4">
                <Link href={`/communities/${user.affiliation.orgId}`}>View Your Community</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {imageSrc && (
        <ImageCropper
          isOpen={isCropperOpen}
          onClose={() => setIsCropperOpen(false)}
          imageSrc={imageSrc}
          onSave={(img) => {
            cropperConfig.onSave(img);
            setIsCropperOpen(false);
          }}
          aspectRatio={cropperConfig.aspectRatio}
        />
      )}
      <Card className="mx-auto max-w-3xl shadow-xl shadow-black/5">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Establish Your Community's Presence</CardTitle>
          <CardDescription>
            Fill out the form below to add your organization to the JivanIndia.co community hub. Fields marked with an asterisk (*) are required.
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
                      <FormItem className="space-y-2">
                        <FormLabel>Community Logo (1:1 Ratio) *</FormLabel>
                        <FormControl>
                          <Card 
                            role="button"
                            aria-label="Upload logo image"
                            tabIndex={0}
                            className="flex aspect-square w-full cursor-pointer flex-col items-center justify-center gap-2 border-2 border-dashed bg-muted hover:bg-muted/80"
                            onClick={() => logoInputRef.current?.click()}
                            onKeyDown={(e) => e.key === 'Enter' && logoInputRef.current?.click()}
                          >
                            {field.value ? (
                              <Image src={field.value} alt="Logo preview" fill className="object-cover rounded-lg p-2"/>
                            ) : (
                              <div className="text-center">
                                <UploadCloud className="h-8 w-8 text-muted-foreground mx-auto" />
                                <span className="text-muted-foreground text-sm">Click to upload</span>
                              </div>
                            )}
                          </Card>
                        </FormControl>
                        <FormMessage />
                         <Input 
                          id="community-logo-input" 
                          type="file" 
                          className="hidden"
                          ref={logoInputRef}
                          onChange={(e) => handleFileChange(e, 'logoUrl', 1)}
                          accept="image/png, image/jpeg, image/webp"
                        />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="bannerUrl"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel>Community Banner (16:9 Ratio) *</FormLabel>
                        <FormControl>
                          <Card 
                            role="button"
                            aria-label="Upload banner image"
                            tabIndex={0}
                            className="flex aspect-[16/9] w-full cursor-pointer flex-col items-center justify-center gap-2 border-2 border-dashed bg-muted hover:bg-muted/80"
                            onClick={() => bannerInputRef.current?.click()}
                            onKeyDown={(e) => e.key === 'Enter' && bannerInputRef.current?.click()}
                          >
                            {field.value ? (
                              <Image src={field.value} alt="Banner preview" fill className="object-cover rounded-lg"/>
                            ) : (
                              <div className="text-center">
                                <ImageUp className="h-8 w-8 text-muted-foreground mx-auto" />
                                <span className="text-muted-foreground text-sm">Click to upload</span>
                              </div>
                            )}
                          </Card>
                        </FormControl>
                        <FormMessage />
                         <Input 
                          id="community-banner-input" 
                          type="file" 
                          className="hidden"
                          ref={bannerInputRef}
                          onChange={(e) => handleFileChange(e, 'bannerUrl', 16/9)}
                          accept="image/png, image/jpeg, image/webp"
                        />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-headline text-lg font-semibold border-b pb-2">Community Identity</h3>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
                              onFocus={() => setSlugManuallyEdited(true)}
                              onChange={(e) => {
                                setSlugManuallyEdited(true);
                                field.onChange(generateSlug(e.target.value));
                              }}
                            />
                          </FormControl>
                          {isSlugChecking && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin" />}
                        </div>
                        <FormDescription>jivanindia.co/c/{slugValue || 'your-url'}</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
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
                                <span>{field.value.length} / {DESC_MAX_LENGTH}</span>
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
                                <span>{field.value.length} / {FULL_DESC_MAX_LENGTH}</span>
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

              <div className="flex justify-end gap-4 pt-4">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button type="button" variant="outline" disabled={isSubmitting || isSuccess}>
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
                      <AlertDialogAction onClick={() => router.back()}>Leave Page</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <Button type="submit" disabled={!form.formState.isValid || isSubmitting || isSuccess || isSlugChecking}>
                  {isSubmitting && <><Loader2 className="mr-2 animate-spin" /> Submitting...</>}
                  {isSuccess && <><CheckCircle className="mr-2" /> Submitted!</>}
                  {!isSubmitting && !isSuccess && 'Create Community'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

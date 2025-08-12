
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Linkedin, Facebook, Twitter, Instagram, Users } from 'lucide-react';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { businessCategories, type Business } from '@/hooks/use-businesses';
import { useCountries, type StateProvince } from '@/hooks/use-countries';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

const ImageUpload = dynamic(() => import('@/components/feature/image-upload'), {
    loading: () => <Skeleton className="h-48 w-full" />,
    ssr: false
});
const CountrySelector = dynamic(() => import('@/components/layout/country-selector'), {
    loading: () => <Skeleton className="h-10 w-full" />,
});

const formSchema = z.object({
  name: z.string().min(3, "Business name must be at least 3 characters."),
  category: z.enum(businessCategories, { required_error: "A category is required."}),
  logoUrl: z.string().url({ message: "A logo image URL is required." }).or(z.literal('')),
  bannerUrl: z.string().url({ message: "A banner image URL is required." }).or(z.literal('')),
  description: z.string().min(10, "A short description is required."),
  fullDescription: z.string().min(50, "A full description of at least 50 characters is required."),
  country: z.string().min(1, "Country is required."),
  state: z.string().min(1, "State/Province is required."),
  city: z.string().min(2, "City is required."),
  services: z.string().min(3, "Please list at least one service or product."),
  phone: z.string().min(10, "A valid phone number is required."),
  email: z.string().email("A valid email address is required."),
  website: z.string().url("A valid website URL is required."),
  address: z.string().min(10, "A full street address is required."),
  businessNumber: z.string().optional(),
  tags: z.string().optional(),
  socialTwitter: z.string().optional(),
  socialFacebook: z.string().optional(),
  socialLinkedin: z.string().optional(),
  socialInstagram: z.string().optional(),
  socialFacebookGroup: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
});

type BusinessFormValues = z.infer<typeof formSchema>;

interface BusinessFormProps {
    business?: Business | null;
    isPending: boolean;
    onSubmit: (values: any) => Promise<void>;
    onCancel: () => void;
    submitButtonText: string;
    submitButtonLoadingText: string;
}

const stripUsernameFromUrl = (fullUrl?: string) => {
    if (!fullUrl) return '';
    try {
        const url = new URL(fullUrl);
        const pathParts = url.pathname.split('/').filter(p => p && p !== 'company' && p !== 'groups');
        return pathParts.pop() || '';
    } catch (e) {
      return fullUrl.split('/').pop() || '';
    }
}

export default function BusinessForm({ business, isPending, onSubmit, onCancel, submitButtonText, submitButtonLoadingText }: BusinessFormProps) {
  const { toast } = useToast();
  const { getStatesByCountry } = useCountries();
  const [provinces, setProvinces] = useState<StateProvince[]>([]);
  
  const form = useForm<BusinessFormValues>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: business ? {
        name: business.name || '',
        category: business.category,
        logoUrl: business.logoUrl || '',
        bannerUrl: business.bannerUrl || '',
        description: business.description || '',
        fullDescription: business.fullDescription || '',
        country: business.location?.country || '',
        state: business.location?.state || '',
        city: business.location?.city || '',
        services: business.services?.join(', ') || '',
        phone: business.contact?.phone || '',
        email: business.contact?.email || '',
        website: business.contact?.website || '',
        address: business.contact?.address || '',
        businessNumber: business.contact?.businessNumber || '',
        tags: business.tags?.join(', ') || '',
        socialTwitter: stripUsernameFromUrl(business.socialMedia?.twitter),
        socialFacebook: stripUsernameFromUrl(business.socialMedia?.facebook),
        socialLinkedin: stripUsernameFromUrl(business.socialMedia?.linkedin),
        socialInstagram: stripUsernameFromUrl(business.socialMedia?.instagram),
        socialFacebookGroup: business.socialMedia?.facebookGroup || '',
      } : {
      name: '', category: undefined, logoUrl: '', bannerUrl: '', description: '',
      fullDescription: '', country: '', state: '', city: '', services: '',
      phone: '', email: '', website: '', address: '', businessNumber: '', tags: '',
      socialTwitter: '', socialFacebook: '', socialLinkedin: '', socialInstagram: '', socialFacebookGroup: ''
    }
  });

  const selectedCountry = form.watch("country");

  useEffect(() => {
    if (selectedCountry) {
        setProvinces(getStatesByCountry(selectedCountry));
    } else {
        setProvinces([]);
    }
    // Only reset state if the business object is not being loaded for the first time
    if (business === undefined || (business && business.location.country !== selectedCountry)) {
        form.setValue('state', '');
    }
  }, [selectedCountry, getStatesByCountry, form, business]);
  
  const handleFormSubmit = (values: BusinessFormValues) => {
    const socialMedia: { [key: string]: string | undefined } = {};
    if (values.socialTwitter) socialMedia.twitter = `https://x.com/${values.socialTwitter.replace('@', '')}`;
    if (values.socialLinkedin) socialMedia.linkedin = `https://linkedin.com/company/${values.socialLinkedin}`;
    if (values.socialFacebook) socialMedia.facebook = `https://facebook.com/${values.socialFacebook}`;
    if (values.socialInstagram) socialMedia.instagram = `https://instagram.com/${values.socialInstagram.replace('@', '')}`;
    if (values.socialFacebookGroup) socialMedia.facebookGroup = values.socialFacebookGroup;
    
    const submissionData = {
      name: values.name,
      category: values.category,
      logoUrl: values.logoUrl,
      bannerUrl: values.bannerUrl,
      description: values.description,
      fullDescription: values.fullDescription,
      location: {
        country: values.country,
        state: values.state,
        city: values.city,
      },
      services: values.services.split(',').map(s => s.trim()).filter(Boolean),
      contact: {
        phone: values.phone,
        email: values.email,
        website: values.website,
        address: values.address,
        businessNumber: values.businessNumber,
      },
      socialMedia: Object.fromEntries(Object.entries(socialMedia).filter(([_, v]) => v)),
      tags: values.tags?.split(',').map(tag => tag.trim()).filter(Boolean) || [],
    };
    
    onSubmit(submissionData);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8">
        <div className="space-y-4">
            <h3 className="font-headline text-lg font-semibold border-b pb-2">Business Identity</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField name="name" control={form.control} render={({field}) => (<FormItem><FormLabel>Business/Place Name *</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)}/>
                <FormField name="category" control={form.control} render={({field}) => (<FormItem><FormLabel>Category *</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger></FormControl><SelectContent>{businessCategories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>)}/>
            </div>
            <FormField name="businessNumber" control={form.control} render={({field}) => (<FormItem><FormLabel>Business Number (Optional)</FormLabel><FormControl><Input {...field} /></FormControl><FormDescription>e.g., ABN, ACN, GSTIN, EIN</FormDescription><FormMessage /></FormItem>)}/>
        </div>
        <div className="space-y-4">
            <h3 className="font-headline text-lg font-semibold border-b pb-2">Branding</h3>
            <FormField control={form.control} name="logoUrl" render={({ field }) => (<FormItem><FormLabel>Business Logo (1:1 ratio) *</FormLabel><FormControl><ImageUpload value={field.value} onChange={field.onChange} aspectRatio={1/1} toast={toast} folderName="business-logos"/></FormControl><FormMessage /></FormItem>)}/>
            <FormField control={form.control} name="bannerUrl" render={({ field }) => (<FormItem><FormLabel>Business Banner (16:9 ratio) *</FormLabel><FormControl><ImageUpload value={field.value} onChange={field.onChange} aspectRatio={16/9} toast={toast} folderName="business-banners" /></FormControl><FormMessage /></FormItem>)}/>
        </div>
        <div className="space-y-4">
            <h3 className="font-headline text-lg font-semibold border-b pb-2">Location</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField control={form.control} name="country" render={({ field }) => (<FormItem><FormLabel>Country *</FormLabel><FormControl><CountrySelector value={field.value} onValueChange={(value) => { field.onChange(value); }} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="state" render={({ field }) => (<FormItem><FormLabel>State/Province *</FormLabel><Select onValueChange={field.onChange} value={field.value} disabled={provinces.length === 0}><FormControl><SelectTrigger><SelectValue placeholder="Select a state/province" /></SelectTrigger></FormControl><SelectContent>{provinces.map((province) => (<SelectItem key={province.name} value={province.name}>{province.name}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)}/>
                <FormField control={form.control} name="city" render={({ field }) => (<FormItem><FormLabel>City *</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
            </div>
            <FormField name="address" control={form.control} render={({field}) => (<FormItem><FormLabel>Full Street Address *</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)}/>
        </div>
        <div className="space-y-4">
            <h3 className="font-headline text-lg font-semibold border-b pb-2">Details</h3>
            <FormField name="description" control={form.control} render={({field}) => (<FormItem><FormLabel>Short Description *</FormLabel><FormControl><Textarea {...field} rows={2}/></FormControl><FormMessage /></FormItem>)}/>
            <FormField name="fullDescription" control={form.control} render={({field}) => (<FormItem><FormLabel>Full Description *</FormLabel><FormControl><Textarea {...field} rows={5}/></FormControl><FormMessage /></FormItem>)}/>
            <FormField name="services" control={form.control} render={({field}) => (<FormItem><FormLabel>Products / Services Offered *</FormLabel><FormControl><Input {...field} /></FormControl><FormDescription>Separate items with a comma.</FormDescription><FormMessage /></FormItem>)}/>
            <FormField name="tags" control={form.control} render={({field}) => (<FormItem><FormLabel>Tags / Keywords</FormLabel><FormControl><Input {...field} /></FormControl><FormDescription>Separate with commas. Helps users discover your business.</FormDescription><FormMessage /></FormItem>)}/>
        </div>
        <div className="space-y-4">
            <h3 className="font-headline text-lg font-semibold border-b pb-2">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField name="phone" control={form.control} render={({field}) => (<FormItem><FormLabel>Phone *</FormLabel><FormControl><Input {...field} type="tel" /></FormControl><FormMessage /></FormItem>)}/>
                <FormField name="email" control={form.control} render={({field}) => (<FormItem><FormLabel>Email *</FormLabel><FormControl><Input {...field} type="email" /></FormControl><FormMessage /></FormItem>)}/>
            </div>
            <FormField name="website" control={form.control} render={({field}) => (<FormItem><FormLabel>Website *</FormLabel><FormControl><Input {...field} type="url" placeholder="https://example.com" /></FormControl><FormMessage /></FormItem>)}/>
        </div>
        <div className="space-y-4">
            <h3 className="font-headline text-lg font-semibold border-b pb-2">Social Media (Optional)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="socialTwitter" render={({ field }) => (<FormItem><FormLabel><div className="flex items-center gap-2"><Twitter/> X (Twitter)</div></FormLabel><div className="flex items-center"><span className="text-sm text-muted-foreground px-2 py-1 rounded-l-md border border-r-0 h-10 flex items-center bg-muted">x.com/</span><FormControl><Input className="rounded-l-none" placeholder="yourhandle" {...field} /></FormControl></div><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="socialInstagram" render={({ field }) => (<FormItem><FormLabel><div className="flex items-center gap-2"><Instagram /> Instagram</div></FormLabel><div className="flex items-center"><span className="text-sm text-muted-foreground px-2 py-1 rounded-l-md border border-r-0 h-10 flex items-center bg-muted">instagram.com/</span><FormControl><Input className="rounded-l-none" placeholder="yourhandle" {...field} /></FormControl></div><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="socialLinkedin" render={({ field }) => (<FormItem><FormLabel><div className="flex items-center gap-2"><Linkedin /> LinkedIn</div></FormLabel><div className="flex items-center"><span className="text-sm text-muted-foreground px-2 py-1 rounded-l-md border border-r-0 h-10 flex items-center bg-muted">linkedin.com/company/</span><FormControl><Input className="rounded-l-none" placeholder="yourhandle" {...field} /></FormControl></div><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="socialFacebook" render={({ field }) => (<FormItem><FormLabel><div className="flex items-center gap-2"><Facebook /> Facebook Page</div></FormLabel><div className="flex items-center"><span className="text-sm text-muted-foreground px-2 py-1 rounded-l-md border border-r-0 h-10 flex items-center bg-muted">facebook.com/</span><FormControl><Input className="rounded-l-none" placeholder="yourhandle" {...field} /></FormControl></div><FormMessage /></FormItem>)} />
            </div>
            <FormField control={form.control} name="socialFacebookGroup" render={({ field }) => (<FormItem><FormLabel><div className="flex items-center gap-2"><Users /> Facebook Group</div></FormLabel><FormControl><Input {...field} type="url" placeholder="https://www.facebook.com/groups/yourgroup" /></FormControl><FormMessage /></FormItem>)}/>
        </div>
        <div className="flex justify-end gap-4 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>Cancel</Button>
            <Button type="submit" disabled={isPending || !form.formState.isValid}>
                {isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/>{submitButtonLoadingText}</> : submitButtonText}
            </Button>
        </div>
      </form>
    </Form>
  )
}

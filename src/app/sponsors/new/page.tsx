
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
import { useTransition } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Linkedin, Facebook, Twitter, Instagram } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useSponsors, type SponsorTier, type NewSponsorInput } from '@/hooks/use-sponsors';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

const ImageUpload = dynamic(() => import('@/components/feature/image-upload'), {
    loading: () => <Skeleton className="h-48 w-full" />,
    ssr: false
});

const sponsorTiers: SponsorTier[] = ['Platinum', 'Gold', 'Silver', 'Bronze', 'Supporter'];

const formSchema = z.object({
  name: z.string().min(3, "Sponsor name must be at least 3 characters."),
  logoUrl: z.string().url({ message: "A logo image is required." }),
  website: z.string().url("A valid website URL is required."),
  industry: z.string().min(2, "Industry is required."),
  tier: z.enum(sponsorTiers),
  description: z.string().min(10, "A short description is required."),
  fullDescription: z.string().min(50, "A full description of at least 50 characters is required."),
  contactEmail: z.string().email("A valid contact email is required."),
  contactPhone: z.string().min(10, "A valid phone number is required."),
  address: z.string().min(10, "A full address is required."),
  socialTwitter: z.string().optional(),
  socialFacebook: z.string().optional(),
  socialLinkedin: z.string().optional(),
  socialInstagram: z.string().optional(),
});

type SponsorFormValues = z.infer<typeof formSchema>;

export default function NewSponsorPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();
  const { addSponsor } = useSponsors();
  
  const [isPending, startTransition] = useTransition();

  const form = useForm<SponsorFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      logoUrl: '',
      website: '',
      industry: '',
      tier: 'Silver',
      description: '',
      fullDescription: '',
      contactEmail: '',
      contactPhone: '',
      address: '',
      socialTwitter: '',
      socialFacebook: '',
      socialLinkedin: '',
      socialInstagram: '',
    },
    mode: 'onChange'
  });

  const onSubmit = async (values: SponsorFormValues) => {
     if (!user?.roles.includes('admin')) {
      toast({
        title: 'Admin Access Required',
        description: 'Only platform administrators can add new sponsors.',
        variant: 'destructive',
      });
      return;
    }

    startTransition(async () => {
        const socialMedia: { [key: string]: string | undefined } = {};
        if (values.socialTwitter) socialMedia.twitter = `https://x.com/${values.socialTwitter.replace('@', '')}`;
        if (values.socialInstagram) socialMedia.instagram = `https://instagram.com/${values.socialInstagram.replace('@', '')}`;
        if (values.socialLinkedin) socialMedia.linkedin = `https://linkedin.com/company/${values.socialLinkedin}`;
        if (values.socialFacebook) socialMedia.facebook = `https://facebook.com/${values.socialFacebook}`;

        const newSponsorData: NewSponsorInput = {
            ...values,
            socialMedia: Object.fromEntries(Object.entries(socialMedia).filter(([_, v]) => v)),
        };

        try {
            await addSponsor(newSponsorData);
            toast({
                title: 'Sponsor Added!',
                description: `${values.name} has been added as a new sponsor.`,
            });
            router.push('/sponsors');
        } catch (error) {
            console.error("Sponsor submission error", error);
            toast({
                title: 'Submission Failed',
                description: 'An unexpected error occurred. Please try again.',
                variant: 'destructive',
            });
        }
    });
  };

  if (!user || !user.roles.includes('admin')) {
    return (
       <div className="container mx-auto px-4 py-12 text-center">
        <Card className="mx-auto max-w-md">
            <CardHeader>
                <CardTitle className="font-headline text-3xl">Access Denied</CardTitle>
                <CardDescription>This page is restricted to platform administrators.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button asChild className="mt-2"><Link href="/">Return Home</Link></Button>
            </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="mx-auto max-w-3xl">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Add a New Sponsor</CardTitle>
          <CardDescription>
            Fill out the form below to add a new sponsoring organization to the platform.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
               <FormField control={form.control} name="logoUrl" render={({ field }) => (<FormItem><FormLabel>Sponsor Logo *</FormLabel><FormControl><ImageUpload value={field.value} onChange={field.onChange} aspectRatio={2 / 1} toast={toast} folderName="sponsor-logos" /></FormControl><FormMessage /></FormItem>)} />
               <FormField name="name" control={form.control} render={({field}) => (<FormItem><FormLabel>Sponsor Name *</FormLabel><FormControl><Input {...field} placeholder="e.g., Innovate Corp" /></FormControl><FormMessage /></FormItem>)}/>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField name="industry" control={form.control} render={({field}) => (<FormItem><FormLabel>Industry *</FormLabel><FormControl><Input {...field} placeholder="e.g., Technology, Finance" /></FormControl><FormMessage /></FormItem>)}/>
                <FormField name="tier" control={form.control} render={({field}) => (<FormItem><FormLabel>Sponsorship Tier *</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent>{sponsorTiers.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>)}/>
               </div>
              <FormField name="description" control={form.control} render={({field}) => (<FormItem><FormLabel>Short Description *</FormLabel><FormControl><Textarea {...field} placeholder="A brief one-sentence summary." rows={2}/></FormControl><FormMessage /></FormItem>)}/>
              <FormField name="fullDescription" control={form.control} render={({field}) => (<FormItem><FormLabel>Full Description *</FormLabel><FormControl><Textarea {...field} placeholder="A detailed description of the sponsor." rows={5}/></FormControl><FormMessage /></FormItem>)}/>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField name="contactPhone" control={form.control} render={({field}) => (<FormItem><FormLabel>Contact Phone *</FormLabel><FormControl><Input {...field} type="tel" /></FormControl><FormMessage /></FormItem>)}/>
                <FormField name="contactEmail" control={form.control} render={({field}) => (<FormItem><FormLabel>Contact Email *</FormLabel><FormControl><Input {...field} type="email" /></FormControl><FormMessage /></FormItem>)}/>
              </div>
              <FormField name="address" control={form.control} render={({field}) => (<FormItem><FormLabel>Address *</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)}/>
              <FormField name="website" control={form.control} render={({field}) => (<FormItem><FormLabel>Website *</FormLabel><FormControl><Input {...field} type="url" placeholder="https://example.com" /></FormControl><FormMessage /></FormItem>)}/>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="socialTwitter" render={({ field }) => (<FormItem><FormLabel><div className="flex items-center gap-2"><Twitter/> X (Twitter)</div></FormLabel><div className="flex items-center"><span className="text-sm text-muted-foreground px-2 py-1 rounded-l-md border border-r-0 h-10 flex items-center bg-muted">x.com/</span><FormControl><Input className="rounded-l-none" placeholder="yourhandle" {...field} /></FormControl></div><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="socialInstagram" render={({ field }) => (<FormItem><FormLabel><div className="flex items-center gap-2"><Instagram /> Instagram</div></FormLabel><div className="flex items-center"><span className="text-sm text-muted-foreground px-2 py-1 rounded-l-md border border-r-0 h-10 flex items-center bg-muted">instagram.com/</span><FormControl><Input className="rounded-l-none" placeholder="yourhandle" {...field} /></FormControl></div><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="socialLinkedin" render={({ field }) => (<FormItem><FormLabel><div className="flex items-center gap-2"><Linkedin /> LinkedIn</div></FormLabel><div className="flex items-center"><span className="text-sm text-muted-foreground px-2 py-1 rounded-l-md border border-r-0 h-10 flex items-center bg-muted">linkedin.com/company/</span><FormControl><Input className="rounded-l-none" placeholder="yourhandle" {...field} /></FormControl></div><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="socialFacebook" render={({ field }) => (<FormItem><FormLabel><div className="flex items-center gap-2"><Facebook /> Facebook</div></FormLabel><div className="flex items-center"><span className="text-sm text-muted-foreground px-2 py-1 rounded-l-md border border-r-0 h-10 flex items-center bg-muted">facebook.com/</span><FormControl><Input className="rounded-l-none" placeholder="yourhandle" {...field} /></FormControl></div><FormMessage /></FormItem>)} />
                </div>
              <div className="flex justify-end gap-4 pt-4">
                <Button type="button" variant="outline" onClick={() => router.back()} disabled={isPending}>Cancel</Button>
                <Button type="submit" disabled={isPending || !form.formState.isValid}>
                  {isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Adding...</> : "Add Sponsor"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

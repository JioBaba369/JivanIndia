
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
import { Loader2 } from 'lucide-react';
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
import { useBusinesses, businessCategories, type NewBusinessInput } from '@/hooks/use-businesses';


const formSchema = z.object({
  name: z.string().min(3, "Business name must be at least 3 characters."),
  category: z.enum(businessCategories),
  description: z.string().min(10, "A short description is required."),
  fullDescription: z.string().min(50, "A full description of at least 50 characters is required."),
  region: z.string().min(2, "Region is required."),
  services: z.string().min(3, "Please list at least one service or product."),
  phone: z.string().min(10, "A valid phone number is required."),
  email: z.string().email("A valid email address is required."),
  website: z.string().url("A valid website URL is required."),
  address: z.string().min(10, "A full address is required."),
});

type BusinessFormValues = z.infer<typeof formSchema>;

export default function NewBusinessEntryPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();
  const { addBusiness } = useBusinesses();
  
  const [isPending, startTransition] = useTransition();

  const form = useForm<BusinessFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      category: 'Other',
      description: '',
      fullDescription: '',
      region: '',
      services: '',
      phone: '',
      email: '',
      website: '',
      address: '',
    },
    mode: 'onChange'
  });

  const onSubmit = async (values: BusinessFormValues) => {
    if (!user?.isAdmin) {
      toast({
        title: 'Admin Access Required',
        description: 'Only platform administrators can add new business listings.',
        variant: 'destructive',
      });
      return;
    }

    startTransition(async () => {
        const newBusinessData: NewBusinessInput = {
          name: values.name,
          category: values.category,
          description: values.description,
          fullDescription: values.fullDescription,
          region: values.region,
          services: values.services.split(',').map(s => s.trim()).filter(Boolean),
          contact: {
            phone: values.phone,
            email: values.email,
            website: values.website,
            address: values.address,
          },
          associatedCommunityId: user.affiliation?.orgId,
        };
        
        try {
          await addBusiness(newBusinessData);
          toast({
              title: 'Business Submitted!',
              description: `${values.name} has been added to the directory.`,
          });
          router.push('/businesses');
        } catch (error) {
          console.error(error);
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
                <CardDescription>You must be logged in to add a business listing.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button asChild className="mt-2"><Link href="/login">Login</Link></Button>
            </CardContent>
        </Card>
      </div>
    );
  }

   if (!user.isAdmin) {
     return (
       <div className="container mx-auto px-4 py-12 text-center">
        <Card className="mx-auto max-w-md">
            <CardHeader>
                <CardTitle className="font-headline text-3xl">Permission Required</CardTitle>
                <CardDescription>Only administrators can add new listings to ensure they are trusted and verified.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button asChild className="mt-2"><Link href="/dashboard">Return to Dashboard</Link></Button>
            </CardContent>
        </Card>
      </div>
    );
  }


  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="mx-auto max-w-3xl">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Create a New Business Listing</CardTitle>
          <CardDescription>
            Add a trusted business, sponsor, or professional to the business directory. This feature is limited to community administrators.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField name="name" control={form.control} render={({field}) => (<FormItem><FormLabel>Business/Place Name *</FormLabel><FormControl><Input {...field} placeholder="e.g., Fremont Hindu Temple" /></FormControl><FormMessage /></FormItem>)}/>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField name="category" control={form.control} render={({field}) => (<FormItem><FormLabel>Category *</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent>{businessCategories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>)}/>
                <FormField name="region" control={form.control} render={({field}) => (<FormItem><FormLabel>Region *</FormLabel><FormControl><Input {...field} placeholder="e.g., San Francisco Bay Area" /></FormControl><FormMessage /></FormItem>)}/>
              </div>
              <FormField name="description" control={form.control} render={({field}) => (<FormItem><FormLabel>Short Description *</FormLabel><FormControl><Textarea {...field} placeholder="A brief one-sentence summary." rows={2}/></FormControl><FormMessage /></FormItem>)}/>
              <FormField name="fullDescription" control={form.control} render={({field}) => (<FormItem><FormLabel>Full Description *</FormLabel><FormControl><Textarea {...field} placeholder="A detailed description of the place or service." rows={5}/></FormControl><FormMessage /></FormItem>)}/>
              <FormField name="services" control={form.control} render={({field}) => (<FormItem><FormLabel>Products / Services Offered *</FormLabel><FormControl><Input {...field} placeholder="e.g., Daily puja, wedding services, Indian spices" /></FormControl><FormDescription>Separate items with a comma.</FormDescription><FormMessage /></FormItem>)}/>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField name="phone" control={form.control} render={({field}) => (<FormItem><FormLabel>Phone *</FormLabel><FormControl><Input {...field} type="tel" /></FormControl><FormMessage /></FormItem>)}/>
                <FormField name="email" control={form.control} render={({field}) => (<FormItem><FormLabel>Email *</FormLabel><FormControl><Input {...field} type="email" /></FormControl><FormMessage /></FormItem>)}/>
              </div>
              <FormField name="address" control={form.control} render={({field}) => (<FormItem><FormLabel>Address *</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)}/>
              <FormField name="website" control={form.control} render={({field}) => (<FormItem><FormLabel>Website *</FormLabel><FormControl><Input {...field} type="url" placeholder="https://example.com" /></FormControl><FormMessage /></FormItem>)}/>
              <div className="flex justify-end gap-4 pt-4">
                <Button type="button" variant="outline" onClick={() => router.back()} disabled={isPending}>Cancel</Button>
                <Button type="submit" disabled={isPending || !form.formState.isValid}>
                  {isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Adding...</> : "Add to Businesses"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}


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
import { useDeals, type NewDealInput } from '@/hooks/use-deals';
import { useCommunities } from '@/hooks/use-communities';
import { useBusinesses } from '@/hooks/use-businesses';


const formSchema = z.object({
  title: z.string().min(5, "Deal title must be at least 5 characters."),
  description: z.string().min(20, "Description must be at least 20 characters."),
  terms: z.string().min(10, "Terms must be at least 10 characters."),
  category: z.enum(['Food & Dining', 'Retail & Shopping', 'Services', 'Entertainment', 'Other']),
  expires: z.string().refine((val) => val && !isNaN(Date.parse(val)), { message: "A valid expiration date is required." }),
  businessId: z.string().min(1, "You must select a business or community."),
});

type DealFormValues = z.infer<typeof formSchema>;

const dealCategories = ['Food & Dining', 'Retail & Shopping', 'Services', 'Entertainment', 'Other'] as const;

export default function NewDealPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();
  const { addDeal } = useDeals();
  const { communities } = useCommunities();
  const { businesses } = useBusinesses();
  
  const [isPending, startTransition] = useTransition();

  const userAffiliatedBusinesses = businesses.filter(b => b.ownerId === user?.uid);
  const userAffiliatedCommunities = communities.filter(c => c.founderUid === user?.uid);

  const form = useForm<DealFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      terms: '',
      category: 'Food & Dining',
      expires: '',
      businessId: '',
    },
    mode: 'onChange'
  });


  const handleSubmit = async (values: DealFormValues) => {
     if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'You must be logged in to post a deal.',
        variant: 'destructive',
      });
      return;
    }
    const allAffiliations = [...userAffiliatedBusinesses, ...userAffiliatedCommunities];
    const selectedAffiliation = allAffiliations.find(a => a.id === values.businessId);

    if (!selectedAffiliation) {
      toast({
        title: 'Affiliation Not Found',
        description: 'Could not find details for your selected business or community.',
        variant: 'destructive',
      });
      return;
    }
    
    startTransition(async () => {
      const newDealData: NewDealInput = {
        title: values.title,
        description: values.description,
        terms: values.terms,
        category: values.category,
        expires: values.expires,
        business: selectedAffiliation.name,
        businessId: selectedAffiliation.id,
        businessLocation: 'address' in selectedAffiliation ? selectedAffiliation.address : `${selectedAffiliation.location.city}, ${selectedAffiliation.location.country}`,
        businessWebsite: selectedAffiliation.website || '',
        submittedByUid: user.uid,
      };

      try {
        await addDeal(newDealData);
        toast({
          title: 'Deal Submitted!',
          description: `Your deal "${values.title}" has been submitted for review.`,
        });
        form.reset();
        router.push('/deals');
      } catch (error) {
        console.error("Deal submission error", error);
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
                <CardDescription>You must be logged in to post a deal. Please log in to continue.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button asChild className="mt-2"><Link href="/login">Login</Link></Button>
            </CardContent>
        </Card>
      </div>
    );
  }
  
  if (userAffiliatedCommunities.length === 0 && userAffiliatedBusinesses.length === 0) {
     return (
       <div className="container mx-auto px-4 py-12 text-center">
        <Card className="mx-auto max-w-md">
            <CardHeader>
                <CardTitle className="font-headline text-3xl">Business or Community Required</CardTitle>
                <CardDescription>You must manage a registered business or community to post a deal.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button asChild className="mt-2">
                    <Link href="/businesses/new">Register Your Business</Link>
                </Button>
            </CardContent>
        </Card>
      </div>
    );
  }


  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="mx-auto max-w-3xl shadow-xl shadow-black/5">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Create a New Deal</CardTitle>
          <CardDescription>
            Fill out the form below to post a deal for the community. Fields marked with * are required.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
            <div className="space-y-4">
              <h3 className="font-headline text-lg font-semibold border-b pb-2">Deal Information</h3>
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deal Title *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 20% Off Lunch Special" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                  control={form.control}
                  name="businessId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business / Community *</FormLabel>
                       <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Select a business or community you manage" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {[...userAffiliatedBusinesses, ...userAffiliatedCommunities].map(item => (
                            <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category *</FormLabel>
                       <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {dealCategories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="expires"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expiration Date *</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
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
                    <FormLabel>Description *</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Describe the deal in a few sentences." {...field} rows={3} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="terms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Terms & Conditions *</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter any terms, conditions, or restrictions for this deal." {...field} rows={3} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Button type="button" variant="outline" onClick={() => router.back()} disabled={isPending}>Cancel</Button>
              <Button type="submit" disabled={isPending || !form.formState.isValid}>
                {isPending ? <><Loader2 className="mr-2 animate-spin"/>Creating...</> : "Create Deal"}
              </Button>
            </div>
          </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

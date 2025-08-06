
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
import ImageUpload from '@/components/feature/image-upload';


const formSchema = z.object({
  title: z.string().min(5, "Deal title must be at least 5 characters."),
  description: z.string().min(20, "Description must be at least 20 characters."),
  terms: z.string().min(10, "Terms must be at least 10 characters."),
  category: z.enum(['Food & Dining', 'Retail & Shopping', 'Services', 'Entertainment', 'Other']),
  expires: z.string().refine((val) => val && !isNaN(Date.parse(val)), { message: "A valid expiration date is required." }),
  imageUrl: z.string().url({ message: "A deal image is required." }),
});

type DealFormValues = z.infer<typeof formSchema>;

const dealCategories = ['Food & Dining', 'Retail & Shopping', 'Services', 'Entertainment', 'Other'] as const;

export default function NewDealPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [isPending, startTransition] = useTransition();

  const form = useForm<DealFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      terms: '',
      category: 'Food & Dining',
      expires: '',
      imageUrl: undefined,
    },
    mode: 'onChange'
  });


  const handleSubmit = async (values: DealFormValues) => {
     if (!user?.affiliation) {
      toast({
        title: 'Affiliation Required',
        description: 'You must be affiliated with a registered business to post a deal.',
        variant: 'destructive',
      });
      return;
    }
    
    startTransition(async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: 'Deal Submitted!',
        description: `Your deal "${values.title}" has been submitted for review.`,
      });
      
      router.push('/deals');
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
                <Button asChild className="mt-2">
                    <Link href="/login">Login</Link>
                </Button>
            </CardContent>
        </Card>
      </div>
    );
  }
  
  if (!user.affiliation) {
     return (
       <div className="container mx-auto px-4 py-12 text-center">
        <Card className="mx-auto max-w-md">
            <CardHeader>
                <CardTitle className="font-headline text-3xl">Business Affiliation Required</CardTitle>
                <CardDescription>You must represent a registered business to post a deal.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button asChild className="mt-2">
                    <Link href="/communities/new">Register Your Business</Link>
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
                <h3 className="font-headline text-lg font-semibold border-b pb-2">Deal Media</h3>
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                        <FormLabel>Deal Image *</FormLabel>
                        <FormControl>
                            <ImageUpload
                                value={field.value}
                                onChange={field.onChange}
                                aspectRatio={16 / 9}
                                toast={toast}
                                folderName="deal-images"
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                  )}
                />
            </div>
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
               <div className="space-y-2">
                <Label htmlFor="businessName">Business Name</Label>
                <Input id="businessName" value={user.affiliation.orgName} readOnly disabled />
                <p className="text-xs text-muted-foreground">This is based on your community affiliation.</p>
              </div>
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

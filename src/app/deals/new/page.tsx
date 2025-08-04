
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
import { useState, useRef } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Image from 'next/image';
import { ImageUp, Loader2 } from 'lucide-react';
import ImageCropper from '@/components/feature/image-cropper';
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
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setImageSrc(reader.result?.toString() || '');
        setIsCropperOpen(true);
      });
      reader.readAsDataURL(file);
    }
  };

  const handleCropSave = (croppedDataUrl: string) => {
    form.setValue('imageUrl', croppedDataUrl, { shouldValidate: true, shouldDirty: true });
    setIsCropperOpen(false);
  };


  const handleSubmit = async (values: DealFormValues) => {
     if (!user?.affiliation) {
      toast({
        title: 'Affiliation Required',
        description: 'You must be affiliated with a registered business to post a deal.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsSubmitting(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log({
        ...values,
        businessName: user.affiliation.orgName
    });

    toast({
      title: 'Deal Submitted!',
      description: `Your deal "${values.title}" has been submitted for review.`,
    });
    
    setIsSubmitting(false);
    router.push('/deals');
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
        {imageSrc && (
            <ImageCropper
            isOpen={isCropperOpen}
            onClose={() => setIsCropperOpen(false)}
            imageSrc={imageSrc}
            onSave={handleCropSave}
            aspectRatio={16 / 9}
            />
        )}
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
                        <Card 
                          className="relative flex aspect-[16/9] w-full cursor-pointer flex-col items-center justify-center gap-2 border-2 border-dashed bg-muted hover:bg-muted/80"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          {field.value ? (
                            <Image src={field.value} alt="Deal image preview" fill className="object-cover rounded-lg"/>
                          ) : (
                            <>
                              <ImageUp className="h-8 w-8 text-muted-foreground" />
                              <span className="text-muted-foreground">Click to upload image (16:9 ratio recommended)</span>
                            </>
                          )}
                        </Card>
                      </FormControl>
                      <Input 
                        id="deal-image" 
                        type="file" 
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/png, image/jpeg, image/webp"
                      />
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
              <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting || !form.formState.isValid}>
                {isSubmitting ? <><Loader2 className="mr-2 animate-spin"/>Creating...</> : "Create Deal"}
              </Button>
            </div>
          </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

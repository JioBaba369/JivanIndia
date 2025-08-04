
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
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
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
  title: z.string().min(5, "Job title must be at least 5 characters."),
  location: z.string().min(2, "Location is required."),
  type: z.enum(['Full-time', 'Part-time', 'Contract', 'Internship']),
  salary: z.string().optional(),
  description: z.string().min(50, "Description must be at least 50 characters."),
  applicationUrl: z.string().url("Please enter a valid URL for the application."),
});

type JobFormValues = z.infer<typeof formSchema>;

const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship'] as const;

export default function NewJobPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<JobFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      location: '',
      type: 'Full-time',
      salary: '',
      description: '',
      applicationUrl: '',
    },
    mode: 'onChange',
  });


  const handleSubmit = async (values: JobFormValues) => {
    if (!user?.affiliation) {
      toast({
        title: 'Affiliation Required',
        description: 'You must be affiliated with an organization to post a job.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsSubmitting(true);
   
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: 'Job Submitted!',
      description: `Your job posting for "${values.title}" has been submitted for review.`,
    });
    
    setIsSubmitting(false);
    router.push('/careers');
  };

  if (!user) {
    return (
       <div className="container mx-auto px-4 py-12 text-center">
        <Card className="mx-auto max-w-md">
            <CardHeader>
                <CardTitle className="font-headline text-3xl">Access Denied</CardTitle>
                <CardDescription>You must be logged in to post a job. Please log in to continue.</CardDescription>
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
                <CardTitle className="font-headline text-3xl">Affiliation Required</CardTitle>
                <CardDescription>You must be part of a community to post a job. Register your community first.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button asChild className="mt-2">
                    <Link href="/communities/new">Register a Community</Link>
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
          <CardTitle className="font-headline text-3xl">Post a New Job Opening</CardTitle>
          <CardDescription>
            Fill out the form below to share a career opportunity with the community. Fields marked with * are required.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
            <div className="space-y-4">
                <h3 className="font-headline text-lg font-semibold border-b pb-2">Job Details</h3>
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Title *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Software Engineer, Marketing Manager" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input
                        id="companyName"
                        value={user.affiliation.orgName}
                        disabled
                        readOnly
                    />
                     <p className="text-xs text-muted-foreground">This is based on your community affiliation.</p>
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location *</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., San Francisco, CA or Remote" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Employment Type *</FormLabel>
                             <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger><SelectValue placeholder="Select a type" /></SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {jobTypes.map(type => (
                                      <SelectItem key={type} value={type}>{type}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                 </div>
                 <FormField
                    control={form.control}
                    name="salary"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Salary Range (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., $120,000 - $150,000 per year" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                 <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Job Description *</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Provide details about the role, responsibilities, and qualifications." {...field} rows={8}/>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                 <FormField
                    control={form.control}
                    name="applicationUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Application URL *</FormLabel>
                        <FormControl>
                          <Input type="url" placeholder="e.g., https://yourcompany.com/careers/apply" {...field} />
                        </FormControl>
                         <FormDescription>Link to the job posting or application form.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || !form.formState.isValid}>
                {isSubmitting ? <><Loader2 className="mr-2 animate-spin"/>Submitting...</> : "Post Job"}
              </Button>
            </div>
          </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

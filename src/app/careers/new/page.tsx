
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
import { FormEvent, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function NewJobPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [title, setTitle] = useState('');
  const [companyName, setCompanyName] = useState(user?.affiliation?.orgName || '');
  const [location, setLocation] = useState('');
  const [type, setType] = useState('Full-time');
  const [salary, setSalary] = useState('');
  const [description, setDescription] = useState('');
  const [applicationUrl, setApplicationUrl] = useState('');


  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!user?.affiliation) {
      toast({
        title: 'Affiliation Required',
        description: 'You must be affiliated with an organization to post a job.',
        variant: 'destructive',
      });
      return;
    }
   
    // In a real app, you would save this data to your database
    console.log({
      title,
      companyName,
      location,
      type,
      salary,
      description,
      applicationUrl,
    });

    toast({
      title: 'Job Submitted!',
      description: `Your job posting for "${title}" has been submitted for review.`,
    });

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
            Fill out the form below to share a career opportunity with the community.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-4">
                <h3 className="font-headline text-lg font-semibold border-b pb-2">Job Details</h3>
                <div className="space-y-2">
                    <Label htmlFor="title">Job Title</Label>
                    <Input
                        id="title"
                        placeholder="e.g., Software Engineer, Marketing Manager"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input
                        id="companyName"
                        value={companyName}
                        disabled
                        readOnly
                    />
                     <p className="text-xs text-muted-foreground">This is based on your community affiliation.</p>
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                            id="location"
                            placeholder="e.g., San Francisco, CA or Remote"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            required
                        />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="type">Employment Type</Label>
                         <Select value={type} onValueChange={setType} required>
                            <SelectTrigger id="type">
                                <SelectValue placeholder="Select a type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Full-time">Full-time</SelectItem>
                                <SelectItem value="Part-time">Part-time</SelectItem>
                                <SelectItem value="Contract">Contract</SelectItem>
                                <SelectItem value="Internship">Internship</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                 </div>
                 <div className="space-y-2">
                    <Label htmlFor="salary">Salary Range (Optional)</Label>
                    <Input
                        id="salary"
                        placeholder="e.g., $120,000 - $150,000 per year"
                        value={salary}
                        onChange={(e) => setSalary(e.target.value)}
                    />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="description">Job Description</Label>
                    <Textarea
                        id="description"
                        placeholder="Provide details about the role, responsibilities, and qualifications."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        rows={8}
                    />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="applicationUrl">Application URL</Label>
                    <Input
                        id="applicationUrl"
                        type="url"
                        placeholder="e.g., https://yourcompany.com/careers/apply"
                        value={applicationUrl}
                        onChange={(e) => setApplicationUrl(e.target.value)}
                        required
                    />
                     <p className="text-xs text-muted-foreground">Link to the job posting or application form.</p>
                </div>

            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit">Post Job</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

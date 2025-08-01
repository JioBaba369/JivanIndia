
'use client';

import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { Briefcase, Building, MapPin, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// This is the same mock data from the main careers page.
// In a real app, you would fetch job data from a central store or API.
const allJobs = [
  {
    id: "1",
    title: "Software Engineer",
    company: "InnovateTech Solutions",
    location: "San Francisco, CA",
    type: "Full-time",
    imageUrl: "https://placehold.co/100x100.png",
    aiHint: "tech company logo"
  },
  {
    id: "2",
    title: "Marketing Manager",
    company: "Desi Grocers Inc.",
    location: "New York, NY",
    type: "Full-time",
    imageUrl: "https://placehold.co/100x100.png",
    aiHint: "retail logo"
  },
  {
    id: "3",
    title: "Restaurant Chef",
    company: "Saffron Restaurant Group",
    location: "Chicago, IL",
    type: "Part-time",
    imageUrl: "https://placehold.co/100x100.png",
    aiHint: "restaurant logo"
  },
  {
    id: "4",
    title: "Real Estate Agent",
    company: "Sahara Real Estate",
    location: "Houston, TX",
    type: "Contract",
    imageUrl: "https://placehold.co/100x100.png",
    aiHint: "real estate logo"
  },
  {
    id: "5",
    title: "Accountant",
    company: "Rohan Gupta, CPA",
    location: "San Jose, CA",
    type: "Full-time",
    imageUrl: "https://placehold.co/100x100.png",
    aiHint: "finance logo"
  },
  {
    id: "6",
    title: "Graphic Designer",
    company: "Aisha's Design Studio",
    location: "Remote",
    type: "Freelance",
    imageUrl: "https://placehold.co/100x100.png",
    aiHint: "design agency logo"
  },
];


export default function ProfilePage() {
  const { user, savedJobs, unsaveJob } = useAuth();
  const { toast } = useToast();

  const userSavedJobs = allJobs.filter(job => savedJobs.includes(job.id));

  const handleUnsave = (jobId: string, jobTitle: string) => {
    unsaveJob(jobId);
    toast({
        title: "Job Unsaved",
        description: `The ${jobTitle} position has been removed from your saved jobs.`,
    });
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="font-headline text-3xl font-bold">Access Denied</h1>
        <p className="mt-4 text-muted-foreground">Please log in to view your saved jobs.</p>
        <Button asChild className="mt-6">
          <Link href="/login">Login</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-muted/40">
      <div className="container mx-auto px-4 py-12">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-3xl">Saved Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            {userSavedJobs.length > 0 ? (
              <div className="space-y-6">
                {userSavedJobs.map((job) => (
                  <Card key={job.id} className="transition-all hover:shadow-md">
                      <CardContent className="p-4">
                          <div className="flex flex-col sm:flex-row gap-4 items-start">
                              <div className="flex-shrink-0">
                                 <Image
                                  src={job.imageUrl}
                                  alt={`${job.company} logo`}
                                  width={60}
                                  height={60}
                                  className="rounded-lg object-cover border bg-background"
                                  data-ai-hint={job.aiHint}
                                  />
                              </div>
                              <div className="flex-grow">
                                  <Link href={`/careers/${job.id}`} className="group">
                                    <h3 className="font-headline text-xl font-bold group-hover:text-primary transition-colors">{job.title}</h3>
                                  </Link>
                                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-muted-foreground text-sm">
                                     <div className="flex items-center gap-2">
                                       <Building className="h-4 w-4" />
                                       <span>{job.company}</span>
                                     </div>
                                     <div className="flex items-center gap-2">
                                       <MapPin className="h-4 w-4" />
                                       <span>{job.location}</span>
                                     </div>
                                      <div className="flex items-center gap-2">
                                       <Briefcase className="h-4 w-4" />
                                       <span>{job.type}</span>
                                     </div>
                                  </div>
                              </div>
                              <div className="flex items-center gap-2 sm:ml-auto pt-2 sm:pt-0">
                                  <Button variant="outline" size="sm" asChild>
                                      <Link href={`/careers/${job.id}`}>View</Link>
                                  </Button>
                                  <Button variant="destructive" size="icon" onClick={() => handleUnsave(job.id, job.title)}>
                                      <Trash2 className="h-4 w-4" />
                                      <span className="sr-only">Unsave job</span>
                                  </Button>
                              </div>
                          </div>
                      </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border-2 border-dashed rounded-lg">
                <p className="text-muted-foreground">You haven't saved any jobs yet.</p>
                <Button asChild className="mt-4">
                  <Link href="/careers">Find Jobs</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

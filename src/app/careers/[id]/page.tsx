
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, MapPin, Building, Share2, Bookmark, History } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from 'react';
import { ApplyForm } from "@/components/apply-form";
import { useAuth } from "@/hooks/use-auth";
import { useParams, useRouter } from "next/navigation";
import { formatDistanceToNow, isValid } from "date-fns";
import { jobs } from '../page'; // Import jobs data

export default function JobDetailPage() {
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : '';
  
  // Find the specific job from the imported list
  const job = jobs.find(j => j.id === id);

  const { toast } = useToast();
  const [isApplyFormOpen, setIsApplyFormOpen] = useState(false);
  const { user, saveJob, unsaveJob, isJobSaved } = useAuth();
  const router = useRouter();
  const [postedAt, setPostedAt] = useState('');

  useEffect(() => {
    if (job?.postedAt) {
      try {
        const date = new Date(job.postedAt);
        if (isValid(date)) {
          setPostedAt(formatDistanceToNow(date, { addSuffix: true }));
        } else {
          setPostedAt('a while ago');
        }
      } catch (error) {
        console.error("Failed to parse date:", job.postedAt, error);
        setPostedAt('a while ago');
      }
    }
  }, [job?.postedAt]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link Copied!",
      description: "Job posting link copied to clipboard.",
    });
  };

  const handleSaveToggle = () => {
    if (!user || !job) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to save jobs.",
        variant: "destructive",
      });
      if (!user) router.push("/login");
      return;
    }

    const currentlySaved = isJobSaved(job.id);
    if (currentlySaved) {
      unsaveJob(job.id);
      toast({
        title: "Job Unsaved",
        description: `The ${job.title} position has been removed from your saved jobs.`,
      });
    } else {
      saveJob(job.id);
      toast({
        title: "Job Saved!",
        description: `The ${job.title} position has been saved to your profile.`,
      });
    }
  };

  if (!job) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="font-headline text-3xl font-bold">Job Not Found</h1>
        <p className="mt-4 text-muted-foreground">The job you are looking for does not exist or may have been removed.</p>
        <Button asChild className="mt-6">
          <Link href="/careers">Back to Careers</Link>
        </Button>
      </div>
    );
  }

  const jobIsSaved = user ? isJobSaved(job.id) : false;

  return (
    <>
      <ApplyForm
        isOpen={isApplyFormOpen}
        onOpenChange={setIsApplyFormOpen}
        jobTitle={job.title}
        companyName={job.company}
      />
      <div className="bg-background">
        <div className="relative h-48 w-full md:h-64">
          <Image
            src={job.details.imageUrl}
            alt={`${job.company} office`}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        </div>
        <div className="container mx-auto -mt-24 px-4 py-12 md:-mt-32">
          <Card className="overflow-hidden shadow-lg">
            <CardContent className="p-6 md:p-8">
              <div className="flex flex-col items-start gap-6 sm:flex-row">
                <div className="-mt-16 flex-shrink-0 sm:-mt-24">
                  <Image
                    src={job.imageUrl}
                    alt={`${job.company} logo`}
                    width={120}
                    height={120}
                    className="rounded-lg border-4 border-background bg-background object-cover shadow-md"
                  />
                </div>
                <div className="flex-grow pt-4">
                  <Badge variant="secondary">{job.type}</Badge>
                  <h1 className="font-headline mt-2 text-3xl font-bold md:text-4xl">{job.title}</h1>
                  <div className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-2 text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      <span className="hover:text-primary">{job.company}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4" />
                      <span>{job.details.experience}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  <section>
                    <h2 className="font-headline mb-4 border-b pb-2 text-2xl font-semibold">Job Description</h2>
                    <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
                      <History className="h-4 w-4" />
                      <span>Posted {postedAt}</span>
                    </div>
                    <div className="space-y-4 text-muted-foreground">
                      <p>{job.details.companyDescription}</p>
                      <h3 className="font-headline text-xl font-semibold">Responsibilities</h3>
                      <ul className="list-disc space-y-1 pl-5">
                        {job.details.responsibilities.map((item, i) => <li key={i}>{item}</li>)}
                      </ul>
                      <h3 className="font-headline text-xl font-semibold">Qualifications</h3>
                      <ul className="list-disc space-y-1 pl-5">
                        {job.details.qualifications.map((item, i) => <li key={i}>{item}</li>)}
                      </ul>
                    </div>
                  </section>
                  <section className="mt-8">
                    <h3 className="font-headline mb-4 border-b pb-2 text-xl font-semibold">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {job.details.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                    </div>
                  </section>
                </div>
                <div className="space-y-6">
                  <div className="flex flex-col gap-4">
                    <Button size="lg" className="w-full" onClick={() => setIsApplyFormOpen(true)}>
                      Apply Now
                    </Button>
                    <Button size="lg" variant={jobIsSaved ? "default" : "secondary"} className="w-full" onClick={handleSaveToggle}>
                      <Bookmark className="mr-2 h-4 w-4" />
                      {jobIsSaved ? "Job Saved" : "Save Job"}
                    </Button>
                    <Button size="lg" variant="outline" className="w-full" onClick={handleShare}>
                      <Share2 className="mr-2 h-4 w-4" />
                      Share Job
                    </Button>
                  </div>
                  <Card>
                    <CardContent className="space-y-4 p-4">
                      <h4 className="font-headline mb-2 font-semibold">About {job.company}</h4>
                      <div className="flex items-start gap-4">
                        <Building className="h-5 w-5 mt-1 flex-shrink-0 text-primary" />
                        <div>
                          <p className="font-semibold">Company</p>
                          <span className="text-sm text-primary hover:underline">{job.company}</span>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <MapPin className="h-5 w-5 mt-1 flex-shrink-0 text-primary" />
                        <div>
                          <p className="font-semibold">Location</p>
                          <p className="text-sm text-muted-foreground">{job.location}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

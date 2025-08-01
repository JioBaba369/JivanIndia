

'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, MapPin, Building, Share2, Bookmark, History } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { useState } from 'react';
import { ApplyForm } from "@/components/apply-form";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";

// Mock data - in a real app, you'd fetch this based on the `params.id`
const jobDetails = {
    id: "1",
    title: "Software Engineer",
    company: "InnovateTech Solutions",
    location: "San Francisco, CA",
    type: "Full-time",
    experience: "Mid-Senior Level",
    salary: "$120,000 - $160,000",
    postedAt: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
    imageUrl: "https://placehold.co/1200x400.png",
    aiHint: "modern office space",
    companyLogoUrl: "https://placehold.co/100x100.png",
    aiHintLogo: "tech company logo",
    companyDescription: "InnovateTech Solutions is a leading provider of cloud-based software that helps businesses of all sizes streamline their operations and drive growth. We are a passionate team of innovators dedicated to building products that make a difference.",
    responsibilities: [
        "Design, develop, and maintain high-quality, scalable web applications using React and Node.js.",
        "Collaborate with cross-functional teams to define, design, and ship new features.",
        "Write clean, maintainable, and efficient code.",
        "Troubleshoot and debug applications to optimize performance.",
        "Participate in code reviews to maintain code quality standards."
    ],
    qualifications: [
        "Bachelor's degree in Computer Science or related field.",
        "3+ years of experience in software development.",
        "Proficiency in JavaScript, React, and Node.js.",
        "Experience with cloud platforms like AWS or Google Cloud.",
        "Strong problem-solving skills and attention to detail."
    ],
    tags: ["React", "Node.js", "JavaScript", "Full-stack", "AWS"]
};


export default function JobDetailPage({ params }: { params: { id: string } }) {
  // You can use params.id to fetch the correct job data from your backend
  const job = jobDetails;
  const { toast } = useToast();
  const [isApplyFormOpen, setIsApplyFormOpen] = useState(false);
  const { user, saveJob, unsaveJob, isJobSaved } = useAuth();
  const router = useRouter();
  const postedAt = formatDistanceToNow(new Date(job.postedAt), { addSuffix: true });

   const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link Copied!",
      description: "Job posting link copied to clipboard.",
    });
  };

  const handleSaveToggle = () => {
    if (!user) {
        toast({
            title: "Please log in",
            description: "You need to be logged in to save jobs.",
            variant: "destructive",
        });
        router.push("/login");
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
       <div className="relative h-48 md:h-64 w-full">
            <Image
              src={job.imageUrl}
              alt={`${job.company} office`}
              fill
              className="object-cover"
              data-ai-hint={job.aiHint}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        </div>
      <div className="container mx-auto px-4 py-12 -mt-24 md:-mt-32">
        <Card className="overflow-hidden shadow-lg">
          <CardContent className="p-6 md:p-8">
            <div className="flex flex-col sm:flex-row gap-6 items-start">
                 <div className="flex-shrink-0 -mt-16 sm:-mt-24">
                    <Image
                    src={job.companyLogoUrl}
                    alt={`${job.company} logo`}
                    width={120}
                    height={120}
                    className="rounded-lg object-cover border-4 border-background shadow-md bg-background"
                    data-ai-hint={job.aiHintLogo}
                    />
                </div>
                <div className="flex-grow pt-4">
                    <Badge>{job.type}</Badge>
                    <h1 className="font-headline text-3xl md:text-4xl font-bold mt-2">{job.title}</h1>
                    <div className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-2 text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <Building className="h-4 w-4" />
                            <Link href="/organizations" className="hover:text-primary">{job.company}</Link>
                        </div>
                        <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span>{job.location}</span>
                        </div>
                         <div className="flex items-center gap-2">
                            <Briefcase className="h-4 w-4" />
                            <span>{job.experience}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
              <div className="lg:col-span-2">
                <div>
                    <h2 className="font-headline text-2xl font-semibold mb-4 border-b pb-2">Job Description</h2>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                        <History className="h-4 w-4" />
                        <span>Posted {postedAt}</span>
                    </div>
                    <div className="prose prose-sm max-w-none text-muted-foreground space-y-4">
                        <p>{job.companyDescription}</p>
                        <h3 className="font-headline text-xl font-semibold">Responsibilities</h3>
                        <ul className="list-disc pl-5 space-y-1">
                            {job.responsibilities.map((item, i) => <li key={i}>{item}</li>)}
                        </ul>
                        <h3 className="font-headline text-xl font-semibold">Qualifications</h3>
                         <ul className="list-disc pl-5 space-y-1">
                            {job.qualifications.map((item, i) => <li key={i}>{item}</li>)}
                        </ul>
                    </div>
                </div>
                 <div className="mt-8">
                    <h3 className="font-headline text-xl font-semibold mb-4 border-b pb-2">Skills</h3>
                     <div className="flex flex-wrap gap-2">
                        {job.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                    </div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="flex flex-col gap-4">
                    <Button size="lg" className="w-full" onClick={() => setIsApplyFormOpen(true)}>
                        Apply Now
                    </Button>
                    <Button size="lg" variant={jobIsSaved ? "default" : "secondary"} className="w-full" onClick={handleSaveToggle}>
                        <Bookmark className="mr-2"/>
                        {jobIsSaved ? "Job Saved" : "Save Job"}
                    </Button>
                    <Button size="lg" variant="outline" className="w-full" onClick={handleShare}>
                        <Share2 className="mr-2"/>
                        Share Job
                    </Button>
                </div>
                 <Card>
                    <CardContent className="p-4 space-y-4">
                        <h4 className="font-semibold font-headline mb-2">About {job.company}</h4>
                        <div className="flex items-start gap-4">
                        <Building className="h-5 w-5 mt-1 text-primary flex-shrink-0" />
                        <div>
                            <p className="font-semibold">Company</p>
                            <Link href="/organizations" className="text-sm text-primary hover:underline">{job.company}</Link>
                        </div>
                        </div>
                         <div className="flex items-start gap-4">
                        <MapPin className="h-5 w-5 mt-1 text-primary flex-shrink-0" />
                        <div>
                            <p className="font-semibold">Location</p>
                            <p className="text-muted-foreground text-sm">{job.location}</p>
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


'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Briefcase, MapPin, Search, Building } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import type { MouseEvent } from 'react';

const jobs = [
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


export default function CareersPage() {
  const { toast } = useToast();

  const handleApply = (e: MouseEvent<HTMLButtonElement>, jobTitle: string) => {
    e.preventDefault();
    e.stopPropagation();
    toast({
      title: "Application Sent!",
      description: `Your application for ${jobTitle} has been submitted.`,
    });
  };

  const handleSave = (e: MouseEvent<HTMLButtonElement>, jobTitle: string) => {
    e.preventDefault();
    e.stopPropagation();
    toast({
      title: "Job Saved!",
      description: `The ${jobTitle} position has been saved to your profile.`,
    });
  };


  return (
    <div className="flex flex-col">
      <section className="bg-gradient-to-b from-primary/10 via-background to-background py-20 text-center">
        <div className="container mx-auto px-4">
          <h1 className="font-headline text-4xl font-bold md:text-6xl">
            Find Your Next Opportunity
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Explore career openings within our vibrant community businesses.
          </p>
        </div>
      </section>

      <div className="sticky top-[65px] z-30 bg-background/80 py-4 backdrop-blur-md border-y">
        <div className="container mx-auto px-4">
          <Card className="shadow-md">
            <CardContent className="p-4">
               <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
                <div className="relative lg:col-span-2">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="Job title, keyword, or company"
                    className="pl-10 text-base"
                  />
                </div>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="Location or 'Remote'"
                    className="pl-10 text-base"
                  />
                </div>
                 <Select>
                  <SelectTrigger className="text-base">
                    <div className="flex items-center gap-2">
                     <Briefcase className="h-4 w-4 text-muted-foreground" />
                     <SelectValue placeholder="Job Type" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-time">Full-time</SelectItem>
                    <SelectItem value="part-time">Part-time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="freelance">Freelance</SelectItem>
                    <SelectItem value="internship">Internship</SelectItem>
                  </SelectContent>
                </Select>
                <Button size="lg" className="w-full">Find Jobs</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <section className="container mx-auto px-4 py-12">
        <div className="space-y-6">
          {jobs.map((job) => (
            <Card key={job.id} className="transition-all hover:shadow-lg hover:border-primary/50 group">
               <Link href={`/careers/${job.id}`} className="block">
                <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row gap-6">
                        <div className="flex-shrink-0">
                           <Image
                            src={job.imageUrl}
                            alt={`${job.company} logo`}
                            width={80}
                            height={80}
                            className="rounded-lg object-cover border bg-background"
                            data-ai-hint={job.aiHint}
                            />
                        </div>
                        <div className="flex-grow">
                            <h3 className="font-headline text-xl font-bold group-hover:text-primary transition-colors">{job.title}</h3>
                            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-muted-foreground">
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
                        <div className="flex sm:flex-col items-center sm:justify-center gap-2 sm:ml-auto pt-4 sm:pt-0">
                            <Button onClick={(e) => handleApply(e, job.title)}>Apply Now</Button>
                            <Button variant="secondary" onClick={(e) => handleSave(e, job.title)}>Save</Button>
                        </div>
                    </div>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

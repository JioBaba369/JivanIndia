
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
import { Briefcase, MapPin, Search, Building, Bookmark } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import type { MouseEvent } from 'react';
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";

export const jobs: any[] = [];


export default function CareersPage() {
  const { toast } = useToast();
  const { user, saveJob, isJobSaved } = useAuth();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [jobType, setJobType] = useState('all');

  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            job.company.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesLocation = job.location.toLowerCase().includes(locationQuery.toLowerCase());
      const matchesType = jobType === 'all' || job.type === jobType;
      
      return matchesSearch && matchesLocation && matchesType;
    });
  }, [searchQuery, locationQuery, jobType]);


  const handleSave = (e: MouseEvent<HTMLButtonElement>, jobTitle: string, jobId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
         toast({
            title: "Please log in",
            description: "You must be logged in to save jobs.",
            variant: "destructive"
        });
        router.push("/login");
        return;
    }
    
    if (!isJobSaved(jobId)) {
        saveJob(jobId);
        toast({
          title: "Job Saved!",
          description: `The ${jobTitle} position has been saved to your profile.`,
        });
    } else {
        toast({
            title: "Already Saved",
            description: "This job is already in your saved list.",
        });
    }
  };


  return (
    <div className="flex flex-col">
      <section className="bg-gradient-to-b from-primary/10 via-background to-background py-20 text-center">
        <div className="container mx-auto px-4">
          <h1 className="font-headline text-4xl font-bold text-shadow-lg md:text-6xl">
            Find Your Next Opportunity
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Explore career openings within our vibrant community businesses.
          </p>
        </div>
      </section>

      <div className="sticky top-[65px] z-30 border-y bg-background/80 py-4 backdrop-blur-md">
        <div className="container mx-auto px-4">
          <Card className="shadow-md">
            <CardContent className="p-4">
               <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
                <div className="relative lg:col-span-2">
                  <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Job title, keyword, or company"
                    className="pl-10 text-base"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Location or 'Remote'"
                    className="pl-10 text-base"
                    value={locationQuery}
                    onChange={(e) => setLocationQuery(e.target.value)}
                  />
                </div>
                 <Select value={jobType} onValueChange={setJobType}>
                  <SelectTrigger className="text-base">
                    <div className="flex items-center gap-2">
                     <Briefcase className="h-4 w-4 text-muted-foreground" />
                     <SelectValue placeholder="Job Type" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Full-time">Full-time</SelectItem>
                    <SelectItem value="Part-time">Part-time</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                    <SelectItem value="Freelance">Freelance</SelectItem>
                    <SelectItem value="Internship">Internship</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <section className="container mx-auto px-4 py-12">
        <div className="space-y-6">
          {filteredJobs.length > 0 ? filteredJobs.map((job) => (
             <Card key={job.id} className="group transition-all hover:border-primary/50 hover:shadow-lg">
                <CardContent className="p-6">
                    <div className="flex flex-col items-center gap-6 sm:flex-row">
                        <div className="flex-shrink-0">
                           <Image
                            src={job.imageUrl}
                            alt={`${job.company} logo`}
                            width={80}
                            height={80}
                            className="rounded-lg border bg-background object-cover"
                            />
                        </div>
                        <div className="flex-grow">
                            <Link href={`/careers/${job.id}`} className="group">
                                <h3 className="font-headline text-xl font-bold transition-colors group-hover:text-primary">{job.title}</h3>
                            </Link>
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
                        <div className="flex items-center gap-2 pt-4 sm:ml-auto sm:pt-0">
                             <Button variant="secondary" onClick={(e) => handleSave(e, job.title, job.id)} disabled={isJobSaved(job.id)}>
                                <Bookmark className="mr-2 h-4 w-4"/>
                                {isJobSaved(job.id) ? "Saved" : "Save"}
                             </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
          )) : (
            <div className="rounded-lg border-2 border-dashed py-12 text-center">
                <p className="text-muted-foreground">No jobs found that match your criteria.</p>
                <Button variant="link" onClick={() => {
                    setSearchQuery('');
                    setLocationQuery('');
                    setJobType('all');
                }}>Clear Filters</Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

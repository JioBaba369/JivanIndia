
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MapPin, Search, PlusCircle, Briefcase, Building, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState, useMemo, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useJobs } from "@/hooks/use-jobs";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";

export default function CareersPage() {
  const { jobs } = useJobs();
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [jobType, setJobType] = useState('all');

  useEffect(() => {
    setSearchQuery(searchParams.get('q') || '');
  }, [searchParams]);

  const jobTypes = ['all', ...Array.from(new Set(jobs.map(j => j.type)))];

  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      const matchesSearch =
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.companyName.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesLocation = job.location.toLowerCase().includes(locationQuery.toLowerCase());
      
      const matchesType = jobType === 'all' || job.type === jobType;
      
      return matchesSearch && matchesLocation && matchesType;
    });
  }, [jobs, searchQuery, locationQuery, jobType]);

  return (
    <div className="container mx-auto py-12">
        <div className="space-y-4 mb-8">
            <h1 className="font-headline text-4xl font-bold">Career Opportunities</h1>
            <p className="text-lg text-muted-foreground">Find your next role in our community-focused job board.</p>
        </div>
        <div className="rounded-lg bg-card p-4 shadow-md">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                        className="pl-10 text-base md:text-sm"
                        placeholder="Search Jobs..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                        className="pl-10 text-base md:text-sm"
                        placeholder="Location (e.g. San Jose)"
                         value={locationQuery}
                        onChange={(e) => setLocationQuery(e.target.value)}
                    />
                </div>
                 <Select value={jobType} onValueChange={setJobType}>
                    <SelectTrigger>
                        <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                    {jobTypes.map((cat, index) => (
                        <SelectItem key={index} value={cat}>
                        {cat === 'all' ? 'All Job Types' : cat}
                        </SelectItem>
                    ))}
                    </SelectContent>
                </Select>
                 {user?.affiliation && (
                    <Button asChild>
                        <Link href="/careers/new">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Post a Job
                        </Link>
                    </Button>
                )}
            </div>
        </div>
        <div className="space-y-8 mt-8">
          {jobs.length === 0 ? (
            <div className="rounded-lg border-2 border-dashed py-16 text-center">
                <Briefcase className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="font-headline text-xl font-semibold mt-4">No Job Openings</h3>
                <p className="text-muted-foreground mt-2">There are currently no jobs posted. Check back soon for new opportunities!</p>
                {user?.affiliation && <Button asChild className="mt-4">
                    <Link href="/careers/new">Post a Job</Link>
                </Button>}
            </div>
          ) : filteredJobs.length > 0 ? filteredJobs.map((job) => (
            <Card key={job.id} className="transition-shadow hover:shadow-lg">
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row justify-between items-start">
                        <div>
                            <CardTitle className="font-headline text-2xl tracking-tight">{job.title}</CardTitle>
                            <div className="text-md text-muted-foreground">{job.companyName}</div>
                        </div>
                        <Badge variant="secondary">{job.type}</Badge>
                    </div>
                     <p className="text-muted-foreground line-clamp-2 mt-4">{job.description}</p>
                     <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                           <MapPin className="h-4 w-4 text-primary"/>
                           <span>{job.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                           <Briefcase className="h-4 w-4 text-primary"/>
                           <span>{job.type}</span>
                        </div>
                     </div>
                </CardContent>
                <div className="flex items-center p-6 pt-0">
                    <Button asChild variant="link" className="p-0 h-auto">
                        <a href={job.applicationUrl} target="_blank" rel="noopener noreferrer">
                            View Details <ArrowRight className="ml-2 h-4 w-4" />
                        </a>
                    </Button>
                </div>
            </Card>
          )) : (
             <div className="rounded-lg border-2 border-dashed py-16 text-center">
                <h3 className="font-headline text-xl font-semibold">No Matching Jobs Found</h3>
                <p className="text-muted-foreground mt-2">No jobs found that match your criteria. Check back soon or adjust your filters.</p>
                <Button variant="link" onClick={() => {
                    setSearchQuery('');
                    setLocationQuery('');
                    setJobType('all');
                }}>Clear Filters</Button>
            </div>
          )}
        </div>
    </div>
  );
}

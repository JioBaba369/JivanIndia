'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MapPin, Search, PlusCircle, Briefcase, Building, ArrowRight, MoreVertical } from "lucide-react";
import Link from "next/link";
import { useState, useMemo, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useJobs } from "@/hooks/use-jobs";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { Skeleton } from "@/components/ui/skeleton";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import ReportDialog from "@/components/feature/report-dialog";

export default function CareersPage() {
  const { jobs, isLoading } = useJobs();
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
  
  const JobSkeletons = () => (
    Array.from({ length: 4 }).map((_, i) => (
      <Card key={i}>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-start">
              <div>
                  <Skeleton className="h-7 w-64 mb-2" />
                  <Skeleton className="h-5 w-48" />
              </div>
              <Skeleton className="h-6 w-24 mt-2 md:mt-0" />
          </div>
           <Skeleton className="h-4 w-full mt-4" />
           <Skeleton className="h-4 w-5/6 mt-2" />
           <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-5 w-24" />
           </div>
          <div className="mt-6">
            <Skeleton className="h-8 w-28" />
          </div>
        </CardContent>
      </Card>
    ))
  );

  return (
    <div className="flex flex-col">
       <section className="bg-gradient-to-b from-primary/10 via-background to-background py-20 text-center">
        <div className="container mx-auto px-4">
          <h1 className="font-headline text-4xl font-bold text-shadow-lg md:text-6xl">
            Career Opportunities
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Find your next role in our community-focused job board.
          </p>
        </div>
      </section>

      <div className="sticky top-[65px] z-30 border-y bg-background/95 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="relative lg:col-span-2">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                        className="pl-10 text-base h-12"
                        placeholder="Search by job title or company..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                 <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                        className="pl-10 text-base h-12"
                        placeholder="Location..."
                         value={locationQuery}
                        onChange={(e) => setLocationQuery(e.target.value)}
                    />
                </div>
                 <Select value={jobType} onValueChange={setJobType}>
                    <SelectTrigger className="text-base h-12">
                        <SelectValue placeholder="All Job Types" />
                    </SelectTrigger>
                    <SelectContent>
                    {jobTypes.map((cat, index) => (
                        <SelectItem key={index} value={cat}>
                        {cat === 'all' ? 'All Job Types' : cat}
                        </SelectItem>
                    ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
      </div>
        
        <section className="container mx-auto px-4 py-12">
        <div className="space-y-8">
          {isLoading ? <JobSkeletons /> : (
            jobs.length === 0 ? (
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
                          <div className="flex items-center gap-2 mt-2 md:mt-0">
                             <Badge variant="secondary">{job.type}</Badge>
                             <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <MoreVertical size={20} />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <ReportDialog 
                                        contentId={job.id} 
                                        contentType="Career" 
                                        contentTitle={job.title} 
                                        triggerComponent={<DropdownMenuItem onSelect={(e) => e.preventDefault()}>Report Job</DropdownMenuItem>}
                                    />
                                </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
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
            )
          )}
        </div>
        </section>
    </div>
  );
}

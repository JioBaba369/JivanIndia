
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MapPin, Search, PlusCircle, Briefcase, Building, DollarSign } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useMemo } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { jobs } from "@/data/jobs";

export default function CareersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [jobType, setJobType] = useState('all');

  const jobTypes = useMemo(() => {
    const types = new Set(jobs.map(j => j.type));
    return ['all', ...Array.from(types)];
  }, []);

  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      const matchesSearch =
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.companyName.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesLocation = job.location.toLowerCase().includes(locationQuery.toLowerCase());
      
      const matchesType = jobType === 'all' || job.type === jobType;
      
      return matchesSearch && matchesLocation && matchesType;
    });
  }, [searchQuery, locationQuery, jobType]);

  return (
    <div className="flex flex-col">
      <section className="bg-gradient-to-b from-primary/10 via-background to-background py-20 text-center">
        <div className="container mx-auto px-4">
          <h1 className="font-headline text-4xl font-bold text-shadow-lg md:text-6xl">
            Career Opportunities
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Find your next role within our vibrant community of businesses and organizations.
          </p>
           <Button asChild size="lg" className="mt-8">
            <Link href="/careers/new">
              <PlusCircle className="mr-2 h-5 w-5"/>
              Post a Job Opening
            </Link>
          </Button>
        </div>
      </section>

      <div className="sticky top-[65px] z-30 border-y bg-background/80 py-4 backdrop-blur-md">
        <div className="container mx-auto px-4">
          <Card>
            <CardContent className="p-4">
               <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
                <div className="relative lg:col-span-2">
                  <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search by job title or company..."
                    className="pl-10 text-base"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                 <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Location"
                    className="pl-10 text-base"
                    value={locationQuery}
                    onChange={(e) => setLocationQuery(e.target.value)}
                  />
                </div>
                <Select value={jobType} onValueChange={setJobType}>
                  <SelectTrigger className="text-base">
                    <SelectValue placeholder="All Job Types" />
                  </SelectTrigger>
                  <SelectContent>
                    {jobTypes.map((type, index) => (
                      <SelectItem key={index} value={type}>
                        {type === 'all' ? 'All Job Types' : type}
                      </SelectItem>
                    ))}
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
            <Card key={job.id} className="transition-all hover:shadow-lg">
                <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4">
                        <div>
                            <Badge variant="secondary">{job.type}</Badge>
                            <h3 className="font-headline text-xl font-bold mt-2 hover:text-primary"><a href={job.applicationUrl} target="_blank" rel="noopener noreferrer">{job.title}</a></h3>
                            <div className="mt-2 flex flex-col md:flex-row md:items-center gap-x-4 gap-y-1 text-muted-foreground text-sm">
                                <div className="flex items-center gap-2"><Building className="h-4 w-4"/> {job.companyName}</div>
                                <div className="flex items-center gap-2"><MapPin className="h-4 w-4"/> {job.location}</div>
                                {job.salary && <div className="flex items-center gap-2"><DollarSign className="h-4 w-4"/> {job.salary}</div>}
                            </div>
                        </div>
                        <div className="flex items-center md:justify-end">
                            <Button asChild>
                                <a href={job.applicationUrl} target="_blank" rel="noopener noreferrer">
                                    <Briefcase className="mr-2"/>
                                    Apply Now
                                </a>
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
          )) : (
             <div className="rounded-lg border-2 border-dashed py-16 text-center">
                <p className="text-muted-foreground">No jobs found that match your criteria. Check back soon!</p>
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

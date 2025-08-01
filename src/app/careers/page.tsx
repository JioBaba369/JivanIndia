
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

export const jobs = [
  {
    id: "1",
    title: "Software Engineer",
    company: "InnovateTech Solutions",
    location: "San Francisco, CA",
    type: "Full-time",
    imageUrl: "https://placehold.co/100x100.png",
    aiHint: "tech company logo",
    postedAt: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
    details: {
      experience: "Mid-Senior Level",
      salary: "$120,000 - $160,000",
      imageUrl: "https://placehold.co/1200x400.png",
      aiHint: "modern office space",
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
    }
  },
  {
    id: "2",
    title: "Marketing Manager",
    company: "Desi Grocers Inc.",
    location: "New York, NY",
    type: "Full-time",
    imageUrl: "https://placehold.co/100x100.png",
    aiHint: "retail logo",
    postedAt: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(),
    details: {
        experience: "Senior Level",
        salary: "$90,000 - $110,000",
        imageUrl: "https://placehold.co/1200x400.png",
        aiHint: "marketing agency office",
        companyDescription: "Desi Grocers Inc. is a fast-growing retail chain specializing in authentic Indian grocery products. We are looking for a creative and results-driven Marketing Manager to lead our marketing efforts.",
        responsibilities: [ "Develop and execute marketing campaigns.", "Manage social media presence.", "Analyze market trends." ],
        qualifications: [ "Bachelor's degree in Marketing.", "5+ years of marketing experience.", "Strong understanding of the Indian consumer market." ],
        tags: ["Marketing", "Retail", "Social Media", "Campaign Management"]
    }
  },
  {
    id: "3",
    title: "Restaurant Chef",
    company: "Saffron Restaurant Group",
    location: "Chicago, IL",
    type: "Part-time",
    imageUrl: "https://placehold.co/100x100.png",
    aiHint: "restaurant logo",
    postedAt: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(),
    details: {
        experience: "Experienced",
        salary: "$25 - $35 / hour",
        imageUrl: "https://placehold.co/1200x400.png",
        aiHint: "restaurant kitchen",
        companyDescription: "Saffron Restaurant Group is looking for a talented chef to join our team. We specialize in authentic Indian cuisine and are committed to providing an exceptional dining experience.",
        responsibilities: [ "Prepare and cook menu items.", "Ensure kitchen cleanliness and safety.", "Manage inventory." ],
        qualifications: [ "Proven experience as a chef.", "Knowledge of Indian cuisine.", "Ability to work in a fast-paced environment." ],
        tags: ["Culinary", "Chef", "Indian Cuisine", "Part-time"]
    }
  },
  {
    id: "4",
    title: "Real Estate Agent",
    company: "Sahara Real Estate",
    location: "Houston, TX",
    type: "Contract",
    imageUrl: "https://placehold.co/100x100.png",
    aiHint: "real estate logo",
    postedAt: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString(),
     details: {
        experience: "All levels",
        salary: "Commission-based",
        imageUrl: "https://placehold.co/1200x400.png",
        aiHint: "suburban neighborhood",
        companyDescription: "Sahara Real Estate is a leading real estate firm in Houston, TX. We are seeking motivated real estate agents to join our growing team.",
        responsibilities: [ "Assist clients with buying and selling properties.", "Negotiate contracts.", "Host open houses." ],
        qualifications: [ "Real estate license required.", "Strong sales and negotiation skills.", "Excellent communication skills." ],
        tags: ["Real Estate", "Sales", "Contract", "Agent"]
    }
  },
  {
    id: "5",
    title: "Accountant",
    company: "Rohan Gupta, CPA",
    location: "San Jose, CA",
    type: "Full-time",
    imageUrl: "https://placehold.co/100x100.png",
    aiHint: "finance logo",
    postedAt: new Date(new Date().setDate(new Date().getDate() - 10)).toISOString(),
    details: {
        experience: "Junior-Mid Level",
        salary: "$70,000 - $90,000",
        imageUrl: "https://placehold.co/1200x400.png",
        aiHint: "accounting office",
        companyDescription: "Rohan Gupta, CPA is a full-service accounting firm providing tax, accounting, and advisory services to individuals and businesses.",
        responsibilities: [ "Prepare financial statements.", "Manage accounts payable and receivable.", "Assist with tax preparation." ],
        qualifications: [ "Bachelor's degree in Accounting.", "CPA or CPA candidate preferred.", "Proficiency in QuickBooks." ],
        tags: ["Accounting", "Finance", "CPA", "Taxes"]
    }
  },
  {
    id: "6",
    title: "Graphic Designer",
    company: "Aisha's Design Studio",
    location: "Remote",
    type: "Freelance",
    imageUrl: "https://placehold.co/100x100.png",
    aiHint: "design agency logo",
    postedAt: new Date(new Date().setDate(new Date().getDate() - 15)).toISOString(),
    details: {
        experience: "Mid-level",
        salary: "Project-based",
        imageUrl: "https://placehold.co/1200x400.png",
        aiHint: "designer workspace",
        companyDescription: "Aisha's Design Studio is a creative agency specializing in branding and digital design. We are looking for a talented freelance graphic designer to collaborate on various projects.",
        responsibilities: [ "Create visual concepts for websites and marketing materials.", "Design logos and branding packages.", "Collaborate with clients to understand their needs." ],
        qualifications: [ "Portfolio of design work.", "Proficiency in Adobe Creative Suite.", "Strong communication skills." ],
        tags: ["Graphic Design", "Freelance", "Remote", "Branding"]
    }
  },
];


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
          <h1 className="font-headline text-4xl font-bold md:text-6xl text-shadow-lg">
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
               <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
                <div className="relative lg:col-span-2">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="Job title, keyword, or company"
                    className="pl-10 text-base"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
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
             <Card key={job.id} className="transition-all hover:shadow-lg hover:border-primary/50 group">
                <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row gap-6 items-center">
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
                            <Link href={`/careers/${job.id}`} className="group">
                                <h3 className="font-headline text-xl font-bold group-hover:text-primary transition-colors">{job.title}</h3>
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
                        <div className="flex items-center gap-2 sm:ml-auto pt-4 sm:pt-0">
                             <Button variant="secondary" onClick={(e) => handleSave(e, job.title, job.id)} disabled={isJobSaved(job.id)}>
                                <Bookmark className="mr-2"/>
                                {isJobSaved(job.id) ? "Saved" : "Save"}
                             </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
          )) : (
            <div className="text-center py-12 border-2 border-dashed rounded-lg">
                <p className="text-muted-foreground">No jobs found matching your criteria.</p>
                <Button variant="link" onClick={() => {
                    setSearchQuery('');
                    setLocationQuery('');
                    setJobType('all');
                }}>Clear filters</Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

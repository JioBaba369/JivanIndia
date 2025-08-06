
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Heart, Target, Sprout, Handshake, Link as LinkIcon } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAbout } from "@/hooks/use-about";
import { getInitials } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export default function AboutUsPage() {
  const { aboutContent, isLoading } = useAbout();
  const { story, teamMembers } = aboutContent;

  const TeamSkeleton = () => (
    <Card className="border-none shadow-none text-center">
      <CardContent className="flex flex-col items-center">
        <Skeleton className="h-32 w-32 rounded-full mb-4" />
        <Skeleton className="h-7 w-40 mb-2" />
        <Skeleton className="h-5 w-24 mb-4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6 mt-2" />
      </CardContent>
    </Card>
  );

  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="relative bg-primary/10 py-20 md:py-32 text-center">
         <div className="absolute inset-0">
            <Image 
                src="https://images.unsplash.com/photo-1594917409245-8a245973c8b4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw0fHxJbmRpYW4lMjBmZXN0aXZhbCUyMGNyb3dkfGVufDB8fHx8MTc1NDE5NzQzNnww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="A vibrant Indian festival with a large, joyful crowd"
                fill
                className="object-cover opacity-10"
                priority
                data-ai-hint="festival crowd"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        </div>
        <div className="container mx-auto px-4 relative">
          <h1 className="font-headline text-4xl font-bold md:text-6xl text-shadow-lg">
            Empowering Those Who Do Good
          </h1>
          <p className="mx-auto mt-4 max-w-3xl text-lg text-foreground/80 text-shadow">
            Our mission is to provide the digital tools and community platform for non-profits to thrive and amplify their impact.
          </p>
        </div>
      </section>
      
      {/* Our Story Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
            <h2 className="font-headline text-3xl font-bold text-center mb-4">Our Story</h2>
            <p className="text-center text-muted-foreground text-lg mb-10">JivanIndia.co was born from a desire to support the pillars of our communities: the non-profit organizations that work tirelessly for the greater good.</p>
             {isLoading ? (
                <div className="space-y-4">
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-3/4" />
                </div>
            ) : (
                <div className="text-lg text-foreground/80 leading-relaxed space-y-4 text-left md:text-justify whitespace-pre-line">
                {story}
                </div>
            )}
        </div>
      </section>

      {/* Core Values Section */}
      <section className="bg-muted/40 py-16 md:py-24">
        <div className="container mx-auto px-4">
            <h2 className="font-headline text-3xl font-bold text-center mb-12">Our Core Values</h2>
            <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto text-center">
                <div className="flex flex-col items-center">
                    <Sprout className="h-10 w-10 text-primary mb-4" />
                    <h3 className="font-headline text-xl font-semibold">Empowerment</h3>
                    <p className="text-muted-foreground mt-2">Providing tools and platforms for non-profits to succeed.</p>
                </div>
                <div className="flex flex-col items-center">
                    <LinkIcon className="h-10 w-10 text-primary mb-4" />
                    <h3 className="font-headline text-xl font-semibold">Connection</h3>
                    <p className="text-muted-foreground mt-2">Connecting organizations with volunteers, donors, and partners.</p>
                </div>
                <div className="flex flex-col items-center">
                    <Heart className="h-10 w-10 text-primary mb-4" />
                    <h3 className="font-headline text-xl font-semibold">Impact</h3>
                    <p className="text-muted-foreground mt-2">Facilitating actions that lead to meaningful, positive change.</p>
                </div>
                 <div className="flex flex-col items-center">
                    <Handshake className="h-10 w-10 text-primary mb-4" />
                    <h3 className="font-headline text-xl font-semibold">Collaboration</h3>
                    <p className="text-muted-foreground mt-2">Fostering a network of support and shared purpose.</p>
                </div>
            </div>
        </div>
      </section>

       {/* Meet the Team Section */}
       <section className="py-16 md:py-24">
            <div className="container mx-auto px-4">
                <h2 className="font-headline text-3xl font-bold text-center mb-12">Meet the Team</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 max-w-6xl mx-auto">
                    {isLoading ? (
                        Array.from({length: 4}).map((_, i) => <TeamSkeleton key={i} />)
                    ) : teamMembers && teamMembers.length > 0 ? (
                        teamMembers.map((member) => (
                            <Card key={member.name} className="border-none shadow-none text-center">
                                <CardContent className="flex flex-col items-center p-0">
                                <Avatar className="h-32 w-32 mb-4 border-4 border-primary">
                                    <AvatarImage src={member.avatarUrl} alt={`Portrait of ${member.name}, ${member.role}`} data-ai-hint="portrait person" />
                                    <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                                </Avatar>
                                <h3 className="font-headline text-2xl font-semibold">{member.name}</h3>
                                <p className="font-semibold text-primary">{member.role}</p>
                                <p className="text-muted-foreground mt-2 text-sm">{member.bio}</p>
                                </CardContent>
                            </Card>
                        ))
                    ) : null}
                </div>
            </div>
        </section>
      
       {/* CTA Section */}
      <section className="bg-primary/10 py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
             <h2 className="font-headline text-3xl font-bold">Join Our Mission</h2>
             <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">Help us build the most comprehensive resource for the non-profit community. Register your organization, post a volunteer opportunity, or get in touch.</p>
             <div className="mt-8 flex justify-center gap-4">
                <Button asChild size="lg">
                    <Link href="/communities/new">Register Your Non-Profit</Link>
                </Button>
                <Button asChild variant="secondary" size="lg">
                    <Link href="/contact">Contact Us</Link>
                </Button>
             </div>
        </div>
      </section>

    </div>
  );
}

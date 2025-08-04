
import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Heart, Target, Sprout, Handshake, Link as LinkIcon } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const metadata: Metadata = {
  title: "About Us | JivanIndia.co",
  description: "Learn about the mission, vision, and team behind JivanIndia.co, the central hub for the Indian community.",
};

const teamMembers = [
    {
        name: "Priya Sharma",
        role: "Co-Founder & Community Lead",
        avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMHdvbWFufGVufDB8fHx8MTc1NDE5NzQzNnww&ixlib=rb-4.1.0&q=80&w=200",
        initials: "PS",
        bio: "With a background in community organizing, Priya is passionate about creating spaces where people feel they belong."
    },
    {
        name: "Rohan Gupta",
        role: "Co-Founder & Tech Lead",
        avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMG1hbnxlbnwwfHx8fDE3NTQxOTc0MzZ8MA&ixlib=rb-4.1.0&q=80&w=200",
        initials: "RG",
        bio: "Rohan is a software architect dedicated to building technology that empowers and connects communities."
    }
]

export default function AboutUsPage() {
  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="relative bg-primary/10 py-20 md:py-32 text-center">
         <div className="absolute inset-0">
            <Image 
                src="https://images.unsplash.com/photo-1594917409245-8a245973c8b4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw0fHxJbmRpYW4lMjBmZXN0aXZhbCUyMGNyb3dkfGVufDB8fHx8MTc1NDE5NzQzNnww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Indian festival crowd"
                fill
                className="object-cover opacity-10"
                priority
                data-ai-hint="festival crowd"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        </div>
        <div className="container mx-auto px-4 relative">
          <h1 className="font-headline text-4xl font-bold md:text-6xl text-shadow-lg">
            Connecting the Heart of a Community
          </h1>
          <p className="mx-auto mt-4 max-w-3xl text-lg text-foreground/80 text-shadow">
            Our mission is to create a central digital hub that supports, celebrates, and connects the Indian diaspora.
          </p>
        </div>
      </section>
      
      {/* Our Story Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
            <h2 className="font-headline text-3xl font-bold text-center mb-4">Our Story</h2>
            <p className="text-center text-muted-foreground text-lg mb-10">JivanIndia.co was born from a simple idea: to bridge the gap between finding information and feeling connected.</p>
            <div className="text-lg text-foreground/80 leading-relaxed space-y-4 text-left md:text-justify">
                <p>In our daily lives, we saw how challenging it could be to keep track of cultural events, find trusted local businesses, or connect with community organizations. Information was scattered across social media groups, outdated websites, and word-of-mouth, making it difficult to feel truly tapped into the pulse of the community.</p>
                <p>We envisioned a single, reliable, and beautiful platform where all this information could live, breathe, and be easily accessible to everyone. Our platform is more than just a directory; it's a dynamic ecosystem designed to empower every member of the Indian community. Whether you're looking to attend a local Diwali celebration, find a new job, support an Indian-owned business, or join a cultural group, JivanIndia.co is your starting point.</p>
            </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="bg-muted/40 py-16 md:py-24">
        <div className="container mx-auto px-4">
            <h2 className="font-headline text-3xl font-bold text-center mb-12">Our Core Values</h2>
            <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto text-center">
                <div className="flex flex-col items-center">
                    <Sprout className="h-10 w-10 text-primary mb-4" />
                    <h3 className="font-headline text-xl font-semibold">Community</h3>
                    <p className="text-muted-foreground mt-2">To foster a sense of belonging and mutual support.</p>
                </div>
                <div className="flex flex-col items-center">
                    <LinkIcon className="h-10 w-10 text-primary mb-4" />
                    <h3 className="font-headline text-xl font-semibold">Connection</h3>
                    <p className="text-muted-foreground mt-2">To bridge gaps and build meaningful relationships.</p>
                </div>
                <div className="flex flex-col items-center">
                    <Heart className="h-10 w-10 text-primary mb-4" />
                    <h3 className="font-headline text-xl font-semibold">Celebration</h3>
                    <p className="text-muted-foreground mt-2">To honor and share our rich cultural heritage.</p>
                </div>
                 <div className="flex flex-col items-center">
                    <Handshake className="h-10 w-10 text-primary mb-4" />
                    <h3 className="font-headline text-xl font-semibold">Opportunity</h3>
                    <p className="text-muted-foreground mt-2">To empower individuals and organizations to thrive.</p>
                </div>
            </div>
        </div>
      </section>

       {/* Meet the Team Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
            <h2 className="font-headline text-3xl font-bold text-center mb-12">Meet the Team</h2>
            <div className="grid md:grid-cols-2 gap-10 max-w-4xl mx-auto">
                {teamMembers.map((member) => (
                    <Card key={member.name} className="border-none shadow-none text-center">
                        <CardContent className="flex flex-col items-center">
                           <Avatar className="h-32 w-32 mb-4 border-4 border-primary">
                                <AvatarImage src={member.avatarUrl} alt={member.name} data-ai-hint="portrait person" />
                                <AvatarFallback>{member.initials}</AvatarFallback>
                            </Avatar>
                            <h3 className="font-headline text-2xl font-semibold">{member.name}</h3>
                            <p className="font-semibold text-primary">{member.role}</p>
                            <p className="text-muted-foreground mt-2">{member.bio}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
      </section>
      
       {/* CTA Section */}
      <section className="bg-primary/10 py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
             <h2 className="font-headline text-3xl font-bold">Join Our Journey</h2>
             <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">Help us build the most comprehensive resource for the Indian community. Register your organization, post an event, or get in touch.</p>
             <div className="mt-8 flex justify-center gap-4">
                <Button asChild size="lg">
                    <Link href="/communities/new">Register a Community</Link>
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

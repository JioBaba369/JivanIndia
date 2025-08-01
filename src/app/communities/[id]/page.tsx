
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Globe, Mail, MapPin, Phone, Users, Share2, Bookmark, BadgeCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from "@/hooks/use-auth";

// Mock data - in a real app, you'd fetch this based on the `params.id`
// A real implementation would fetch the specific org data based on the ID
const allCommunitiesData: { [key: string]: any } = {
  "1": {
    id: "1",
    name: "India Cultural Center",
    type: "Community Center",
    region: "San Francisco, CA",
    imageUrl: "https://images.unsplash.com/photo-1583445063483-392a2596e7e9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHxjb21tdW5pdHklMjBjZW50ZXJ8ZW58MHx8fHwxNzU0MDUxODgxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    aiHint: "community center",
    description: "Established in 1998, the India Cultural Center has grown to become a pivotal institution for the Indian diaspora in the San Francisco Bay Area. We offer a diverse range of programs including language classes (Hindi, Tamil, Telugu), classical and Bollywood dance instruction, music lessons, and yoga and meditation workshops. Our facilities include a large auditorium for performances, multiple classrooms, a library with a rich collection of Indian literature, and a community hall for private events. We are a non-profit organization run by a dedicated team of volunteers and staff, committed to serving the community's cultural, social, and educational needs.",
    membersCount: "5,000+ Members",
    founded: "1998",
    contactEmail: "contact@sfindiacc.org",
    website: "www.sfindiacc.org",
    phone: "555-123-4567",
    address: "123 Cultural Way, Fremont, CA 94539",
    tags: ["Culture", "Community", "Events", "Education", "Non-Profit"],
    isVerified: true,
  },
  "7": {
    id: "7",
    name: "Yash Raj Films",
    type: "Film Distributor",
    region: "Mumbai, IN",
    imageUrl: "https://images.unsplash.com/photo-1594904523995-18b0831c26ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxmaWxtJTIwc3R1ZGlvfGVufDB8fHx8fDE3NTQxOTc0MzZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    aiHint: "film studio",
    description: "Yash Raj Films (YRF) is one of India's largest and most successful film production and distribution companies. Founded by the late Yash Chopra, a veteran of the Indian film industry, in 1970, YRF has grown to be a powerhouse in Indian cinema. The company has produced some of the most iconic and highest-grossing Hindi films of all time. YRF also operates a state-of-the-art studio complex in Mumbai, which includes shooting stages, sound-recording studios, and post-production facilities.",
    membersCount: "N/A",
    founded: "1970",
    contactEmail: "helpdesk@yashrajfilms.com",
    website: "www.yashrajfilms.com",
    phone: "+91-22-3061-3500",
    address: "Veera Desai Road, Andheri West, Mumbai, Maharashtra 400053, India",
    tags: ["Film", "Entertainment", "Bollywood", "Production", "Distribution"],
    isVerified: true,
  },
  // Add other communities here...
};

// Mock data for related events
const relatedEvents = [
    {
        id: 1,
        title: "Annual Diwali Gala",
        date: "Nov 4, 2024",
        imageUrl: "https://images.unsplash.com/photo-1600813633279-997f77a83777?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxkaXdhbGklMjBmZXN0aXZhbHxlbnwwfHx8fDE3NTQxOTc0MzZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
        aiHint: "diwali gala"
    },
    {
        id: 2,
        title: "Holi Celebration in the Park",
        date: "Mar 23, 2025",
        imageUrl: "https://images.unsplash.com/photo-1518826767222-2262145719a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxob2xpJTIwZmVzdGl2YWx8ZW58MHx8fHwxNzU0MTk3NDM2fDA&ixlib=rb-4.1.0&q=80&w=1080",
        aiHint: "holi celebration"
    },
    {
        id: 3,
        title: "Summer Indian Food Festival",
        date: "Jul 15, 2024",
        imageUrl: "https://images.unsplash.com/photo-1589301760014-d929f39791e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxJbmRpYW4lMjBmb29kfGVufDB8fHx8fDE3NTQxOTc0MzZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
        aiHint: "indian food festival"
    }
]

export default function CommunityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params.id === 'string' ? params.id : '';
  const community = allCommunitiesData[id] || allCommunitiesData["1"];
  
  const { toast } = useToast();
  const { user, joinCommunity, leaveCommunity, isCommunityJoined } = useAuth();
  
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link Copied!",
      description: "Community profile link copied to clipboard.",
    });
  };

  const handleJoinToggle = () => {
    if (!user) {
        toast({
            title: "Please log in",
            description: "You need to be logged in to join communities.",
            variant: "destructive",
        });
        router.push("/login");
        return;
    }

    const currentlyJoined = isCommunityJoined(community.id);
    if (currentlyJoined) {
        leaveCommunity(community.id);
        toast({
            title: "Community Left",
            description: `You have left ${community.name}.`,
        });
    } else {
        joinCommunity(community.id);
        toast({
            title: "Community Joined!",
            description: `You have successfully joined ${community.name}.`,
        });
    }
  }

  const orgIsJoined = user ? isCommunityJoined(community.id) : false;

  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-12">
        <Card className="overflow-hidden">
          <div className="relative h-64 md:h-96 w-full">
            <Image
              src={community.imageUrl}
              alt={community.name}
              fill
              className="object-cover"
              data-ai-hint={community.aiHint}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6 md:p-8">
              <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold">
                {community.type}
              </span>
              <div className="flex items-center gap-2 mt-2">
                <h1 className="font-headline text-3xl md:text-5xl font-bold text-white">
                  {community.name}
                </h1>
                {community.isVerified && <BadgeCheck className="h-7 w-7 text-white fill-primary" />}
              </div>
            </div>
          </div>
          <CardContent className="p-6 md:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <h2 className="font-headline text-2xl font-semibold mb-4">
                  About Our Community
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {community.description}
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                    {community.tags.map((tag: string) => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                </div>
                 <div className="mt-10">
                   <h3 className="font-headline text-xl font-semibold mb-4">
                     Upcoming Events Hosted by Us
                   </h3>
                   <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {relatedEvents.map(event => (
                            <Link href={`/events/${event.id}`} key={event.id} className="group">
                                <Card className="overflow-hidden h-full">
                                    <div className="relative h-32 w-full">
                                        <Image src={event.imageUrl} alt={event.title} fill className="object-cover transition-transform group-hover:scale-105" data-ai-hint={event.aiHint}/>
                                    </div>
                                    <CardContent className="p-4">
                                        <h4 className="font-semibold group-hover:text-primary truncate">{event.title}</h4>
                                        <p className="text-sm text-muted-foreground">{event.date}</p>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                   </div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="flex flex-col gap-4">
                    <Button size="lg" variant={orgIsJoined ? "default" : "secondary"} className="w-full" onClick={handleJoinToggle}>
                        <Bookmark className="mr-2"/>
                        {orgIsJoined ? "Joined" : "Join Community"}
                    </Button>
                    <Button size="lg" variant="outline" className="w-full" onClick={handleShare}>
                        <Share2 className="mr-2"/>
                        Share Profile
                    </Button>
                </div>
                 <Card>
                  <CardContent className="p-4 space-y-4">
                     <div className="flex items-start gap-4">
                      <Users className="h-5 w-5 mt-1 text-primary flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold">Members</h4>
                        <p className="text-muted-foreground text-sm">{community.membersCount}</p>
                      </div>
                    </div>
                     <div className="flex items-start gap-4">
                      <Calendar className="h-5 w-5 mt-1 text-primary flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold">Founded</h4>
                        <p className="text-muted-foreground text-sm">{community.founded}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                 <Card>
                  <CardContent className="p-4 space-y-4">
                    <h4 className="font-semibold font-headline mb-2">Contact Information</h4>
                     <div className="flex items-start gap-4">
                      <MapPin className="h-5 w-5 mt-1 text-primary flex-shrink-0" />
                      <div>
                         <p className="text-muted-foreground text-sm">{community.address}</p>
                      </div>
                    </div>
                     <div className="flex items-start gap-4">
                      <Phone className="h-5 w-5 mt-1 text-primary flex-shrink-0" />
                      <div>
                         <p className="text-muted-foreground text-sm">{community.phone}</p>
                      </div>
                    </div>
                     <div className="flex items-start gap-4">
                      <Mail className="h-5 w-5 mt-1 text-primary flex-shrink-0" />
                      <div>
                         <p className="text-muted-foreground text-sm hover:text-primary"><a href={`mailto:${community.contactEmail}`}>{community.contactEmail}</a></p>
                      </div>
                    </div>
                     <div className="flex items-start gap-4">
                      <Globe className="h-5 w-5 mt-1 text-primary flex-shrink-0" />
                      <div>
                         <p className="text-muted-foreground text-sm hover:text-primary"><a href={`https://${community.website}`} target="_blank" rel="noopener noreferrer">{community.website}</a></p>
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
  );
}

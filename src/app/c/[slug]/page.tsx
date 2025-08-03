
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Globe, Mail, MapPin, Phone, Users, Share2, Bookmark, BadgeCheck, Twitter, Linkedin, Facebook } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from "@/hooks/use-auth";
import { useCommunities } from "@/hooks/use-communities";
import { useEvents } from "@/hooks/use-events";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function CommunityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = typeof params.slug === 'string' ? params.slug : '';
  const { getCommunityBySlug, getInitials } = useCommunities();
  const community = getCommunityBySlug(slug);
  const { events } = useEvents();

  const relatedEvents = community ? events.filter(event => event.organizerId === community.id && event.status === 'Approved').slice(0, 3) : [];
  
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
    if (!user || !community) {
        toast({
            title: "Please log in",
            description: "You need to be logged in to join communities.",
            variant: "destructive",
        });
        if (!user) router.push("/login");
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

  if (!community) {
    return (
        <div className="container mx-auto px-4 py-12 text-center">
            <h1 className="font-headline text-3xl font-bold">Community Not Found</h1>
            <p className="text-muted-foreground">The community you are looking for does not exist or may have been removed.</p>
            <Button asChild className="mt-6">
                <Link href="/communities">Back to Communities</Link>
            </Button>
        </div>
    );
  }

  const orgIsJoined = user ? isCommunityJoined(community.id) : false;

  return (
    <div className="bg-background">
        <div className="relative h-64 md:h-80 w-full">
            <Image
                src={community.imageUrl}
                alt={`${community.name} backdrop`}
                fill
                className="object-cover"
                priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        </div>

      <div className="container mx-auto px-4 pb-12">
        <Card className="overflow-hidden -mt-24 relative z-10 shadow-xl">
           <CardContent className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0 text-center md:text-left">
                     <Avatar className="h-32 w-32 border-4 border-background bg-muted shadow-lg mx-auto md:mx-0">
                        <AvatarImage src={community.logoUrl} alt={community.name} />
                        <AvatarFallback className="text-4xl font-headline">{getInitials(community.name)}</AvatarFallback>
                    </Avatar>
                </div>
                <div className="flex-grow text-center md:text-left">
                    <Badge variant="secondary">{community.type}</Badge>
                    <div className="flex items-center justify-center md:justify-start gap-2 mt-2">
                        <h1 className="font-headline text-3xl md:text-5xl font-bold">
                            {community.name}
                        </h1>
                        {community.isVerified && <BadgeCheck className="h-7 w-7 text-primary fill-primary" />}
                    </div>
                     <p className="text-muted-foreground mt-2">{community.description}</p>
                     <div className="mt-4 flex justify-center md:justify-start items-center gap-2">
                        {community.socialMedia?.twitter && <Button variant="outline" size="icon" asChild><Link href={community.socialMedia.twitter} target="_blank"><Twitter/></Link></Button>}
                        {community.socialMedia?.linkedin && <Button variant="outline" size="icon" asChild><Link href={community.socialMedia.linkedin} target="_blank"><Linkedin/></Link></Button>}
                        {community.socialMedia?.facebook && <Button variant="outline" size="icon" asChild><Link href={community.socialMedia.facebook} target="_blank"><Facebook/></Link></Button>}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
              <div className="lg:col-span-2">
                <h2 className="font-headline text-2xl font-semibold mb-4">
                  About Our Community
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {community.fullDescription}
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                    {community.tags.map((tag: string) => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                </div>
                 {relatedEvents.length > 0 && <div className="mt-10">
                   <h3 className="font-headline text-xl font-semibold mb-4">
                     Upcoming Events Hosted by Us
                   </h3>
                   <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {relatedEvents.map(event => (
                            <Link href={`/events/${event.id}`} key={event.id} className="group">
                                <Card className="overflow-hidden h-full">
                                    <div className="relative h-32 w-full">
                                        <Image src={event.imageUrl} alt={event.title} fill className="object-cover transition-transform group-hover:scale-105"/>
                                    </div>
                                    <CardContent className="p-4">
                                        <h4 className="font-semibold group-hover:text-primary truncate">{event.title}</h4>
                                        <p className="text-sm text-muted-foreground">{new Date(event.startDateTime).toLocaleDateString()}</p>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                   </div>
                </div>}
              </div>
              <div className="space-y-6">
                <div className="flex flex-col gap-4">
                    <Button size="lg" variant={orgIsJoined ? "destructive" : "default"} className="w-full" onClick={handleJoinToggle}>
                        <Bookmark className="mr-2 h-4 w-4"/>
                        {orgIsJoined ? "Leave Community" : "Join Community"}
                    </Button>
                    <Button size="lg" variant="outline" className="w-full" onClick={handleShare}>
                        <Share2 className="mr-2 h-4 w-4"/>
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

'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Globe, Mail, MapPin, Phone, Users, Share2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

// Mock data - in a real app, you'd fetch this based on the `params.id`
const organizationDetails = {
  id: "1",
  name: "India Cultural Center",
  category: "Community Center",
  location: "San Francisco, CA",
  imageUrl: "https://images.unsplash.com/photo-1583445063483-392a2596e7e9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHxjb21tdW5pdHklMjBjZW50ZXJ8ZW58MHx8fHwxNzU0MDUxODgxfDA&ixlib=rb-4.1.0&q=80&w=1080",
  aiHint: "community center",
  description:
    "The India Cultural Center is the heart of the Bay Area's Indian community, offering a vibrant space for cultural events, educational classes, and comprehensive support services. Our mission is to preserve and promote the rich tapestry of Indian culture for future generations while fostering a strong sense of community and belonging among the diaspora. We host major festivals, workshops, and provide resources for newcomers.",
  longDescription: "Established in 1998, the India Cultural Center has grown to become a pivotal institution for the Indian diaspora in the San Francisco Bay Area. We offer a diverse range of programs including language classes (Hindi, Tamil, Telugu), classical and Bollywood dance instruction, music lessons, and yoga and meditation workshops. Our facilities include a large auditorium for performances, multiple classrooms, a library with a rich collection of Indian literature, and a community hall for private events. We are a non-profit organization run by a dedicated team of volunteers and staff, committed to serving the community's cultural, social, and educational needs.",
  members: "5,000+ Members",
  founded: "1998",
  contact: {
    address: "123 Cultural Way, Fremont, CA 94539",
    phone: "555-123-4567",
    email: "contact@sfindiacc.org",
    website: "www.sfindiacc.org",
  },
  tags: ["Culture", "Community", "Events", "Education", "Non-Profit"]
};

// Mock data for related events
const relatedEvents = [
    {
        id: 1,
        title: "Annual Diwali Gala",
        date: "Nov 4, 2024",
        imageUrl: "https://placehold.co/600x400.png",
        aiHint: "diwali gala"
    },
    {
        id: 2,
        title: "Holi Celebration in the Park",
        date: "Mar 23, 2025",
        imageUrl: "https://placehold.co/600x400.png",
        aiHint: "holi celebration"
    },
    {
        id: 3,
        title: "Summer Indian Food Festival",
        date: "Jul 15, 2024",
        imageUrl: "https://placehold.co/600x400.png",
        aiHint: "indian food festival"
    }
]

export default function OrganizationDetailPage({ params }: { params: { id: string } }) {
  // You can use params.id to fetch the correct organization data from your backend
  const org = organizationDetails;
  const { toast } = useToast();
  const [isJoined, setIsJoined] = useState(false);

  const handleJoin = () => {
    setIsJoined(true);
    toast({
      title: "Successfully Joined!",
      description: `You are now a member of ${org.name}.`,
    });
  };

  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-12">
        <Card className="overflow-hidden">
          <div className="relative h-64 md:h-96 w-full">
            <Image
              src={org.imageUrl}
              alt={org.name}
              fill
              className="object-cover"
              data-ai-hint={org.aiHint}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6 md:p-8">
              <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold">
                {org.category}
              </span>
              <h1 className="font-headline text-3xl md:text-5xl font-bold text-white mt-2">
                {org.name}
              </h1>
            </div>
          </div>
          <CardContent className="p-6 md:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <h2 className="font-headline text-2xl font-semibold mb-4">
                  About Our Organization
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {org.longDescription}
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                    {org.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
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
                    <Button size="lg" className="w-full" onClick={handleJoin} disabled={isJoined}>
                        <Users className="mr-2"/>
                        {isJoined ? "Joined" : "Join Now"}
                    </Button>
                    <Button size="lg" variant="secondary" className="w-full">
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
                        <p className="text-muted-foreground text-sm">{org.members}</p>
                      </div>
                    </div>
                     <div className="flex items-start gap-4">
                      <Calendar className="h-5 w-5 mt-1 text-primary flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold">Founded</h4>
                        <p className="text-muted-foreground text-sm">{org.founded}</p>
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
                         <p className="text-muted-foreground text-sm">{org.contact.address}</p>
                      </div>
                    </div>
                     <div className="flex items-start gap-4">
                      <Phone className="h-5 w-5 mt-1 text-primary flex-shrink-0" />
                      <div>
                         <p className="text-muted-foreground text-sm">{org.contact.phone}</p>
                      </div>
                    </div>
                     <div className="flex items-start gap-4">
                      <Mail className="h-5 w-5 mt-1 text-primary flex-shrink-0" />
                      <div>
                         <p className="text-muted-foreground text-sm hover:text-primary"><a href={`mailto:${org.contact.email}`}>{org.contact.email}</a></p>
                      </div>
                    </div>
                     <div className="flex items-start gap-4">
                      <Globe className="h-5 w-5 mt-1 text-primary flex-shrink-0" />
                      <div>
                         <p className="text-muted-foreground text-sm hover:text-primary"><a href={`https://www.${org.contact.website}`} target="_blank" rel="noopener noreferrer">{org.contact.website}</a></p>
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

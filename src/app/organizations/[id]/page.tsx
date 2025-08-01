
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Globe, Mail, MapPin, Phone, Users, Share2, Bookmark } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from "@/hooks/use-auth";

// Mock data - in a real app, you'd fetch this based on the `params.id`
// A real implementation would fetch the specific org data based on the ID
const allOrganizationsData: { [key: string]: any } = {
  "1": {
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
  },
  "7": {
     id: "7",
    name: "Yash Raj Films",
    category: "Film Distributor",
    location: "Mumbai, IN",
    imageUrl: "https://placehold.co/1200x400.png",
    aiHint: "film studio",
    description: "A leading film production and distribution company, bringing Bollywood cinema to the world.",
    longDescription: "Yash Raj Films (YRF) is one of India's largest and most successful film production and distribution companies. Founded by the late Yash Chopra, a veteran of the Indian film industry, in 1970, YRF has grown to be a powerhouse in Indian cinema. The company has produced some of the most iconic and highest-grossing Hindi films of all time. YRF also operates a state-of-the-art studio complex in Mumbai, which includes shooting stages, sound-recording studios, and post-production facilities.",
    members: "N/A",
    founded: "1970",
    contact: {
      address: "Veera Desai Road, Andheri West, Mumbai, Maharashtra 400053, India",
      phone: "+91-22-3061-3500",
      email: "helpdesk@yashrajfilms.com",
      website: "www.yashrajfilms.com",
    },
    tags: ["Film", "Entertainment", "Bollywood", "Production", "Distribution"]
  },
  // Add other organizations here...
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

export default function OrganizationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params.id === 'string' ? params.id : '';
  const org = allOrganizationsData[id] || allOrganizationsData["1"];
  
  const { toast } = useToast();
  const { user, saveOrg, unsaveOrg, isOrgSaved } = useAuth();
  
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link Copied!",
      description: "Organization profile link copied to clipboard.",
    });
  };

  const handleSaveToggle = () => {
    if (!user) {
        toast({
            title: "Please log in",
            description: "You need to be logged in to save organizations.",
            variant: "destructive",
        });
        router.push("/login");
        return;
    }

    const currentlySaved = isOrgSaved(org.id);
    if (currentlySaved) {
        unsaveOrg(org.id);
        toast({
            title: "Organization Unsaved",
            description: `${org.name} has been removed from your saved list.`,
        });
    } else {
        saveOrg(org.id);
        toast({
            title: "Organization Saved!",
            description: `${org.name} has been saved to your profile.`,
        });
    }
  }

  const orgIsSaved = user ? isOrgSaved(org.id) : false;

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
                    {org.tags.map((tag: string) => <Badge key={tag} variant="secondary">{tag}</Badge>)}
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
                    <Button size="lg" variant={orgIsSaved ? "default" : "secondary"} className="w-full" onClick={handleSaveToggle}>
                        <Bookmark className="mr-2"/>
                        {orgIsSaved ? "Organization Saved" : "Save Organization"}
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

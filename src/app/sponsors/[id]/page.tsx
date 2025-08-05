
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Globe, Mail, MapPin, Phone, Share2, Handshake, X, Linkedin, Facebook, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEvents } from "@/hooks/use-events";
import { useSponsors } from "@/hooks/use-sponsors";
import { formatUrl } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";


export default function SponsorDetailPage() {
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : '';
  const { getSponsorById, isLoading } = useSponsors();
  const sponsor = getSponsorById(id);

  const { events } = useEvents();
  const { toast } = useToast();

  const sponsoredEvents = events.filter(event => sponsor?.eventsSponsored.some(e => e.eventId === event.id) && event.status === 'Approved');
  
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link Copied!",
      description: "Sponsor profile link copied to clipboard.",
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center flex items-center justify-center min-h-[calc(100vh-128px)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!sponsor) {
    return (
        <div className="container mx-auto px-4 py-12 text-center">
            <h1 className="font-headline text-3xl font-bold">Sponsor Not Found</h1>
            <p className="mt-4 text-muted-foreground">The sponsor you are looking for does not exist or may have been removed.</p>
            <Button asChild className="mt-6">
                <Link href="/sponsors">Back to Sponsors</Link>
            </Button>
        </div>
    );
  }

  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-12">
        <Card className="overflow-hidden">
          <div className="relative h-64 md:h-80 w-full bg-muted flex items-center justify-center p-8">
            <Image
              src={sponsor.logoUrl}
              alt={`${sponsor.name} logo`}
              width={400}
              height={200}
              className="object-contain"
              data-ai-hint="sponsor logo"
            />
          </div>
          <CardContent className="p-6 md:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                 <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex-grow">
                        <Badge variant={sponsor.tier === 'Platinum' ? 'default' : 'secondary'}>
                            {sponsor.tier} Sponsor
                        </Badge>
                        <h1 className="font-headline text-3xl md:text-5xl font-bold mt-2">
                        {sponsor.name}
                        </h1>
                        <p className="text-lg text-muted-foreground mt-1">{sponsor.industry}</p>
                    </div>
                    <div className="flex items-center gap-2 mt-4 md:mt-0">
                        {sponsor.socialMedia.twitter && <Button variant="outline" size="icon" asChild><a href={formatUrl(sponsor.socialMedia.twitter)} target="_blank" rel="noopener noreferrer"><X className="h-4 w-4"/></a></Button>}
                        {sponsor.socialMedia.linkedin && <Button variant="outline" size="icon" asChild><a href={formatUrl(sponsor.socialMedia.linkedin)} target="_blank" rel="noopener noreferrer"><Linkedin/></a></Button>}
                        {sponsor.socialMedia.facebook && <Button variant="outline" size="icon" asChild><a href={formatUrl(sponsor.socialMedia.facebook)} target="_blank" rel="noopener noreferrer"><Facebook/></a></Button>}
                    </div>
                </div>

                <h2 className="font-headline text-2xl font-semibold mt-8 mb-4">
                  About {sponsor.name}
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {sponsor.fullDescription}
                </p>

                 {sponsoredEvents.length > 0 && <div className="mt-10">
                   <h3 className="font-headline text-xl font-semibold mb-4">
                     Events Sponsored by {sponsor.name}
                   </h3>
                   <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {sponsoredEvents.map(event => (
                            <Link href={`/events/${event.id}`} key={event.id} className="group">
                                <Card className="overflow-hidden h-full">
                                    <div className="relative h-32 w-full">
                                        <Image src={event.imageUrl} alt={event.title} fill className="object-cover transition-transform group-hover:scale-105" data-ai-hint="event photo"/>
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
                    <Button size="lg" variant="outline" className="w-full" onClick={handleShare}>
                        <Share2 className="mr-2 h-4 w-4"/>
                        Share Profile
                    </Button>
                </div>
                 <Card>
                  <CardContent className="p-4 space-y-4">
                    <h4 className="font-semibold font-headline mb-2">Contact Information</h4>
                     <div className="flex items-start gap-4">
                      <MapPin className="h-5 w-5 mt-1 text-primary flex-shrink-0" />
                      <div>
                         <p className="text-muted-foreground text-sm">{sponsor.address}</p>
                      </div>
                    </div>
                     <div className="flex items-start gap-4">
                      <Phone className="h-5 w-5 mt-1 text-primary flex-shrink-0" />
                      <div>
                         <p className="text-muted-foreground text-sm">{sponsor.contactPhone}</p>
                      </div>
                    </div>
                     <div className="flex items-start gap-4">
                      <Mail className="h-5 w-5 mt-1 text-primary flex-shrink-0" />
                      <div>
                         <p className="text-muted-foreground text-sm hover:text-primary"><a href={`mailto:${sponsor.contactEmail}`}>{sponsor.contactEmail}</a></p>
                      </div>
                    </div>
                     <div className="flex items-start gap-4">
                      <Globe className="h-5 w-5 mt-1 text-primary flex-shrink-0" />
                      <div>
                         <p className="text-muted-foreground text-sm hover:text-primary"><a href={formatUrl(sponsor.website)} target="_blank" rel="noopener noreferrer">{sponsor.website}</a></p>
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

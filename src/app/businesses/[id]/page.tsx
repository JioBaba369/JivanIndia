'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Globe, Mail, MapPin, Phone, Share2, Star, Bookmark, BadgeCheck, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useParams, useRouter } from "next/navigation";
import { useEvents } from "@/hooks/use-events";
import { useCommunities } from "@/hooks/use-communities";
import { useBusinesses } from "@/hooks/use-businesses";

export default function BusinessDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params.id === 'string' ? params.id : '';
  const { businesses, isLoading: isLoadingBusinesses } = useBusinesses();
  const business = businesses.find(p => p.id === id);
  
  const { events } = useEvents();
  const { getCommunityById } = useCommunities();

  const associatedCommunity = business?.associatedCommunityId ? getCommunityById(business.associatedCommunityId) : null;
  
  const relatedEvents = associatedCommunity ? events.filter(event => event.organizerId === associatedCommunity.id && event.status === 'Approved').slice(0, 3) : [];

  const { toast } = useToast();
  const { user, saveBusiness, unsaveBusiness, isBusinessSaved } = useAuth();
  
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link Copied!",
      description: "Listing profile link copied to clipboard.",
    });
  };

  const handleSaveToggle = () => {
    if (!user || !business) {
        toast({
            title: "Please log in",
            description: "You need to be logged in to save listings.",
            variant: "destructive",
        });
        if (!user) router.push("/login");
        return;
    }

    const currentlySaved = isBusinessSaved(business.id);
    if (currentlySaved) {
        unsaveBusiness(business.id);
        toast({
            title: "Listing Unsaved",
            description: `${business.name} has been removed from your saved list.`,
        });
    } else {
        saveBusiness(business.id);
        toast({
            title: "Listing Saved!",
            description: `${business.name} has been saved to your profile.`,
        });
    }
  }

  if (isLoadingBusinesses) {
    return (
      <div className="container mx-auto px-4 py-12 text-center flex items-center justify-center min-h-[calc(100vh-128px)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!business) {
    return (
        <div className="container mx-auto px-4 py-12 text-center">
            <h1 className="font-headline text-3xl font-bold">Listing Not Found</h1>
            <p className="mt-4 text-muted-foreground">The listing you are looking for does not exist or may have been removed.</p>
            <Button asChild className="mt-6">
                <Link href="/businesses">Back to Businesses</Link>
            </Button>
        </div>
    );
  }

  const businessIsSaved = user ? isBusinessSaved(business.id) : false;

  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-12">
        <Card className="overflow-hidden">
          <div className="relative h-64 md:h-96 w-full">
            <Image
              src={business.imageUrl}
              alt={business.name}
              fill
              className="object-cover"
              data-ai-hint="service photo"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6 md:p-8">
              <Badge variant="secondary">
                {business.category}
              </Badge>
              <div className="flex items-center gap-2 mt-2">
                <h1 className="font-headline text-3xl md:text-5xl font-bold text-white">
                  {business.name}
                </h1>
                {business.isVerified && <BadgeCheck className="h-7 w-7 text-white fill-primary" />}
              </div>
               <div className="mt-2 flex items-center gap-2 text-yellow-400">
                    <Star className="h-5 w-5 fill-current" />
                    <span className="font-bold text-lg text-white">{business.rating.toFixed(1)}</span>
                    <span className="text-sm text-white/80">({business.reviewCount} reviews)</span>
                </div>
            </div>
          </div>
          <CardContent className="p-6 md:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <h2 className="font-headline text-2xl font-semibold mb-4">
                  About {business.name}
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {business.fullDescription}
                </p>

                <h3 className="font-headline text-xl font-semibold mt-8 mb-4 border-b pb-2">Services Offered</h3>
                <div className="flex flex-wrap gap-2">
                    {business.services.map((service: string) => <Badge key={service} variant="outline">{service}</Badge>)}
                </div>

                {associatedCommunity && (
                <div className="mt-10">
                   <h3 className="font-headline text-xl font-semibold mb-4">
                     Associated with
                   </h3>
                   <Card>
                       <CardContent className="p-4">
                            <Link href={`/c/${associatedCommunity.slug}`} className="group">
                               <p className="font-semibold group-hover:text-primary">{associatedCommunity.name}</p>
                               <p className="text-sm text-muted-foreground">View community profile</p>
                            </Link>
                       </CardContent>
                   </Card>
                </div>
                )}

                 {relatedEvents.length > 0 && <div className="mt-10">
                   <h3 className="font-headline text-xl font-semibold mb-4">
                     Upcoming Events Hosted by their Community
                   </h3>
                   <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {relatedEvents.map(event => (
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
                    <Button size="lg" variant={businessIsSaved ? "default" : "secondary"} className="w-full" onClick={handleSaveToggle}>
                        <Bookmark className="mr-2 h-4 w-4"/>
                        {businessIsSaved ? "Saved" : "Save Listing"}
                    </Button>
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
                         <p className="text-muted-foreground text-sm">{business.contact.address}</p>
                      </div>
                    </div>
                     <div className="flex items-start gap-4">
                      <Phone className="h-5 w-5 mt-1 text-primary flex-shrink-0" />
                      <div>
                         <p className="text-muted-foreground text-sm">{business.contact.phone}</p>
                      </div>
                    </div>
                     <div className="flex items-start gap-4">
                      <Mail className="h-5 w-5 mt-1 text-primary flex-shrink-0" />
                      <div>
                         <p className="text-muted-foreground text-sm hover:text-primary"><a href={`mailto:${business.contact.email}`}>{business.contact.email}</a></p>
                      </div>
                    </div>
                     <div className="flex items-start gap-4">
                      <Globe className="h-5 w-5 mt-1 text-primary flex-shrink-0" />
                      <div>
                         <p className="text-muted-foreground text-sm hover:text-primary"><a href={`https://${business.contact.website}`} target="_blank" rel="noopener noreferrer">{business.contact.website}</a></p>
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


'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Globe, Mail, MapPin, Phone, Share2, Star, Bookmark, BadgeCheck, Loader2, Edit, X, Facebook, Linkedin } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useParams, useRouter } from "next/navigation";
import { useEvents } from "@/hooks/use-events";
import { useCommunities } from "@/hooks/use-communities";
import { useBusinesses } from "@/hooks/use-businesses";
import ReportDialog from "@/components/feature/report-dialog";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials, formatUrl } from "@/lib/utils";

export default function BusinessDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params.id === 'string' ? params.id : '';
  const { businesses, isLoading: isLoadingBusinesses, deleteBusiness } = useBusinesses();
  const business = businesses.find(p => p.id === id);
  
  const { events } = useEvents();
  const { getCommunityById } = useCommunities();
  const { user } = useAuth();
  const { toast } = useToast();

  const relatedEvents = []; // Business pages no longer link to community events
  
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

    // This functionality requires `saveItem` and `isItemSaved` in useAuth, which is not implemented for businesses yet
    toast({ title: 'Coming Soon!', description: 'Saving businesses will be available soon.' });
  }
  
  const handleDelete = async () => {
      if(!business) return;
      try {
          await deleteBusiness(business.id);
          toast({
              title: "Business Deleted",
              description: `${business.name} has been removed.`,
          });
          router.push('/businesses');
      } catch (e) {
          toast({
              title: "Error",
              description: "Failed to delete business.",
              variant: "destructive",
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

  const businessIsSaved = user ? user.savedBusinesses?.includes(business.id) : false;
  const canEdit = user && (user.roles.includes('admin') || user.uid === business.ownerId);

  return (
    <div className="bg-background">
       <div className="relative h-64 md:h-80 w-full bg-muted">
            {business.bannerUrl ? (
                <Image src={business.bannerUrl} alt={`${business.name} banner`} fill className="object-cover" data-ai-hint="business banner" />
            ) : (
                <div className="absolute inset-0 bg-gradient-to-t from-primary/10 via-background to-background" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
             <div className="absolute top-4 right-4 flex gap-2">
                 {canEdit && (
                    <Button variant="secondary" asChild>
                        <Link href={`/businesses/${business.id}/edit`}>
                            <Edit className="mr-2 h-4 w-4" /> Edit
                        </Link>
                    </Button>
                 )}
                <ReportDialog contentId={business.id} contentType="Business" contentTitle={business.name} triggerVariant="secondary" />
            </div>
        </div>

      <div className="container mx-auto px-4 pb-12 -mt-24 relative z-10">
        <Card className="overflow-hidden shadow-xl">
          <CardContent className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0 text-center md:text-left">
                     <Avatar className="relative h-32 w-32 border-4 border-background bg-muted shadow-lg mx-auto md:mx-0">
                        <AvatarImage src={business.logoUrl} alt={business.name} data-ai-hint="business logo" />
                        <AvatarFallback className="text-4xl font-headline">{getInitials(business.name)}</AvatarFallback>
                    </Avatar>
                </div>
                <div className="flex-grow text-center md:text-left">
                     <Badge variant="secondary">
                        {business.category}
                      </Badge>
                      <div className="flex items-center gap-2 mt-2 justify-center md:justify-start">
                        <h1 className="font-headline text-3xl md:text-5xl font-bold">
                          {business.name}
                        </h1>
                        {business.isVerified && <BadgeCheck className="h-7 w-7 text-primary fill-primary" />}
                      </div>
                       <div className="mt-2 flex items-center gap-2 text-yellow-400 justify-center md:justify-start">
                            <Star className="h-5 w-5 fill-current" />
                            <span className="font-bold text-lg">{business.rating.toFixed(1)}</span>
                            <span className="text-sm text-muted-foreground">({business.reviewCount} reviews)</span>
                        </div>
                </div>
                 <div className="mt-4 flex justify-center md:justify-start items-center gap-2">
                    {business.socialMedia?.twitter && <Button variant="outline" size="icon" asChild><Link href={business.socialMedia.twitter} target="_blank"><X className="h-4 w-4"/></Link></Button>}
                    {business.socialMedia?.linkedin && <Button variant="outline" size="icon" asChild><Link href={business.socialMedia.linkedin} target="_blank"><Linkedin/></Link></Button>}
                    {business.socialMedia?.facebook && <Button variant="outline" size="icon" asChild><Link href={business.socialMedia.facebook} target="_blank"><Facebook/></Link></Button>}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
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
                 <h3 className="font-headline text-xl font-semibold mt-8 mb-4 border-b pb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                    {business.tags?.map((tag: string) => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                </div>

                {relatedEvents.length > 0 && <div className="mt-10">
                   <h3 className="font-headline text-xl font-semibold mb-4">
                     Upcoming Events
                   </h3>
                   <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {relatedEvents.map(event => (
                            <Link href={`/events/${event.id}`} key={event.id} className="group">
                                <Card className="overflow-hidden h-full">
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
                         <p className="text-muted-foreground text-sm">{business.location.city}, {business.location.state}, {business.location.country}</p>
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
                         <p className="text-muted-foreground text-sm hover:text-primary"><a href={formatUrl(business.contact.website)} target="_blank" rel="noopener noreferrer">{business.contact.website}</a></p>
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

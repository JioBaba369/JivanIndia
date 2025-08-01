
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Tag, Building, Share2, Globe, MapPin, Bookmark } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";

// Mock data - in a real app, you'd fetch this based on the `params.id`
const dealDetails = {
    id: "1",
    title: "20% Off Lunch Buffet",
    business: "Taste of India Restaurant",
    category: "Food",
    imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxJbmRpYW4lMjBidWZmZXR8ZW58MHx8fHwxNzU0MDQyNjA0fDA&ixlib=rb-4.1.0&q=80&w=1080",
    aiHint: "indian buffet",
    description: "Enjoy a delicious and authentic Indian lunch buffet at a 20% discount. Our buffet features a wide variety of vegetarian and non-vegetarian dishes, including tandoori chicken, paneer makhani, biryani, and fresh naan bread. A perfect way to sample the best of Indian cuisine.",
    terms: "Offer valid Monday to Friday, 11:30 AM to 2:30 PM. Not valid on holidays. Cannot be combined with other offers. Mention this deal to redeem.",
    expires: "December 31, 2024",
    businessWebsite: "www.tasteofindiala.com", 
    businessLocation: "Los Angeles, CA",
    businessId: "1", // Link to an organization profile if available
};


export default function DealDetailPage({ params }: { params: { id: string } }) {
  // You can use params.id to fetch the correct deal data from your backend
  const deal = dealDetails;
  const { toast } = useToast();
  const { user, saveDeal, unsaveDeal, isDealSaved } = useAuth();
  const router = useRouter();


   const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link Copied!",
      description: "Deal link copied to clipboard.",
    });
  };

  const handleRedeem = () => {
    toast({
        title: "Deal Redeemed!",
        description: "Show this confirmation at the business to get your discount.",
    });
  };

  const handleSaveToggle = () => {
    if (!user) {
        toast({
            title: "Please log in",
            description: "You need to be logged in to save deals.",
            variant: "destructive",
        });
        router.push("/login");
        return;
    }

    const currentlySaved = isDealSaved(deal.id);
    if (currentlySaved) {
        unsaveDeal(deal.id);
        toast({
            title: "Deal Unsaved",
            description: `The "${deal.title}" deal has been removed from your saved list.`,
        });
    } else {
        saveDeal(deal.id);
        toast({
            title: "Deal Saved!",
            description: `The "${deal.title}" deal has been saved to your profile.`,
        });
    }
  }

  const dealIsSaved = user ? isDealSaved(deal.id) : false;

  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-12">
        <Card className="overflow-hidden">
           <div className="relative h-64 md:h-96 w-full">
            <Image
              src={deal.imageUrl}
              alt={deal.title}
              fill
              className="object-cover"
              data-ai-hint={deal.aiHint}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6 md:p-8">
              <Badge>{deal.category}</Badge>
              <h1 className="font-headline text-3xl md:text-5xl font-bold text-white mt-2">
                {deal.title}
              </h1>
            </div>
          </div>
          <CardContent className="p-6 md:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <h2 className="font-headline text-2xl font-semibold mb-4 border-b pb-2">Deal Details</h2>
                <div className="prose prose-sm max-w-none text-muted-foreground space-y-4">
                    <p>{deal.description}</p>
                    <h3 className="font-headline text-xl font-semibold">Terms & Conditions</h3>
                    <p>{deal.terms}</p>
                </div>
              </div>
              <div className="space-y-6">
                <div className="flex flex-col gap-4">
                    <Button size="lg" className="w-full" onClick={handleRedeem}>
                        <Tag className="mr-2"/>
                        Redeem Deal Now
                    </Button>
                    <Button size="lg" variant={dealIsSaved ? "default" : "secondary"} className="w-full" onClick={handleSaveToggle}>
                        <Bookmark className="mr-2"/>
                        {dealIsSaved ? "Deal Saved" : "Save Deal"}
                    </Button>
                    <Button size="lg" variant="outline" className="w-full" onClick={handleShare}>
                        <Share2 className="mr-2"/>
                        Share Deal
                    </Button>
                </div>
                 <Card>
                    <CardContent className="p-4 space-y-4">
                        <h4 className="font-semibold font-headline mb-2">Offered By</h4>
                        <div className="flex items-start gap-4">
                            <Building className="h-5 w-5 mt-1 text-primary flex-shrink-0" />
                            <div>
                                <Link href={`/organizations/${deal.businessId}`} className="font-semibold hover:text-primary">{deal.business}</Link>
                                <p className="text-sm text-muted-foreground">Visit the business profile for more information.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <MapPin className="h-5 w-5 mt-1 text-primary flex-shrink-0" />
                            <div>
                                <p className="font-semibold">Location</p>
                                <p className="text-muted-foreground text-sm">{deal.businessLocation}</p>
                            </div>
                        </div>
                         <div className="flex items-start gap-4">
                            <Calendar className="h-5 w-5 mt-1 text-primary flex-shrink-0" />
                            <div>
                                <p className="font-semibold">Expires</p>
                                <p className="text-muted-foreground text-sm">{deal.expires}</p>
                            </div>
                        </div>
                         <div className="flex items-start gap-4">
                            <Globe className="h-5 w-5 mt-1 text-primary flex-shrink-0" />
                            <div>
                                <p className="font-semibold">Website</p>
                                <a href={`https://${deal.businessWebsite}`} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                                    {deal.businessWebsite}
                                </a>
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

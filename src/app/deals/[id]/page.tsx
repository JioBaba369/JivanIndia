'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Tag, Building, Share2, Globe, MapPin, Bookmark, History, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useRouter, useParams } from "next/navigation";
import { format, formatDistanceToNow, isValid } from 'date-fns';
import { useState, useEffect, useMemo } from 'react';
import { useDeals } from "@/hooks/use-deals";
import { useCommunities } from "@/hooks/use-communities";

export default function DealDetailPage() {
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : '';
  const { getDealById, isLoading: isLoadingDeals } = useDeals();
  const deal = getDealById(id);
  const { getCommunityBySlug, isLoading: isLoadingCommunities } = useCommunities();
  
  const { toast } = useToast();
  const { user, saveDeal, unsaveDeal, isDealSaved } = useAuth();
  const router = useRouter();

  const businessCommunity = getCommunityBySlug(deal?.businessId || '');

  const postedAt = useMemo(() => {
    if (!deal?.postedAt) return 'a while ago';
    try {
      const date = new Date(deal.postedAt);
      return isValid(date) ? formatDistanceToNow(date, { addSuffix: true }) : 'a while ago';
    } catch (error) {
      console.error("Failed to parse date:", deal.postedAt);
      return 'a while ago';
    }
  }, [deal?.postedAt]);

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
    if (!user || !deal) {
        toast({
            title: "Please log in",
            description: "You need to be logged in to save deals.",
            variant: "destructive",
        });
        if (!user) router.push("/login");
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
  
  const isLoading = isLoadingDeals || isLoadingCommunities;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center flex items-center justify-center min-h-[calc(100vh-128px)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!deal) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="font-headline text-3xl font-bold">Deal Not Found</h1>
        <p className="text-muted-foreground">The deal you are looking for does not exist or may have been removed.</p>
        <Button asChild className="mt-6">
          <Link href="/deals">Back to Deals</Link>
        </Button>
      </div>
    );
  }

  const dealIsSaved = user ? isDealSaved(deal.id) : false;
  const expirationDate = isValid(new Date(deal.expires)) ? format(new Date(deal.expires), 'PPP') : 'N/A';


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
              data-ai-hint="deal photo"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6 md:p-8">
              <Badge variant="secondary">{deal.category}</Badge>
              <h1 className="font-headline text-3xl md:text-5xl font-bold text-white mt-2">
                {deal.title}
              </h1>
            </div>
          </div>
          <CardContent className="p-6 md:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <h2 className="font-headline text-2xl font-semibold mb-4 border-b pb-2">Deal Details</h2>
                 <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                    <History className="h-4 w-4" />
                    <span>Posted {postedAt}</span>
                </div>
                <div className="space-y-4 text-muted-foreground">
                    <p>{deal.description}</p>
                    <h3 className="font-headline text-xl font-semibold">Terms & Conditions</h3>
                    <p>{deal.terms}</p>
                </div>
              </div>
              <div className="space-y-6">
                <div className="flex flex-col gap-4">
                    <Button size="lg" className="w-full" onClick={handleRedeem}>
                        <Tag className="mr-2 h-4 w-4"/>
                        Redeem Deal Now
                    </Button>
                    <Button size="lg" variant={dealIsSaved ? "default" : "secondary"} className="w-full" onClick={handleSaveToggle}>
                        <Bookmark className="mr-2 h-4 w-4"/>
                        {dealIsSaved ? "Deal Saved" : "Save Deal"}
                    </Button>
                    <Button size="lg" variant="outline" className="w-full" onClick={handleShare}>
                        <Share2 className="mr-2 h-4 w-4"/>
                        Share Deal
                    </Button>
                </div>
                 <Card>
                    <CardHeader className="p-4">
                        <CardTitle className="font-headline text-xl">Offered By</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 space-y-4">
                        <div className="flex items-start gap-4">
                            <Building className="h-5 w-5 mt-1 text-primary flex-shrink-0" />
                            <div>
                                {businessCommunity ? (
                                    <Link href={`/c/${businessCommunity.slug}`} className="font-semibold hover:text-primary">{deal.business}</Link>
                                ) : (
                                    <p className="font-semibold">{deal.business}</p>
                                )}
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
                                <p className="text-muted-foreground text-sm">{expirationDate}</p>
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

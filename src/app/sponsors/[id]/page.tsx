

'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Globe, HeartHandshake, Share2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { useParams } from "next/navigation";
import { sponsors } from "../page";

export default function SponsorDetailPage() {
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : '';
  const sponsor = sponsors.find(s => s.id === id);
  const { toast } = useToast();

  const sponsorDetails = {
    description: "Saffron Restaurant Group is a premier collection of fine dining establishments dedicated to bringing authentic, high-quality Indian cuisine to discerning palates. With a focus on traditional recipes, the freshest ingredients, and impeccable service, we create unforgettable dining experiences that celebrate the rich culinary heritage of India. As proud sponsors of the community, we are committed to supporting cultural events and initiatives that bring people together.",
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link Copied!",
      description: "Sponsor profile link copied to clipboard.",
    });
  };

  if (!sponsor) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="font-headline text-3xl font-bold">Sponsor not found</h1>
        <p className="mt-4 text-muted-foreground">The sponsor you are looking for does not exist.</p>
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
          <div className="relative h-64 md:h-96 w-full">
            <Image
              src={sponsor.imageUrl}
              alt={sponsor.name}
              fill
              className="object-cover"
              data-ai-hint={sponsor.aiHint}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6 md:p-8">
              <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold">
                Community Sponsor
              </span>
              <h1 className="font-headline text-3xl md:text-5xl font-bold text-white mt-2">
                {sponsor.name}
              </h1>
            </div>
          </div>
          <CardContent className="p-6 md:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <h2 className="font-headline text-2xl font-semibold mb-4">
                  About {sponsor.name}
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {sponsorDetails.description}
                </p>
              </div>
              <div className="space-y-6">
                <div className="flex flex-col gap-4">
                    <Button size="lg" className="w-full" asChild>
                        <a href={sponsor.website} target="_blank" rel="noopener noreferrer">
                            <Globe className="mr-2"/>
                            Visit Website
                        </a>
                    </Button>
                    <Button size="lg" variant="secondary" className="w-full" onClick={handleShare}>
                        <Share2 className="mr-2"/>
                        Share Profile
                    </Button>
                </div>
                 <Card>
                  <CardContent className="p-4 space-y-4">
                     <div className="flex items-start gap-4">
                      <HeartHandshake className="h-5 w-5 mt-1 text-primary flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold">Industry</h4>
                        <p className="text-muted-foreground text-sm">{sponsor.industry}</p>
                      </div>
                    </div>
                     <div className="flex items-start gap-4">
                      <Globe className="h-5 w-5 mt-1 text-primary flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold">Website</h4>
                        <a href={sponsor.website} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">{sponsor.website.replace('https://','')}</a>
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

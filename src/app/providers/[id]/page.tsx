
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Globe, Mail, MapPin, Phone, Share2, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useParams } from "next/navigation";

// Mock data - in a real app, you'd fetch this based on the `params.id`
const providerDetails = {
  id: "1",
  name: "Dr. Anjali Sharma, MD",
  category: "Healthcare",
  specialty: "Cardiologist",
  location: "Los Angeles, CA",
  imageUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHx GRsaW5pdGllfGVufDB8fHx8MTc1NDE5NzQzNnww&ixlib=rb-4.1.0&q=80&w=1080",
  aiHint: "female doctor smiling",
  description: "Dr. Anjali Sharma is a board-certified cardiologist with over 15 years of experience in treating a wide range of cardiovascular conditions. She is dedicated to providing compassionate, patient-centered care and is a leading expert in preventative cardiology and women's heart health. Dr. Sharma is affiliated with Cedars-Sinai Medical Center and is a fellow of the American College of Cardiology.",
  services: ["Preventative Cardiology", "Echocardiography", "Stress Testing", "Heart Failure Management", "Arrhythmia Treatment"],
  reviews: {
      rating: 4.9,
      count: 124,
  },
  contact: {
    address: "123 Health St, Suite 400, Beverly Hills, CA 90210",
    phone: "555-987-6543",
    email: "contact@drsharmacardiology.com",
    website: "www.drsharmacardiology.com",
  },
};


export default function ProviderDetailPage() {
  const params = useParams();
  // You can use params.id to fetch the correct provider data from your backend
  const provider = providerDetails;
  const { toast } = useToast();

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link Copied!",
      description: "Provider profile link copied to clipboard.",
    });
  };

  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-12">
        <Card className="overflow-hidden">
          <div className="relative h-64 md:h-96 w-full">
            <Image
              src={provider.imageUrl}
              alt={provider.name}
              fill
              className="object-cover"
              data-ai-hint={provider.aiHint}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6 md:p-8">
              <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold">
                {provider.category}
              </span>
              <h1 className="font-headline text-3xl md:text-5xl font-bold text-white mt-2">
                {provider.name}
              </h1>
               <div className="mt-2 flex items-center gap-2 text-yellow-400">
                <Star className="h-5 w-5 fill-current" />
                <span className="font-bold text-white">{provider.reviews.rating}</span>
                <span className="text-sm text-gray-300">({provider.reviews.count} reviews)</span>
              </div>
            </div>
          </div>
          <CardContent className="p-6 md:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <h2 className="font-headline text-2xl font-semibold mb-4 border-b pb-2">
                  About {provider.name}
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {provider.description}
                </p>
                
                 <div className="mt-8">
                   <h3 className="font-headline text-xl font-semibold mb-4 border-b pb-2">
                     Services Offered
                   </h3>
                   <div className="flex flex-wrap gap-2">
                    {provider.services.map(service => (
                        <Badge key={service} variant="secondary">{service}</Badge>
                    ))}
                   </div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="flex flex-col gap-4">
                    <Button size="lg" className="w-full" asChild>
                        <a href={`mailto:${provider.contact.email}`}>Contact Provider</a>
                    </Button>
                    <Button size="lg" variant="secondary" className="w-full" onClick={handleShare}>
                        <Share2 className="mr-2"/>
                        Share Profile
                    </Button>
                </div>
                 <Card>
                  <CardContent className="p-4 space-y-4">
                    <h4 className="font-semibold font-headline mb-2">Contact Information</h4>
                     <div className="flex items-start gap-4">
                      <MapPin className="h-5 w-5 mt-1 text-primary flex-shrink-0" />
                      <div>
                         <p className="text-muted-foreground text-sm">{provider.contact.address}</p>
                      </div>
                    </div>
                     <div className="flex items-start gap-4">
                      <Phone className="h-5 w-5 mt-1 text-primary flex-shrink-0" />
                      <div>
                         <p className="text-muted-foreground text-sm">{provider.contact.phone}</p>
                      </div>
                    </div>
                     <div className="flex items-start gap-4">
                      <Mail className="h-5 w-5 mt-1 text-primary flex-shrink-0" />
                      <div>
                         <p className="text-muted-foreground text-sm hover:text-primary"><a href={`mailto:${provider.contact.email}`}>{provider.contact.email}</a></p>
                      </div>
                    </div>
                     <div className="flex items-start gap-4">
                      <Globe className="h-5 w-5 mt-1 text-primary flex-shrink-0" />
                      <div>
                         <p className="text-muted-foreground text-sm hover:text-primary"><a href={`https://www.${provider.contact.website}`} target="_blank" rel="noopener noreferrer">{provider.contact.website}</a></p>
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


'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin, Search, UserCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useMemo } from "react";

export const providers = [
  {
    id: "1",
    name: "Dr. Anjali Sharma, MD",
    category: "Healthcare",
    specialty: "Cardiologist",
    location: "Los Angeles, CA",
    imageUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHx GRsaW5pdGllfGVufDB8fHx8MTc1NDE5NzQzNnww&ixlib=rb-4.1.0&q=80&w=1080",
    aiHint: "doctor portrait",
    details: {
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
    }
  },
  {
    id: "2",
    name: "Rajesh Kumar & Associates",
    category: "Legal Services",
    specialty: "Immigration Law",
    location: "New York, NY",
    imageUrl: "https://images.unsplash.com/photo-1505664194779-8beace72944f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxsYXclMjBvZmZpY2V8ZW58MHx8fHwxNzU0MTk3NDM2fDA&ixlib=rb-4.1.0&q=80&w=1080",
    aiHint: "law office",
    details: {
      description: "Rajesh Kumar & Associates is a leading law firm specializing in U.S. immigration law. We provide expert legal guidance on all types of visas, green cards, and citizenship matters. Our team is committed to helping individuals, families, and businesses navigate the complex immigration process with confidence and clarity.",
      services: ["Family-based Visas", "Employment-based Visas", "Green Card Applications", "Citizenship & Naturalization", "Deportation Defense"],
      reviews: {
          rating: 4.8,
          count: 98,
      },
      contact: {
        address: "55 Liberty St, New York, NY 10005",
        phone: "555-123-7890",
        email: "info@rkimmlaw.com",
        website: "www.rkimmlaw.com",
      },
    }
  },
  {
    id: "3",
    name: "Priya's Kitchen",
    category: "Catering",
    specialty: "North Indian Cuisine",
    location: "Dallas, TX",
    imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBjYXRlcmluZ3xlbnwwfHx8fDE3NTQxOTc0MzZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    aiHint: "catering food",
    details: {
      description: "Priya's Kitchen offers authentic, home-style North Indian catering for all occasions. From intimate gatherings to large weddings, we provide delicious, freshly prepared food that will delight your guests. We specialize in custom menus and exceptional service to make your event memorable.",
      services: ["Wedding Catering", "Corporate Events", "Private Parties", "Tiffin Services", "Custom Menus"],
      reviews: {
          rating: 5.0,
          count: 150,
      },
      contact: {
        address: "789 Spice Ave, Plano, TX 75024",
        phone: "555-555-5555",
        email: "priya@priyaskitchendallas.com",
        website: "www.priyaskitchendallas.com",
      },
    }
  },
  {
    id: "4",
    name: "Vikram Singh Photography",
    category: "Event Services",
    specialty: "Wedding Photography",
    location: "Miami, FL",
    imageUrl: "https://images.unsplash.com/photo-1519225421980-715cb0295b73?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxJbmRpYW4lMjB3ZWRkaW5nJTIwcGhvdG9ncmFwaGVyfGVufDB8fHx8fDE3NTQxOTc0MzZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    aiHint: "photographer camera",
    details: {
      description: "Vikram Singh is a passionate wedding photographer who captures the vibrant colors, emotions, and traditions of Indian weddings. With a keen eye for detail and a creative approach, he tells the unique story of your special day through stunning, timeless images.",
      services: ["Wedding Photography", "Engagement Shoots", "Videography", "Album Design", "Destination Weddings"],
      reviews: {
          rating: 4.9,
          count: 85,
      },
      contact: {
        address: "456 Lens St, Miami, FL 33101",
        phone: "555-888-9999",
        email: "vikram@vsphotography.com",
        website: "www.vsphotography.com",
      },
    }
  },
  {
    id: "5",
    name: "Aisha's Design Studio",
    category: "Creative Services",
    specialty: "Graphic Design",
    location: "Seattle, WA",
    imageUrl: "https://images.unsplash.com/photo-1569396116180-210c182bedb8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxkZXNpZ24lMjBzdHVkaW98ZW58MHx8fHwxNzU0MTk3NDM2fDA&ixlib=rb-4.1.0&q=80&w=1080",
    aiHint: "design studio",
    details: {
      description: "Aisha's Design Studio is a creative agency specializing in branding and digital design for modern businesses. We help brands connect with their audience through thoughtful design, compelling visuals, and a cohesive brand identity. Our services range from logo design to full website development.",
      services: ["Branding & Logo Design", "Web Design", "Marketing Materials", "Social Media Graphics", "UI/UX Design"],
      reviews: {
          rating: 4.7,
          count: 62,
      },
      contact: {
        address: "101 Creative Way, Seattle, WA 98101",
        phone: "555-777-1234",
        email: "hello@aishadesign.com",
        website: "www.aishadesign.com",
      },
    }
  },
  {
    id: "6",
    name: "Rohan Gupta, CPA",
    category: "Financial Services",
    specialty: "Tax & Accounting",
    location: "San Jose, CA",
    imageUrl: "https://images.unsplash.com/photo-1554224155-1696413565d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxhY2NvdW50YW50JTIwb2ZmaWNlfGVufDB8fHx8fDE3NTQxOTc0MzZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    aiHint: "accountant office",
    details: {
      description: "Rohan Gupta, CPA is a full-service accounting firm providing expert tax, accounting, and advisory services to individuals and small businesses in the Bay Area. We are dedicated to helping our clients achieve financial success with personalized strategies and proactive advice.",
      services: ["Individual & Business Tax Prep", "Bookkeeping Services", "Payroll", "Financial Planning", "IRS Representation"],
      reviews: {
          rating: 4.8,
          count: 110,
      },
      contact: {
        address: "200 Finance Rd, San Jose, CA 95112",
        phone: "555-222-3333",
        email: "rohan@rohanCPA.com",
        website: "www.rohanCPA.com",
      },
    }
  },
];


export default function ProvidersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('all');

  const providerCategories = useMemo(() => {
    const categories = new Set(providers.map(p => p.category));
    return ['all', ...Array.from(categories)];
  }, []);

  const filteredProviders = useMemo(() => {
    return providers.filter(provider => {
      const matchesSearch =
        provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        provider.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
        provider.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = category === 'all' || provider.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, category]);


  return (
    <div className="flex flex-col">
      <section className="bg-gradient-to-b from-primary/10 via-background to-background py-20 text-center">
        <div className="container mx-auto px-4">
          <h1 className="font-headline text-4xl font-bold md:text-6xl text-shadow-lg">
            Service Providers
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Find trusted professionals and services within the community.
          </p>
        </div>
      </section>

      <div className="sticky top-[65px] z-30 bg-background/80 py-4 backdrop-blur-md border-y">
        <div className="container mx-auto px-4">
          <Card>
            <CardContent className="p-4">
               <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="relative md:col-span-2">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, service, or location..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Services" />
                  </SelectTrigger>
                  <SelectContent>
                    {providerCategories.map((cat, index) => (
                      <SelectItem key={index} value={cat}>
                        {cat === 'all' ? 'All Categories' : cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredProviders.length > 0 ? filteredProviders.map((provider) => (
            <Card key={provider.id} className="overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1 group flex flex-col">
               <Link href={`/providers/${provider.id}`} className="block h-full flex flex-col">
                <CardContent className="p-0 flex flex-col h-full">
                  <div className="relative h-48 w-full">
                    <Image
                      src={provider.imageUrl}
                      alt={provider.name}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                      data-ai-hint={provider.aiHint}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                     <div className="absolute bottom-0 left-0 p-4">
                       <h3 className="font-headline text-xl font-bold text-white text-shadow">{provider.name}</h3>
                       <p className="font-semibold text-primary-foreground/90 text-sm text-shadow">{provider.specialty}</p>
                     </div>
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex flex-col space-y-2 text-muted-foreground flex-grow">
                       <div className="flex items-center gap-2">
                         <UserCheck className="h-4 w-4 text-primary" />
                         <span>{provider.category}</span>
                       </div>
                       <div className="flex items-center gap-2">
                         <MapPin className="h-4 w-4 text-primary" />
                         <span>{provider.location}</span>
                       </div>
                    </div>
                     <Button variant="secondary" className="mt-6 w-full">
                      View Profile
                    </Button>
                  </div>
                </CardContent>
              </Link>
            </Card>
          )) : (
            <div className="text-center py-12 border-2 border-dashed rounded-lg md:col-span-3">
                <p className="text-muted-foreground">No providers found matching your criteria.</p>
                <Button variant="link" onClick={() => { setSearchQuery(''); setCategory('all'); }}>Clear filters</Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

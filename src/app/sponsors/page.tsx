

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { HeartHandshake, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const sponsors = [
  {
    id: "1",
    name: "Saffron Restaurant Group",
    industry: "Food & Beverage",
    imageUrl: "https://images.unsplash.com/photo-1552566626-52f8b828add9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxsb3V4dXJ5JTIwcmVzdGF1cmFudCUyMGludGVyaW9yfGVufDB8fHx8MTc1NDE5NzQzNnww&ixlib=rb-4.1.0&q=80&w=1080",
    aiHint: "luxury restaurant",
    website: "https://www.saffronrestaurantgroup.com"
  },
  {
    id: "2",
    name: "Desi Grocers Inc.",
    industry: "Retail",
    imageUrl: "https://images.unsplash.com/photo-1588963523910-a19ffd1451a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxJbmRpYW4lMjBncm9jZXJ5JTIwc3RvcmV8ZW58MHx8fHwxNzU0MTk3NDM2fDA&ixlib=rb-4.1.0&q=80&w=1080",
    aiHint: "grocery store",
    website: "#"
  },
  {
    id: "3",
    name: "InnovateTech Solutions",
    industry: "Technology",
    imageUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHx0ZWNoJTIwY29tcGFueSUyMG9mZmljZXxlbnwwfHx8fDE3NTQxOTc0MzZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    aiHint: "tech company",
    website: "#"
  },
  {
    id: "4",
    name: "Sahara Real Estate",
    industry: "Real Estate",
    imageUrl: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBob3VzZSUyMGV4dGVyaW9yfGVufDB8fHx8fDE3NTQxOTc0MzZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    aiHint: "modern house",
    website: "#"
  },
  {
    id: "5",
    name: "Air India",
    industry: "Travel & Tourism",
    imageUrl: "https://images.unsplash.com/photo-1540348882199-a8c62b158223?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxiaWclMjBhaXJwbGFuZXxlbnwwfHx8fDE3NTQxOTc0MzZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    aiHint: "airplane wing",
    website: "#"
  },
  {
    id: "6",
    name: "Bollywood Cinemas",
    industry: "Entertainment",
    imageUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxtb3ZpZSUyMHRoZWF0ZXJ8ZW58MHx8fHwxNzU0MTk3NDM2fDA&ixlib=rb-4.1.0&q=80&w=1080",
    aiHint: "movie theater",
    website: "#"
  },
];


export default function SponsorsPage() {
  return (
    <div className="flex flex-col">
      <section className="bg-gradient-to-b from-primary/10 via-background to-background py-20 text-center">
        <div className="container mx-auto px-4">
          <h1 className="font-headline text-4xl font-bold md:text-6xl text-shadow-lg">
            Our Valued Sponsors
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            The businesses and individuals powering our community.
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
                    placeholder="Search for a sponsor by name or industry..."
                    className="pl-10"
                  />
                </div>
                <Button className="w-full">Search Sponsors</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {sponsors.map((sponsor) => (
            <Card key={sponsor.id} className="overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1 group flex flex-col">
               <Link href={`/sponsors/${sponsor.id}`} className="block h-full flex flex-col">
                <CardContent className="p-0 flex flex-col h-full">
                  <div className="relative h-48 w-full">
                    <Image
                      src={sponsor.imageUrl}
                      alt={sponsor.name}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                      data-ai-hint={sponsor.aiHint}
                    />
                  </div>
                  <div className="p-6 text-center flex flex-col flex-grow">
                    <h3 className="font-headline text-xl font-bold group-hover:text-primary">{sponsor.name}</h3>
                    <div className="mt-2 flex items-center justify-center gap-2 text-muted-foreground flex-grow">
                        <HeartHandshake className="h-4 w-4" />
                        <span>{sponsor.industry}</span>
                    </div>
                    <Button variant="secondary" className="mt-6 w-full">
                      View Profile
                    </Button>
                  </div>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

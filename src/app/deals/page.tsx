

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Search, Tag, Building } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const deals = [
  {
    id: "1",
    title: "20% Off Lunch Buffet",
    business: "Taste of India Restaurant",
    category: "Food",
    imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxJbmRpYW4lMjBidWZmZXR8ZW58MHx8fHwxNzU0MDQyNjA0fDA&ixlib=rb-4.1.0&q=80&w=1080",
    aiHint: "indian buffet",
    postedAt: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
  },
  {
    id: "2",
    title: "Buy One Get One Free Saree",
    business: "Bollywood Styles Boutique",
    category: "Shopping",
    imageUrl: "https://images.unsplash.com/photo-1617196020993-9417f77b8a7f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxzYXJlZSUyMHNob3B8ZW58MHx8fHwxNzU0MDQyNjA0fDA&ixlib=rb-4.1.0&q=80&w=1080",
    aiHint: "saree shop",
    postedAt: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(),
  },
  {
    id: "3",
    title: "$50 Off International Flights",
    business: "Fly High Travel Agency",
    category: "Travel",
    imageUrl: "https://images.unsplash.com/photo-1549922572-80b6245f7895?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxmbGlnaHQlMjB0byUyMEluZGliaWVufDB8fHx8MTc1NDE5NzQzNnww&ixlib=rb-4.1.0&q=80&w=1080",
    aiHint: "travel agency",
    postedAt: new Date(new Date().setDate(new Date().getDate() - 4)).toISOString(),
  },
  {
    id: "4",
    title: "First Month Free - Yoga Classes",
    business: "Peaceful Warrior Yoga",
    category: "Health & Wellness",
    imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHx5b2dhJTIwY2xhc3N8ZW58MHx8fHwxNzU0MDQyNjA0fDA&ixlib=rb-4.1.0&q=80&w=1080",
    aiHint: "yoga class",
    postedAt: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString(),
  },
  {
    id: "5",
    title: "15% Off All Spices",
    business: "Mumbai Spice Market",
    category: "Groceries",
    imageUrl: "https://images.unsplash.com/photo-1599529399895-654761ce8545?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBzcGljZXMlMjBtYXJrZXR8ZW58MHx8fHwxNzU0MDQyNjA0fDA&ixlib=rb-4.1.0&q=80&w=1080",
    aiHint: "spice market",
    postedAt: new Date(new Date().setDate(new Date().getDate() - 10)).toISOString(),
  },
  {
    id: "6",
    title: "Family Photo Session for $199",
    business: "Moments Captured Studio",
    category: "Services",
    imageUrl: "https://images.unsplash.com/photo-1620327467535-b512a8a855b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBmYW1pbHklMjBwaG90b3xlbnwwfHx8fDE3NTQwNDI2MDR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    aiHint: "family photo",
    postedAt: new Date(new Date().setDate(new Date().getDate() - 12)).toISOString(),
  },
];


export default function DealsPage() {
  return (
    <div className="flex flex-col">
      <section className="bg-gradient-to-b from-primary/10 via-background to-background py-20 text-center">
        <div className="container mx-auto px-4">
          <h1 className="font-headline text-4xl font-bold md:text-6xl text-shadow-lg">
            Community Deals
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Exclusive offers from businesses in our community. Support local, save money.
          </p>
           <Button size="lg" className="mt-8">
              <PlusCircle className="mr-2 h-5 w-5" />
              Post a Deal
            </Button>
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
                    placeholder="Search for a deal or business..."
                    className="pl-10"
                  />
                </div>
                <Button className="w-full">Find Deals</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {deals.map((deal) => (
            <Card key={deal.id} className="overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1 flex flex-col group">
               <Link href={`/deals/${deal.id}`} className="block h-full flex flex-col">
                <CardContent className="p-0 h-full flex flex-col">
                   <div className="relative h-48 w-full">
                    <Image
                      src={deal.imageUrl}
                      alt={deal.title}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                      data-ai-hint={deal.aiHint}
                    />
                  </div>
                  <div className="p-6 flex-grow flex flex-col">
                    <Badge variant="secondary" className="w-fit">{deal.category}</Badge>
                    <h3 className="font-headline text-xl font-bold mt-2 flex-grow group-hover:text-primary">{deal.title}</h3>
                    <div className="mt-4 flex items-center gap-2 text-muted-foreground">
                       <Building className="h-4 w-4" />
                       <span>{deal.business}</span>
                    </div>
                     <Button variant="outline" className="mt-6 w-full">
                        <Tag className="mr-2 h-4 w-4" />
                        View Deal
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

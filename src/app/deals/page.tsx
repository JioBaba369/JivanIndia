
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Search, Tag, Building } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const deals = [
  {
    id: "1",
    title: "20% Off Lunch Buffet",
    business: "Taste of India Restaurant",
    category: "Food",
    imageUrl: "https://placehold.co/600x400.png",
    aiHint: "indian buffet"
  },
  {
    id: "2",
    title: "Buy One Get One Free Saree",
    business: "Bollywood Styles Boutique",
    category: "Shopping",
    imageUrl: "https://placehold.co/600x400.png",
    aiHint: "saree shop"
  },
  {
    id: "3",
    title: "$50 Off International Flights",
    business: "Fly High Travel Agency",
    category: "Travel",
    imageUrl: "https://placehold.co/600x400.png",
    aiHint: "travel agency"
  },
  {
    id: "4",
    title: "First Month Free - Yoga Classes",
    business: "Peaceful Warrior Yoga",
    category: "Health & Wellness",
    imageUrl: "https://placehold.co/600x400.png",
    aiHint: "yoga class"
  },
  {
    id: "5",
    title: "15% Off All Spices",
    business: "Mumbai Spice Market",
    category: "Groceries",
    imageUrl: "https://placehold.co/600x400.png",
    aiHint: "spice market"
  },
  {
    id: "6",
    title: "Family Photo Session for $199",
    business: "Moments Captured Studio",
    category: "Services",
    imageUrl: "https://placehold.co/600x400.png",
    aiHint: "family photo"
  },
];


export default function DealsPage() {
  return (
    <div className="flex flex-col">
      <section className="bg-gradient-to-b from-primary/10 via-background to-background py-20 text-center">
        <div className="container mx-auto px-4">
          <h1 className="font-headline text-4xl font-bold md:text-6xl">
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

      <div className="sticky top-[65px] z-30 bg-background/80 py-4 backdrop-blur-md">
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
               <Link href={`/deals/${deal.id}`} className="block h-full">
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

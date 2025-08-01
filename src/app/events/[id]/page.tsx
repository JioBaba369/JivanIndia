
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, MapPin, Ticket, Share2, Plus, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// Mock data - in a real app, you'd fetch this based on the `params.id`
const eventDetails = {
  id: 1,
  title: "Diwali Festival of Lights",
  category: "Festival",
  date: "Saturday, November 4, 2024",
  time: "7:00 PM - 11:00 PM PST",
  location: "Grand Park, Downtown LA",
  address: "200 N Grand Ave, Los Angeles, CA 90012",
  imageUrl: "https://images.unsplash.com/photo-1605302977545-3a09913be1dd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw4fHxkaXdhbGklMjBjZWxlYnJhdGlvbiUyMG5pZ2h0fGVufDB8fHx8MTc1NDA0MjYwNHww&ixlib=rb-4.1.0&q=80&w=1080",
  aiHint: "diwali celebration night",
  description:
    "Experience the magic of Diwali at the annual Festival of Lights. This family-friendly event will feature traditional music, dance performances, delicious Indian food from local vendors, and a spectacular fireworks display to conclude the evening. Come and celebrate the victory of light over darkness with the community.",
  organizer: "India Cultural Center",
};

export default function EventDetailPage({ params }: { params: { id: string } }) {
  // You can use params.id to fetch the correct event data from your backend
  const event = eventDetails;

  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-12">
        <Card className="overflow-hidden">
          <div className="relative h-64 md:h-96 w-full">
            <Image
              src={event.imageUrl}
              alt={event.title}
              fill
              className="object-cover"
              data-ai-hint={event.aiHint}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6 md:p-8">
              <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold">
                {event.category}
              </span>
              <h1 className="font-headline text-3xl md:text-5xl font-bold text-white mt-2">
                {event.title}
              </h1>
            </div>
          </div>
          <CardContent className="p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <h2 className="font-headline text-2xl font-semibold mb-4">
                  About this event
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {event.description}
                </p>
                <div className="mt-8">
                   <h3 className="font-headline text-xl font-semibold mb-4">
                     Organized by
                   </h3>
                   <div className="flex items-center gap-4">
                     <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
                       <Users className="h-6 w-6 text-secondary-foreground" />
                     </div>
                     <div>
                       <p className="font-semibold">{event.organizer}</p>
                       <Link href="/organizations" className="text-sm text-primary hover:underline">
                         View Organization
                       </Link>
                     </div>
                   </div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="flex flex-col gap-4">
                    <Button size="lg" className="w-full">
                        <Ticket className="mr-2"/>
                        Register / Get Tickets
                    </Button>
                    <Button size="lg" variant="secondary" className="w-full">
                        <Share2 className="mr-2"/>
                        Share Event
                    </Button>
                </div>
                 <Card>
                  <CardContent className="p-4 space-y-4">
                     <div className="flex items-start gap-4">
                      <Calendar className="h-5 w-5 mt-1 text-primary flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold">Date and time</h4>
                        <p className="text-muted-foreground text-sm">{event.date}</p>
                        <p className="text-muted-foreground text-sm">{event.time}</p>
                      </div>
                    </div>
                     <div className="flex items-start gap-4">
                      <MapPin className="h-5 w-5 mt-1 text-primary flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold">Location</h4>
                        <p className="text-muted-foreground text-sm">{event.location}</p>
                         <p className="text-muted-foreground text-sm">{event.address}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                 <div className="relative h-48 w-full rounded-lg overflow-hidden">
                    <Image
                      src="https://images.unsplash.com/photo-1730317195705-8a265a59ed1b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw4fHxjaXR5JTIwbWFwfGVufDB8fHx8MTc1NDA0MjYwNHww&ixlib=rb-4.1.0&q=80&w=1080"
                      alt="Map"
                      fill
                      className="object-cover"
                      data-ai-hint="city map"
                    />
                 </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Heart, Target } from "lucide-react";
import Image from "next/image";

export default function AboutUsPage() {
  return (
    <div className="bg-background">
      <section className="relative bg-primary/10 py-20 md:py-32 text-center">
         <div className="absolute inset-0">
            <Image 
                src="https://images.unsplash.com/photo-1594917409245-8a245973c8b4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw0fHxJbmRpYW4lMjBmZXN0aXZhbCUyMGNyb3dkfGVufDB8fHx8MTc1NDE5NzQzNnww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Indian festival crowd"
                fill
                className="object-cover opacity-10"
                priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        </div>
        <div className="container mx-auto px-4 relative">
          <h1 className="font-headline text-4xl font-bold md:text-6xl">
            About JivanIndia.co
          </h1>
          <p className="mx-auto mt-4 max-w-3xl text-lg text-muted-foreground">
            Connecting the vibrant heart of the Indian community, all in one place.
          </p>
        </div>
      </section>
      
      <section className="container mx-auto px-4 py-16">
        <Card className="max-w-5xl mx-auto">
            <CardContent className="p-8 md:p-12">
                <div className="grid md:grid-cols-3 gap-12 text-center">
                    <div className="flex flex-col items-center">
                        <Target className="h-12 w-12 text-primary mb-4" />
                        <h2 className="font-headline text-2xl font-semibold">Our Mission</h2>
                        <p className="text-muted-foreground mt-2">To create a central digital hub that connects, supports, and celebrates the Indian diaspora by providing a comprehensive platform for community engagement, resources, and opportunities.</p>
                    </div>
                     <div className="flex flex-col items-center">
                        <Users className="h-12 w-12 text-primary mb-4" />
                        <h2 className="font-headline text-2xl font-semibold">Who We Are</h2>
                        <p className="text-muted-foreground mt-2">We are a passionate team dedicated to fostering a stronger, more connected Indian community. JivanIndia.co is an independent platform built for the community, by the community.</p>
                    </div>
                     <div className="flex flex-col items-center">
                        <Heart className="h-12 w-12 text-primary mb-4" />
                        <h2 className="font-headline text-2xl font-semibold">What We Do</h2>
                        <p className="text-muted-foreground mt-2">We bring together events, organizations, service providers, deals, and career opportunities to make it easier for community members to find what they need and engage with what they love.</p>
                    </div>
                </div>

                <div className="mt-16 text-lg text-muted-foreground leading-relaxed prose prose-invert mx-auto">
                    <p>JivanIndia.co was born from a simple idea: to bridge the gap between finding information and feeling connected. In our daily lives, we saw how challenging it could be to keep track of cultural events, find trusted local businesses, or connect with community organizations. We envisioned a single, reliable platform where all this information could live, breathe, and be easily accessible to everyone.</p>
                    <p>Our platform is more than just a directory; it's a dynamic ecosystem designed to empower every member of the Indian community. Whether you're looking to attend a local Diwali celebration, find a new job, support a local Indian-owned business, or join a cultural group, JivanIndia.co is your starting point. We are committed to building a trusted, comprehensive, and vibrant resource that truly serves as the heartbeat of the Indian community.</p>
                </div>
            </CardContent>
        </Card>
      </section>
    </div>
  );
}

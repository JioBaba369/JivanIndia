
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Briefcase, LandPlot, Sprout } from "lucide-react";
import Image from "next/image";
import StatCard from "@/components/feature/stat-card";

export default function AboutIndiaPage() {
  const stats = [
    { title: "Global Diaspora Population", value: "32 Million", description: "Largest in the world", icon: <Users /> },
    { title: "Remittances to India (2023)", value: "$125 Billion", description: "Highest in the world", icon: <Briefcase /> },
    { title: "Countries with Diaspora", value: "146+", description: "Present across the globe", icon: <LandPlot /> },
    { title: "PIOs & NRIs", value: "Balanced Mix", description: "Of citizens and residents", icon: <Sprout /> },
  ];

  return (
    <div className="bg-background">
      <section className="relative bg-primary/10 py-20 md:py-32 text-center">
         <div className="absolute inset-0">
            <Image 
                src="https://images.unsplash.com/photo-1594323533358-061559404617?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxUYWolMjBNYWhhbCUyMHN1bnJpc2V8ZW58MHx8fHwxNzU0MTk3NDM2fDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="A majestic view of the Taj Mahal at sunrise"
                fill
                className="object-cover opacity-10"
                priority
                data-ai-hint="Taj Mahal sunrise"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        </div>
        <div className="container mx-auto px-4 relative">
          <h1 className="font-headline text-4xl font-bold md:text-6xl text-shadow-lg">
            The Spirit of India, Worldwide
          </h1>
          <p className="mx-auto mt-4 max-w-3xl text-lg text-foreground/80 text-shadow">
            Exploring the roots, culture, and global presence of the Indian diaspora.
          </p>
        </div>
      </section>
      
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-headline text-3xl font-bold mb-4">The Global Indian Diaspora</h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              The Indian diaspora is a vibrant and diverse community of people of Indian origin living outside of India. This global community maintains strong cultural, linguistic, and emotional ties to their ancestral homeland, serving as a powerful bridge between India and the world. They are ambassadors of India's rich heritage and significant contributors to the economies and societies of their host countries.
            </p>
        </div>
      </section>

      <section className="bg-muted/40 py-16 md:py-24">
        <div className="container mx-auto px-4">
            <h2 className="font-headline text-3xl font-bold text-center mb-12">Diaspora at a Glance</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {stats.map(stat => (
                <StatCard
                  key={stat.title}
                  title={stat.title}
                  value={stat.value}
                  description={stat.description}
                  icon={stat.icon}
                />
              ))}
            </div>
        </div>
      </section>
      
      <section className="py-16 md:py-24">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <Image 
                            src="https://images.unsplash.com/photo-1542038784-56eD6D45525g?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxJbmRpYW4lMjBjdWx0dXJlJTIwZGl2ZXJzaXR5fGVufDB8fHx8MTc1NDE5NzQzNnww&ixlib=rb-4.1.0&q=80&w=1080"
                            alt="A collage representing diverse Indian culture"
                            width={600}
                            height={400}
                            className="rounded-lg shadow-xl"
                            data-ai-hint="culture diversity"
                        />
                    </div>
                    <div className="max-w-xl">
                        <h2 className="font-headline text-3xl font-bold mb-4">Cultural Ambassadors</h2>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                           Members of the diaspora are crucial in promoting Indian culture globally. Through festivals like Diwali and Holi, culinary traditions, art, music, and cinema, they introduce the richness of Indian heritage to new audiences. They establish cultural centers, temples, and community organizations that act as hubs for cultural preservation and celebration, ensuring that traditions are passed down through generations and shared with the wider world.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    </div>
  );
}

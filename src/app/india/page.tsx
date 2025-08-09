
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Briefcase, LandPlot, Sprout, Milestone, LineChart } from "lucide-react";
import Image from "next/image";
import StatCard from "@/components/feature/stat-card";

export default function AboutIndiaPage() {
  const stats = [
    { title: "Global Diaspora Population", value: "35.4 Million", description: "Largest in the world", icon: <Users /> },
    { title: "Remittances to India (2024)", value: "$129 Billion", description: "Highest in the world", icon: <Briefcase /> },
    { title: "Countries with Diaspora", value: "200+", description: "Present across every continent", icon: <LandPlot /> },
    { title: "PIOs & NRIs", value: "Balanced Mix", description: "~13.5M NRIs & ~21.9M PIOs", icon: <Sprout /> },
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
              The Indian diaspora represents a dynamic tapestry of individuals who carry the essence of India across borders. From ancient trade routes to modern migrations, this community embodies resilience, innovation, and cultural pride. Whether as entrepreneurs, artists, or community leaders, they foster global connections while preserving their heritage.
            </p>
             <p className="text-muted-foreground text-lg leading-relaxed mt-4">
              As ambassadors of India's rich heritage, they contribute significantly to the economies, societies, and cultural landscapes of their host countries, often blending Indian traditions with local customs to create unique hybrid identities.
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
                           Members of the diaspora play a pivotal role in promoting Indian culture worldwide. Through vibrant festivals like Diwali, Holi, and Navratri, they illuminate global cities with lights, colors, and joy. Culinary traditions—think butter chicken, dosas, and masala chai—have become staples in international cuisine, while Bollywood films, classical music, and yoga introduce India's artistic depth to new audiences.
                        </p>
                    </div>
                </div>
            </div>
        </section>

         <section className="bg-muted/40 py-16 md:py-24">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                     <div className="max-w-xl md:order-2">
                        <h2 className="font-headline text-3xl font-bold mb-4">History of Migration</h2>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                           The Indian diaspora's roots trace back centuries. Early migrations occurred through trade with ancient civilizations in Southeast Asia and the Middle East. The 19th century saw large-scale movements under British colonial rule, with indentured laborers sent to plantations in the Caribbean, Africa, and Fiji. Post-independence, skilled professionals migrated to the West for education and opportunities, particularly during the IT boom of the 1990s. Today, migration continues for work, study, and family reunification, making India the top source of international migrants annually.
                        </p>
                    </div>
                    <div className="md:order-1">
                        <Image 
                            src="https://images.unsplash.com/photo-1620674156044-55e4b38b184d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxvbGQlMjBJbmRpYW4lMjBtYXB8ZW58MHx8fHwxNzU0MTk3NDM2fDA&ixlib=rb-4.1.0&q=80&w=1080"
                            alt="An old map showing historical migration routes from India"
                            width={600}
                            height={400}
                            className="rounded-lg shadow-xl"
                            data-ai-hint="old map"
                        />
                    </div>
                </div>
            </div>
        </section>

        <section className="py-16 md:py-24">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <Image 
                            src="https://images.unsplash.com/photo-1579532582937-16c128983486?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxJbmRpYW4lMjBlY29ub215JTIwZ3JhcGh8ZW58MHx8fHwxNzU0MTk3NDM2fDA&ixlib=rb-4.1.0&q=80&w=1080"
                            alt="A graph showing economic growth and contribution"
                            width={600}
                            height={400}
                            className="rounded-lg shadow-xl"
                            data-ai-hint="economic graph"
                        />
                    </div>
                    <div className="max-w-xl">
                        <h2 className="font-headline text-3xl font-bold mb-4">Economic & Social Contributions</h2>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                          Beyond culture, the diaspora drives economic growth. In 2024, remittances reached a record $129 billion, funding education, healthcare, and infrastructure in India. Diaspora members excel in fields like technology (e.g., CEOs of Google and Microsoft), medicine, and entrepreneurship, contributing to host economies while investing back home.
                        </p>
                    </div>
                </div>
            </div>
        </section>

        <section className="bg-muted/40 py-16 md:py-24">
            <div className="container mx-auto px-4 max-w-4xl text-center">
                 <h2 className="font-headline text-3xl font-bold mb-4">Challenges and Future Outlook</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                   Despite their successes, the diaspora faces challenges such as identity struggles, discrimination, and integration issues in host countries. The COVID-19 pandemic highlighted vulnerabilities, with many relying on community support networks. Looking ahead, the diaspora is poised to grow, with increasing focus on youth engagement and digital connectivity. Initiatives like India's Pravasi Bharatiya Divas celebrate their contributions, strengthening ties for a more interconnected world.
                </p>
            </div>
        </section>

    </div>
  );
}

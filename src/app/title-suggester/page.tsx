
'use client';
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Wand2 } from "lucide-react";

// Mock AI function - in a real app, this would call a Genkit flow
const getTitleSuggestions = async (description: string): Promise<string[]> => {
  console.log("Getting title suggestions for:", description);
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mocked suggestions
  return [
    "Diwali Gala: A Festival of Lights & Culture",
    "Illuminate the Night: Grand Diwali Celebration",
    "Experience the Magic of Diwali: A Community Festival",
    "A Night of Sparkle: The Annual Diwali Mela",
    "From Tradition to Celebration: The Ultimate Diwali Experience"
  ];
};


export default function TitleSuggesterPage() {
  const [description, setDescription] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSuggestTitles = async () => {
    if (!description.trim()) {
      setError("Please enter a description for your event.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setSuggestions([]);
    try {
      const result = await getTitleSuggestions(description);
      setSuggestions(result);
    } catch (err) {
      setError("Sorry, we couldn't generate titles right now. Please try again later.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="flex flex-col">
      <section className="bg-gradient-to-b from-primary/10 via-background to-background py-20 text-center">
        <div className="container mx-auto px-4">
          <h1 className="font-headline text-4xl font-bold md:text-6xl">
            Event Title Suggester
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Craft the perfect, attention-grabbing title for your event. Let our AI help you find the right words.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
           <Card>
            <CardHeader>
                <CardTitle>Describe Your Event</CardTitle>
                <CardDescription>
                    Provide a few sentences about your event, including what it is, who it's for, and what makes it special. Our AI will generate some creative title ideas for you.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid w-full gap-4">
                    <Textarea 
                        placeholder="e.g., A family-friendly community gathering to celebrate the festival of lights with traditional music, dance, food, and fireworks..." 
                        rows={5}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        disabled={isLoading}
                    />
                    {error && <p className="text-sm text-destructive">{error}</p>}
                    <Button onClick={handleSuggestTitles} disabled={isLoading} size="lg">
                        <Wand2 className="mr-2 h-5 w-5" />
                        {isLoading ? "Generating Titles..." : "Suggest Titles"}
                    </Button>
                </div>

                {suggestions.length > 0 && (
                     <div className="mt-8">
                        <h3 className="font-headline text-2xl font-bold mb-4">Suggested Titles</h3>
                        <div className="space-y-3">
                            {suggestions.map((title, index) => (
                                <Card key={index} className="bg-secondary/50 p-4">
                                    <p className="font-medium text-secondary-foreground">{title}</p>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}
            </CardContent>
           </Card>
        </div>
      </section>
    </div>
  );
}

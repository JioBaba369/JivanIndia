"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Sparkles, Wand2 } from "lucide-react";
import { getSuggestedTitles } from "./actions";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

const formSchema = z.object({
  eventDescription: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }).max(500, {
    message: "Description must not be longer than 500 characters."
  }),
});

export default function EventTitleSuggesterPage() {
  const [suggestedTitles, setSuggestedTitles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      eventDescription: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setSuggestedTitles([]);
    const result = await getSuggestedTitles(values);
    setIsLoading(false);

    if (result.success && result.data?.suggestedTitles) {
      setSuggestedTitles(result.data.suggestedTitles);
    } else {
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: result.error || "Could not generate titles. Please try again.",
      });
    }
  }

  return (
    <div className="flex flex-col">
       <section className="bg-gradient-to-b from-primary/10 via-background to-background py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center items-center gap-2">
            <Wand2 className="h-10 w-10 text-primary"/>
            <h1 className="font-headline text-4xl font-bold md:text-6xl">
              Event Title Suggester
            </h1>
          </div>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Let AI help you craft the perfect, catchy title for your next event.
          </p>
        </div>
      </section>
      
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Card>
              <CardHeader>
                <CardTitle>Describe Your Event</CardTitle>
                <CardDescription>
                  Provide a brief description, and we'll generate some title ideas.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="eventDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Event Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., A colorful festival celebrating spring with music, dance, and food for the whole family."
                          className="resize-none"
                          rows={5}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="mr-2 h-4 w-4" />
                  )}
                  Generate Titles
                </Button>
              </CardFooter>
            </Card>
          </form>
        </Form>
        
        {(isLoading || suggestedTitles.length > 0) && (
            <div className="mt-8">
                <h3 className="font-headline text-2xl font-bold mb-4 text-center">
                    {isLoading ? "Generating Ideas..." : "Here are some ideas!"}
                </h3>
                {isLoading ? (
                    <div className="flex justify-center items-center py-10">
                        <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    </div>
                ) : (
                    <div className="flex flex-wrap justify-center gap-3">
                        {suggestedTitles.map((title, index) => (
                            <Badge key={index} className="text-base px-4 py-2 cursor-pointer transition-transform hover:scale-105" variant="outline">
                                {title}
                            </Badge>
                        ))}
                    </div>
                )}
            </div>
        )}
        </div>
      </section>
    </div>
  );
}

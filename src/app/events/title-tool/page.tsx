
'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Wand2, Loader2, Sparkles, Copy } from 'lucide-react';
import { useState } from 'react';
import { generateEventTitle, GenerateTitleInputSchema } from '@/ai/flows/generate-event-title-flow';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

type TitleGeneratorFormValues = z.infer<typeof GenerateTitleInputSchema>;

export default function EventTitleToolPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const form = useForm<TitleGeneratorFormValues>({
    resolver: zodResolver(GenerateTitleInputSchema),
    defaultValues: {
      description: '',
      keywords: '',
    },
    mode: 'onChange',
  });
  
  const handleSubmit = async (values: TitleGeneratorFormValues) => {
    setIsLoading(true);
    setSuggestions([]);
    try {
        const result = await generateEventTitle(values);
        setSuggestions(result.titles);
    } catch(error) {
        console.error(error);
        toast({
            title: "Failed to generate titles",
            description: "An error occurred while communicating with the AI. Please try again.",
            variant: "destructive",
        })
    } finally {
        setIsLoading(false);
    }
  }

  const handleSuggestionClick = (title: string) => {
    navigator.clipboard.writeText(title);
    toast({
        title: "Title Copied!",
        description: `"${title}" copied to clipboard.`,
        icon: <Copy className="h-5 w-5"/>
    });
  }


  return (
    <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
                <Wand2 className="h-12 w-12 mx-auto text-primary" />
                <h1 className="font-headline text-4xl font-bold mt-4">Event Title Generator</h1>
                <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                    Struggling to find the perfect name for your event? Describe your event below, and let our AI suggest some creative and catchy titles.
                </p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Describe Your Event</CardTitle>
                </CardHeader>
                <CardContent>
                     <Form {...form}>
                     <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Event Description</FormLabel>
                                    <FormControl>
                                    <Textarea 
                                        placeholder="e.g., A vibrant celebration of spring with colorful powders, music, dancing, and Indian street food. Family-friendly and open to all."
                                        rows={5}
                                        {...field}
                                    />
                                    </FormControl>
                                    <p className="text-xs text-muted-foreground">The more detail you provide, the better the suggestions will be.</p>
                                    <FormMessage />
                                </FormItem>
                            )}
                         />
                         <FormField
                            control={form.control}
                            name="keywords"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Keywords (Optional)</FormLabel>
                                    <FormControl>
                                        <Textarea 
                                            placeholder="e.g., Holi, festival, colors, family, food, music"
                                            rows={2}
                                            {...field}
                                        />
                                    </FormControl>
                                    <p className="text-xs text-muted-foreground">Add some keywords (comma-separated) to guide the AI, like the event type, tone, or key features.</p>
                                    <FormMessage />
                                </FormItem>
                            )}
                         />
                        <Button type="submit" className="w-full" size="lg" disabled={isLoading || !form.formState.isValid}>
                           {isLoading ? <><Loader2 className="mr-2 animate-spin" />Generating Titles...</> : <><Sparkles className="mr-2" />Generate Titles</>}
                        </Button>
                    </form>
                    </Form>
                </CardContent>
            </Card>

            {suggestions.length > 0 && (
                <div className="mt-10">
                    <h2 className="font-headline text-2xl font-bold text-center mb-6">Here are your suggestions!</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {suggestions.map((title, index) => (
                            <Card 
                                key={index} 
                                className="p-4 flex items-center justify-center text-center font-semibold cursor-pointer hover:bg-primary/10 hover:shadow-lg transition-all"
                                onClick={() => handleSuggestionClick(title)}
                            >
                                {title}
                            </Card>
                        ))}
                    </div>
                    <p className="text-center text-sm text-muted-foreground mt-4">Click on any title to copy it to your clipboard.</p>
                </div>
            )}
        </div>
    </div>
  );
}

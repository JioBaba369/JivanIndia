
'use server';
/**
 * @fileOverview An AI flow for generating event title suggestions.
 *
 * - getTitleSuggestions - A function that generates titles based on a description.
 * - TitleSuggestionInput - The input type for the getTitleSuggestions function.
 * - TitleSuggestionOutput - The return type for the getTitleSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TitleSuggestionInputSchema = z.object({
  description: z.string().describe('The description of the event.'),
});
export type TitleSuggestionInput = z.infer<typeof TitleSuggestionInputSchema>;

const TitleSuggestionOutputSchema = z.object({
    suggestions: z.array(z.string()).describe('An array of 5 creative and engaging event titles.'),
});
export type TitleSuggestionOutput = z-infer<typeof TitleSuggestionOutputSchema>;


const prompt = ai.definePrompt({
  name: 'titleSuggestionPrompt',
  input: {schema: TitleSuggestionInputSchema},
  output: {schema: TitleSuggestionOutputSchema},
  prompt: `You are an expert event marketer specializing in crafting compelling titles for community events for the Indian diaspora.
  
  Based on the following event description, generate 5 creative, catchy, and engaging title suggestions. The titles should be appealing to a broad audience within the Indian community and reflect the essence of the event.

Event Description:
{{{description}}}`,
});

const titleSuggestionFlow = ai.defineFlow(
  {
    name: 'titleSuggestionFlow',
    inputSchema: TitleSuggestionInputSchema,
    outputSchema: TitleSuggestionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);


export async function getTitleSuggestions(input: TitleSuggestionInput): Promise<TitleSuggestionOutput> {
  return titleSuggestionFlow(input);
}


'use server';
/**
 * @fileOverview An AI flow to generate creative event titles.
 *
 * - generateEventTitle - A function that suggests event titles based on a description.
 * - GenerateTitleInput - The input type for the generateEventTitle function.
 * - GenerateTitleOutput - The return type for the generateEventTitle function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

export const GenerateTitleInputSchema = z.object({
  description: z.string().min(10).describe('A detailed description of the event.'),
  keywords: z.string().optional().describe('Optional keywords to guide the AI (e.g., festival, family-friendly, business).'),
});
export type GenerateTitleInput = z.infer<typeof GenerateTitleInputSchema>;

export const GenerateTitleOutputSchema = z.object({
  titles: z.array(z.string()).length(6).describe('An array of 6 creative and engaging event titles.'),
});
export type GenerateTitleOutput = z.infer<typeof GenerateTitleOutputSchema>;


const prompt = ai.definePrompt({
  name: 'eventTitlePrompt',
  input: { schema: GenerateTitleInputSchema },
  output: { schema: GenerateTitleOutputSchema },
  prompt: `You are an expert event planner and marketing copywriter specializing in creating titles for community events. Your audience is the Indian diaspora.

Generate 6 creative, catchy, and appealing titles for an event based on the following description and keywords. The titles should be varied in style.

Event Description:
{{{description}}}

{{#if keywords}}
Keywords to inspire the tone and focus:
{{{keywords}}}
{{/if}}

Produce exactly 6 titles. Ensure the titles are engaging and would make someone want to learn more about the event.`,
});


export const generateEventTitleFlow = ai.defineFlow(
  {
    name: 'generateEventTitleFlow',
    inputSchema: GenerateTitleInputSchema,
    outputSchema: GenerateTitleOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);


export async function generateEventTitle(input: GenerateTitleInput): Promise<GenerateTitleOutput> {
  return generateEventTitleFlow(input);
}

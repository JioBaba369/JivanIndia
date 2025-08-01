'use server';

/**
 * @fileOverview Generates creative and engaging event titles based on a brief description.
 *
 * - suggestEventTitle - A function that suggests event titles.
 * - SuggestEventTitleInput - The input type for the suggestEventTitle function.
 * - SuggestEventTitleOutput - The return type for the suggestEventTitle function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestEventTitleInputSchema = z.object({
  eventDescription: z
    .string()
    .describe('A brief description of the event.'),
});
export type SuggestEventTitleInput = z.infer<typeof SuggestEventTitleInputSchema>;

const SuggestEventTitleOutputSchema = z.object({
  suggestedTitles: z.array(z.string()).describe('An array of suggested event titles.'),
});
export type SuggestEventTitleOutput = z.infer<typeof SuggestEventTitleOutputSchema>;

export async function suggestEventTitle(input: SuggestEventTitleInput): Promise<SuggestEventTitleOutput> {
  return suggestEventTitleFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestEventTitlePrompt',
  input: {schema: SuggestEventTitleInputSchema},
  output: {schema: SuggestEventTitleOutputSchema},
  prompt: `You are a creative marketing expert specializing in event titles.

  Generate a list of 5 creative and engaging event titles based on the event description provided.

  Event Description: {{{eventDescription}}}
  `,
});

const suggestEventTitleFlow = ai.defineFlow(
  {
    name: 'suggestEventTitleFlow',
    inputSchema: SuggestEventTitleInputSchema,
    outputSchema: SuggestEventTitleOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

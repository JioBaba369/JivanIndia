
'use server';

/**
 * @fileOverview A flow for handling job application submissions.
 * 
 * - submitApplication - A function that handles the application submission process.
 * - SubmitApplicationInput - The input type for the submitApplication function.
 * - SubmitApplicationOutput - The return type for the submitApplication function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

// We need to define this so Genkit knows about this file.
// We are not using a model in this flow, but it's good practice.
const gemini = ai.model('googleai/gemini-1.5-flash');

export const SubmitApplicationInputSchema = z.object({
    name: z.string().describe('The full name of the applicant.'),
    email: z.string().email().describe('The email address of the applicant.'),
    jobTitle: z.string().describe('The title of the job being applied for.'),
    companyName: z.string().describe('The name of the company.'),
    resumeDataUri: z.string().describe(
        "The applicant's resume, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type SubmitApplicationInput = z.infer<typeof SubmitApplicationInputSchema>;

export const SubmitApplicationOutputSchema = z.object({
    message: z.string().describe('A confirmation message for the applicant.'),
});
export type SubmitApplicationOutput = z.infer<typeof SubmitApplicationOutputSchema>;


export async function submitApplication(input: SubmitApplicationInput): Promise<SubmitApplicationOutput> {
    return submitApplicationFlow(input);
}


const submitApplicationFlow = ai.defineFlow(
  {
    name: 'submitApplicationFlow',
    inputSchema: SubmitApplicationInputSchema,
    outputSchema: SubmitApplicationOutputSchema,
  },
  async (input) => {
    
    console.log(`Received application from ${input.name} for ${input.jobTitle} at ${input.companyName}`);
    // In a real application, you would:
    // 1. Save the resume (input.resumeDataUri) to a secure cloud storage bucket.
    // 2. Save the application details (name, email, job title, and the path to the resume) to a database.
    // 3. Send a notification (e.g., email) to the employer.

    // For now, we'll just simulate this process and return a success message.
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return {
      message: `Your application for the ${input.jobTitle} position at ${input.companyName} has been received. We will be in touch!`,
    };
  }
);

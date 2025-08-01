'use server';

import { suggestEventTitle, SuggestEventTitleInput, SuggestEventTitleOutput } from '@/ai/flows/suggest-event-title';

interface ActionResult {
    success: boolean;
    data?: SuggestEventTitleOutput;
    error?: string;
}

export async function getSuggestedTitles(input: SuggestEventTitleInput): Promise<ActionResult> {
  try {
    const result = await suggestEventTitle(input);
    return { success: true, data: result };
  } catch (error) {
    console.error("Error in getSuggestedTitles:", error);
    return { success: false, error: 'Failed to suggest titles due to a server error.' };
  }
}


'use server';

import { genkit } from '@genkit-ai/core';
import { googleAI } from '@genkit-ai/googleai';
import { GENKIT_ENV } from 'genkit';

export const ai = genkit({
  plugins: [googleAI({ apiVersion: 'v1beta' })],
  logSinks: [],
  enableTracing: GENKIT_ENV === 'dev',
});

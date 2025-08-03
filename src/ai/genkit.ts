
'use server';

import { genkit, ai } from '@genkit-ai/core';
import { googleAI } from '@genkit-ai/googleai';
import { GENKIT_ENV } from 'genkit';

genkit({
  plugins: [googleAI({ apiVersion: 'v1beta' })],
  logSinks: [],
  enableTracing: GENKIT_ENV === 'dev',
});

export { ai };


import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import {dotprompt} from '@genkit-ai/dotprompt';

const ai = genkit({
  plugins: [
    googleAI(),
    dotprompt(),
  ],
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});

export {ai};

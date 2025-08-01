
import {genkit, Ai} from 'genkit';
import {googleAI} from 'genkit/plugins/googleai';

// Note: genkit() is a singleton, so this file will only be loaded once.
export const ai: Ai = genkit({
  plugins: [
    googleAI({
      // In a real app, you would want to use a secret manager
      // to store your API key.
      apiKey: process.env.GEMINI_API_KEY,
    }),
  ],
  // Log developer-friendly error messages and trace information.
  // NOTE: You'll want to disable this in production.
  logLevel: 'debug',
  // Prevent Genkit from writing telemetry data to a file.
  enableTracing: false,
});

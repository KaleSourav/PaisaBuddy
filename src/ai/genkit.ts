import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

export const ai = genkit({
  plugins: [googleAI({
    apiKey: process.env.GOOGLE_API_KEY || 'AIzaSyDJyFGXZLcQj0_Uy4UVlSfOgSg_Ww-zUJE', // Fallback to a demo key
  })],
  model: 'googleai/gemini-1.5-pro',
});

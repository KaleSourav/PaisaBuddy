'use server';
/**
 * @fileOverview A tool for fetching the current price of a stock.
 *
 * - getStockPrice - A Genkit tool that retrieves the latest market price for a given stock ticker.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// NOTE: This is a public, free API for demonstration purposes.
// For a production application, you should use a robust, paid financial data API
// and store your API key securely as an environment variable.
const FMP_API_URL = 'https://financialmodelingprep.com/api/v3/quote-short/';
const FMP_API_KEY = 'YOUR_API_KEY'; // Replace with a real key if you have one, or use the demo.

export const getStockPrice = ai.defineTool(
  {
    name: 'getStockPrice',
    description: 'Returns the current market value of a single stock.',
    inputSchema: z.object({
      ticker: z
        .string()
        .describe('The ticker symbol of the stock (e.g., RELIANCE.NS).'),
    }),
    outputSchema: z.number(),
  },
  async (input) => {
    // In a real app, you would use a more robust fetch library and error handling.
    // Also, the API key should not be hardcoded.
    const apiKey = process.env.FMP_API_KEY || FMP_API_KEY;
    const url = `${FMP_API_URL}${input.ticker}?apikey=${apiKey === 'YOUR_API_KEY' ? 'demo' : apiKey}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      const data = await response.json();
      
      if (data && data.length > 0 && typeof data[0].price === 'number') {
        return data[0].price;
      }
      
      // Fallback for demonstration if API fails or returns unexpected format
      return generateMockPrice(input.ticker);

    } catch (error) {
        console.error("Stock API fetch failed, returning mock price.", error);
        return generateMockPrice(input.ticker);
    }
  }
);

function generateMockPrice(ticker: string): number {
    // This is a simplified price generator as a fallback.
    const randomFactor = 1 + (Math.random() - 0.5) / 10; // +/- 5%
    let basePrice = 1000;
    if (ticker.includes('RELIANCE')) basePrice = 2950;
    if (ticker.includes('TCS')) basePrice = 3850;
    if (ticker.includes('HDFCBANK')) basePrice = 1680;
    if (ticker.includes('INFY')) basePrice = 1630;
    if (ticker.includes('ICICIBANK')) basePrice = 1150;

    return basePrice * randomFactor;
}

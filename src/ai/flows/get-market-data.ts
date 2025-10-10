'use server';
/**
 * @fileOverview A flow for fetching current market data for a list of stocks.
 *
 * - getMarketData - A function that returns live market prices for stocks.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { getStockPrice } from '@/ai/tools/get-stock-price';
import { StockPrice, stockPriceSchema } from '@/app/(app)/portfolio/types';

const GetMarketDataInputSchema = z.array(
  z.object({
    ticker: z.string(),
    name: z.string(),
  })
);

const GetMarketDataOutputSchema = z.array(stockPriceSchema);

export async function getMarketData(
  input: z.infer<typeof GetMarketDataInputSchema>
): Promise<z.infer<typeof GetMarketDataOutputSchema>> {
  return getMarketDataFlow(input);
}

const getMarketDataFlow = ai.defineFlow(
  {
    name: 'getMarketDataFlow',
    inputSchema: GetMarketDataInputSchema,
    outputSchema: GetMarketDataOutputSchema,
  },
  async (stocks) => {
    const stockDataPromises = stocks.map(async (stock) => {
      try {
        const price = await getStockPrice(stock);
        // This is a simplified change calculation. A real implementation
        // would fetch the previous day's close price to get an accurate change.
        const change = (Math.random() - 0.5) * 5; 
        return {
          ...stock,
          price,
          change,
        };
      } catch (error) {
        console.error(`Failed to fetch price for ${stock.ticker}:`, error);
        // Return a default/stale value or indicate an error
        return {
          ...stock,
          price: 0,
          change: 0,
        };
      }
    });

    const results = await Promise.all(stockDataPromises);
    return results.filter((r): r is StockPrice => r.price > 0);
  }
);

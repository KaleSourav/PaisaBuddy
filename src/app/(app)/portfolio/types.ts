import { z } from 'zod';

export const stockPriceSchema = z.object({
  ticker: z.string(),
  name: z.string(),
  price: z.number(),
  change: z.number(),
});

export type StockPrice = z.infer<typeof stockPriceSchema>;

export const holdingSchema = z.object({
  ticker: z.string(),
  name: z.string(),
  quantity: z.number(),
  avgPrice: z.number(),
});

export type Holding = z.infer<typeof holdingSchema>;

export type BuyStockState = {
  message: string;
  isSuccess: boolean;
  updatedHoldings?: Holding[];
  updatedFunds?: number;
};

export type SellStockState = {
  message: string;
  isSuccess: boolean;
  updatedHoldings?: Holding[];
  updatedFunds?: number;
};

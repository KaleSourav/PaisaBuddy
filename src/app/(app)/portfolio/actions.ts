'use server';

import { z } from 'zod';
import type { Holding, BuyStockState, SellStockState, StockPrice } from '@/app/(app)/portfolio/types';
import { holdingSchema } from '@/app/(app)/portfolio/types';
import { getMarketData } from '@/ai/flows/get-market-data';

export async function getMarketDataAction(stocks: Omit<StockPrice, 'price' | 'change'>[]): Promise<StockPrice[]> {
    return getMarketData(stocks);
}


export async function buyStockAction(
  prevState: BuyStockState,
  formData: FormData
): Promise<BuyStockState> {
  const buyStockSchema = z.object({
    ticker: z.string(),
    name: z.string(),
    price: z.coerce.number(),
    quantity: z.coerce.number().int().positive('Quantity must be a positive number.'),
    availableFunds: z.coerce.number(),
    currentHoldings: z.string().transform((str, ctx) => {
        try {
            const parsed = JSON.parse(str);
            return parsed;
        } catch (e) {
            ctx.addIssue({ code: 'custom', message: 'Invalid JSON' });
            return z.NEVER;
        }
    }).pipe(z.array(holdingSchema)),
  });

  const validatedFields = buyStockSchema.safeParse({
    ticker: formData.get('ticker'),
    name: formData.get('name'),
    price: formData.get('price'),
    quantity: formData.get('quantity'),
    availableFunds: formData.get('availableFunds'),
    currentHoldings: formData.get('currentHoldings'),
  });
  
  if (!validatedFields.success) {
    return {
      message: 'Invalid input. Please check the quantity.',
      isSuccess: false,
    };
  }

  const { ticker, name, price, quantity, availableFunds, currentHoldings } = validatedFields.data;
  const cost = price * quantity;

  if (cost > availableFunds) {
    return { message: "You don't have enough funds for this transaction.", isSuccess: false };
  }

  const updatedFunds = availableFunds - cost;
  let updatedHoldings = [...currentHoldings];
  const existingHoldingIndex = updatedHoldings.findIndex(h => h.ticker === ticker);

  if (existingHoldingIndex > -1) {
    const existingHolding = updatedHoldings[existingHoldingIndex];
    const totalValue = (existingHolding.avgPrice * existingHolding.quantity) + cost;
    const totalQuantity = existingHolding.quantity + quantity;
    existingHolding.quantity = totalQuantity;
    existingHolding.avgPrice = totalValue / totalQuantity;
  } else {
    updatedHoldings.push({
      ticker,
      name,
      quantity,
      avgPrice: price,
    });
  }

  return {
    message: `Successfully bought ${quantity} share(s) of ${ticker}.`,
    isSuccess: true,
    updatedHoldings,
    updatedFunds,
  };
}


export async function sellStockAction(
  prevState: SellStockState,
  formData: FormData
): Promise<SellStockState> {
  const sellStockSchema = z.object({
    ticker: z.string(),
    price: z.coerce.number(),
    quantity: z.coerce.number().int().positive('Quantity must be a positive number.'),
    availableFunds: z.coerce.number(),
    currentHoldings: z.string().transform((str, ctx) => {
        try {
            return JSON.parse(str);
        } catch (e) {
            ctx.addIssue({ code: 'custom', message: 'Invalid JSON' });
            return z.NEVER;
        }
    }).pipe(z.array(holdingSchema)),
  });

  const validatedFields = sellStockSchema.safeParse({
    ticker: formData.get('ticker'),
    price: formData.get('price'),
    quantity: formData.get('quantity'),
    availableFunds: formData.get('availableFunds'),
    currentHoldings: formData.get('currentHoldings'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Invalid input. Please check the quantity.',
      isSuccess: false,
    };
  }

  const { ticker, price, quantity, availableFunds, currentHoldings } = validatedFields.data;
  const proceeds = price * quantity;
  
  const holdingIndex = currentHoldings.findIndex(h => h.ticker === ticker);

  if (holdingIndex === -1) {
    return { message: "You don't own this stock.", isSuccess: false };
  }
  
  const holding = currentHoldings[holdingIndex];

  if (quantity > holding.quantity) {
    return { message: "You can't sell more shares than you own.", isSuccess: false };
  }

  const updatedFunds = availableFunds + proceeds;
  let updatedHoldings = [...currentHoldings];

  if (quantity === holding.quantity) {
    // Remove the holding if all shares are sold
    updatedHoldings.splice(holdingIndex, 1);
  } else {
    // Otherwise, just decrease the quantity
    updatedHoldings[holdingIndex].quantity -= quantity;
  }

  return {
    message: `Successfully sold ${quantity} share(s) of ${ticker}.`,
    isSuccess: true,
    updatedHoldings,
    updatedFunds,
  };
}

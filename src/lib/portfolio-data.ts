import type { Holding, StockPrice } from '@/app/(app)/portfolio/types';

export const initialHoldings: Holding[] = [
  { ticker: 'RELIANCE.NS', name: 'Reliance Industries', quantity: 10, avgPrice: 2800.0 },
  { ticker: 'HDFCBANK.NS', name: 'HDFC Bank', quantity: 25, avgPrice: 1600.0 },
  { ticker: 'TCS.NS', name: 'Tata Consultancy', quantity: 5, avgPrice: 3500.0 },
];

export const availableFunds = 50000.0;

export const availableStocksList: Omit<StockPrice, 'price' | 'change'>[] = [
  { ticker: 'RELIANCE.NS', name: 'Reliance Industries' },
  { ticker: 'TCS.NS', name: 'Tata Consultancy' },
  { ticker: 'HDFCBANK.NS', name: 'HDFC Bank' },
  { ticker: 'INFY.NS', name: 'Infosys' },
  { ticker: 'ICICIBANK.NS', name: 'ICICI Bank' },
];

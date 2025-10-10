'use client';

import { useState, useEffect, useTransition, useCallback } from 'react';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Wallet, ArrowUp, ArrowDown, RefreshCw, Loader2 } from 'lucide-react';
import { Holding, StockPrice } from '@/app/(app)/portfolio/types';
import { BuyStockDialog } from '@/components/buy-stock-dialog';
import { SellStockDialog } from '@/components/sell-stock-dialog';
import { initialHoldings, availableFunds as initialAvailableFunds, availableStocksList } from '@/lib/portfolio-data';
import { getMarketDataAction } from './actions';


export default function PortfolioPage() {
  const [isRefreshing, startRefreshTransition] = useTransition();
  const [availableFunds, setAvailableFunds] = useState(initialAvailableFunds);
  const [userHoldings, setUserHoldings] = useState<Holding[]>(initialHoldings);
  const [marketPrices, setMarketPrices] = useState<StockPrice[]>([]);
  const [refreshedAt, setRefreshedAt] = useState('');
  
  const handleRefresh = useCallback(() => {
    startRefreshTransition(async () => {
      const prices = await getMarketDataAction(availableStocksList);
      setMarketPrices(prices);
      setRefreshedAt(new Date().toLocaleTimeString());
    });
  }, []);

  useEffect(() => {
    // Set initial prices on client-side mount
    handleRefresh();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const handleBuySuccess = useCallback((newHoldings: Holding[], newFunds: number) => {
    setUserHoldings(newHoldings);
    setAvailableFunds(newFunds);
    handleRefresh();
  }, [handleRefresh]);
  
  const handleSellSuccess = useCallback((newHoldings: Holding[], newFunds: number) => {
    setUserHoldings(newHoldings);
    setAvailableFunds(newFunds);
    handleRefresh();
  }, [handleRefresh]);

  const totalInvested = userHoldings.reduce((acc, h) => acc + h.avgPrice * h.quantity, 0);

  const totalHoldingsValue = userHoldings.reduce((acc, holding) => {
    const stock = marketPrices.find(s => s.ticker === holding.ticker);
    return acc + (stock ? stock.price : holding.avgPrice) * holding.quantity;
  }, 0);

  const totalPnL = totalHoldingsValue - totalInvested;

  const totalPnlPercent = totalInvested > 0 ? (totalPnL / totalInvested) * 100 : 0;

  const portfolioSummary = [
    {
      title: 'Portfolio Value',
      value: `₹${totalHoldingsValue.toFixed(2)}`,
      icon: Wallet,
      change: `${totalPnlPercent.toFixed(2)}%`,
      changeType: totalPnL >= 0 ? ('increase' as const) : ('decrease' as const),
    },
    {
      title: 'Available Funds',
      value: `₹${availableFunds.toFixed(2)}`,
      icon: Wallet,
      change: 'Virtual money',
      changeType: 'neutral' as const,
    },
    {
      title: 'Total P&L',
      value: `₹${totalPnL.toFixed(2)}`,
      icon: totalPnL >= 0 ? ArrowUp : ArrowDown,
      change: `${totalPnlPercent.toFixed(2)}%`,
      changeType: totalPnL >= 0 ? ('increase' as const) : ('decrease' as const),
    },
  ];

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 pb-24 lg:gap-6 lg:p-6">
      <PageHeader
        title="Virtual Portfolio"
        description="Learn to invest by trading with virtual money."
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {portfolioSummary.map(item => (
          <Card key={item.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
              <item.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{item.value}</div>
              <p
                className={`text-xs ${
                  item.changeType === 'increase'
                    ? 'text-green-600'
                    : item.changeType === 'decrease'
                    ? 'text-red-600'
                    : 'text-muted-foreground'
                }`}
              >
                {item.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="space-y-1.5">
              <CardTitle>Market Watch</CardTitle>
              <CardDescription>Last updated: {refreshedAt || 'Loading...'}</CardDescription>
            </div>
            <Button size="icon" variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
              {isRefreshing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              <span className="sr-only">Refresh Prices</span>
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Stock</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Change</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {marketPrices.map(stock => (
                  <TableRow key={stock.ticker}>
                    <TableCell>
                      <div className="font-medium">{stock.ticker}</div>
                      <div className="text-sm text-muted-foreground">{stock.name}</div>
                    </TableCell>
                    <TableCell className="text-right">₹{stock.price.toFixed(2)}</TableCell>
                    <TableCell
                      className={`text-right font-medium ${
                        stock.change >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {stock.change.toFixed(2)}%
                    </TableCell>
                    <TableCell className="text-right">
                      <BuyStockDialog
                        stock={stock}
                        availableFunds={availableFunds}
                        currentHoldings={userHoldings}
                        onBuySuccess={handleBuySuccess}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>My Holdings</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Stock</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead className="text-right">Avg. Price</TableHead>
                  <TableHead className="text-right">Value</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userHoldings.map(holding => {
                  const marketPrice =
                    marketPrices.find(s => s.ticker === holding.ticker)?.price ?? holding.avgPrice;
                  const currentValue = marketPrice * holding.quantity;
                  return (
                    <TableRow key={holding.ticker}>
                      <TableCell>
                        <div className="font-medium">{holding.ticker}</div>
                        <div className="text-sm text-muted-foreground">{holding.name}</div>
                      </TableCell>
                      <TableCell className="text-right">{holding.quantity}</TableCell>
                      <TableCell className="text-right">₹{holding.avgPrice.toFixed(2)}</TableCell>
                      <TableCell className="text-right font-medium">
                        ₹{currentValue.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        <SellStockDialog
                          holding={holding}
                          marketPrice={marketPrice}
                          availableFunds={availableFunds}
                          currentHoldings={userHoldings}
                          onSellSuccess={handleSellSuccess}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

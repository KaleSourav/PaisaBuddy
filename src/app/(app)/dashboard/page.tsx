'use client';

import { Bot, ShieldCheck, TrendingUp, IndianRupee, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const quickActions = [
  {
    title: 'Virtual Portfolio',
    description: 'Practice trading with ₹1L virtual money',
    icon: TrendingUp,
    value: '₹1,25,000',
    href: '/portfolio',
  },
  {
    title: 'Fraud Challenge',
    description: 'Test your scam detection skills',
    icon: ShieldCheck,
    value: 'New Challenge!',
    href: '/fraud-prevention',
  },
  {
    title: 'AI Advisor',
    description: 'Get personalized financial advice',
    icon: Bot,
    value: 'Ask AI',
    href: '/advice',
  },
];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export default function DashboardPage() {

  return (
    <div className="flex flex-1 flex-col gap-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4 pb-24">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">नमस्ते! 👋</h1>
          <p className="text-muted-foreground text-lg">
            Welcome to your financial dashboard
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8">
            <span className="relative mr-2 flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
            </span>
            Live Market
          </Button>
        </div>
      </header>

      {/* Main Feature Card */}
      <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl rounded-xl overflow-hidden border-none">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold">Manage Your Finances</h2>
              <p className="text-blue-100 max-w-md">
                Track your spending, set budgets, and get personalized financial advice all in one place.
              </p>
              <div className="flex gap-3 pt-2">
                <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-blue-50">
                  <a href="/budgeting">Set Budget</a>
                </Button>
                <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/20">
                  <a href="/advice">Get Advice</a>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="shadow-lg rounded-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700">
          <CardTitle className="text-xl">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickActions.map((action) => (
              <a
                key={action.title}
                href={action.href}
                className="flex items-center gap-4 p-4 rounded-lg transition-all hover:bg-gray-100 dark:hover:bg-gray-800 hover:shadow-md"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <action.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-semibold">{action.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {action.description}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

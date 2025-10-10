

'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/page-header';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Clock, IndianRupee, Lightbulb, PiggyBank, Sparkles } from 'lucide-react';
import { SpendingChart, ChartData } from '@/components/spending-chart';
import { BudgetingForm } from '@/components/budgeting-form';
import { UpdateBudgetDialog } from '@/components/update-budget-dialog';

const initialBudgetData = {
  income: 45000,
  expenses: [
    { name: 'Food & Dining', value: 6500, target: 8000, color: 'hsl(var(--chart-4))' },
    { name: 'Housing', value: 15000, target: 15000, color: 'hsl(var(--chart-3))' },
    { name: 'Shopping', value: 3400, target: 4000, color: 'hsl(var(--chart-5))' },
    { name: 'Transportation', value: 4800, target: 5000, color: 'hsl(var(--chart-1))' },
    { name: 'Entertainment', value: 2800, target: 3000, color: 'hsl(var(--chart-2))' },
  ],
  savingsGoal: 15000,
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};


export default function BudgetingPage() {
  const [budgetData, setBudgetData] = useState(initialBudgetData);

  const totalExpenses = budgetData.expenses.reduce((acc, item) => acc + item.value, 0);
  const moneySaved = budgetData.income - totalExpenses;
  const remainingToSpend = budgetData.income - totalExpenses;
  const savingsGoalProgress = (moneySaved / budgetData.savingsGoal) * 100;

  const chartData: ChartData[] = budgetData.expenses.map(item => ({
    name: item.name,
    value: item.value,
    fill: item.color,
  }));

  const handleBudgetUpdate = (updatedData: typeof initialBudgetData) => {
    setBudgetData(updatedData);
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 pb-24 lg:gap-6 lg:p-6">
      <PageHeader
        title="Budget Tracker"
        description="Manage your money wisely"
      />

      <Card className="bg-gradient-to-r from-teal-500 to-green-500 text-primary-foreground shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle>Overview</CardTitle>
            <UpdateBudgetDialog currentData={budgetData} onUpdate={handleBudgetUpdate} />
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="grid grid-cols-3 items-center justify-items-center gap-4">
            <div className="flex flex-col items-center text-center">
              <span className="text-sm opacity-90">Income</span>
              <span className="text-2xl font-bold">{formatCurrency(budgetData.income)}</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <span className="text-sm opacity-90">Expenses</span>
              <span className="text-2xl font-bold">{formatCurrency(totalExpenses)}</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <span className="text-sm opacity-90">Saved</span>
              <span className="text-2xl font-bold">{formatCurrency(moneySaved)}</span>
            </div>
          </div>
          <div className="mt-4">
             <div className="mb-1 flex justify-between text-xs">
                <span>Savings Goal Progress</span>
                <span>{savingsGoalProgress.toFixed(0)}%</span>
            </div>
            <Progress value={savingsGoalProgress} className="h-2 bg-white/30" />
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="ai">AI Suggestions</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="mt-4 space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Money Saved</CardTitle>
                        <PiggyBank className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(moneySaved)}</div>
                        <p className="text-xs text-green-600">+{(moneySaved / budgetData.income * 100).toFixed(1)}% of income</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Remaining to Spend</CardTitle>
                        <IndianRupee className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(remainingToSpend)}</div>
                        <p className="text-xs text-muted-foreground">Available to spend</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                        <Clock className="h-5 w-5" />
                        Spending Breakdown
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                        <SpendingChart data={chartData} />
                    </div>
                </CardContent>
            </Card>
            
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Category Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {budgetData.expenses.map((item) => (
                        <div key={item.name}>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="font-medium">{item.name}</span>
                                <span>{formatCurrency(item.value)} / {formatCurrency(item.target)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div
                                    className="h-2 w-2 rounded-full"
                                    style={{ backgroundColor: item.color }}
                                />
                                <Progress value={(item.value / item.target) * 100} className="h-2" />
                                <span className="text-xs w-10 text-right">{((item.value / item.target) * 100).toFixed(0)}%</span>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>

            <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                <CardHeader className="flex-row items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-green-600" />
                    <CardTitle className="text-base text-green-800 dark:text-green-300">Budgeting Tip</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-green-700 dark:text-green-400">
                        Follow the 50-30-20 rule: 50% for needs, 30% for wants, and 20% for savings and debt repayment!
                    </p>
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="categories">
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
              <p>Category management coming soon!</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="goals">
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
              <p>Goal tracking coming soon!</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="history">
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
              <p>Transaction history coming soon!</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="ai" className="mt-4">
          <BudgetingForm />
        </TabsContent>
      </Tabs>
    </main>
  );
}

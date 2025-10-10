'use client';

import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { getSuggestionsAction } from '@/app/(app)/budgeting/actions';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Sparkles, Wand } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const budgetingFormSchema = z.object({
  income: z.coerce.number().positive({ message: 'Monthly income must be a positive number.' }),
  expenses_housing: z.coerce.number().min(0, { message: 'Cannot be negative.' }),
  expenses_food: z.coerce.number().min(0, { message: 'Cannot be negative.' }),
  expenses_transport: z.coerce.number().min(0, { message: 'Cannot be negative.' }),
  expenses_entertainment: z.coerce.number().min(0, { message: 'Cannot be negative.' }),
  expenses_other: z.coerce.number().min(0, { message: 'Cannot be negative.' }),
  financialGoals: z.string().min(10, { message: 'Please describe your financial goals in a bit more detail.' }),
});

export type FormState = {
  message: string;
  suggestions?: string[];
  isSuccess: boolean;
};

const initialState: FormState = {
  message: '',
  isSuccess: false,
};

const defaultValues = {
  income: '' as unknown as number,
  expenses_housing: 0,
  expenses_food: 0,
  expenses_transport: 0,
  expenses_entertainment: 0,
  expenses_other: 0,
  financialGoals: '',
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand className="mr-2 h-4 w-4" />}
      Get Suggestions
    </Button>
  );
}

export function BudgetingForm() {
  const [state, formAction] = useActionState(getSuggestionsAction, initialState);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof budgetingFormSchema>>({
    resolver: zodResolver(budgetingFormSchema),
    defaultValues,
  });

  useEffect(() => {
    if (state.message && !state.isSuccess) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: state.message,
      });
    }
  }, [state, toast]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
      <Card>
        <Form {...form}>
          <form action={formAction} className="h-full flex flex-col">
            <CardHeader>
              <CardTitle>Your Financial Details</CardTitle>
              <CardDescription>Enter your monthly income, expenses, and goals to get personalized AI-powered suggestions.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="income"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Monthly Income (INR)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 50000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <fieldset>
                <legend className="text-sm font-medium mb-2">Monthly Expenses (INR)</legend>
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="expenses_housing"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Housing</FormLabel>
                            <FormControl>
                            <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="expenses_food"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Food</FormLabel>
                            <FormControl>
                            <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="expenses_transport"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Transport</FormLabel>
                            <FormControl>
                            <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="expenses_entertainment"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Entertainment</FormLabel>
                            <FormControl>
                            <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="expenses_other"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Other</FormLabel>
                            <FormControl>
                            <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                </div>
              </fieldset>
              <FormField
                control={form.control}
                name="financialGoals"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Financial Goals</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., Save for a down payment, build an emergency fund..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="mt-auto">
              <SubmitButton />
            </CardFooter>
          </form>
        </Form>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>AI Budgeting Suggestions</CardTitle>
          <CardDescription>Our AI will generate actionable tips based on your input.</CardDescription>
        </CardHeader>
        <CardContent>
          {state.isSuccess && state.suggestions ? (
            <div className="space-y-4 p-4 bg-muted rounded-lg">
                <ul className="space-y-2">
                    {state.suggestions.map((suggestion, index) => (
                        <li key={index} className="flex items-start gap-2">
                           <Sparkles className="h-4 w-4 mt-1 text-primary flex-shrink-0" /> 
                           <span className="text-sm text-foreground">{suggestion}</span>
                        </li>
                    ))}
                </ul>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-[28rem] rounded-lg border-2 border-dashed">
              <Wand className="h-12 w-12 mb-4" />
              <p>Your personalized budgeting tips will appear here.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

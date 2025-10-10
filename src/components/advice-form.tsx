'use client';

import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { getAdviceAction } from '@/app/(app)/advice/actions';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Bot, Loader2, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const adviceFormSchema = z.object({
  simulationData: z.string().min(1, { message: 'Simulation data cannot be empty.' }),
  learningProgress: z.string().min(1, { message: 'Learning progress cannot be empty.' }),
  userGoals: z.string().min(1, { message: 'User goals cannot be empty.' }),
});

export type AdviceFormState = {
  message: string;
  advice?: string;
  isSuccess: boolean;
};

const initialState: AdviceFormState = {
  message: '',
  isSuccess: false,
};

const defaultValues = {
  simulationData: JSON.stringify({
    portfolioValue: 125000,
    totalInvestment: 100000,
    topHoldings: [
      { stock: "RELIANCE.NS", profit: 5000 },
      { stock: "HDFCBANK.NS", loss: -2000 }
    ],
    riskProfile: "moderate"
  }, null, 2),
  learningProgress: JSON.stringify({
    completedModules: ["Budgeting", "SIPs"],
    quizScores: {
      "Budgeting": "85%",
      "SIPs": "92%"
    }
  }, null, 2),
  userGoals: JSON.stringify([
    "Save for a down payment on a house in 5 years",
    "Build an emergency fund of 6 months' expenses"
  ], null, 2)
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
      Generate Advice
    </Button>
  );
}

export function AdviceForm() {
  const [state, formAction] = useActionState(getAdviceAction, initialState);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof adviceFormSchema>>({
    resolver: zodResolver(adviceFormSchema),
    defaultValues,
  });

  useEffect(() => {
    if (state.message) {
      if (!state.isSuccess) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: state.message,
        });
      } else if (state.isSuccess) {
        toast({
          title: 'Success',
          description: state.message,
        });
      }
    }
  }, [state, toast]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
      <Card>
        <Form {...form}>
          <form action={formAction} className="h-full flex flex-col">
            <CardHeader>
              <CardTitle>Your Financial Context</CardTitle>
              <CardDescription>Provide data about your progress to get AI-powered tips.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="simulationData"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Virtual Portfolio Data</FormLabel>
                    <FormControl>
                      <Textarea className="font-code h-36" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="learningProgress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Learning Progress Data</FormLabel>
                    <FormControl>
                      <Textarea className="font-code h-32" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="userGoals"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Financial Goals</FormLabel>
                    <FormControl>
                      <Textarea className="font-code h-28" {...field} />
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
          <CardTitle>Your Personalized Advice</CardTitle>
          <CardDescription>Our AI financial advisor will generate tips just for you.</CardDescription>
        </CardHeader>
        <CardContent>
          {state.isSuccess && state.advice ? (
            <div className="space-y-4 p-4 bg-muted rounded-lg">
                <p className="text-sm text-foreground leading-relaxed">{state.advice}</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-[28rem] rounded-lg border-2 border-dashed">
              <Bot className="h-12 w-12 mb-4" />
              <p>Your personalized financial advice will appear here.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

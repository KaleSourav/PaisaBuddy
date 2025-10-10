
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Pencil } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const budgetUpdateSchema = z.object({
  income: z.coerce.number().positive(),
  savingsGoal: z.coerce.number().positive(),
  expenses: z.array(z.object({
    name: z.string(),
    value: z.coerce.number().min(0),
    target: z.coerce.number().min(0),
    color: z.string(),
  }))
});

type BudgetUpdateFormValues = z.infer<typeof budgetUpdateSchema>;

type UpdateBudgetDialogProps = {
  currentData: BudgetUpdateFormValues;
  onUpdate: (data: BudgetUpdateFormValues) => void;
};

export function UpdateBudgetDialog({ currentData, onUpdate }: UpdateBudgetDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<BudgetUpdateFormValues>({
    resolver: zodResolver(budgetUpdateSchema),
    defaultValues: currentData,
  });

  // Reset form when currentData changes to avoid stale state
  useEffect(() => {
    form.reset(currentData);
  }, [currentData, form]);

  const onSubmit = (data: BudgetUpdateFormValues) => {
    onUpdate(data);
    toast({
      title: 'Success!',
      description: 'Your budget has been updated.',
    });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Pencil className="mr-2 h-4 w-4" />
          Edit Budget
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Your Budget</DialogTitle>
          <DialogDescription>
            Adjust your monthly income, expenses, and goals.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="income"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monthly Income</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="savingsGoal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monthly Savings Goal</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div>
              <h3 className="mb-2 text-sm font-medium">Expenses & Targets</h3>
              <div className="space-y-2">
                {form.watch('expenses').map((expense, index) => (
                  <div key={index} className="grid grid-cols-2 gap-4 items-center">
                     <FormField
                      control={form.control}
                      name={`expenses.${index}.value`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{expense.name} (Actual)</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`expenses.${index}.target`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{expense.name} (Target)</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                           <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                ))}
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

'use client';

import { useState, useEffect, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import {
  buyStockAction,
} from '@/app/(app)/portfolio/actions';
import type { Holding, BuyStockState } from '@/app/(app)/portfolio/types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
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
import { Loader2 } from 'lucide-react';

const initialState: BuyStockState = {
  message: '',
  isSuccess: false,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Confirm Buy'}
    </Button>
  );
}

type BuyStockDialogProps = {
  stock: {
    ticker: string;
    name: string;
    price: number;
  };
  availableFunds: number;
  currentHoldings: Holding[];
  onBuySuccess: (newHoldings: Holding[], newFunds: number) => void;
};

const buyStockFormSchema = z.object({
  ticker: z.string(),
  name: z.string(),
  price: z.number(),
  quantity: z.coerce.number().int().positive('Quantity must be a positive number.'),
  availableFunds: z.number(),
  currentHoldings: z.any(),
});


export function BuyStockDialog({
  stock,
  availableFunds,
  currentHoldings,
  onBuySuccess,
}: BuyStockDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [state, formAction] = useActionState(buyStockAction, initialState);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof buyStockFormSchema>>({
    resolver: zodResolver(buyStockFormSchema),
    defaultValues: {
      ticker: stock.ticker,
      name: stock.name,
      price: stock.price,
      quantity: 1,
      availableFunds,
      currentHoldings,
    },
  });

  const quantity = form.watch('quantity');
  const totalCost = (quantity || 0) * stock.price;

  useEffect(() => {
    if (!state.message) return;

    if (state.isSuccess) {
      toast({
        title: 'Success',
        description: state.message,
      });
      if (state.updatedHoldings && state.updatedFunds !== undefined) {
        onBuySuccess(state.updatedHoldings, state.updatedFunds);
      }
      setIsOpen(false);
      form.reset({
          ...form.getValues(),
          quantity: 1
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: state.message,
      });
    }
  }, [state, toast, onBuySuccess, form]);
  
  // Update hidden form fields when props change
  useEffect(() => {
    form.setValue('price', stock.price);
    form.setValue('availableFunds', availableFunds);
    form.setValue('currentHoldings', currentHoldings);
  }, [stock.price, availableFunds, currentHoldings, form]);


  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">Buy</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Buy {stock.name}</DialogTitle>
          <DialogDescription>
            Market Price: ₹{stock.price.toFixed(2)}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form action={formAction}>
            <input type="hidden" {...form.register('ticker')} />
            <input type="hidden" {...form.register('name')} />
            <input type="hidden" {...form.register('price')} />
            <input type="hidden" {...form.register('availableFunds')} />
            <input type="hidden" name="currentHoldings" value={JSON.stringify(currentHoldings)} />
            
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="text-sm text-muted-foreground">
                  <div className="flex justify-between">
                      <span>Total Cost:</span>
                      <span>₹{totalCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                      <span>Funds after purchase:</span>
                      <span className={availableFunds - totalCost < 0 ? 'text-destructive' : ''}>
                        ₹{(availableFunds - totalCost).toFixed(2)}
                      </span>
                  </div>
              </div>
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <SubmitButton />
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

'use client';

import { useState, useEffect, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import {
  sellStockAction,
} from '@/app/(app)/portfolio/actions';
import type { Holding, SellStockState } from '@/app/(app)/portfolio/types';
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

const initialState: SellStockState = {
  message: '',
  isSuccess: false,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full" variant="destructive">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Confirm Sell'}
    </Button>
  );
}

type SellStockDialogProps = {
  holding: Holding;
  marketPrice: number;
  availableFunds: number;
  currentHoldings: Holding[];
  onSellSuccess: (newHoldings: Holding[], newFunds: number) => void;
};

const sellStockFormSchema = z.object({
  ticker: z.string(),
  price: z.number(),
  quantity: z.coerce.number().int().positive('Quantity must be a positive number.'),
  availableFunds: z.number(),
  currentHoldings: z.any(),
});


export function SellStockDialog({
  holding,
  marketPrice,
  availableFunds,
  currentHoldings,
  onSellSuccess,
}: SellStockDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [state, formAction] = useActionState(sellStockAction, initialState);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof sellStockFormSchema>>({
    resolver: zodResolver(sellStockFormSchema),
    defaultValues: {
      ticker: holding.ticker,
      price: marketPrice,
      quantity: 1,
      availableFunds,
      currentHoldings,
    },
  });

  const quantity = form.watch('quantity');
  const totalProceeds = (quantity || 0) * marketPrice;

  useEffect(() => {
    if (!state.message) return;

    if (state.isSuccess) {
      toast({
        title: 'Success',
        description: state.message,
      });
      if (state.updatedHoldings && state.updatedFunds !== undefined) {
        onSellSuccess(state.updatedHoldings, state.updatedFunds);
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
  }, [state, toast, onSellSuccess, form]);
  
  useEffect(() => {
    form.setValue('price', marketPrice);
    form.setValue('availableFunds', availableFunds);
    form.setValue('currentHoldings', currentHoldings);
  }, [marketPrice, availableFunds, currentHoldings, form]);


  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="destructive">Sell</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Sell {holding.name}</DialogTitle>
          <DialogDescription>
            You own {holding.quantity} shares. Market Price: ₹{marketPrice.toFixed(2)}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form action={formAction}>
            <input type="hidden" {...form.register('ticker')} />
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
                      <Input type="number" min="1" max={holding.quantity} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="text-sm text-muted-foreground">
                  <div className="flex justify-between">
                      <span>Total Proceeds:</span>
                      <span>₹{totalProceeds.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                      <span>Funds after sale:</span>
                      <span>
                        ₹{(availableFunds + totalProceeds).toFixed(2)}
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

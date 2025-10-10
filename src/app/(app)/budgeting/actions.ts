'use server';

import { getBudgetingSuggestions } from '@/ai/flows/personalized-budgeting-suggestions';
import { z } from 'zod';

const budgetingFormSchema = z.object({
  income: z.coerce.number().positive({ message: 'Monthly income must be a positive number.' }),
  expenses_housing: z.coerce.number().min(0),
  expenses_food: z.coerce.number().min(0),
  expenses_transport: z.coerce.number().min(0),
  expenses_entertainment: z.coerce.number().min(0),
  expenses_other: z.coerce.number().min(0),
  financialGoals: z.string().min(10, { message: 'Please describe your financial goals in a bit more detail.' }),
});

export type FormState = {
  message: string;
  suggestions?: string[];
  isSuccess: boolean;
};

export async function getSuggestionsAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = budgetingFormSchema.safeParse({
    income: formData.get('income'),
    expenses_housing: formData.get('expenses_housing'),
    expenses_food: formData.get('expenses_food'),
    expenses_transport: formData.get('expenses_transport'),
    expenses_entertainment: formData.get('expenses_entertainment'),
    expenses_other: formData.get('expenses_other'),
    financialGoals: formData.get('financialGoals'),
  });
  
  if (!validatedFields.success) {
    return {
      message: 'There was an error with your submission.',
      isSuccess: false,
    };
  }

  const { income, financialGoals, ...expensesFields } = validatedFields.data;
  
  const expenses = {
      Housing: expensesFields.expenses_housing,
      Food: expensesFields.expenses_food,
      Transport: expensesFields.expenses_transport,
      Entertainment: expensesFields.expenses_entertainment,
      Other: expensesFields.expenses_other,
  }

  try {
    const result = await getBudgetingSuggestions({
      income,
      expenses,
      financialGoals: [financialGoals],
    });

    if (result.suggestions && result.suggestions.length > 0) {
      return {
        message: 'Here are your personalized suggestions!',
        suggestions: result.suggestions,
        isSuccess: true,
      };
    } else {
      return { message: 'Could not generate suggestions. Please try again.', isSuccess: false };
    }
  } catch (error) {
    console.error(error);
    return { message: 'An unexpected error occurred. Please try again later.', isSuccess: false };
  }
}

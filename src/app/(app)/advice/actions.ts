'use server';

import { getPersonalizedFinancialAdvice } from '@/ai/flows/personalized-financial-advice';
import { z } from 'zod';

const adviceFormSchema = z.object({
  simulationData: z.string().min(1, { message: 'Simulation data cannot be empty.' }),
  learningProgress: z.string().min(1, { message: 'Learning progress cannot be empty.' }),
  userGoals: z.string().min(1, { message: 'User goals cannot be empty.' }),
});

export type AdviceFormState = {
  message: string;
  advice?: string;
  isSuccess: boolean;
};

export async function getAdviceAction(
  prevState: AdviceFormState,
  formData: FormData
): Promise<AdviceFormState> {
  const validatedFields = adviceFormSchema.safeParse({
    simulationData: formData.get('simulationData'),
    learningProgress: formData.get('learningProgress'),
    userGoals: formData.get('userGoals'),
  });

  if (!validatedFields.success) {
    return {
      message: 'All fields are required. Please check your input.',
      isSuccess: false,
    };
  }

  try {
    const result = await getPersonalizedFinancialAdvice(validatedFields.data);

    if (result.advice) {
      return {
        message: 'Here is your personalized financial advice!',
        advice: result.advice,
        isSuccess: true,
      };
    } else {
      return { message: 'Could not generate advice. Please try again.', isSuccess: false };
    }
  } catch (error) {
    console.error(error);
    // Provide fallback advice when the AI service is unavailable
    const fallbackAdvice = `Based on your portfolio and goals, here are some general recommendations:
    
1. Consider diversifying your investments beyond just Reliance and HDFC Bank to reduce risk.
2. Your moderate risk profile aligns well with a mix of blue-chip stocks and some growth opportunities.
3. For your house down payment goal, consider allocating funds to a separate high-interest savings account.
4. Your emergency fund goal is excellent - aim to keep this in liquid investments.
5. Since you've completed the Budgeting and SIPs modules with good scores, consider applying these concepts to automate your investments.`;
    
    return { 
      message: 'AI service is currently unavailable. Showing general advice instead.',
      advice: fallbackAdvice,
      isSuccess: true 
    };
  }
}

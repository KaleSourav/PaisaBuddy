'use server';

/**
 * @fileOverview Provides personalized financial advice based on user's simulation data and learning progress.
 *
 * - getPersonalizedFinancialAdvice - A function that generates personalized financial tips.
 * - PersonalizedFinancialAdviceInput - The input type for the getPersonalizedFinancialAdvice function.
 * - PersonalizedFinancialAdviceOutput - The return type for the getPersonalizedFinancialAdvice function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedFinancialAdviceInputSchema = z.object({
  simulationData: z
    .string()
    .describe('The user\'s virtual portfolio simulation data, as a JSON string.'),
  learningProgress: z
    .string()
    .describe('The user\'s learning progress data, as a JSON string.'),
  userGoals: z
    .string()
    .describe('A list of user defined financial goals, as a JSON string.'),
});
export type PersonalizedFinancialAdviceInput = z.infer<
  typeof PersonalizedFinancialAdviceInputSchema
>;

const PersonalizedFinancialAdviceOutputSchema = z.object({
  advice: z
    .string()
    .describe('Personalized financial advice based on the user data.'),
});
export type PersonalizedFinancialAdviceOutput = z.infer<
  typeof PersonalizedFinancialAdviceOutputSchema
>;

export async function getPersonalizedFinancialAdvice(
  input: PersonalizedFinancialAdviceInput
): Promise<PersonalizedFinancialAdviceOutput> {
  return personalizedFinancialAdviceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedFinancialAdvicePrompt',
  input: {schema: PersonalizedFinancialAdviceInputSchema},
  output: {schema: PersonalizedFinancialAdviceOutputSchema},
  prompt: `You are a financial advisor providing personalized advice to young Indian adults.

  Analyze the user's virtual portfolio simulation data, learning progress, and stated financial goals to provide tailored recommendations.

  Simulation Data: {{{simulationData}}}
  Learning Progress: {{{learningProgress}}}
  User Goals: {{{userGoals}}}

  Provide specific, actionable tips to help the user improve their financial literacy and achieve their goals within the Indian financial context.
  Consider various investment options, budgeting strategies, and fraud prevention measures relevant to the Indian market.
  The advice should be concise and easy to understand.
  `,
});

const personalizedFinancialAdviceFlow = ai.defineFlow(
  {
    name: 'personalizedFinancialAdviceFlow',
    inputSchema: PersonalizedFinancialAdviceInputSchema,
    outputSchema: PersonalizedFinancialAdviceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

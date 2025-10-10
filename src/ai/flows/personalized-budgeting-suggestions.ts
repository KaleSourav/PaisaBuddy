// src/ai/flows/personalized-budgeting-suggestions.ts
'use server';

/**
 * @fileOverview Provides personalized budgeting suggestions based on user's financial data.
 *
 * - getBudgetingSuggestions - A function that generates budgeting suggestions.
 * - BudgetingSuggestionsInput - The input type for the getBudgetingSuggestions function.
 * - BudgetingSuggestionsOutput - The return type for the getBudgetingSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const BudgetingSuggestionsInputSchema = z.object({
  income: z.number().describe('Monthly income of the user.'),
  expenses: z.record(z.string(), z.number()).describe('A map of expense categories and their amounts.'),
  financialGoals: z.array(z.string()).describe('List of financial goals the user wants to achieve.'),
});
export type BudgetingSuggestionsInput = z.infer<typeof BudgetingSuggestionsInputSchema>;

const BudgetingSuggestionsOutputSchema = z.object({
  suggestions: z.array(z.string()).describe('Personalized suggestions to improve budgeting.'),
});
export type BudgetingSuggestionsOutput = z.infer<typeof BudgetingSuggestionsOutputSchema>;

export async function getBudgetingSuggestions(input: BudgetingSuggestionsInput): Promise<BudgetingSuggestionsOutput> {
  return budgetingSuggestionsFlow(input);
}

const budgetingSuggestionsPrompt = ai.definePrompt({
  name: 'budgetingSuggestionsPrompt',
  input: {schema: BudgetingSuggestionsInputSchema},
  output: {schema: BudgetingSuggestionsOutputSchema},
  prompt: `You are a personal finance advisor. Provide personalized budgeting suggestions based on the user's financial information and goals.

User Income: {{{income}}}
User Expenses:
{{#each expenses}}
  - {{key}}: {{{this}}}
{{/each}}
User Goals: {{#each financialGoals}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

Provide specific and actionable suggestions.`,
});

const budgetingSuggestionsFlow = ai.defineFlow(
  {
    name: 'budgetingSuggestionsFlow',
    inputSchema: BudgetingSuggestionsInputSchema,
    outputSchema: BudgetingSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await budgetingSuggestionsPrompt(input);
    return output!;
  }
);

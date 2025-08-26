'use server';
/**
 * @fileOverview A flow for generating a study performance summary.
 *
 * - generateSummary - A function that analyzes study sessions and returns a summary.
 * - GenerateSummaryInput - The input type for the generateSummary function.
 * - GenerateSummaryOutput - The return type for the generateSummary function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import type { StudySession } from '@/lib/types';

const GenerateSummaryInputSchema = z.array(z.object({
    id: z.string(),
    activityId: z.string(),
    startTime: z.date(),
    endTime: z.date(),
    duration: z.number().describe('Duration in minutes'),
    subject: z.string(),
}));

export type GenerateSummaryInput = z.infer<typeof GenerateSummaryInputSchema>;

const GenerateSummaryOutputSchema = z.string().describe("A concise and insightful summary of the study performance, written in Brazilian Portuguese.");

export type GenerateSummaryOutput = z.infer<typeof GenerateSummaryOutputSchema>;


export async function generateSummary(input: StudySession[]): Promise<GenerateSummaryOutput> {
  // We need to transform the input to match the schema, as dates are not directly supported in the prompt input
  const flowInput = input.map(session => ({
    ...session,
    startTime: session.startTime.toISOString(),
    endTime: session.endTime.toISOString(),
  }));
  return generateSummaryFlow(flowInput as any);
}

const prompt = ai.definePrompt({
  name: 'generateSummaryPrompt',
  input: { schema: GenerateSummaryInputSchema },
  output: { schema: GenerateSummaryOutputSchema },
  prompt: `Você é um coach de estudos motivacional e analítico. Sua tarefa é analisar a lista de sessões de estudo fornecida e gerar um resumo conciso (2-3 frases) em português do Brasil.

O resumo deve:
1.  Começar com um reforço positivo sobre o esforço do estudante.
2.  Destacar o tempo total de estudo ou a matéria mais focada.
3.  Oferecer uma sugestão ou observação útil para os próximos estudos.
4.  Manter um tom encorajador e amigável.

Não liste cada sessão. Crie um parágrafo coeso e útil.

Aqui estão os dados das sessões de estudo:
{{#each @last}}
- Matéria: {{subject}}, Duração: {{duration}} minutos.
{{/each}}
`,
});

const generateSummaryFlow = ai.defineFlow(
  {
    name: 'generateSummaryFlow',
    inputSchema: GenerateSummaryInputSchema,
    outputSchema: GenerateSummaryOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
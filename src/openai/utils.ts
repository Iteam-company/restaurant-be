import { z } from 'zod/v4';

export const QuestionSchema = z.object({
  id: z.number().int(),
  text: z.string(),
  variants: z.array(z.string()),
  correct: z.array(z.number().int()),
  multipleCorrect: z.boolean(),
});

export const QuizSchema = z.object({
  id: z.number().int(),
  title: z.string(),
  createdAt: z.string(),
  questions: z.array(QuestionSchema),
  difficultyLevel: z.enum(['easy', 'medium', 'hard']),
  timeLimit: z.number().int(),
  status: z.literal('not-started'),
});

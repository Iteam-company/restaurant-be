import { Injectable } from '@nestjs/common';
import {
  generateNewQuestionBasedOnPrevious,
  generateQuizSystemPrompt,
} from './prompts';

import { generateObject, ModelMessage } from 'ai';
import { openai } from '@ai-sdk/openai';
import { QuestionSchema, QuizSchema } from './utils';
import { Question } from 'src/types/entity/question.entity';

@Injectable()
export class OpenaiService {
  constructor() {}

  async generateQuiz(
    filesBlob: Array<Express.Multer.File>,
    prompt?: string,
    count: number = 5,
  ): Promise<string> {
    const result = await generateObject({
      model: openai('gpt-5'),
      schema: QuizSchema,
      messages: [
        generateQuizSystemPrompt,
        ...(prompt ? [{ role: 'user', content: prompt } as ModelMessage] : []),
        {
          role: 'user',
          content: `Generate ${count} quiz questions based on the following content`,
        },
        {
          role: 'user',
          content: filesBlob.map((file) => ({
            type: 'file',
            data: file.buffer,
            mediaType: file.mimetype,
          })),
        },
      ],
    });

    return JSON.stringify(result.object);
  }

  async generateQuestion(
    filesBlob: Array<Express.Multer.File>,
    prompt?: string,
    previousQuestions?: Array<Question>,
    count: number = 5,
  ) {
    const result = await generateObject({
      model: openai('gpt-5'),
      output: 'array',
      schema: QuestionSchema,
      messages: [
        generateQuizSystemPrompt,
        ...(previousQuestions
          ? [
              {
                role: 'system',
                content: `${generateNewQuestionBasedOnPrevious}
                Previous questions: ${JSON.stringify(previousQuestions)}`,
              } as ModelMessage,
            ]
          : []),
        ...(prompt ? [{ role: 'user', content: prompt } as ModelMessage] : []),
        {
          role: 'user',
          content: `Generate ${count} quiz questions based on the following content`,
        },
        {
          role: 'user',
          content: filesBlob.map((file) => ({
            type: 'file',
            data: file.buffer,
            mediaType: file.mimetype,
          })),
        },
      ],
    });

    return JSON.stringify(result.object);
  }
}

import { BadRequestException, Injectable } from '@nestjs/common';
import {
  generateNewQuestionBasedOnPrevious,
  generateQuizSystemPrompt,
} from './prompts';
import {
  FilePart,
  generateObject,
  ModelMessage,
  NoObjectGeneratedError,
  TextPart,
} from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { QuestionSchema, QuizSchema } from './utils';
import { Question } from 'src/types/entity/question.entity';
import { ConfigService } from '@nestjs/config';
import { Quiz } from 'src/types/entity/quiz.entity';
import * as mammoth from 'mammoth';

@Injectable()
export class OpenaiService {
  constructor(private readonly configService: ConfigService) {
    this.openai = createOpenAI({
      apiKey: configService.getOrThrow('OPENAI_API_KEY'),
    });
  }

  private openai;

  async generateQuiz(
    filesBlob: Array<Express.Multer.File>,
    prompt?: string,
    count?: number,
  ): Promise<Quiz> {
    try {
      const result = await generateObject({
        model: this.openai('gpt-5-mini'),
        schema: QuizSchema,
        messages: [
          generateQuizSystemPrompt,
          ...(prompt
            ? [{ role: 'user', content: prompt } as ModelMessage]
            : []),
          ...(count
            ? [
                {
                  role: 'user',
                  content: `Generate ${count} quiz questions based on the following content`,
                } as ModelMessage,
              ]
            : []),
          {
            role: 'user',
            content: await Promise.all(
              filesBlob.map(async (file) => this.parseFile(file)),
            ),
          },
        ],
      });

      return result.object as unknown as Quiz;
    } catch (error) {
      if (NoObjectGeneratedError.isInstance(error)) {
        console.log('NoObjectGeneratedError');
        console.log('Cause:', error.cause);
        console.log('Text:', error.text);
        console.log('Response:', error.response);
        console.log('Usage:', error.usage);
      }
      throw new BadRequestException(
        'Generated object do not valid of schema, try again.',
      );
    }
  }

  async generateQuestion(
    filesBlob: Array<Express.Multer.File>,
    prompt?: string,
    previousQuestions?: Array<Question>,
    count?: number,
  ) {
    try {
      const result = await generateObject({
        model: this.openai('gpt-5-mini'),
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
          ...(prompt
            ? [{ role: 'user', content: prompt } as ModelMessage]
            : []),
          ...(count
            ? [
                {
                  role: 'user',
                  content: `Generate ${count} quiz questions based on the following content`,
                } as ModelMessage,
              ]
            : []),
          {
            role: 'user',
            content: await Promise.all(
              filesBlob.map(async (file) => this.parseFile(file)),
            ),
          },
        ],
      });

      return result.object as unknown as Question[];
    } catch (error) {
      console.log(error);
      if (NoObjectGeneratedError.isInstance(error)) {
        console.log('NoObjectGeneratedError');
        console.log('Cause:', error.cause);
        console.log('Text:', error.text);
        console.log('Response:', error.response);
        console.log('Usage:', error.usage);
      }
      throw new BadRequestException(
        'Generated object do not valid of schema, try again.',
      );
    }
  }

  private async parseFile(
    file: Express.Multer.File,
  ): Promise<FilePart | TextPart> {
    switch (file.mimetype) {
      case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
      case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        return {
          type: 'text',
          text: (await mammoth.extractRawText({ buffer: file.buffer })).value,
        };

      default:
        return {
          type: 'file',
          data: file.buffer.toString('base64'),
          mediaType: file.mimetype,
          filename: file.filename,
        };
    }
  }
}

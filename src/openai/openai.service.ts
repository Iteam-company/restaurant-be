import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { CreateQuestionDto } from 'src/question/dto/create-question.dto';
import { basePrompt, generateQuizSystemPrompt } from './prompts';
import {
  extractTextFromDocx,
  extractTextFromImage,
  extractTextFromPdf,
} from './utils';
import { Quiz } from 'src/types/entity/quiz.entity';

@Injectable()
export class OpenaiService {
  constructor() {
    this.client = new OpenAI({
      apiKey: new ConfigService().get('OPENAI_API_KEY'),
    });
  }

  private client: OpenAI;

  private async extractTextFromFile(
    file: Express.Multer.File,
  ): Promise<string> {
    const ext = file.originalname.split('.').pop()?.toLowerCase();

    if (ext === 'pdf') return extractTextFromPdf(file);
    if (ext === 'docx' || ext === 'doc') return extractTextFromDocx(file);
    if (['jpg', 'jpeg', 'png', 'bmp', 'tiff'].includes(ext))
      return extractTextFromImage(file);

    return file.buffer.toString('utf-8');
  }

  async generateQuiz(
    filesBlob: Array<Express.Multer.File>,
    prompt?: string,
    count: number = 5,
  ): Promise<Quiz> {
    const filesText = (
      await Promise.all(filesBlob.map((f) => this.extractTextFromFile(f)))
    ).join('\n\n');

    const completion = await this.client.chat.completions.create({
      model: 'gpt-5',
      messages: [
        generateQuizSystemPrompt,
        {
          role: 'user',
          content: `Generate ${count} quiz questions based on the following content:\n\n${filesText}`,
        },
        prompt && { role: 'user', content: prompt },
      ],
    });

    const result: Quiz = JSON.parse(completion.choices[0].message.content);
    result.status = 'not-started';

    return result;
  }

  async getQuestions(count: number = 10): Promise<[CreateQuestionDto]> {
    return JSON.parse(
      (
        await this.client.chat.completions.create({
          messages: [{ role: 'user', content: await this.fillPrompt(count) }],
          model: 'o1-mini',
        })
      ).choices?.[0]?.message.content
        .replace('```json', '')
        .replace('```', ''),
    );
  }

  private async fillPrompt(questionCount: number) {
    return basePrompt
      .replace('${number_of_questions}', questionCount.toString())
      .replace('${Question}', await this.getResponseSchema())
      .replace('${array of quizItem elements}', '')
      .replaceAll('\n', '');
  }

  private async getResponseSchema() {
    return `
    class CreateQuestionDto {
        text: string;
        variants: string[];
        correct: number[];
        multipleCorrect: boolean;
        quizId: number;
    }
  `;
  }
}

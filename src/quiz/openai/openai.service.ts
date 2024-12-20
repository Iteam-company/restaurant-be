import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { MenuService } from 'src/menu/menu.service';
import { CreateQuestionDto } from 'src/question/dto/create-question.dto';
// import * as path from 'path';
// import * as fs from 'fs';

@Injectable()
export class OpenaiService {
  constructor(
    @Inject(forwardRef(() => MenuService))
    private readonly menuService: MenuService,
  ) {
    this.client = new OpenAI({
      apiKey: new ConfigService().get('OPENAI_API_KEY_'),
    });

    // this.prompt = this.copyTextFromFile(
    //   path.resolve(__dirname, './prompt.txt'),
    // );
  }

  private prompt: string =
    'Based on the following json input provide a ${number_of_questions} questions for a quiz, based on the schema ${Question} in JSON array output ${array of quizItem elements}';
  private client: OpenAI;

  async getQuestions(
    menuId: number,
    count: number = 10,
  ): Promise<[CreateQuestionDto]> {
    return JSON.parse(
      (
        await this.client.chat.completions.create({
          messages: [
            { role: 'user', content: await this.fillPrompt(count, menuId) },
          ],
          model: 'o1-mini',
        })
      ).choices?.[0]?.message.content
        .replace('```json', '')
        .replace('```', ''),
    );
  }

  private async fillPrompt(questionCount: number, menuId: number) {
    return this.prompt
      .replace('${number_of_questions}', questionCount.toString())
      .replace('${Question}', await this.getResponceSchema())
      .replace(
        '${array of quizItem elements}',
        JSON.stringify(await this.menuService.getAllForPrompt(menuId)),
      )
      .replaceAll('\n', '');
  }

  // private copyTextFromFile(filePath: string): string {
  //   try {
  //     const filePathResolved = path.resolve(filePath).replace('dist', 'src');
  //     const text = fs.readFileSync(filePathResolved, { encoding: 'utf-8' });
  //     return text;
  //   } catch (error) {
  //     console.error(`Error reading file at ${filePath}:`, error);
  //     throw error;
  //   }
  // }

  private async getResponceSchema() {
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

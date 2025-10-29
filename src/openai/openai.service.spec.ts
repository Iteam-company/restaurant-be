import { Test, TestingModule } from '@nestjs/testing';
import { OpenaiService } from './openai.service';
import { ConfigModule } from '@nestjs/config';
import { readFile } from 'fs/promises';
import { join } from 'path';

describe('OpenaiService', () => {
  jest.setTimeout(30000);

  let service: OpenaiService;

  let file: Express.Multer.File;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: '.env',
          isGlobal: true,
        }),
      ],
      providers: [OpenaiService],
    }).compile();

    const buffer = await readFile(
      join(process.cwd(), 'src/test/word-test.docx'),
    );

    file = {
      fieldname: 'file',
      originalname: 'word-test.docx',
      encoding: '7bit',
      mimetype:
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      size: buffer.length,
      buffer,
    } as Express.Multer.File;

    service = module.get<OpenaiService>(OpenaiService);
  });

  it('should be defined', () => {
    expect(file).toBeDefined();
    expect(service).toBeDefined();
  });

  it('should return generated quiz and question', async () => {
    const questionsCount = 2;
    const [quiz, question] = await Promise.all([
      service.generateQuiz([file], undefined, questionsCount),
      service.generateQuestion([file], undefined, undefined, questionsCount),
    ]);

    // question test
    expect(question).toBeDefined();
    expect(question.length).toEqual(questionsCount);

    // quiz test
    expect(quiz).toBeDefined();
    expect(quiz.status).toBe('not-started');
    expect(quiz.questions.length).toEqual(questionsCount);
  });
});

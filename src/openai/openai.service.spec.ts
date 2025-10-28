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
      originalname: 'word-test.pdf',
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

  it('should generate questions with const count', async () => {
    const questionsCount = 2;
    const result = await service.generateQuestion(
      [file],
      undefined,
      undefined,
      questionsCount,
    );

    expect(result).toBeDefined();
    expect(result.length).toEqual(questionsCount);
  });

  it('should generate quiz with const count of question', async () => {
    const questionsCount = 2;
    const result = await service.generateQuiz(
      [file],
      undefined,
      questionsCount,
    );

    expect(result).toBeDefined();
    expect(result.status).toBe('not-started');
    expect(result.questions.length).toEqual(questionsCount);
  });
});

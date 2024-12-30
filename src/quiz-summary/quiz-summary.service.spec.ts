import { Test, TestingModule } from '@nestjs/testing';
import { QuizSummaryService } from './quiz-summary.service';

describe('QuizSummaryService', () => {
  let service: QuizSummaryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuizSummaryService],
    }).compile();

    service = module.get<QuizSummaryService>(QuizSummaryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

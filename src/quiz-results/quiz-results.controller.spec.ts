import { Test, TestingModule } from '@nestjs/testing';
import { QuizResultsController } from './quiz-results.controller';
import { QuizResultsService } from './quiz-results.service';

describe('QuizResultsController', () => {
  let controller: QuizResultsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuizResultsController],
      providers: [QuizResultsService],
    }).compile();

    controller = module.get<QuizResultsController>(QuizResultsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

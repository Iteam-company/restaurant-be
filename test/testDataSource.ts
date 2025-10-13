import { ConfigService } from '@nestjs/config';
import { Question } from '../src/types/entity/question.entity';
import { QuizResult } from '../src/types/entity/quiz-result.entity';
import { QuizSummary } from '../src/types/entity/quiz-summary.entity';
import { Quiz } from '../src/types/entity/quiz.entity';
import Restaurant from '../src/types/entity/restaurant.entity';
import User from '../src/types/entity/user.entity';
import { DataSourceOptions } from 'typeorm';

export const getTestDataSource = (
  configService: ConfigService,
): DataSourceOptions => {
  return {
    type: 'postgres',
    url: configService.get('TEST_DB_CONNECT'),
    entities: [User, Restaurant, Quiz, Question, QuizResult, QuizSummary],
    synchronize: true,
  };
};

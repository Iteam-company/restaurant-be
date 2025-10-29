import { Question } from './types/entity/question.entity';
import { QuizResult } from './types/entity/quiz-result.entity';
import { QuizSummary } from './types/entity/quiz-summary.entity';
import { Quiz } from './types/entity/quiz.entity';
import Restaurant from './types/entity/restaurant.entity';
import User from './types/entity/user.entity';
import { DataSource } from 'typeorm';

import * as dotenv from 'dotenv';
import { join } from 'path';

dotenv.config({ path: join(__dirname, '..', '.env.test') });

export const TestDataSource = new DataSource({
  type: 'postgres',
  url: process.env.TEST_DB_CONNECT,
  entities: [User, Restaurant, Quiz, Question, QuizResult, QuizSummary],
  synchronize: true,
});

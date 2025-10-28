import { DataSource } from 'typeorm';
import User from './types/entity/user.entity';
import Restaurant from './types/entity/restaurant.entity';
import { Quiz } from './types/entity/quiz.entity';
import { Question } from './types/entity/question.entity';
import { QuizResult } from './types/entity/quiz-result.entity';
import { QuizSummary } from './types/entity/quiz-summary.entity';
import 'dotenv/config';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DB_CONNECT,
  ssl:
    process.env.MODE === 'PRODUCTION' ? { rejectUnauthorized: false } : false,
  entities: [User, Restaurant, Quiz, Question, QuizResult, QuizSummary],
  migrations:
    process.env.MODE === 'PRODUCTION' ? ['dist/migrations/*.js'] : undefined,
  synchronize: false,
});

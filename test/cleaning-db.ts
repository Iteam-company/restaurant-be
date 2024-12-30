import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import User from '../src/types/entity/user.entity';
import Restaurant from '../src/types/entity/restaurant.entity';
import Menu from '../src/types/entity/menu.entity';
import MenuItem from '../src/types/entity/menu-item.entity';
import { Quiz } from '../src/types/entity/quiz.entity';
import { Question } from '../src/types/entity/question.entity';
import { QuizResult } from '../src/types/entity/quiz-result.entity';
import { QuizSummary } from '../src/types/entity/quiz-summary.entity';

dotenv.config();

const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.TEST_DB_CONNECT,
  entities: [
    User,
    Restaurant,
    Menu,
    MenuItem,
    Quiz,
    Question,
    QuizResult,
    QuizSummary,
  ],
  synchronize: true,
});

export default async function cleanDatabase() {
  try {
    await AppDataSource.initialize();

    const entities = AppDataSource.entityMetadatas;

    for (const entity of entities) {
      const repository = AppDataSource.getRepository(entity.name);
      await repository.delete({});
    }

    console.log('All tables cleared successfully.');
  } catch (error) {
    console.error('Error while cleaning the database:', error);
  } finally {
    await AppDataSource.destroy();
  }
}

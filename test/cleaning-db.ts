import * as dotenv from 'dotenv';
import { TestDataSource } from '../src/test-data-source';

dotenv.config();

const AppDataSource = TestDataSource;

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

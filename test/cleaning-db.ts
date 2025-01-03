import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { ConfigService } from '@nestjs/config';
import { getTestDataSource } from './testDataSource';

dotenv.config();

const AppDataSource = new DataSource(getTestDataSource(new ConfigService()));

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

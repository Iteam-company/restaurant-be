import { TestDataSource } from '../src/test-data-source';

export default async function globalTeardown() {
  const dataSource = TestDataSource.isInitialized
    ? TestDataSource
    : await TestDataSource.initialize();

  try {
    const entities = dataSource.entityMetadatas;
    const tableNames = entities.map((e) => `"${e.tableName}"`).join(', ');

    if (tableNames.length === 0) {
      console.warn('⚠️ No entities found to clean.');
      return;
    }

    await dataSource.query(
      `TRUNCATE TABLE ${tableNames} RESTART IDENTITY CASCADE;`,
    );
    console.log('✅ Database cleaned successfully (CASCADE)');
  } catch (error) {
    console.error('❌ Error while cleaning the database:', error);
    throw error;
  } finally {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
      console.log('🧹 Database connection closed.');
    }
  }
}

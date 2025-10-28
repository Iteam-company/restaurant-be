import { Test, TestingModule } from '@nestjs/testing';
import { HealthService } from './health.service';

import { TypeOrmModule } from '@nestjs/typeorm';
import { TestDataSource } from 'src/test-data-source';

describe('HealthService', () => {
  let service: HealthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(TestDataSource.options)],
      providers: [HealthService],
    }).compile();

    service = module.get<HealthService>(HealthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return health status', async () => {
    const result = await service.check();

    expect(result.status).toBe('ok');
    expect(result.database).toBe('ok');

    expect(typeof result.timestamp).toBe('string');

    expect(typeof result.uptime).toBe('number');
  });
});

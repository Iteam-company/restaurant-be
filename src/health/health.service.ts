import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class HealthService {
  constructor(private dataSource: DataSource) {}

  async check() {
    const dbStatus = await this.dataSource
      .query('SELECT 1')
      .then(() => 'ok')
      .catch(() => 'error');
    return {
      status: dbStatus === 'ok' ? 'ok' : 'error',
      uptime: process.uptime(),
      database: dbStatus,
      timestamp: new Date().toISOString(),
    };
  }
}

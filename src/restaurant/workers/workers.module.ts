import { Module } from '@nestjs/common';
import { WorkersController } from './workers.controller';
import { RestaurantModule } from '../restaurant.module';

@Module({
  imports: [RestaurantModule],
  controllers: [WorkersController],
  providers: [],
})
export class WorkersModule {}

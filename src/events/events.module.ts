import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { UserRestaurantEvents } from './user-restaurant.events';

@Module({
  imports: [EventEmitterModule.forRoot()],
  providers: [UserRestaurantEvents],
  exports: [UserRestaurantEvents],
})
export class EventsModule {}

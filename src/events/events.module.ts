import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { UserRestaurantEvents } from './user-restaurant.events';
import { QuizQuestionEvents } from './quiz-question.events';

@Module({
  imports: [EventEmitterModule.forRoot()],
  providers: [UserRestaurantEvents, QuizQuestionEvents],
  exports: [UserRestaurantEvents, QuizQuestionEvents],
})
export class EventsModule {}

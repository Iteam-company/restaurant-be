import { Module } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { QuizController } from './quiz.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Quiz } from 'src/types/entity/quiz.entity';
import { OpenaiModule } from 'src/openai/openai.module';
import { EventsModule } from 'src/events/events.module';
import Restaurant from 'src/types/entity/restaurant.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Quiz, Restaurant]),
    EventsModule,
    OpenaiModule,
  ],
  exports: [QuizService],
  controllers: [QuizController],
  providers: [QuizService],
})
export class QuizModule {}

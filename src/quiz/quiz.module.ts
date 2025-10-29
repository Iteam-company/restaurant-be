import { forwardRef, Module } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { QuizController } from './quiz.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Quiz } from 'src/types/entity/quiz.entity';
import { QuestionModule } from 'src/question/question.module';
import { OpenaiModule } from 'src/openai/openai.module';
import Restaurant from 'src/types/entity/restaurant.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Quiz, Restaurant]),
    forwardRef(() => QuestionModule),
    OpenaiModule,
  ],
  exports: [QuizService],
  controllers: [QuizController],
  providers: [QuizService],
})
export class QuizModule {}

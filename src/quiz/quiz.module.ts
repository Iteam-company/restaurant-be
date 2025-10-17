import { forwardRef, Module } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { QuizController } from './quiz.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Quiz } from 'src/types/entity/quiz.entity';
import { QuestionModule } from 'src/question/question.module';
import { OpenaiService } from './openai/openai.service';

@Module({
  imports: [TypeOrmModule.forFeature([Quiz]), forwardRef(() => QuestionModule)],
  exports: [QuizService],
  controllers: [QuizController],
  providers: [QuizService, OpenaiService],
})
export class QuizModule {}

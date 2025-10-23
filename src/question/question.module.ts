import { forwardRef, Module } from '@nestjs/common';
import { QuestionService } from './question.service';
import { QuestionController } from './question.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from 'src/types/entity/question.entity';
import { QuizModule } from 'src/quiz/quiz.module';
import { ConfigModule } from '@nestjs/config';
import { OpenaiModule } from 'src/openai/openai.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Question]),
    forwardRef(() => QuizModule),
    OpenaiModule,
    ConfigModule,
  ],
  exports: [QuestionService],
  controllers: [QuestionController],
  providers: [QuestionService],
})
export class QuestionModule {}

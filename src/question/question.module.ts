import { Module } from '@nestjs/common';
import { QuestionService } from './question.service';
import { QuestionController } from './question.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from 'src/types/entity/question.entity';
import { Quiz } from 'src/types/entity/quiz.entity';
import { OpenaiModule } from 'src/openai/openai.module';

@Module({
  imports: [TypeOrmModule.forFeature([Question, Quiz]), OpenaiModule],
  exports: [QuestionService],
  controllers: [QuestionController],
  providers: [QuestionService],
})
export class QuestionModule {}

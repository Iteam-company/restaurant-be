import { Module } from '@nestjs/common';
import { QuizSummaryService } from './quiz-summary.service';
import { QuizSummaryController } from './quiz-summary.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuizSummary } from 'src/types/entity/quiz-summary.entity';
import { QuizModule } from 'src/quiz/quiz.module';

@Module({
  imports: [TypeOrmModule.forFeature([QuizSummary]), QuizModule],
  controllers: [QuizSummaryController],
  providers: [QuizSummaryService],
})
export class QuizSummaryModule {}

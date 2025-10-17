import { Module } from '@nestjs/common';
import { QuizResultsService } from './quiz-results.service';
import { QuizResultsController } from './quiz-results.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuizResult } from 'src/types/entity/quiz-result.entity';
import { QuizModule } from 'src/quiz/quiz.module';
import { UserModule } from 'src/user/user.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([QuizResult]),
    QuizModule,
    UserModule,
    ConfigModule,
  ],
  exports: [QuizResultsService],
  controllers: [QuizResultsController],
  providers: [QuizResultsService],
})
export class QuizResultsModule {}

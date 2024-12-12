import { forwardRef, Module } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { QuizController } from './quiz.controller';
import { QuestionModule } from './question/question.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Quiz } from 'src/types/entity/quiz.entity';
import { MenuModule } from 'src/menu/menu.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Quiz]),
    QuestionModule,
    forwardRef(() => MenuModule),
  ],
  exports: [QuizService],
  controllers: [QuizController],
  providers: [QuizService],
})
export class QuizModule {}

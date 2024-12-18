import { forwardRef, Module } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { QuizController } from './quiz.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Quiz } from 'src/types/entity/quiz.entity';
import { MenuModule } from 'src/menu/menu.module';
import { QuestionModule } from 'src/question/question.module';
import { RestaurantModule } from 'src/restaurant/restaurant.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Quiz]),
    forwardRef(() => QuestionModule),
    forwardRef(() => MenuModule),
    RestaurantModule,
  ],
  exports: [QuizService],
  controllers: [QuizController],
  providers: [QuizService],
})
export class QuizModule {}

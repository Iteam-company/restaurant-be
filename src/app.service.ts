import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from './user/user.service';
import { RestaurantService } from './restaurant/restaurant.service';
import { QuizService } from './quiz/quiz.service';
import { QuestionService } from './question/question.service';
import { QuizResultsService } from './quiz-results/quiz-results.service';
import { AppDataSource } from './data-source';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    private readonly userService: UserService,
    private readonly restaurantService: RestaurantService,
    private readonly quizService: QuizService,
    private readonly questionService: QuestionService,
    private readonly quizResultService: QuizResultsService,

    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    const logger = new Logger('Migrations');
    // run migrations
    logger.log('Run Migrations');
    await AppDataSource.initialize();
    await AppDataSource.runMigrations();
    logger.log('Migrations Done');

    if (this.configService.get('MODE') !== 'PRODUCTION') {
      // seed data
      await this.userService.seed();
      await this.quizService.seed();
      await this.restaurantService.seed();
      await this.questionService.seed();
      await this.quizResultService.seed();
    }
  }
}

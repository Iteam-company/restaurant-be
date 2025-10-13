import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SharedJwtAuthModule } from './shared-jwt-auth/shared-jwt-auth.module';
import { RestaurantModule } from './restaurant/restaurant.module';
import { WorkersModule } from './restaurant/workers/workers.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuizModule } from './quiz/quiz.module';
import User from './types/entity/user.entity';
import Restaurant from './types/entity/restaurant.entity';
import { Question } from './types/entity/question.entity';
import { Quiz } from './types/entity/quiz.entity';
import { LoggerMiddleware } from './logger/LoggerMiddleware';
import { QuizResultsModule } from './quiz-results/quiz-results.module';
import { QuizResult } from './types/entity/quiz-result.entity';
import { QuizSummaryModule } from './quiz-summary/quiz-summary.module';
import { QuizSummary } from './types/entity/quiz-summary.entity';

@Module({
  imports: [
    AuthModule,
    UserModule,
    QuizModule,
    WorkersModule,
    RestaurantModule,
    QuizSummaryModule,
    QuizResultsModule,
    SharedJwtAuthModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get('DB_CONNECT'),
        entities: [User, Restaurant, Quiz, Question, QuizResult, QuizSummary],
        synchronize: true,
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}

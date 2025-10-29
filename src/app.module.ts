import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { SharedJwtAuthModule } from './shared-jwt-auth/shared-jwt-auth.module';
import { RestaurantModule } from './restaurant/restaurant.module';
import { WorkersModule } from './restaurant/workers/workers.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuizModule } from './quiz/quiz.module';
import { LoggerMiddleware } from './logger/LoggerMiddleware';
import { QuizResultsModule } from './quiz-results/quiz-results.module';
import { QuizSummaryModule } from './quiz-summary/quiz-summary.module';
import { OpenaiModule } from './openai/openai.module';
import { QuestionModule } from './question/question.module';
import { HealthModule } from './health/health.module';
import { AppDataSource } from './data-source';
import { EventsModule } from './events/events.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    QuizModule,
    QuestionModule,
    WorkersModule,
    RestaurantModule,
    QuizSummaryModule,
    QuizResultsModule,
    SharedJwtAuthModule,
    EventsModule,
    ConfigModule.forRoot({
      envFilePath: '.env.test',
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      ...AppDataSource.options,
      autoLoadEntities: true,
    }),
    OpenaiModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}

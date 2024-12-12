import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SharedJwtAuthModule } from './shared-jwt-auth/shared-jwt-auth.module';
import { RestaurantModule } from './restaurant/restaurant.module';
import { WorkersModule } from './restaurant/workers/workers.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuModule } from './menu/menu.module';
import { QuizModule } from './quiz/quiz.module';
import User from './types/entity/user.entity';
import Restaurant from './types/entity/restaurant.entity';
import MenuItem from './types/entity/menu-item.entity';
import Menu from './types/entity/menu.entity';
import { Question } from './types/entity/question.entity';
import { Quiz } from './types/entity/quiz.entity';

@Module({
  imports: [
    AuthModule,
    UserModule,
    MenuModule,
    QuizModule,
    WorkersModule,
    RestaurantModule,
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
        entities: [User, Restaurant, Menu, MenuItem, Quiz, Question],
        synchronize: true,
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { Test, TestingModule } from '@nestjs/testing';
import { QuizSummaryService } from './quiz-summary.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Quiz } from 'src/types/entity/quiz.entity';
import { QuizModule } from 'src/quiz/quiz.module';
import { QuizSummary } from 'src/types/entity/quiz-summary.entity';
import { SharedJwtAuthModule } from 'src/shared-jwt-auth/shared-jwt-auth.module';
import { QuizService } from 'src/quiz/quiz.service';
import {
  CreateQuizDto,
  DifficultyLevelEnum,
  StatusEnum,
} from 'src/quiz/dto/create-quiz.dto';
import { CreateQuizSummaryDto } from './dto/create-quiz-summary.dto';
import { TestDataSource } from 'src/test-data-source';
import CreateUserDto from 'src/user/dto/create-user.dto';
import CreateRestaurantDto from 'src/restaurant/dto/create-restaurant.dto';
import { UserRole } from 'src/types/entity/user.entity';
import { UserService } from 'src/user/user.service';
import { RestaurantService } from 'src/restaurant/restaurant.service';
import { UserModule } from 'src/user/user.module';
import { RestaurantModule } from 'src/restaurant/restaurant.module';

describe('QuizSummaryService', () => {
  let service: QuizSummaryService;
  let quizService: QuizService;
  let userService: UserService;
  let restaurantService: RestaurantService;

  const ownerExample: CreateUserDto = {
    firstName: 'super new owner',
    lastName: 'with last name',
    username: 'zxmnbcvzx',
    email: 'SWZ@gmail.com',
    phoneNumber: '+19384019283',
    role: UserRole.OWNER,
    password: 'qwertyuiop',
  };

  const restaurantExample: CreateRestaurantDto = {
    address: 'Some new address 123',
    name: 'Some cool restaurant',
    ownerId: 0,
  };

  const quizExample: CreateQuizDto = {
    title: 'test string',
    difficultyLevel: DifficultyLevelEnum.EASY,
    timeLimit: 60,
    status: StatusEnum.IN_PROGRESS,
    questions: [],
    restaurantId: 0,
  };
  const quizSummaryExample: CreateQuizSummaryDto = {
    bestScore: '99/100',
    endDate: new Date('12/30/2024, 3:35:24 PM'),
    duration: '2 days',
    quiz: 0,
  };

  let quizResource: Quiz;
  let quizSummaryResource: QuizSummary;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuizSummaryService],
      imports: [
        ConfigModule.forRoot({
          envFilePath: '.env',
          isGlobal: true,
        }),
        TypeOrmModule.forRoot(TestDataSource.options),
        TypeOrmModule.forFeature([QuizSummary]),
        QuizModule,
        UserModule,
        RestaurantModule,
        SharedJwtAuthModule,
      ],
    }).compile();

    service = module.get<QuizSummaryService>(QuizSummaryService);
    quizService = module.get<QuizService>(QuizService);
    userService = module.get<UserService>(UserService);
    restaurantService = module.get<RestaurantService>(RestaurantService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(quizService).toBeDefined();
    expect(userService).toBeDefined();
    expect(restaurantService).toBeDefined();
  });

  it('should create and save a new quiz summary', async () => {
    const owner = await userService.createUser(ownerExample);

    const restaurant = await restaurantService.createRestaurant(
      { ...restaurantExample, ownerId: owner.id },
      undefined,
      { role: UserRole.OWNER, id: owner.id, email: '', icon: '', username: '' },
    );

    const dbQuiz = await quizService.create({
      ...quizExample,
      restaurantId: restaurant.id,
    });
    const result = await service.create({
      ...quizSummaryExample,
      quiz: dbQuiz.id,
    });

    expect({
      ...dbQuiz,
      createAt: undefined,
      createdAt: undefined,
      restaurantId: 0,
    }).toEqual({
      ...quizExample,
      id: dbQuiz.id,
    });

    expect(result.quiz).toBeDefined();

    expect({ ...result, quiz: undefined }).toEqual({
      ...quizSummaryExample,
      quiz: undefined,
      id: result.id,
    });

    quizSummaryResource = result;
    quizResource = await quizService.findOne({ id: dbQuiz.id });
  });

  it('should return quiz summary', async () => {
    const result = await service.findOne(quizSummaryResource.id);

    expect(result).toEqual({
      ...quizSummaryResource,
      quiz: undefined,
    });
  });

  it('should return quiz summary by quiz id', async () => {
    const result = await service.findOneByQuizId(quizResource.id);

    expect(result).toEqual({
      ...quizSummaryResource,
      quiz: { ...quizResource, restaurants: undefined, questions: undefined },
    });
  });

  it('should remove quiz summary', async () => {
    const result = await service.remove(quizSummaryResource.id);

    expect(result).toEqual({
      ...quizSummaryResource,
      quiz: undefined,
      id: undefined,
    });
  });
});

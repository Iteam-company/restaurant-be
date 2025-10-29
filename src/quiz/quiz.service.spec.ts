import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Repository } from 'typeorm';
import { Quiz } from 'src/types/entity/quiz.entity';
import { QuizService } from './quiz.service';
import {
  CreateQuizDto,
  DifficultyLevelEnum,
  StatusEnum,
} from './dto/create-quiz.dto';
import { QuestionModule } from 'src/question/question.module';
import { SharedJwtAuthModule } from 'src/shared-jwt-auth/shared-jwt-auth.module';
import { RestaurantModule } from 'src/restaurant/restaurant.module';
import { TestDataSource } from 'src/test-data-source';
import { RestaurantService } from 'src/restaurant/restaurant.service';
import { UserService } from 'src/user/user.service';
import Restaurant from 'src/types/entity/restaurant.entity';
import { EventsModule } from 'src/events/events.module';
import { forwardRef } from '@nestjs/common';
import CreateRestaurantDto from 'src/restaurant/dto/create-restaurant.dto';
import CreateUserDto from 'src/user/dto/create-user.dto';
import { UserRole } from 'src/types/entity/user.entity';

describe('QuizService', () => {
  let quizService: QuizService;
  let restaurantService: RestaurantService;
  let userService: UserService;

  let quizRepository: Repository<Quiz>;

  const ownerExample: CreateUserDto = {
    role: UserRole.OWNER,
    email: 'owner@restaurant.net',
    firstName: 'new owner',
    lastName: 'lastname of me',
    password: 'asdfghjkl',
    phoneNumber: '+6789054321',
    username: 'owner_me',
  };

  const restaurantExample: CreateRestaurantDto = {
    address: '123 own street',
    name: 'restaurant example',
    ownerId: 0,
  };

  const quizExample: CreateQuizDto = {
    title: 'string',
    difficultyLevel: DifficultyLevelEnum.EASY,
    timeLimit: 60,
    status: StatusEnum.IN_PROGRESS,
    questions: [],
    restaurantId: 0,
  };

  let quizResource: Quiz;
  let restaurantResource: Restaurant;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: '.env',
          isGlobal: true,
        }),
        TypeOrmModule.forRoot(TestDataSource.options),
        TypeOrmModule.forFeature([Quiz, Restaurant]),
        SharedJwtAuthModule,
        EventsModule,
        forwardRef(() => RestaurantModule),
        forwardRef(() => QuestionModule),
      ],
      providers: [QuizService],
    }).compile();

    quizService = module.get<QuizService>(QuizService);
    restaurantService = module.get<RestaurantService>(RestaurantService);
    userService = module.get<UserService>(UserService);
    quizRepository = module.get('QuizRepository');
  });

  it('should be defined', async () => {
    expect(quizService).toBeDefined();
    expect(quizRepository).toBeDefined();
  });

  it('should create and save a new quiz', async () => {
    const owner = await userService.createUser(ownerExample);

    const dbRestaurant = await restaurantService.createRestaurant(
      {
        ...restaurantExample,
        ownerId: owner.id,
      },
      undefined,
      {
        role: UserRole.OWNER,
        email: 'wertyui',
        icon: undefined,
        id: 0,
        username: 'buhinjomk',
      },
    );

    const result = await quizService.create({
      ...quizExample,
      restaurantId: dbRestaurant.id,
    });

    expect({
      ...result,
      restaurantId: 0,
      createdAt: undefined,
      createAt: undefined,
    }).toEqual({
      ...quizExample,
      id: result.id,
    });
    quizResource = await quizService.findOne({ id: result.id });
    restaurantResource = dbRestaurant;
  });

  it('should update existing quiz', async () => {
    const updateData = {
      title: 'qwerty',
    };
    const result = await quizService.update(quizResource.id, updateData);

    expect({ ...result }).toEqual({
      ...quizResource,
      ...updateData,
    });
    quizResource = { ...quizResource, ...updateData };
  });

  it('should remove quiz without removing menu', async () => {
    const result = await quizService.remove(quizResource.id);

    expect({ ...result }).toEqual({ ...quizResource, id: undefined });
  });

  it('should create new quiz and remove menu with quiz', async () => {
    const dbCreateQuiz = await quizService.create(<CreateQuizDto>{
      ...quizResource,
      restaurantId: restaurantResource.id,
    });

    const result = await restaurantService.removeRestaurant(
      restaurantResource.id,
    );

    expect(result.quizzes.length !== 0).toBeTruthy();
    expect({
      ...result,
      quizzes: undefined,
      workers: undefined,
    }).toEqual({
      ...restaurantResource,
      owner: undefined,
      ownerId: undefined,
      id: undefined,
    });
    const dbQuiz = await quizRepository.findOneBy({ id: dbCreateQuiz.id });
    expect(dbQuiz).toBeNull();
  });
});

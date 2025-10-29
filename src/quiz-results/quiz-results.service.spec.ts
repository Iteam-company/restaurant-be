import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import User, { UserRole } from 'src/types/entity/user.entity';
import { ConfigModule } from '@nestjs/config';
import { QuizResult } from 'src/types/entity/quiz-result.entity';
import { QuizResultsService } from './quiz-results.service';
import { QuizModule } from 'src/quiz/quiz.module';
import { QuizService } from 'src/quiz/quiz.service';
import {
  CreateQuizDto,
  DifficultyLevelEnum,
  StatusEnum,
} from 'src/quiz/dto/create-quiz.dto';
import { UserModule } from 'src/user/user.module';
import { SharedJwtAuthModule } from 'src/shared-jwt-auth/shared-jwt-auth.module';
import CreateUserDto from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { CreateQuestionDto } from 'src/question/dto/create-question.dto';
import { QuestionModule } from 'src/question/question.module';
import { QuestionService } from 'src/question/question.service';
import { TestDataSource } from 'src/test-data-source';
import { RestaurantModule } from 'src/restaurant/restaurant.module';
import { RestaurantService } from 'src/restaurant/restaurant.service';
import CreateRestaurantDto from 'src/restaurant/dto/create-restaurant.dto';

describe('QuizResultService', () => {
  let quizResultService: QuizResultsService;
  let quizService: QuizService;
  let userService: UserService;
  let questionService: QuestionService;
  let restaurantService: RestaurantService;

  const quizExample: CreateQuizDto = {
    title: 'string',
    difficultyLevel: DifficultyLevelEnum.EASY,
    timeLimit: 60,
    status: StatusEnum.IN_PROGRESS,
    questions: [],
    restaurantId: 0,
  };
  const question1Example: CreateQuestionDto = {
    text: 'qq1',
    variants: ['1', '2', '3', '4'],
    correct: [2],
    multipleCorrect: false,
    quizId: 0,
  };
  const question2Example: CreateQuestionDto = {
    text: 'qq2',
    variants: ['1', '2', '3', '4'],
    correct: [4],
    multipleCorrect: false,
    quizId: 0,
  };
  const correctAnswers = '2/2';

  const userExample: CreateUserDto = {
    firstName: 'Jim',
    lastName: 'Kerry',
    username: 'JKBest',
    email: 'JK1@mail.com',
    phoneNumber: '+380970000012',
    role: UserRole.ADMIN,
    password: 'qwertyuiop',
  };

  const ownerExample: CreateUserDto = {
    firstName: 'super new owner',
    lastName: 'with last name',
    username: 'zxmnb,mzxcvzx',
    email: 'SWZ@mail.com',
    phoneNumber: '+1929384019283',
    role: UserRole.OWNER,
    password: 'qwertyuiop',
  };

  const restaurantExample: CreateRestaurantDto = {
    address: 'Some address 123',
    name: 'Some restaurant',
    ownerId: 0,
  };

  let quizResultResource: QuizResult;
  let userResource: User;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: '.env.test',
          isGlobal: true,
        }),
        TypeOrmModule.forRootAsync({
          useFactory: () => TestDataSource.options,
        }),
        TypeOrmModule.forFeature([QuizResult]),
        UserModule,
        QuizModule,
        QuestionModule,
        RestaurantModule,
        SharedJwtAuthModule,
      ],
      providers: [QuizResultsService],
    }).compile();

    quizResultService = module.get<QuizResultsService>(QuizResultsService);
    quizService = module.get<QuizService>(QuizService);
    userService = module.get<UserService>(UserService);
    questionService = module.get<QuestionService>(QuestionService);
    restaurantService = module.get<RestaurantService>(RestaurantService);
  });

  it('should be defined', async () => {
    expect(quizResultService).toBeDefined();
    expect(quizService).toBeDefined();
    expect(userService).toBeDefined();
    expect(restaurantService).toBeDefined();
    expect(questionService).toBeDefined();
  });

  it('should create and save a new user', async () => {
    const owner = await userService.createUser(ownerExample);
    const { id } = await userService.createUser(<CreateUserDto>userExample);
    const dbUser = await userService.getUserById(id);

    const restaurant = await restaurantService.createRestaurant(
      { ...restaurantExample, ownerId: owner.id },
      undefined,
      { role: UserRole.OWNER, id: owner.id, email: '', icon: '', username: '' },
    );

    const dbQuiz = await quizService.create({
      ...quizExample,
      restaurantId: restaurant.id,
    });
    const dbQuestion1 = await questionService.create(<CreateQuestionDto>{
      ...question1Example,
      quizId: dbQuiz.id,
    });
    const dbQuestion2 = await questionService.create(<CreateQuestionDto>{
      ...question2Example,
      quizId: dbQuiz.id,
    });

    const result = await quizResultService.create(
      {
        answers: [
          { questionId: dbQuestion1.id, answers: [...dbQuestion1.correct] },
          { questionId: dbQuestion2.id, answers: [...dbQuestion2.correct] },
        ],
        quizId: dbQuiz.id,
      },
      dbUser.id,
    );

    expect(result.quiz).toBeDefined();
    expect(result.user).toBeDefined();
    expect(result.ratingDate).toBeDefined();
    expect({ ...result, quiz: undefined, ratingDate: undefined }).toEqual({
      score: correctAnswers,
      id: result.id,
      quiz: undefined,
      user: dbUser,
    });
    quizResultResource = {
      ...result,
      quiz: { ...result.quiz, questions: undefined },
    };
    userResource = dbUser;
  });

  it('should return quiz result', async () => {
    const result = await quizResultService.findOne(quizResultResource.id, {
      id: userResource.id,
      email: userResource.email,
      role: UserRole.WAITER,
      username: userResource.username,
      icon: null,
    });

    expect({
      ...result,
      user: { ...result.user, password: undefined },
    }).toEqual({
      ...quizResultResource,
      quiz: { ...quizResultResource.quiz, restaurants: undefined },
      quizId: undefined,
    });
  });

  it('should remove quiz result', async () => {
    const result = await quizResultService.remove(quizResultResource.id);

    expect({
      ...result,
    }).toEqual({
      ...quizResultResource,
      id: undefined,
      user: null,
      quiz: null,
      quizId: undefined,
    });
  });
});

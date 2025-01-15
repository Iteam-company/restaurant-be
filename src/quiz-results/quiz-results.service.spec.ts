import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from 'src/types/entity/user.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { QuizResult } from 'src/types/entity/quiz-result.entity';
import { QuizResultsService } from './quiz-results.service';
import { QuizModule } from 'src/quiz/quiz.module';
import PayloadType from 'src/types/PayloadType';
import { QuizService } from 'src/quiz/quiz.service';
import {
  CreateQuizDto,
  DifficultyLevelEnum,
  StatusEnum,
} from 'src/quiz/dto/create-quiz.dto';
import { MenuService } from 'src/menu/menu.service';
import {
  CategoriesEnum,
  CreateMenuDto,
  SeasonsEnum,
} from 'src/menu/dto/create-menu.dto';
import { MenuModule } from 'src/menu/menu.module';
import { UserModule } from 'src/user/user.module';
import { SharedJwtAuthModule } from 'src/shared-jwt-auth/shared-jwt-auth.module';
import CreateUserDto from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { getTestDataSource } from 'test/testDataSource';
import { CreateQuestionDto } from 'src/question/dto/create-question.dto';
import { QuestionModule } from 'src/question/question.module';
import { QuestionService } from 'src/question/question.service';

describe('QuizResultService', () => {
  let quizResultService: QuizResultsService;
  let menuService: MenuService;
  let quizService: QuizService;
  let userService: UserService;
  let questionService: QuestionService;

  const menuExample: CreateMenuDto = {
    name: 'zxcvbnm',
    categories: CategoriesEnum.MAIN_COURSES,
    season: SeasonsEnum.SUMMER,
  };
  const quizExample: CreateQuizDto = {
    title: 'string',
    difficultyLevel: DifficultyLevelEnum.EASY,
    timeLimit: 60,
    status: StatusEnum.IN_PROGRESS,
    menuId: 0,
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
    role: 'admin',
    password: 'qwertyuiop',
  };

  let quizResultResource: QuizResult;
  let userResource: User;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: '.env',
          isGlobal: true,
        }),
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (configService: ConfigService) =>
            getTestDataSource(configService),
        }),
        TypeOrmModule.forFeature([QuizResult]),
        UserModule,
        QuizModule,
        MenuModule,
        QuestionModule,
        SharedJwtAuthModule,
      ],
      providers: [QuizResultsService],
    }).compile();

    quizResultService = module.get<QuizResultsService>(QuizResultsService);
    menuService = module.get<MenuService>(MenuService);
    quizService = module.get<QuizService>(QuizService);
    userService = module.get<UserService>(UserService);
    questionService = module.get<QuestionService>(QuestionService);
  });

  it('should be defined', async () => {
    expect(quizResultService).toBeDefined();
    expect(menuService).toBeDefined();
    expect(quizService).toBeDefined();
    expect(userService).toBeDefined();
  });

  it('should create and save a new user', async () => {
    const payloadUser = await parseJwt(
      (await userService.createUser(<CreateUserDto>userExample)).access_token,
    );
    const dbUser = await userService.getUserById(payloadUser.id);

    const dbMenu = await menuService.create(<CreateMenuDto>menuExample);
    const dbQuiz = await quizService.create(<CreateQuizDto>{
      ...quizExample,
      menuId: dbMenu.id,
      id: undefined,
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
    expect(result.raitingDate).toBeDefined();
    expect({ ...result, quiz: undefined, raitingDate: undefined }).toEqual({
      score: correctAnswers,
      id: result.id,
      quiz: undefined,
      user: dbUser,
    });
    quizResultResource = {
      ...result,
      quiz: { ...result.quiz, menu: undefined, questions: undefined },
    };
    userResource = dbUser;
  });

  it('should return quiz result', async () => {
    const result = await quizResultService.findOne(quizResultResource.id, {
      id: userResource.id,
      email: userResource.email,
      role: 'waiter',
      username: userResource.username,
      icon: null,
    });

    expect({
      ...result,
      user: { ...result.user, password: undefined },
    }).toEqual({
      ...quizResultResource,
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

async function parseJwt(token): Promise<PayloadType> {
  return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
}

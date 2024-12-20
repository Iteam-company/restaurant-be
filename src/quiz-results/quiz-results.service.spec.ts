import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from 'src/types/entity/user.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Restaurant from 'src/types/entity/restaurant.entity';
import Menu from 'src/types/entity/menu.entity';
import MenuItem from 'src/types/entity/menu-item.entity';
import { Quiz } from 'src/types/entity/quiz.entity';
import { Question } from 'src/types/entity/question.entity';
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
import { CreateQuizResultDto } from './dto/create-quiz-result.dto';

describe('QuizResultService', () => {
  let quizResultService: QuizResultsService;
  let menuService: MenuService;
  let quizService: QuizService;
  let userService: UserService;

  const quizResultExample: CreateQuizResultDto = {
    score: '90/100',
    quizId: 0,
  };

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
  const userExample: CreateUserDto = {
    firstName: 'J',
    lastName: 'M',
    username: 'JMBest',
    email: 'JM1@mail.com',
    phoneNumber: '+380000000001',
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
          useFactory: (configService: ConfigService) => ({
            type: 'postgres',
            url: configService.get('TEST_DB_CONNECT'),
            entities: [
              User,
              Restaurant,
              Menu,
              MenuItem,
              Quiz,
              Question,
              QuizResult,
            ],
            synchronize: true,
          }),
        }),
        TypeOrmModule.forFeature([QuizResult]),
        UserModule,
        QuizModule,
        MenuModule,
        SharedJwtAuthModule,
      ],
      providers: [QuizResultsService],
    }).compile();

    quizResultService = module.get<QuizResultsService>(QuizResultsService);
    menuService = module.get<MenuService>(MenuService);
    quizService = module.get<QuizService>(QuizService);
    userService = module.get<UserService>(UserService);
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

    const result = await quizResultService.create(
      {
        ...quizResultExample,
        quizId: dbQuiz.id,
      },
      dbUser.id,
    );

    expect(result.quiz).toBeDefined();
    expect(result.user).toBeDefined();
    expect(result.raitingDate).toBeDefined();
    expect({ ...result, quiz: undefined, raitingDate: undefined }).toEqual({
      ...quizResultExample,
      id: result.id,
      quiz: undefined,
      quizId: result.quizId,
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

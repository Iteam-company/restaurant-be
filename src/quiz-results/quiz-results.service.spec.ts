import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from 'src/types/entity/user.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
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
import { CreateQuizDto } from 'src/quiz/dto/create-quiz.dto';
import { MenuService } from 'src/menu/menu.service';
import { CreateMenuDto } from 'src/menu/dto/create-menu.dto';
import { MenuModule } from 'src/menu/menu.module';
import { UserModule } from 'src/user/user.module';
import { SharedJwtAuthModule } from 'src/shared-jwt-auth/shared-jwt-auth.module';
import CreateUserDto from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';

describe('QuizResultService', () => {
  let quizResultService: QuizResultsService;
  let menuService: MenuService;
  let quizService: QuizService;
  let userService: UserService;

  let quizResultRepository: Repository<QuizResult>;

  let quizResultExample = {
    id: 0,
    score: '90/100',
    quizId: 0,
    quiz: undefined,
  };

  const menuExample = {
    id: 0,
    name: 'Spring',
    categories: 'main courses',
    season: 'spring',
    menuItems: [],
    restaurant: null,
    quizes: [],
  };
  const quizExample = {
    id: 0,
    title: 'string',
    difficultyLevel: 'easy',
    timeLimit: 60,
    status: 'in-progress',
  };

  let userExample = {
    id: 1,
    firstName: 'J',
    lastName: 'M',
    username: 'JMBest',
    email: 'JM1@mail.com',
    phoneNumber: '+380000000001',
    role: 'admin',
    password: 'qwertyuiop',
  };

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
    quizResultRepository = module.get('QuizResultRepository');
  });

  it('should be defined', async () => {
    expect(quizResultService).toBeDefined();
    expect(quizResultRepository).toBeDefined();
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
    quizResultExample = {
      ...result,
      quiz: { ...result.quiz, menu: undefined, questions: undefined },
      quizId: undefined,
    };
    userExample = dbUser;
  });

  it('should return quiz result', async () => {
    const result = await quizResultService.findOne(quizResultExample.id, {
      id: userExample.id,
      email: userExample.email,
      role: 'waiter',
      username: userExample.username,
    });

    expect({
      ...result,
      user: { ...result.user, password: undefined },
    }).toEqual({
      ...quizResultExample,
    });
  });

  it('should remove quiz result', async () => {
    const result = await quizResultService.remove(quizResultExample.id);

    expect({
      ...result,
    }).toEqual({
      ...quizResultExample,
      id: undefined,
      user: null,
      quiz: null,
    });
  });
});

async function parseJwt(token): Promise<PayloadType> {
  return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
}

import { Test, TestingModule } from '@nestjs/testing';
import { QuizSummaryService } from './quiz-summary.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import User from 'src/types/entity/user.entity';
import Restaurant from 'src/types/entity/restaurant.entity';
import Menu from 'src/types/entity/menu.entity';
import MenuItem from 'src/types/entity/menu-item.entity';
import { Quiz } from 'src/types/entity/quiz.entity';
import { Question } from 'src/types/entity/question.entity';
import { QuizResult } from 'src/types/entity/quiz-result.entity';
import { QuizModule } from 'src/quiz/quiz.module';
import { QuizSummary } from 'src/types/entity/quiz-summary.entity';
import { SharedJwtAuthModule } from 'src/shared-jwt-auth/shared-jwt-auth.module';
import { QuizService } from 'src/quiz/quiz.service';
import {
  CreateQuizDto,
  DifficultyLevelEnum,
  StatusEnum,
} from 'src/quiz/dto/create-quiz.dto';
import {
  CategoriesEnum,
  CreateMenuDto,
  SeasonsEnum,
} from 'src/menu/dto/create-menu.dto';
import { MenuModule } from 'src/menu/menu.module';
import { MenuService } from 'src/menu/menu.service';
import { CreateQuizSummaryDto } from './dto/create-quiz-summary.dto';

describe('QuizSummaryService', () => {
  let service: QuizSummaryService;
  let quizService: QuizService;
  let menuService: MenuService;

  const menuExample: CreateMenuDto = {
    name: 'test Spring',
    categories: CategoriesEnum.MAIN_COURSES,
    season: SeasonsEnum.SPRING,
  };
  const quizExample: CreateQuizDto = {
    title: 'test string',
    difficultyLevel: DifficultyLevelEnum.EASY,
    timeLimit: 60,
    status: StatusEnum.IN_PROGRESS,
    menuId: 0,
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
              QuizSummary,
            ],
            synchronize: true,
          }),
        }),
        SharedJwtAuthModule,
        MenuModule,
        QuizModule,
        TypeOrmModule.forFeature([QuizSummary]),
      ],
    }).compile();

    service = module.get<QuizSummaryService>(QuizSummaryService);
    quizService = module.get<QuizService>(QuizService);
    menuService = module.get<MenuService>(MenuService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(quizService).toBeDefined();
  });

  it('should create and save a new quiz summary', async () => {
    const dbMenu = await menuService.create(<CreateMenuDto>menuExample);
    const dbQuiz = await quizService.create(<CreateQuizDto>{
      ...quizExample,
      menuId: dbMenu.id,
      id: undefined,
    });
    const result = await service.create({
      ...quizSummaryExample,
      quiz: dbQuiz.id,
    });

    expect({
      ...dbQuiz,
      menu: {
        ...dbQuiz.menu,
        menuItems: undefined,
        quizes: undefined,
        restaurant: undefined,
      },
      menuId: undefined,
      createAt: undefined,
      createdAt: undefined,
    }).toEqual({
      ...quizExample,
      menu: dbMenu,
      menuId: undefined,
      id: dbQuiz.id,
    });

    expect(result.quiz).toBeDefined();

    expect({ ...result, quiz: undefined }).toEqual({
      ...quizSummaryExample,
      quiz: undefined,
      id: result.id,
    });

    quizSummaryResource = result;
    quizResource = await quizService.findOne(dbQuiz.id);
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
      quiz: { ...quizResource, menu: undefined, questions: undefined },
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

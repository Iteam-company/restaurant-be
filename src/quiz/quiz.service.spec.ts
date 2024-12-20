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
import { QuizService } from './quiz.service';
import {
  CreateQuizDto,
  DifficultyLevelEnum,
  StatusEnum,
} from './dto/create-quiz.dto';
import { MenuModule } from 'src/menu/menu.module';
import { MenuService } from 'src/menu/menu.service';
import {
  CategoriesEnum,
  CreateMenuDto,
  SeasonsEnum,
} from 'src/menu/dto/create-menu.dto';
import { QuestionModule } from 'src/question/question.module';
import { SharedJwtAuthModule } from 'src/shared-jwt-auth/shared-jwt-auth.module';
import { RestaurantModule } from 'src/restaurant/restaurant.module';

describe('QuizService', () => {
  let quizService: QuizService;
  let menuService: MenuService;

  let quizRepository: Repository<Quiz>;

  const menuExample: CreateMenuDto = {
    name: 'Spring',
    categories: CategoriesEnum.MAIN_COURSES,
    season: SeasonsEnum.SPRING,
  };
  const quizExample: CreateQuizDto = {
    title: 'string',
    difficultyLevel: DifficultyLevelEnum.EASY,
    timeLimit: 60,
    status: StatusEnum.IN_PROGRESS,
    menuId: 0,
  };

  let menuResource: Menu;
  let quizResource: Quiz;

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
        TypeOrmModule.forFeature([Quiz]),
        MenuModule,
        QuestionModule,
        RestaurantModule,
        SharedJwtAuthModule,
      ],
      providers: [QuizService],
    }).compile();

    quizService = module.get<QuizService>(QuizService);
    menuService = module.get<MenuService>(MenuService);
    quizRepository = module.get('QuizRepository');
  });

  it('should be defined', async () => {
    expect(quizService).toBeDefined();
    expect(quizRepository).toBeDefined();
  });

  it('should create and save a new quiz', async () => {
    const dbMenu = await menuService.create(<CreateMenuDto>menuExample);
    const result = await quizService.create(<CreateQuizDto>{
      ...quizExample,
      menuId: dbMenu.id,
      id: undefined,
    });

    expect({
      ...result,
      menu: {
        ...result.menu,
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
      id: result.id,
    });
    quizResource = await quizService.findOne(result.id);
    menuResource = dbMenu;
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
      menuId: menuResource.id,
    });

    const result = await menuService.remove(menuResource.id);

    expect(result.quizes.length !== 0).toBeTruthy();
    expect({
      ...result,
      quizes: undefined,
      menuItems: undefined,
      restaurant: undefined,
    }).toEqual({
      ...menuResource,
      id: undefined,
    });
    const dbQuiz = await quizRepository.findOneBy({ id: dbCreateQuiz.id });
    expect(dbQuiz).toBeNull();
  });
});

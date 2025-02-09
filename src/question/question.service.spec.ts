import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Menu from 'src/types/entity/menu.entity';
import { Quiz } from 'src/types/entity/quiz.entity';
import { Question } from 'src/types/entity/question.entity';
import { QuestionService } from './question.service';
import { QuizModule } from 'src/quiz/quiz.module';
import { SharedJwtAuthModule } from 'src/shared-jwt-auth/shared-jwt-auth.module';
import { QuizService } from 'src/quiz/quiz.service';
import {
  CreateQuizDto,
  DifficultyLevelEnum,
  StatusEnum,
} from 'src/quiz/dto/create-quiz.dto';
import { MenuModule } from 'src/menu/menu.module';
import { MenuService } from 'src/menu/menu.service';
import {
  CategoriesEnum,
  CreateMenuDto,
  SeasonsEnum,
} from 'src/menu/dto/create-menu.dto';
import { CreateQuestionDto } from './dto/create-question.dto';
import { getTestDataSource } from 'test/testDataSource';

describe('QuestionService', () => {
  let questionService: QuestionService;
  let menuService: MenuService;
  let quizService: QuizService;

  const menuExample: CreateMenuDto = {
    name: 'something new',
    categories: CategoriesEnum.MAIN_COURSES,
    season: SeasonsEnum.FALL,
  };

  const quizExample: CreateQuizDto = {
    title: 'string',
    difficultyLevel: DifficultyLevelEnum.EASY,
    timeLimit: 60,
    status: StatusEnum.IN_PROGRESS,
    menuId: 0,
  };

  const questionExample: CreateQuestionDto = {
    text: 'does it work',
    variants: ['yes', 'no', 'i dont know how but it work'],
    correct: [0],
    multipleCorrect: false,
    quizId: 0,
  };

  let menuResource: Menu;
  let quizResource: Quiz;
  let questionResource: Question;

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
        TypeOrmModule.forFeature([Question]),
        MenuModule,
        QuizModule,
        SharedJwtAuthModule,
      ],
      providers: [QuestionService],
    }).compile();

    questionService = module.get<QuestionService>(QuestionService);
    menuService = module.get<MenuService>(MenuService);
    quizService = module.get<QuizService>(QuizService);
  });

  it('should be defined', async () => {
    expect(questionService).toBeDefined();
    expect(menuService).toBeDefined();
    expect(quizService).toBeDefined();
  });

  it('should create and save a new question', async () => {
    const dbMenu = await menuService.create(<CreateMenuDto>menuExample);
    let dbQuiz = await quizService.create(<CreateQuizDto>{
      ...quizExample,
      menuId: dbMenu.id,
    });
    dbQuiz = await quizService.findOne(dbQuiz.id);

    const result = await questionService.create({
      ...questionExample,
      quizId: dbQuiz.id,
    });

    expect(result).toEqual({
      ...questionExample,
      quizId: result.quizId,
      quiz: dbQuiz,
      id: result.id,
    });
    questionResource = result;
    menuResource = dbMenu;
    quizResource = { ...dbQuiz };
  });

  it('should update and save existing question', async () => {
    const updateData = { text: 'it work' };
    const result = await questionService.update(
      questionResource.id,
      updateData,
    );

    expect(result.quiz !== undefined).toBeTruthy();
    expect({ ...result, quiz: undefined }).toEqual({
      ...questionResource,
      ...updateData,
      correct: undefined,
      quizId: undefined,
      quiz: undefined,
    });

    questionResource = { ...questionResource, ...updateData };
  });

  it('should delete existing quiz with question', async () => {
    const result = await quizService.remove(quizResource.id);

    expect({ ...result }).toEqual({
      ...quizResource,
      questions: [
        {
          ...questionResource,
          quiz: undefined,
          quizId: undefined,
        },
      ],
      quizId: undefined,
      id: undefined,
    });
  });

  it('should create question and remove it', async () => {
    const dbQuiz = await quizService.create(<CreateQuizDto>{
      ...quizResource,
      menuId: menuResource.id,
    });
    const result = await questionService.create({
      ...questionResource,
      quizId: dbQuiz.id,
    });
    delete result.quizId;

    const removedResult = await questionService.remove(result.id);

    expect({ ...result }).toEqual({
      ...questionResource,
      quiz: { ...result.quiz, id: dbQuiz.id },
      quizId: undefined,
      id: result.id,
    });
    expect(removedResult).toEqual({
      ...result,
      quiz: null,
      correct: undefined,
      id: undefined,
    });
  });
});

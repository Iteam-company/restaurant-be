import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
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
import { CreateQuestionDto } from './dto/create-question.dto';
import { TestDataSource } from 'src/test-data-source';
import { RestaurantModule } from 'src/restaurant/restaurant.module';
import { RestaurantService } from 'src/restaurant/restaurant.service';
import CreateRestaurantDto from 'src/restaurant/dto/create-restaurant.dto';
import CreateUserDto from 'src/user/dto/create-user.dto';
import { UserRole } from 'src/types/entity/user.entity';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import Restaurant from 'src/types/entity/restaurant.entity';

describe('QuestionService', () => {
  let questionService: QuestionService;
  let restaurantService: RestaurantService;
  let quizService: QuizService;
  let userService: UserService;

  const ownerExample: CreateUserDto = {
    username: 'owner1',
    email: 'owner@mail.com',
    password: 'strongpassword',
    firstName: 'Owner',
    lastName: 'One',
    role: UserRole.OWNER,
    phoneNumber: '09854321',
  };

  const restaurantExample: CreateRestaurantDto = {
    name: 'Test Restaurant',
    address: '123 Test St',
    ownerId: 1,
  };

  const quizExample: CreateQuizDto = {
    title: 'string',
    difficultyLevel: DifficultyLevelEnum.EASY,
    timeLimit: 60,
    status: StatusEnum.IN_PROGRESS,
    questions: [],
    restaurantId: 0,
  };

  const questionExample: CreateQuestionDto = {
    text: 'does it work',
    variants: ['yes', 'no', 'i dont know how but it work'],
    correct: [0],
    multipleCorrect: false,
    quizId: 0,
  };

  let quizResource: Quiz;
  let questionResource: Question;
  let restaurantResource: Restaurant;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: '.env.test',
          isGlobal: true,
        }),
        TypeOrmModule.forRoot(TestDataSource.options as any),
        TypeOrmModule.forFeature([Question, Quiz]),
        QuizModule,
        UserModule,
        RestaurantModule,
        SharedJwtAuthModule,
      ],
      providers: [QuestionService],
    }).compile();

    restaurantService = module.get<RestaurantService>(RestaurantService);
    questionService = module.get<QuestionService>(QuestionService);
    quizService = module.get<QuizService>(QuizService);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', async () => {
    expect(questionService).toBeDefined();
    expect(quizService).toBeDefined();
    expect(restaurantService).toBeDefined();
    expect(userService).toBeDefined();
  });

  it('should create and save a new question', async () => {
    const owner = await userService.createUser(ownerExample);

    const restaurant = await restaurantService.createRestaurant(
      { ...restaurantExample, ownerId: owner.id },
      undefined,
      { role: UserRole.OWNER, id: 1, email: '', icon: '', username: '' },
    );

    const { id } = await quizService.create(<CreateQuizDto>{
      ...quizExample,
      restaurantId: restaurant.id,
    });

    const dbQuiz = await quizService.findOneById(id);

    const result = await questionService.create({
      ...questionExample,
      quizId: dbQuiz.id,
    });

    expect(result).toEqual({
      ...questionExample,
      quizId: result.quizId,
      quiz: { ...dbQuiz, questions: undefined, restaurants: undefined },
      id: result.id,
    });

    restaurantResource = restaurant;
    questionResource = result;
    quizResource = dbQuiz;
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
      id: undefined,
    });
  });

  it('should create question and remove it', async () => {
    const dbQuiz = await quizService.create(<CreateQuizDto>{
      ...quizResource,
      restaurantId: restaurantResource.id,
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

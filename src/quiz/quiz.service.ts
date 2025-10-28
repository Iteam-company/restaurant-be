import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Quiz } from 'src/types/entity/quiz.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { QuestionService } from 'src/question/question.service';
import PayloadType from 'src/types/PayloadType';
import { quizSeed } from 'src/types/seeds';
import { paginate } from 'nestjs-paginate';
import SearchQuizQueryDto from './dto/search-quiz-param.dt';
import { RestaurantService } from 'src/restaurant/restaurant.service';

@Injectable()
export class QuizService {
  constructor(
    @InjectRepository(Quiz)
    private quizRepository: Repository<Quiz>,

    @Inject(forwardRef(() => QuestionService))
    private readonly questionService: QuestionService,

    @Inject(forwardRef(() => RestaurantService))
    private readonly restaurantService: RestaurantService,
  ) {}

  async create(createQuizDto: CreateQuizDto): Promise<Quiz> {
    const dbQuiz: Quiz = await this.quizRepository.save({
      ...createQuizDto,
      createAt: new Date(),
      id: undefined,
      questions: createQuizDto.questions?.map((question) => ({
        ...question,
        id: undefined,
      })),
    });

    await this.connectQuizToRestaurant(dbQuiz.id, createQuizDto.restaurantId);

    return dbQuiz;
  }

  async getAllByRestaurant(id: number) {
    return await this.quizRepository.find({ where: { restaurants: { id } } });
  }

  async getSearch(query: SearchQuizQueryDto) {
    const dbQuiz = await this.quizRepository.createQueryBuilder('quiz');

    if (query.restaurantId)
      dbQuiz
        .leftJoin('quiz.restaurants', 'restaurants')
        .where('restaurants.id = :restaurantId', {
          restaurantId: query.restaurantId,
        });

    return (
      await paginate(query, dbQuiz, {
        sortableColumns: ['id'],
        searchableColumns: ['title'],
      })
    ).data;
  }

  async findAll(user: PayloadType) {
    if (user.role === 'waiter')
      return await this.quizRepository.find({
        where: { status: 'in-progress' },
        relations: ['restaurants'],
      });
    return await this.quizRepository.find();
  }

  async findOne(options: FindOneOptions<Quiz>['where']) {
    const dbQuiz = await this.quizRepository.findOne({
      where: options,
      relations: ['questions', 'restaurants'],
    });
    if (!dbQuiz) throw new NotFoundException('Quiz with this id is not exist');

    return dbQuiz;
  }

  async findOneById(id: number) {
    return await this.findOne({ id });
  }

  async update(id: number, updateQuizDto: UpdateQuizDto) {
    await this.quizRepository.update(id, updateQuizDto);
    return await this.findOneById(id);
  }

  async remove(id: number) {
    const dbQuiz = await this.findOneById(id);

    for await (const question of dbQuiz.questions) {
      await this.questionService.remove(question.id);
    }

    return await this.quizRepository.remove(dbQuiz);
  }

  async connectQuizToRestaurant(quizId: number, restaurantId: number) {
    const quizDb = await this.findOneById(quizId);
    const restaurantDb =
      await this.restaurantService.getRestaurant(restaurantId);

    if (!quizDb.restaurants.find((r) => r.id === restaurantDb.id)) {
      quizDb.restaurants.push(restaurantDb);
    }

    return this.quizRepository.save(quizDb);
  }

  async seed() {
    for await (const quiz of quizSeed) {
      const isExist = await this.quizRepository.findOne({
        where: { title: quiz.title },
      });
      if (!isExist) {
        await this.quizRepository.save({
          ...quiz,
          createdAt: new Date(),
        });

        console.log(`Quiz ${quiz.title} seeded`);
      }
    }
  }
}

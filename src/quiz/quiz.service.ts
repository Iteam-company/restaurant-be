import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Quiz } from 'src/types/entity/quiz.entity';
import { Repository } from 'typeorm';
import { QuestionService } from 'src/question/question.service';
import PayloadType from 'src/types/PayloadType';
import { RestaurantService } from 'src/restaurant/restaurant.service';
import { quizSeed } from 'src/types/seeds';
import { paginate } from 'nestjs-paginate';
import SearchQuizQueryDto from './dto/search-quiz-param.dt';

@Injectable()
export class QuizService implements OnModuleInit {
  constructor(
    @InjectRepository(Quiz)
    private quizRepository: Repository<Quiz>,

    private readonly restarauntService: RestaurantService,

    @Inject(forwardRef(() => QuestionService))
    private readonly questionService: QuestionService,
  ) {}

  async onModuleInit() {
    await this.seed();
  }

  async create(createQuizDto: CreateQuizDto): Promise<Quiz> {
    return await this.quizRepository.save({
      ...createQuizDto,
      createAt: new Date(),
    });
  }

  async getSearch(query: SearchQuizQueryDto) {
    const dbQuiz = await this.quizRepository
      .createQueryBuilder('quiz')
      .leftJoinAndSelect('quiz.menu', 'menu')
      .leftJoinAndSelect('menu.restaurant', 'restaurant');

    if (query.restaurantId)
      dbQuiz.andWhere('restaurant.id = :restaurantId', {
        restaurantId: query.restaurantId,
      });

    return (
      await paginate(query, dbQuiz, {
        sortableColumns: ['id'],
        searchableColumns: ['title'],
        relations: ['menu'],
      })
    ).data;
  }

  async findAll(user: PayloadType) {
    if (user.role === 'waiter')
      return await this.quizRepository.find({
        where: { status: 'in-progress' },
        relations: ['menu'],
      });
    return await this.quizRepository.find();
  }

  async findOne(id: number) {
    const dbQuiz = await this.quizRepository.findOne({
      where: { id: id },
      relations: ['questions', 'menu'],
    });
    if (!dbQuiz) throw new NotFoundException('Quiz with this id is not exist');

    return dbQuiz;
  }

  async findOneById(id: number) {
    const dbQuiz = await this.findOne(id);

    return dbQuiz;
  }

  async update(id: number, updateQuizDto: UpdateQuizDto) {
    await this.quizRepository.update(id, updateQuizDto);
    return await this.findOne(id);
  }

  async remove(id: number) {
    const dbQuiz = await this.findOne(id);

    for await (const question of dbQuiz.questions) {
      await this.questionService.remove(question.id);
    }

    return await this.quizRepository.remove(dbQuiz);
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

import {
  BadRequestException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Quiz } from 'src/types/entity/quiz.entity';
import { Repository } from 'typeorm';
import { MenuService } from 'src/menu/menu.service';
import { QuestionService } from 'src/question/question.service';
import PayloadType from 'src/types/PayloadType';
import { RestaurantService } from 'src/restaurant/restaurant.service';

@Injectable()
export class QuizService {
  constructor(
    @InjectRepository(Quiz)
    private quizRepository: Repository<Quiz>,

    @Inject(forwardRef(() => MenuService))
    private readonly menuService: MenuService,

    private readonly restarauntService: RestaurantService,

    @Inject(forwardRef(() => QuestionService))
    private readonly questionService: QuestionService,
  ) {}

  async create(createQuizDto: CreateQuizDto): Promise<Quiz> {
    return await this.quizRepository.save({
      ...createQuizDto,
      menu: await this.menuService.findOne(+createQuizDto.menuId),
      createAt: new Date(),
    });
  }

  async getAllByRestaurant(id: number) {
    const dbRestaraunt = await this.restarauntService.getRestaurant(id);

    const result = [];

    for await (const menu of dbRestaraunt.menu) {
      await result.push(...(await this.menuService.findOne(menu.id)).quizes);
    }
    return result;
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

  async findOneValidate(id: number, user: PayloadType) {
    const dbQuiz = await this.findOne(id);

    if (dbQuiz.status !== 'in-progress' && user.role === 'waiter')
      throw new ForbiddenException(
        'Quiz is not started yet or quiz is already finished',
      );

    return dbQuiz;
  }

  async update(id: number, updateQuizDto: UpdateQuizDto) {
    const dbQuiz = await this.findOne(id);

    await this.quizRepository.update(id, {
      ...updateQuizDto,
      menu: dbQuiz.menu,
    });
    return await this.findOne(id);
  }

  async remove(id: number) {
    const dbQuiz = await this.findOne(id);

    for await (const question of dbQuiz.questions) {
      await this.questionService.remove(question.id);
    }

    await this.unlinkMenuQuiz(dbQuiz.menu.id, id);

    return await this.quizRepository.remove(dbQuiz);
  }

  async linkMenuQuiz(menuId: number, quizId: number) {
    const dbQuiz = await this.findOne(quizId);

    if (dbQuiz.menu)
      throw new BadRequestException('This quiz is already linked to menu');

    const menu = await this.menuService.findOne(menuId);

    await menu.quizes.push(dbQuiz);

    await this.menuService.saveMenuToDB(menu);

    return await this.findOne(quizId);
  }

  async unlinkMenuQuiz(menuId: number, quizId: number) {
    const dbQuiz = await this.findOne(quizId);

    if (menuId !== dbQuiz.menu.id)
      throw new BadRequestException('Menu with this quiz is not exis');

    const menu = await this.menuService.findOne(dbQuiz.menu.id);

    await menu.quizes.splice(
      await menu.quizes.findIndex((elem) => elem.id === dbQuiz.id),
      1,
    );

    await this.menuService.saveMenuToDB(menu);

    return await this.findOne(quizId);
  }
}

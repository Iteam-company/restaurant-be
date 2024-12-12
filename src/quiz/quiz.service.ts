import {
  BadRequestException,
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
import { QuestionService } from './question/question.service';

@Injectable()
export class QuizService {
  constructor(
    @InjectRepository(Quiz)
    private quizRepository: Repository<Quiz>,

    @Inject(forwardRef(() => MenuService))
    private readonly menuService: MenuService,

    private readonly questionService: QuestionService,
  ) {}

  async create(createQuizDto: CreateQuizDto) {
    const dbQuiz = await this.quizRepository
      .createQueryBuilder('quiz')
      .leftJoinAndSelect('quiz.menu', 'menu')
      .select(['quiz', 'menu.id'])
      .where('menu.id = :id', { id: createQuizDto.menu })
      .getOne();
    if (dbQuiz)
      throw new BadRequestException('Quiz with this menu is already exist');

    return await this.quizRepository.save({
      ...createQuizDto,
      menu: await this.menuService.findOne(+createQuizDto.menu),
      createAt: new Date(),
    });
  }

  async findAll() {
    return await this.quizRepository.find();
  }

  async findOne(id: number) {
    return await this.quizRepository.findOne({
      where: { id: id },
      relations: ['questions', 'menu'],
    });
  }

  async update(id: number, updateQuizDto: UpdateQuizDto) {
    const dbQuiz = await this.findOne(id);
    if (!dbQuiz) throw new NotFoundException('Quiz with this id is not exist');

    await this.quizRepository.update(id, {
      ...updateQuizDto,
      menu: dbQuiz.menu,
    });
    return await this.findOne(id);
  }

  async remove(id: number) {
    const dbQuiz = await this.findOne(id);
    if (!dbQuiz) throw new NotFoundException('Quiz with this id is not exist');

    for await (const question of dbQuiz.questions) {
      await this.questionService.remove(question.id);
    }

    await this.unlinkMenuQuiz(dbQuiz.menu.id, id);

    return await this.quizRepository.save(dbQuiz);
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

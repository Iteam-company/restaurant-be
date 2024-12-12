import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { Question } from 'src/types/entity/question.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuizService } from '../quiz.service';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,

    @Inject(forwardRef(() => QuizService))
    private readonly quizService: QuizService,
  ) {}

  async create(createQuestionDto: CreateQuestionDto) {
    return await this.questionRepository.save({
      ...createQuestionDto,
      quiz: await this.quizService.findOne(createQuestionDto.quizId),
    });
  }

  async findAll() {
    return await this.questionRepository.find();
  }

  async findOne(id: number) {
    const dbQuestion = await this.questionRepository.findOneBy({ id });
    if (!dbQuestion)
      throw new NotFoundException('Question with this id is not exist ');

    return dbQuestion;
  }

  async update(id: number, updateQuestionDto: UpdateQuestionDto) {
    const dbQuestion = await this.findOne(id);
    if (!dbQuestion)
      throw new NotFoundException('Question with this id is not exist');

    await this.questionRepository.update(id, {
      ...updateQuestionDto,
      quiz: dbQuestion.quiz,
    });
    return await this.findOne(id);
  }

  async remove(id: number) {
    const dbQuestion = await this.findOne(id);
    if (!dbQuestion)
      throw new NotFoundException('Question with this id is not exist');

    dbQuestion.quiz = null;

    return await this.questionRepository.save(dbQuestion);
  }
}

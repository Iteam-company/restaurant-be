import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { Question } from 'src/types/entity/question.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuizService } from 'src/quiz/quiz.service';
import { questionsSeed, quizSeed } from 'src/types/seeds';
import PayloadType from 'src/types/PayloadType';

@Injectable()
export class QuestionService implements OnModuleInit {
  constructor(
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,

    @Inject(forwardRef(() => QuizService))
    private readonly quizService: QuizService,
  ) {}

  async onModuleInit() {
    await this.seed();
  }

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
    const dbQuestion = await this.questionRepository.findOne({
      where: { id },
      relations: ['quiz'],
    });
    if (!dbQuestion)
      throw new NotFoundException('Question with this id is not exist ');

    delete dbQuestion.correct;

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
    await this.questionRepository.save(dbQuestion);

    return await this.questionRepository.remove(dbQuestion);
  }

  async seed() {
    for await (const question of questionsSeed) {
      const isExist = await this.questionRepository.findOne({
        where: { text: question.text },
      });
      if (!isExist) {
        for await (const quiz of quizSeed) {
          if (quiz.title !== question.quizTitle) continue;

          const dbQuiz = await (
            await this.quizService.findAll(<PayloadType>{ role: 'admin' })
          ).find((elem) => elem.title === quiz.title);

          await this.questionRepository.save({ ...question, quiz: dbQuiz });

          console.log(`Question ${question.text} seeded`);
        }
      }
    }
  }
}

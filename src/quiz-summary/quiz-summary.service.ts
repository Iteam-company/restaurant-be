import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateQuizSummaryDto } from './dto/create-quiz-summary.dto';
import { Repository } from 'typeorm';
import { QuizSummary } from 'src/types/entity/quiz-summary.entity';
import { QuizService } from 'src/quiz/quiz.service';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class QuizSummaryService {
  constructor(
    @InjectRepository(QuizSummary)
    private readonly quizSummaryRepository: Repository<QuizSummary>,
    private readonly quizService: QuizService,
  ) {}

  async create(createQuizSummaryDto: CreateQuizSummaryDto) {
    const quiz = await this.quizService.findOneById(+createQuizSummaryDto.quiz);
    if (await this.findOneByQuizId(+createQuizSummaryDto.quiz, true))
      throw new BadRequestException('Quiz with this id is already has summary');

    return await this.quizSummaryRepository.save({
      ...createQuizSummaryDto,

      endDate: new Date(createQuizSummaryDto.endDate),
      quiz: quiz,
    });
  }

  async findOne(id: number) {
    const quizSummary = await this.quizSummaryRepository.findOneBy({ id });
    if (!quizSummary)
      throw new BadRequestException('Quiz summary with this id is not exist');

    return quizSummary;
  }

  async findOneByQuizId(id: number, isExist = false) {
    const quizSummary = await this.quizSummaryRepository
      .createQueryBuilder('quiz_summary')
      .leftJoinAndSelect('quiz_summary.quiz', 'quiz')
      .where('quiz_summary.quiz = :quizId', { quizId: id })
      .getOne();
    if (isExist) return quizSummary;

    if (!quizSummary)
      throw new BadRequestException('Quiz summary with this id is not exist');

    return quizSummary;
  }

  async remove(id: number) {
    const quizSummary = await this.findOne(id);

    return await this.quizSummaryRepository.remove(quizSummary);
  }
}

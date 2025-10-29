import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { Question } from 'src/types/entity/question.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Quiz } from 'src/types/entity/quiz.entity';
import { questionsSeed, quizSeed } from 'src/types/seeds';
import PayloadType from 'src/types/PayloadType';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,

    @InjectRepository(Quiz)
    private readonly quizRepository: Repository<Quiz>,
  ) {}

  async create(createQuestionDto: CreateQuestionDto) {
    const quiz = await this.findQuizById(createQuestionDto.quizId);
    return await this.questionRepository.save({
      ...createQuestionDto,
      quiz: quiz,
    });
  }

  async findAll() {
    return await this.questionRepository.find();
  }

  async findAllByQuizId(quizId: number) {
    const dbQuestions = await this.questionRepository.find({
      where: { quiz: { id: quizId } },
      relations: ['quiz'],
      select: ['id', 'text', 'variants', 'multipleCorrect', 'quiz'],
    });
    if (!dbQuestions)
      throw new NotFoundException('Questions with this quizId is not exist');

    return dbQuestions;
  }

  async findOne(id: number, user?: PayloadType) {
    const dbQuestion = await this.questionRepository.findOne({
      where: { id },
      relations: ['quiz'],
    });
    if (!dbQuestion)
      throw new NotFoundException('Question with this id is not exist ');

    if (user === undefined || user.role === 'waiter') delete dbQuestion.correct;

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

  @OnEvent('question.remove')
  async remove(id: number) {
    const dbQuestion = await this.findOne(id);
    if (!dbQuestion)
      throw new NotFoundException('Question with this id is not exist');

    dbQuestion.quiz = null;
    await this.questionRepository.save(dbQuestion);

    return await this.questionRepository.remove(dbQuestion);
  }

  private async findQuizById(id: number) {
    const quiz = await this.quizRepository.findOne({
      where: { id },
    });
    if (!quiz) throw new NotFoundException('Quiz with this id is not exist');
    return quiz;
  }

  private async findAllQuiz(user: PayloadType) {
    if (user.role === 'waiter')
      return await this.quizRepository.find({
        where: { status: 'in-progress' },
        relations: ['restaurants'],
      });
    return await this.quizRepository.find();
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
            await this.findAllQuiz(<PayloadType>{ role: 'admin' })
          ).find((elem) => elem.title === quiz.title);

          await this.questionRepository.save({ ...question, quiz: dbQuiz });

          console.log(`Question ${question.text} seeded`);
        }
      }
    }
  }
}

import { BadRequestException, Injectable } from '@nestjs/common';
import {
  CreateQuizResultDto,
  ResultAnswersDto,
} from './dto/create-quiz-result.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { QuizResult } from 'src/types/entity/quiz-result.entity';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { QuizService } from 'src/quiz/quiz.service';
import PayloadType from 'src/types/PayloadType';
import { quizResultSeed } from 'src/types/seeds';
import { Question } from 'src/types/entity/question.entity';
import SearchQueryDto from './dto/search-query.dto';
import { paginate } from 'nestjs-paginate';

@Injectable()
export class QuizResultsService {
  constructor(
    @InjectRepository(QuizResult)
    private quizResultsRepository: Repository<QuizResult>,

    private readonly userService: UserService,
    private readonly quizService: QuizService,
  ) {}

  async create(createQuizResultDto: CreateQuizResultDto, userId: number) {
    const dbQuiz = await this.quizService.findOneById(
      createQuizResultDto.quizId,
    );
    if (dbQuiz.status !== 'in-progress')
      throw new BadRequestException(
        'This quiz is not already started or is already finished',
      );

    const score = await this.checkAnswers(
      createQuizResultDto.answers,
      dbQuiz.questions,
    );

    delete dbQuiz.questions;

    return await this.quizResultsRepository.save({
      score,
      raitingDate: new Date(),
      user: await this.userService.getUserById(userId),
      quiz: dbQuiz,
    });
  }

  async findAll(user: PayloadType, restaurantId: number) {
    if (user.role !== 'waiter')
      return this.quizResultsRepository
        .createQueryBuilder('quizResult')
        .innerJoinAndSelect('quizResult.user', 'user')
        .innerJoinAndSelect('user.restaurant', 'restaurant')
        .innerJoinAndSelect('quizResult.quiz', 'quiz')
        .where('restaurant.id = :restaurantId', { restaurantId })
        .getMany();

    return await this.quizResultsRepository.find({
      where: {
        user: await this.userService.getUserById(user.id),
      },
    });
  }

  async findOne(id: number, user: PayloadType) {
    const dbQuizResult = await this.quizResultsRepository.findOne({
      where: {
        id,
        user:
          user.role === 'waiter'
            ? await this.userService.getUserById(user.id)
            : {},
      },
    });
    if (!dbQuizResult)
      throw new BadRequestException(
        'This user has no quiz finished with this id',
      );

    return dbQuizResult;
  }

  async search(query: SearchQueryDto, user: PayloadType) {
    const dbQuizResults = this.quizResultsRepository
      .createQueryBuilder('quizResult')
      .leftJoinAndSelect('quizResult.user', 'user')
      .leftJoinAndSelect('quizResult.quiz', 'quiz')
      .leftJoinAndSelect('user.workerRestaurants', 'workerRestaurants');

    if (query.restaurantId)
      dbQuizResults
        .leftJoin('user.workerRestaurants', 'workerRestaurants')
        .andWhere('workerRestaurants.id = :restaurantId', {
          restaurantId: query.restaurantId,
        });

    if (user && user.role === 'waiter')
      dbQuizResults.andWhere('user.id = :userId', { userId: user.id });

    return (
      await paginate(query, dbQuizResults, {
        sortableColumns: ['id'],
        searchableColumns: ['user.firstName', 'user.lastName', 'quiz.title'],
        relations: ['user', 'quiz'],
        select: [
          'id',
          'ratingDate',
          'score',
          'user.id',
          'user.firstName',
          'user.lastName',
          'quiz.id',
          'quiz.title',
          'quiz.difficultyLevel',
          'quiz.status',
        ],
      })
    ).data;
  }

  async remove(id: number) {
    const dbQuizResult = await this.quizResultsRepository.findOneBy({ id });
    if (!dbQuizResult)
      throw new BadRequestException('Finished quiz with this id is not exits');

    dbQuizResult.user = null;
    dbQuizResult.quiz = null;

    return await this.quizResultsRepository.remove(dbQuizResult);
  }

  async checkAnswers(answers: ResultAnswersDto[], questions: Question[]) {
    let correctAnswers = 0;
    let countCorrectAnswers = 0;

    for await (const question of questions) {
      const answer = await answers.find(
        (elem) => elem.questionId === question.id,
      );
      if (!answer)
        throw new BadRequestException(
          'Question with this id is no in quiz with this id',
        );

      for await (const ans of answer.answers)
        if (await question.correct.includes(ans)) correctAnswers += 1;

      countCorrectAnswers += question.correct.length;
    }

    return `${correctAnswers}/${countCorrectAnswers}`;
  }

  async seed() {
    for await (const quizResult of quizResultSeed) {
      const isExist = await this.quizResultsRepository.findOne({
        where: { score: quizResult.score },
      });
      if (!isExist) {
        const dbQuiz = await (
          await this.quizService.findAll(<PayloadType>{ role: 'admin' })
        ).find((elem) => elem.title === quizResult.quizTitle);

        const dbUser = await (
          await this.userService.getSearch({
            path: undefined,
            search: quizResult.username,
          })
        )[0];

        await this.quizResultsRepository.save({
          ...quizResult,
          quiz: dbQuiz,
          user: dbUser,
        });

        console.log(`Quiz result ${quizResult.quizTitle} seeded`);
      }
    }
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  UseGuards,
  Request,
  Query,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { QuizService } from './quiz.service';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import RequestType from 'src/types/RequestType';
import { OpenaiService } from 'src/openai/openai.service';
import AdminOwnerAccess from 'src/types/AdminOwnerAccess';
import { FilesInterceptor } from '@nestjs/platform-express';
import SearchQuizQueryDto from './dto/search-quiz-param.dt';
import GenerateQuizzesDto from './dto/generate-quizzes.dto';
import GenerateQuestionsDto from './dto/generate-questions.dto';

@ApiBearerAuth()
@Controller('quiz')
export class QuizController {
  constructor(
    private readonly quizService: QuizService,
    private readonly openaiService: OpenaiService,
  ) {}

  @Post()
  @AdminOwnerAccess()
  @UseGuards(AuthGuard)
  @ApiBody({ type: CreateQuizDto })
  async create(@Body() createQuizDto: CreateQuizDto) {
    return await this.quizService.create(createQuizDto);
  }

  @Get('search/')
  @UseGuards(AuthGuard)
  async search(@Query() query: SearchQuizQueryDto) {
    return await this.quizService.getSearch(query);
  }

  @Get('for-restaurant/:id')
  @UseGuards(AuthGuard)
  async findAllByRestaurant(@Param('id') id: string) {
    if (Number.isNaN(+id))
      throw new BadRequestException(`Param id: ${id} is not a number`);

    return await this.quizService.getAllByRestaurant(+id);
  }

  @Get()
  @UseGuards(AuthGuard)
  async findAll(@Request() req: RequestType) {
    return await this.quizService.findAll(req.user);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async findOne(@Param('id') id: string) {
    if (Number.isNaN(+id))
      throw new BadRequestException(`Param id: ${id} is not a number`);

    return await this.quizService.findOneById(+id);
  }

  @Patch(':id')
  @AdminOwnerAccess()
  @UseGuards(AuthGuard)
  @ApiBody({ type: UpdateQuizDto })
  async update(@Param('id') id: string, @Body() updateQuizDto: UpdateQuizDto) {
    if (Number.isNaN(+id))
      throw new BadRequestException(`Param id: ${id} is not a number`);

    return await this.quizService.update(+id, updateQuizDto);
  }

  @Delete(':id')
  @AdminOwnerAccess()
  @UseGuards(AuthGuard)
  async remove(@Param('id') id: string) {
    if (Number.isNaN(+id))
      throw new BadRequestException(`Param id: ${id} is not a number`);

    return await this.quizService.remove(+id);
  }

  @Get('generate/questions')
  @AdminOwnerAccess()
  @UseGuards(AuthGuard)
  @UseInterceptors(FilesInterceptor('files'))
  async getQuestions(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: GenerateQuestionsDto,
  ) {
    return await this.openaiService.generateQuestion(
      files,
      body.prompt,
      body.previousQuestions,
      body.count,
    );
  }

  @Get('generate/quiz')
  @AdminOwnerAccess()
  @UseGuards(AuthGuard)
  @UseInterceptors(FilesInterceptor('files'))
  async generateQuizzes(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: GenerateQuizzesDto,
  ) {
    return await this.openaiService.generateQuiz(
      files,
      body.prompt,
      body.count,
    );
  }
}

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
} from '@nestjs/common';
import { QuizService } from './quiz.service';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import AdminAccess from 'src/types/AdminAccess';
import { ApiBody } from '@nestjs/swagger';
import RequestType from 'src/types/RequestType';
import { OpenaiService } from './openai/openai.service';

@Controller('quiz')
export class QuizController {
  constructor(
    private readonly quizService: QuizService,
    private readonly openaiService: OpenaiService,
  ) {}

  @Post()
  @AdminAccess()
  @UseGuards(AuthGuard)
  @ApiBody({ type: CreateQuizDto })
  async create(@Body() createQuizDto: CreateQuizDto) {
    return await this.quizService.create(createQuizDto);
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
  async findOne(@Param('id') id: string, @Request() req: RequestType) {
    if (Number.isNaN(+id))
      throw new BadRequestException(`Param id: ${id} is not a number`);

    return await this.quizService.findOneValidate(+id, req.user);
  }

  @Patch(':id')
  @AdminAccess()
  @UseGuards(AuthGuard)
  @ApiBody({ type: UpdateQuizDto })
  async update(@Param('id') id: string, @Body() updateQuizDto: UpdateQuizDto) {
    if (Number.isNaN(+id))
      throw new BadRequestException(`Param id: ${id} is not a number`);

    return await this.quizService.update(+id, updateQuizDto);
  }

  @Delete(':id')
  @AdminAccess()
  @UseGuards(AuthGuard)
  async remove(@Param('id') id: string) {
    if (Number.isNaN(+id))
      throw new BadRequestException(`Param id: ${id} is not a number`);

    return await this.quizService.remove(+id);
  }

  @Patch(':menuId/:quizId')
  @AdminAccess()
  @UseGuards(AuthGuard)
  async linkQuizToMenu(
    @Param('menuId') menuId: string,
    @Param('quizId') quizId: string,
  ) {
    if (Number.isNaN(+menuId))
      throw new BadRequestException(`Param menuId: ${menuId} is not a number`);
    if (Number.isNaN(+quizId))
      throw new BadRequestException(`Param id: ${quizId} is not a number`);

    return await this.quizService.linkMenuQuiz(+menuId, +quizId);
  }

  @Delete(':menuId/:quizId')
  @AdminAccess()
  @UseGuards(AuthGuard)
  async unlinkQuizToMenu(
    @Param('menuId') menuId: string,
    @Param('quizId') quizId: string,
  ) {
    if (Number.isNaN(+menuId))
      throw new BadRequestException(`Param menuId: ${menuId} is not a number`);
    if (Number.isNaN(+quizId))
      throw new BadRequestException(`Param id: ${quizId} is not a number`);

    return await this.quizService.unlinkMenuQuiz(+menuId, +quizId);
  }

  @Get('generate/questions/:menuId')
  @AdminAccess()
  @UseGuards(AuthGuard)
  async getQuestions(
    @Param('menuId') menuId: number,
    @Query('count') count: number,
  ) {
    if (Number.isNaN(+menuId))
      throw new BadRequestException(`Param menuId: ${menuId} is not a number`);

    return await this.openaiService.getQuestions(menuId, count);
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { QuestionService } from './question.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import AdminOwnerAccess from 'src/types/AdminOwnerAccess';

@ApiBearerAuth()
@Controller('question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Post()
  @AdminOwnerAccess()
  @UseGuards(AuthGuard)
  async create(@Body() createQuestionDto: CreateQuestionDto) {
    return await this.questionService.create(createQuestionDto);
  }

  @Post('create-many')
  @AdminOwnerAccess()
  @UseGuards()
  @ApiBody({ type: [CreateQuestionDto] })
  async createMany(@Body() body: CreateQuestionDto[]) {
    const questions = [];

    for await (const question of body) {
      await questions.push(await this.questionService.create(question));
    }

    return questions;
  }

  @Get('by-quiz/:quizId')
  @UseGuards(AuthGuard)
  async findByQuizId(@Param('quizId') quizId: string) {
    if (Number.isNaN(+quizId))
      throw new BadRequestException(`Param quizId: ${quizId} is not a number`);

    return await this.questionService.findAllByQuizId(+quizId);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async findOne(@Param('id') id: string) {
    if (Number.isNaN(+id))
      throw new BadRequestException(`Param id: ${id} is not a number`);

    return await this.questionService.findOne(+id);
  }

  @Patch(':id')
  @AdminOwnerAccess()
  @UseGuards(AuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateQuestionDto: UpdateQuestionDto,
  ) {
    if (Number.isNaN(+id))
      throw new BadRequestException(`Param id: ${id} is not a number`);

    return await this.questionService.update(+id, updateQuestionDto);
  }

  @Delete(':id')
  @AdminOwnerAccess()
  @UseGuards(AuthGuard)
  async remove(@Param('id') id: string) {
    if (Number.isNaN(+id))
      throw new BadRequestException(`Param id: ${id} is not a number`);

    return await this.questionService.remove(+id);
  }
}

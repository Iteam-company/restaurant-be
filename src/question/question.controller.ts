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
  ParseIntPipe,
} from '@nestjs/common';
import { QuestionService } from './question.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import AdminOwnerAccess from 'src/types/AdminOwnerAccess';
import User from 'src/types/entity/user.entity';
import { CurrentUser } from 'src/types/decorators/current-user.decorator';

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
    const questions = await Promise.all(
      body.map(async (question) => await this.questionService.create(question)),
    );

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
  async findOne(
    @Param('id', ParseIntPipe) id: string,
    @CurrentUser() user: User,
  ) {
    return await this.questionService.findOne(+id, user);
  }

  @Patch(':id')
  @AdminOwnerAccess()
  @UseGuards(AuthGuard)
  async update(
    @Param('id', ParseIntPipe) id: string,
    @Body() updateQuestionDto: UpdateQuestionDto,
  ) {
    return await this.questionService.update(+id, updateQuestionDto);
  }

  @Delete(':id')
  @AdminOwnerAccess()
  @UseGuards(AuthGuard)
  async remove(@Param('id', ParseIntPipe) id: string) {
    return await this.questionService.remove(+id);
  }
}

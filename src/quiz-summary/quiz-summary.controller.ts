import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { QuizSummaryService } from './quiz-summary.service';
import { CreateQuizSummaryDto } from './dto/create-quiz-summary.dto';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import AdminOwnerAccess from 'src/types/AdminOwnerAccess';

@ApiBearerAuth()
@Controller('quiz-summary')
export class QuizSummaryController {
  constructor(private readonly quizSummaryService: QuizSummaryService) {}

  @Post()
  @AdminOwnerAccess()
  @UseGuards(AuthGuard)
  @ApiBody({ type: CreateQuizSummaryDto })
  async create(@Body() createQuizSummaryDto: CreateQuizSummaryDto) {
    return await this.quizSummaryService.create(createQuizSummaryDto);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async findOne(@Param('id') id: string) {
    if (Number.isNaN(+id))
      throw new BadRequestException(`Param id: ${id} is not a number`);

    return await this.quizSummaryService.findOne(+id);
  }
  @Get('/by-quiz/:id')
  @UseGuards(AuthGuard)
  async findOneByQuiz(@Param('id') id: string) {
    if (Number.isNaN(+id))
      throw new BadRequestException(`Param id: ${id} is not a number`);

    return await this.quizSummaryService.findOneByQuizId(+id);
  }

  @Delete(':id')
  @AdminOwnerAccess()
  @UseGuards(AuthGuard)
  async remove(@Param('id') id: string) {
    if (Number.isNaN(+id))
      throw new BadRequestException(`Param id: ${id} is not a number`);

    return await this.quizSummaryService.remove(+id);
  }
}

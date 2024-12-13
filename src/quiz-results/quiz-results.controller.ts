import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { QuizResultsService } from './quiz-results.service';
import { CreateQuizResultDto } from './dto/create-quiz-result.dto';
import AdminAccess from 'src/types/AdminAccess';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiBody } from '@nestjs/swagger';
import RequestType from 'src/types/RequestType';

@Controller('quiz-results')
export class QuizResultsController {
  constructor(private readonly quizResultsService: QuizResultsService) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiBody({ type: CreateQuizResultDto })
  async create(
    @Request() req: RequestType,
    @Body() createQuizResultDto: CreateQuizResultDto,
  ) {
    return await this.quizResultsService.create(
      createQuizResultDto,
      req.user.id,
    );
  }

  @Get()
  @UseGuards(AuthGuard)
  async findAll(@Request() req: RequestType) {
    return await this.quizResultsService.findAll(req.user);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async findOne(@Request() req: RequestType, @Param('id') id: string) {
    return await this.quizResultsService.findOne(+id, req.user);
  }

  @Delete(':id')
  @AdminAccess()
  @UseGuards(AuthGuard)
  async remove(@Param('id') id: string) {
    return this.quizResultsService.remove(+id);
  }
}

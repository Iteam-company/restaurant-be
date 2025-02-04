import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { QuizResultsService } from './quiz-results.service';
import { CreateQuizResultDto } from './dto/create-quiz-result.dto';
import AdminOwnerAccess from 'src/types/AdminOwnerAccess';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import RequestType from 'src/types/RequestType';
import SearchQueryDto from './dto/search-query.dto';

@ApiBearerAuth()
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

  @Get('/get-by-restaurant/:restaurantId')
  @UseGuards(AuthGuard)
  async findAll(
    @Request() req: RequestType,
    @Param('restaurantId') restaurantId: number,
  ) {
    return await this.quizResultsService.findAll(req.user, restaurantId);
  }

  @Get('search')
  @UseGuards(AuthGuard)
  async search(@Query() query: SearchQueryDto, @Request() req: RequestType) {
    return await this.quizResultsService.search(query, req.user);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async findOne(@Request() req: RequestType, @Param('id') id: string) {
    return await this.quizResultsService.findOne(+id, req.user);
  }

  @Delete(':id')
  @AdminOwnerAccess()
  @UseGuards(AuthGuard)
  async remove(@Param('id') id: string) {
    return this.quizResultsService.remove(+id);
  }
}

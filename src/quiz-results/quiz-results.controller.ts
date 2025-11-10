import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { QuizResultsService } from './quiz-results.service';
import { CreateQuizResultDto } from './dto/create-quiz-result.dto';
import AdminOwnerAccess from 'src/types/AdminOwnerAccess';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import SearchQueryDto from './dto/search-query.dto';
import User from 'src/types/entity/user.entity';
import { CurrentUser } from 'src/types/decorators/current-user.decorator';

@ApiBearerAuth()
@Controller('quiz-results')
export class QuizResultsController {
  constructor(private readonly quizResultsService: QuizResultsService) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiBody({ type: CreateQuizResultDto })
  async create(
    @CurrentUser() user: User,
    @Body() createQuizResultDto: CreateQuizResultDto,
  ) {
    return await this.quizResultsService.create(createQuizResultDto, user.id);
  }

  @Get('/get-by-restaurant/:restaurantId')
  @UseGuards(AuthGuard)
  async findAll(
    @CurrentUser() user: User,
    @Param('restaurantId') restaurantId: number,
  ) {
    return await this.quizResultsService.findAll(user, restaurantId);
  }

  @Get('search')
  @UseGuards(AuthGuard)
  async search(@Query() query: SearchQueryDto, @CurrentUser() user: User) {
    return await this.quizResultsService.search(query, user);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async findOne(@CurrentUser() user: User, @Param('id') id: string) {
    return await this.quizResultsService.findOne(+id, user);
  }

  @Delete(':id')
  @AdminOwnerAccess()
  @UseGuards(AuthGuard)
  async remove(@Param('id') id: string) {
    return this.quizResultsService.remove(+id);
  }
}

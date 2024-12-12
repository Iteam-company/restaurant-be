import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { QuestionService } from './question.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import AdminAccess from 'src/types/AdminAccess';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('quiz/question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Post()
  @AdminAccess()
  @UseGuards(AuthGuard)
  async create(@Body() createQuestionDto: CreateQuestionDto) {
    return await this.questionService.create(createQuestionDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.questionService.findOne(+id);
  }

  @Patch(':id')
  @AdminAccess()
  @UseGuards(AuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateQuestionDto: UpdateQuestionDto,
  ) {
    return await this.questionService.update(+id, updateQuestionDto);
  }

  @Delete(':id')
  @AdminAccess()
  @UseGuards(AuthGuard)
  async remove(@Param('id') id: string) {
    return await this.questionService.remove(+id);
  }
}

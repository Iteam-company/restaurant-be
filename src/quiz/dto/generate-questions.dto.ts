import { ApiProperty } from '@nestjs/swagger';
import { Question } from 'src/types/entity/question.entity';

class GenerateQuestionsDto {
  @ApiProperty({ description: 'Search by restaurant', required: false })
  prompt?: string;

  @ApiProperty({
    description: 'Count of quizzes(by default 5)',
    required: false,
  })
  count?: number;

  @ApiProperty({
    type: 'array',
    description:
      'Previous question based on this ai should not generate same questions',
    required: false,
  })
  previousQuestions?: Array<Question>;
}

export default GenerateQuestionsDto;

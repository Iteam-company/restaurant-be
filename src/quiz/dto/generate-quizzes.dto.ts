import { ApiProperty } from '@nestjs/swagger';

class GenerateQuizzesDto {
  @ApiProperty({ description: 'Search by restaurant', required: false })
  prompt?: string;

  @ApiProperty({
    description: 'Count of quizzes(by default 5)',
    required: false,
  })
  count?: number;
}

export default GenerateQuizzesDto;

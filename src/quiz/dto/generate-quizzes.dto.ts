import { ApiProperty } from '@nestjs/swagger';

class GenerateQuizzesDto {
  @ApiProperty({
    description: 'Array of files as data for ai to generate questions',
  })
  files: Express.Multer.File[];

  @ApiProperty({ description: 'Search by restaurant', required: false })
  prompt?: string;

  @ApiProperty({
    description: 'Count of quizzes',
    required: false,
  })
  count?: number;
}

export default GenerateQuizzesDto;

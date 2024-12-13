import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateQuizResultDto {
  @ApiProperty({ description: 'Quiz score', example: '10/10' })
  @IsString()
  @IsNotEmpty()
  score: string;

  @ApiProperty({ description: 'Quiz id which one did you go' })
  @IsNumber()
  @IsNotEmpty()
  quizId: number;
}

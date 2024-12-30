import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateQuizSummaryDto {
  @ApiProperty({ description: 'Best score user beat' })
  @IsString()
  @IsNotEmpty()
  bestScore: string;

  @ApiProperty({ description: 'Date when quiz is end' })
  @IsString()
  @IsNotEmpty()
  endDate: Date;

  @ApiProperty({ description: 'Time how much quiz was opened' })
  @IsString()
  @IsNotEmpty()
  duration: string;

  @ApiProperty({ description: 'Quiz id' })
  @IsNumber()
  @IsNotEmpty()
  quiz: number;
}

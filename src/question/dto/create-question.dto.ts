import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class CreateQuestionDto {
  @ApiProperty({ description: 'Question text' })
  @IsString()
  @IsNotEmpty()
  text: string;

  @ApiProperty({ description: 'Question variants' })
  @IsString({ each: true })
  @IsArray()
  @IsNotEmpty()
  variants: string[];

  @ApiProperty({ description: 'Question correct answers (indexes)' })
  @IsNumber({}, { each: true })
  @IsArray()
  @IsNotEmpty()
  correct: number[];

  @ApiProperty({ description: 'Id Question is multipty set true' })
  @IsBoolean()
  @IsNotEmpty()
  multipleCorrect: boolean;

  @ApiProperty({ description: 'Quiz id question for' })
  @IsNumber()
  @IsNotEmpty()
  quizId: number;
}

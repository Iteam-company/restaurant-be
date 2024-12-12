import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class CreateQuestionDto {
  @IsString()
  @IsNotEmpty()
  text: string;

  @IsString()
  @IsArray({ each: true })
  @IsNotEmpty()
  variants: string[];

  @IsNumber()
  @IsArray({ each: true })
  @IsNotEmpty()
  correct: number[];

  @IsBoolean()
  @IsNotEmpty()
  multipleCorrect: boolean;

  @IsNumber()
  @IsNotEmpty()
  quizId: number;
}

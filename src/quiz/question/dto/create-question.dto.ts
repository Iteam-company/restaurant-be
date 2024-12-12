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

  @IsString({ each: true })
  @IsArray()
  @IsNotEmpty()
  variants: string[];

  @IsNumber({}, { each: true })
  @IsArray()
  @IsNotEmpty()
  correct: number[];

  @IsBoolean()
  @IsNotEmpty()
  multipleCorrect: boolean;

  @IsNumber()
  @IsNotEmpty()
  quizId: number;
}

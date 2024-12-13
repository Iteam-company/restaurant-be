import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateQuizResultDto {
  @IsString()
  @IsNotEmpty()
  score: string;

  @IsNumber()
  @IsNotEmpty()
  quizId: number;
}

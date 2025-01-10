import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsNumber } from 'class-validator';

export class ResultAnswersDto {
  @ApiProperty({
    description: 'Id of question user answered',
  })
  @IsNumber()
  @IsNotEmpty()
  questionId: number;

  @ApiProperty({
    description: 'Answers',
    example: '[1, 2]',
  })
  @IsNumber()
  @IsNotEmpty()
  answers: number[];
}

export class CreateQuizResultDto {
  @ApiProperty({
    description: 'Answers',
    example:
      '[{ "questionId":1, "answers": [1,2] }, { "questionId":2, "answers": [3] }]',
  })
  @IsArray()
  @Type(() => ResultAnswersDto)
  @IsNotEmpty()
  answers: ResultAnswersDto[];

  @ApiProperty({ description: 'Quiz id which one did you go' })
  @IsNumber()
  @IsNotEmpty()
  quizId: number;
}

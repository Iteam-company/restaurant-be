import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

enum DeifficultyLevelEnum {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
}

enum StatuseEnum {
  IN_PROGRESS = 'in-progress',
  COMPLETED = 'completed',
  NOT_STARTED = 'not-started',
}

export class CreateQuizDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsEnum(DeifficultyLevelEnum)
  @IsNotEmpty()
  difficultyLevel: DeifficultyLevelEnum;

  @IsNumber()
  @IsNotEmpty()
  timeLimit: number;

  @IsEnum(StatuseEnum)
  @IsNotEmpty()
  status: StatuseEnum;

  @IsNumber()
  @IsNotEmpty()
  menuId: number;
}

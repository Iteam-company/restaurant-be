import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export enum DeifficultyLevelEnum {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
}

export enum StatuseEnum {
  IN_PROGRESS = 'in-progress',
  COMPLETED = 'completed',
  NOT_STARTED = 'not-started',
}

export class CreateQuizDto {
  @ApiProperty({ description: 'Quiz title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Quiz dificulty' })
  @IsEnum(DeifficultyLevelEnum)
  @IsNotEmpty()
  difficultyLevel: DeifficultyLevelEnum;

  @ApiProperty({ description: 'Time limit in minter' })
  @IsNumber()
  @IsNotEmpty()
  timeLimit: number;

  @ApiProperty({ description: 'Quiz status' })
  @IsEnum(StatuseEnum)
  @IsNotEmpty()
  status: StatuseEnum;

  @ApiProperty({ description: 'Menu id quiz for' })
  @IsNumber()
  @IsNotEmpty()
  menuId: number;
}

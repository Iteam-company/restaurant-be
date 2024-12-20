import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export enum DifficultyLevelEnum {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
}

export enum StatusEnum {
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
  @IsEnum(DifficultyLevelEnum)
  @IsNotEmpty()
  difficultyLevel: DifficultyLevelEnum;

  @ApiProperty({ description: 'Time limit in minter' })
  @IsNumber()
  @IsNotEmpty()
  timeLimit: number;

  @ApiProperty({ description: 'Quiz status' })
  @IsEnum(StatusEnum)
  @IsNotEmpty()
  status: StatusEnum;

  @ApiProperty({ description: 'Menu id quiz for' })
  @IsNumber()
  @IsNotEmpty()
  menuId: number;
}

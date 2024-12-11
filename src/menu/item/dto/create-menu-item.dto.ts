import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateMenuItemDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  ingredients: string;

  @IsString()
  @IsNotEmpty()
  timeForCook: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;
}

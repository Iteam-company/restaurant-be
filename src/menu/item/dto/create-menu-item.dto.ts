import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateMenuItemDto {
  @ApiProperty({ description: 'Menu item name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Description of item' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'Menu item ingredients' })
  @IsString()
  @IsNotEmpty()
  ingredients: string;

  @ApiProperty({ description: 'How much time a cook need to cook' })
  @IsString()
  @IsNotEmpty()
  timeForCook: string;

  @ApiProperty({ description: 'Price of this item' })
  @IsNumber()
  @IsNotEmpty()
  price: number;
}

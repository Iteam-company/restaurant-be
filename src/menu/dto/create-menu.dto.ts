import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

enum SeasonsEnum {
  SPRING = 'spring',
  SUMMER = 'summer',
  FALL = 'fall',
  WINTER = 'winter',
}

enum CategoriesEnum {
  APPETIZERS = 'appetizers',
  MAIN_COURSES = 'main courses',
  DESSERTS = 'desserts',
}

export class CreateMenuDto {
  @ApiProperty({ description: 'Menu name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Dish of what season' })
  @IsString()
  @IsEnum(SeasonsEnum)
  season: SeasonsEnum;

  @ApiProperty({ description: 'Dish of what category' })
  @IsString()
  @IsEnum(CategoriesEnum)
  categories: CategoriesEnum;
}

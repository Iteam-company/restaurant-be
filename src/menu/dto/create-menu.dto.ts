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
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsEnum(SeasonsEnum)
  season: SeasonsEnum;

  @IsString()
  @IsEnum(CategoriesEnum)
  categories: CategoriesEnum;
}

import { IsNotEmpty, IsNumber } from 'class-validator';

export default class LinkMenuItemDto {
  @IsNumber()
  @IsNotEmpty()
  menuId: number;

  @IsNumber()
  @IsNotEmpty()
  itemId: number;
}

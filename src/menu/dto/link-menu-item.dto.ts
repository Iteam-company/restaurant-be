import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export default class LinkMenuItemDto {
  @ApiProperty({ description: 'Id of menu what you need to link' })
  @IsNumber()
  @IsNotEmpty()
  menuId: number;

  @ApiProperty({ description: 'Id of item what you need to link' })
  @IsNumber()
  @IsNotEmpty()
  itemId: number;
}

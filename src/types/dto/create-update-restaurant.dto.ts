import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export default class CreateUpdateRestaurantDto {
  @ApiProperty({ description: 'Restaurant name' })
  @IsString()
  name: string | undefined;

  @ApiProperty({ description: 'Restaurant address' })
  @IsString()
  address: string | undefined;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export default class UpdateRestaurantDto {
  @ApiProperty({ description: 'Restaurant name' })
  @IsString()
  @IsOptional()
  name: string | undefined;

  @ApiProperty({ description: 'Restaurant address' })
  @IsString()
  @IsOptional()
  address: string | undefined;
}

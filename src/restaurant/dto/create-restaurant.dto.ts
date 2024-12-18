import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export default class CreateRestaurantDto {
  @ApiProperty({ description: 'Restaurant name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Restaurant address' })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({ description: 'Owner id' })
  @IsNumber()
  @IsNotEmpty()
  ownerId: number;
}

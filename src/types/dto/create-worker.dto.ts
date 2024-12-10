import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export default class CreateWorkerDto {
  @ApiProperty({ description: 'User id what need to add' })
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @ApiProperty({ description: 'Restaurant id to add user' })
  @IsNumber()
  @IsNotEmpty()
  restaurantId: number;
}

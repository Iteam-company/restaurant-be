import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export default class UpdateUserPasswordDto {
  @ApiProperty({ description: 'User id who need to change password' })
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @ApiProperty({ description: 'New user password' })
  @IsString()
  @IsNotEmpty()
  newPassword: string;
}

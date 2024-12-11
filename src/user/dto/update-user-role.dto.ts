import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export default class UpdateUserRoleDto {
  @ApiProperty({ description: 'User who need to change role' })
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @ApiProperty({ description: 'Role on what need to change' })
  @IsString()
  @IsNotEmpty()
  role: 'owner' | 'waiter' | 'admin';
}

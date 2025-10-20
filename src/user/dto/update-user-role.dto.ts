import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { UserRole } from 'src/types/entity/user.entity';

export default class UpdateUserRoleDto {
  @ApiProperty({ description: 'User who need to change role' })
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @ApiProperty({ description: 'Role on what need to change' })
  @IsEnum(UserRole)
  @IsNotEmpty()
  role: UserRole;
}

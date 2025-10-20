import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { UserRole } from 'src/types/entity/user.entity';

export default class CreateUserDto {
  @ApiProperty({ example: 'John', description: 'User first name' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Morgan', description: 'User last name' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ example: 'JMTheBest', description: 'Username must me unique' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: 'User role',
    enum: UserRole,
    example: 'waiter',
  })
  @IsString()
  @IsNotEmpty()
  role: UserRole;

  @ApiProperty({ example: 'JM@mail.com', description: 'User email' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '+380000000000', description: 'User phone number' })
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({ example: 'password', description: 'User password' })
  @IsString()
  @IsNotEmpty()
  password: string;
}

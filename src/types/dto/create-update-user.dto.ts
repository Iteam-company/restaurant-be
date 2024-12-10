import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export default class CreateUpdateUserDto {
  @ApiProperty({ example: 'John', description: 'User first name' })
  @IsString()
  firstName: string | undefined;

  @ApiProperty({ example: 'Morgan', description: 'User last name' })
  @IsString()
  lastName: string | undefined;

  @ApiProperty({ example: 'JMTheBest', description: 'Username must me unique' })
  @IsString()
  username: string | undefined;

  @ApiProperty({
    description: 'User role',
    enum: ['owner', 'waiter', 'admin'],
    example: 'waiter',
  })
  @IsString()
  role: 'owner' | 'waiter' | 'admin' | undefined;

  @ApiProperty({ example: 'JM@mail.com', description: 'User email' })
  @IsEmail()
  email: string | undefined;

  @ApiProperty({ example: '+380000000000', description: 'User phone number' })
  @IsString()
  phoneNumber: string | undefined;

  @ApiProperty({ example: 'password', description: 'User password' })
  @IsString()
  password: string | undefined;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export default class UpdateUserDto {
  @ApiProperty({ example: 'John', description: 'User first name' })
  @IsOptional()
  @IsString()
  firstName: string | undefined;

  @ApiProperty({ example: 'Morgan', description: 'User last name' })
  @IsOptional()
  @IsString()
  lastName: string | undefined;

  @ApiProperty({ example: 'JMTheBest', description: 'Username must me unique' })
  @IsOptional()
  @IsString()
  username: string | undefined;

  @ApiProperty({ example: 'JM@mail.com', description: 'User email' })
  @IsOptional()
  @IsEmail()
  email: string | undefined;

  @ApiProperty({ example: '+380000000000', description: 'User phone number' })
  @IsOptional()
  @IsString()
  phoneNumber: string | undefined;
}

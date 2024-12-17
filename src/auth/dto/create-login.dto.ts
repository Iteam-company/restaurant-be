import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export default class CreateLoginDto {
  @ApiProperty({ example: 'user', description: 'Username from user accaunt' })
  @IsString()
  @IsOptional()
  username: string;

  @ApiProperty({
    example: 'user@mail.com',
    description: 'Email from user accaunt',
  })
  @IsString()
  @IsOptional()
  email: string;

  @ApiProperty({
    example: '+380000000000',
    description: 'Phone number from user accaunt',
  })
  @IsString()
  @IsOptional()
  phoneNumber: string;

  @ApiProperty({
    example: 'password',
    description: 'password from user accaunt',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}

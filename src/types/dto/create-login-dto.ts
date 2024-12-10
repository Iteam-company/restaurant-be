import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export default class CreateLoginDto {
  @ApiProperty({ example: 'user', description: 'Username from user accaunt' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    example: 'password',
    description: 'password from user accaunt',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}

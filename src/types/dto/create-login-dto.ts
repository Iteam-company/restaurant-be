import { ApiProperty } from '@nestjs/swagger';

export default class CreateLoginDto {
  @ApiProperty({ example: 'user', description: 'Username from user accaunt' })
  username: string;

  @ApiProperty({
    example: 'password',
    description: 'password from user accaunt',
  })
  password: string;
}

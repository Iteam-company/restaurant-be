import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export default class RefreshTokenDto {
  @ApiProperty({
    example: 'token',
    description: 'Refresh token to update access token',
  })
  @IsString()
  @IsNotEmpty()
  refresh_token: string;
}

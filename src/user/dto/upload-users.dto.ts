import { IsNotEmpty, IsString } from 'class-validator';

export default class UploadUsersDto {
  @IsString()
  @IsNotEmpty()
  csv: string;
}

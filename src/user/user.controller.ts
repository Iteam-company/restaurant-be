import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBody } from '@nestjs/swagger';
import CreateUpdateUserDto from 'src/types/dto/create-update-user.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import RequestType from 'src/types/RequestType';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(AuthGuard)
  async getUser(@Request() req: RequestType) {
    return await this.userService.getUserById(req.user.id);
  }

  @Patch()
  @UseGuards(AuthGuard)
  @ApiBody({ type: CreateUpdateUserDto })
  async changeUser(
    @Request() req: RequestType,
    @Body() body: CreateUpdateUserDto,
  ) {
    return await this.userService.updateUser(req.user.id, body);
  }

  @Delete()
  @UseGuards(AuthGuard)
  async deleteUser(@Request() req: RequestType) {
    return await this.userService.removeUser(req.user.id);
  }
}

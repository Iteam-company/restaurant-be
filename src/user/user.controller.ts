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
import CreateUpdateUserDto from 'src/user/dto/update-user.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import RequestType from 'src/types/RequestType';
import AdminAccess from 'src/types/AdminAccess';
import UpdateUserPasswordDto from 'src/user/dto/update-user-password.dto';
import UpdateUserRoleDto from 'src/user/dto/update-user-role.dto';
import UseIconInterceptor from 'src/types/UseIconInterceptor';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(AuthGuard)
  @UseIconInterceptor()
  async getUser(@Request() req: RequestType) {
    console.log(req.imageUrl);
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

  @Patch('icon')
  @UseGuards(AuthGuard)
  @UseIconInterceptor()
  async changeIcon(@Request() req: RequestType) {
    return await this.userService.updateIcon(req.user.id, req.imageUrl);
  }

  @Patch('password')
  @AdminAccess()
  @UseGuards(AuthGuard)
  @ApiBody({ type: UpdateUserPasswordDto })
  async changePassword(@Body() body: UpdateUserPasswordDto) {
    return await this.userService.updatePassword(body);
  }

  @Patch('role')
  @AdminAccess()
  @UseGuards(AuthGuard)
  @ApiBody({ type: UpdateUserRoleDto })
  async changeRole(@Body() body: UpdateUserRoleDto) {
    return await this.userService.updateRole(body);
  }

  @Delete()
  @UseGuards(AuthGuard)
  async deleteUser(@Request() req: RequestType) {
    return await this.userService.removeUser(req.user.id);
  }
}

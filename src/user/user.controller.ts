import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import CreateUpdateUserDto from 'src/user/dto/update-user.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import RequestType from 'src/types/RequestType';
import UpdateUserPasswordDto from 'src/user/dto/update-user-password.dto';
import UpdateUserRoleDto from 'src/user/dto/update-user-role.dto';
import UseIconInterceptor from 'src/types/UseIconInterceptor';
import SearchQueryDto from './dto/search-param.dto';
import AdminOwnerAccess from 'src/types/AdminOwnerAccess';
import UseCsvInterceptor from 'src/types/UseCsvInterceptor';

@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('upload')
  @UseCsvInterceptor()
  @AdminOwnerAccess()
  @UseGuards(AuthGuard)
  async uploadCsv(@Request() req: RequestType) {
    return await this.userService.uploadUsers(req.fileData);
  }

  @Get()
  @UseGuards(AuthGuard)
  @UseIconInterceptor()
  async getUser(@Request() req: RequestType) {
    return await this.userService.getUserById(req.user.id);
  }

  @Get('one/:id')
  @AdminOwnerAccess()
  @UseGuards(AuthGuard)
  @UseIconInterceptor()
  async getOne(@Param('id') id: string) {
    if (Number.isNaN(+id))
      throw new BadRequestException(`Param id: ${id} is not a number`);

    return await this.userService.getUserById(+id);
  }

  @Get('search')
  @UseGuards(AuthGuard)
  async search(@Query() query: SearchQueryDto) {
    return await this.userService.getSearch(query);
  }

  @Get('download')
  @AdminOwnerAccess()
  @UseGuards(AuthGuard)
  async getCsv() {
    return await this.userService.getUserCsv();
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

  @Patch('/:id/admin')
  @AdminOwnerAccess()
  @UseGuards(AuthGuard)
  @ApiBody({ type: CreateUpdateUserDto })
  async changeAdminUser(
    @Body() body: CreateUpdateUserDto,
    @Param('id') id: string,
  ) {
    if (Number.isNaN(+id))
      throw new BadRequestException(`Param id: ${id} is not a number`);
    return await this.userService.updateUser(+id, body);
  }

  @Patch('icon')
  @UseGuards(AuthGuard)
  @UseIconInterceptor()
  async changeIcon(@Request() req: RequestType) {
    return await this.userService.updateIcon(req.user.id, req.imageUrl);
  }

  @Patch('icon/:id/admin')
  @UseGuards(AuthGuard)
  @UseIconInterceptor()
  async changeIconByAdmin(
    @Request() req: RequestType,
    @Param(':id') id: string,
  ) {
    if (Number.isNaN(+id))
      throw new BadRequestException(`Param id: ${id} is not a number`);
    return await this.userService.updateIcon(+id, req.imageUrl);
  }

  @Patch('password')
  @AdminOwnerAccess()
  @UseGuards(AuthGuard)
  @ApiBody({ type: UpdateUserPasswordDto })
  async changePassword(@Body() body: UpdateUserPasswordDto) {
    return await this.userService.updatePassword(body);
  }

  @Patch('role')
  @AdminOwnerAccess()
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

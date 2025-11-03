import {
  Body,
  Controller,
  forwardRef,
  Get,
  Inject,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import CreateUserDto from 'src/user/dto/create-user.dto';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import CreateLoginDto from 'src/auth/dto/create-login.dto';
import { AuthGuard } from './auth.guard';
import RequestType from 'src/types/RequestType';
import RefreshTokenDto from './dto/refresh-token.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,

    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  @Post('login')
  @ApiBody({ type: CreateLoginDto })
  async signIn(@Body() body: CreateLoginDto) {
    const payload = await this.userService.validateUser(
      body.username,
      body.email,
      body.phoneNumber,
      body.password,
    );
    return await this.authService.login(payload);
  }

  @Post('signup')
  @ApiBody({ type: CreateUserDto })
  async signUp(@Body() body: CreateUserDto) {
    return await this.userService.createUser(body);
  }

  @Post('refresh')
  async refreshToken(@Body() { refresh_token }: RefreshTokenDto) {
    return await this.authService.refresh(refresh_token);
  }

  @Post('logout')
  async logout(@Body() { refresh_token }: RefreshTokenDto) {
    return await this.authService.logout(refresh_token);
  }

  @ApiBearerAuth()
  @Get('me')
  @UseGuards(AuthGuard)
  async getMe(@Request() req: RequestType) {
    return { ...req.user, iat: undefined, exp: undefined };
  }
}

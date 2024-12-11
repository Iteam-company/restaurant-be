import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import CreateUserDto from 'src/user/dto/create-user.dto';
import { ApiBody } from '@nestjs/swagger';
import CreateLoginDto from 'src/auth/dto/create-login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('login')
  @ApiBody({ type: CreateLoginDto })
  async signIn(@Body() body: CreateLoginDto) {
    const payload = await this.userService.validateUser(
      body.username,
      body.password,
    );
    return await this.authService.login(payload);
  }

  @Post('signup')
  @ApiBody({ type: CreateUserDto })
  async signUp(@Body() body: CreateUserDto) {
    return await this.userService.createUser(body);
  }
}

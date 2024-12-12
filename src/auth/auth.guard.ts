import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';
import RequestType from 'src/types/RequestType';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
  ) {
    this.jwtService = jwtService;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isAdminOnly =
      this.reflector.get('isAdminOnly', context.getHandler()) ?? false;

    if (context.getType() === 'http')
      return await this.httpValidation(
        context.switchToHttp().getRequest(),
        isAdminOnly,
      );
    else if (context.getType() === 'ws')
      return await this.wsValidation(context.switchToWs().getClient());
    return true;
  }

  private async httpValidation(req: RequestType, isAdminOnly: boolean) {
    const auth = req.headers['authorization'] as string;
    if (auth && !auth.startsWith('Bearer ')) throw new UnauthorizedException();

    try {
      const payload = await this.validateToken(auth.split(' ')[1]);
      req.user = payload;
    } catch {
      throw new UnauthorizedException('JWT is not found in headers');
    }

    if (isAdminOnly && req.user.role !== 'admin')
      throw new ForbiddenException('No access');

    return true;
  }

  private async wsValidation(client: Socket) {
    const { authorization } = client.handshake.headers;
    const token: string = authorization.split(' ')[1];

    const payload = await this.validateToken(token);
    client.data.user = payload;

    return true;
  }

  private async validateToken(token: string) {
    try {
      return await this.jwtService.verifyAsync(token, {
        secret: new ConfigService().get('SECRET_KEY'),
      });
    } catch (err) {
      throw new BadRequestException(err);
    }
  }
}

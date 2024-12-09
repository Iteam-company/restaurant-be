import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {
    this.jwtService = jwtService;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (context.getType() === 'http')
      return await this.httpValidation(context.switchToHttp().getRequest());
    else if (context.getType() === 'ws')
      return await this.wsValidation(context.switchToWs().getClient());
    return true;
  }

  private async httpValidation(req: Request) {
    const auth = req.headers['authorization'] as string;
    if (auth && !auth.startsWith('Bearer ')) throw new UnauthorizedException();

    const payload = await this.validateToken(auth.split(' ')[1]);
    req['user'] = payload;

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
    return await this.jwtService.verifyAsync(token);
  }
}

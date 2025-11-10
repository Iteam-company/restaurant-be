import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard as PassportAuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard extends PassportAuthGuard('jwt') {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return super.canActivate(context);
  }
  // async canActivate(context: ExecutionContext): Promise<boolean> {
  //   if (!this.userService)
  //     this.userService = this.moduleRef.get(UserService, { strict: false });

  //   const isAdminOnly =
  //     this.reflector.get('isAdminOnly', context.getHandler()) ?? false;

  //   const isAdminOwnerOnly =
  //     this.reflector.get('isAdminOwnerOnly', context.getHandler()) ?? false;

  //   if (context.getType() === 'http')
  //     return await this.httpValidation(context.switchToHttp().getRequest(), {
  //       isAdminOnly,
  //       isAdminOwnerOnly,
  //     });
  //   else if (context.getType() === 'ws')
  //     return await this.wsValidation(context.switchToWs().getClient());
  //   return true;
  // }

  // private async httpValidation(
  //   req: RequestType,
  //   {
  //     isAdminOnly,
  //     isAdminOwnerOnly,
  //   }: { isAdminOwnerOnly: boolean; isAdminOnly: boolean },
  // ) {
  //   const auth = req.headers['authorization'] as string;
  //   if (auth && !auth.startsWith('Bearer '))
  //     throw new UnauthorizedException('JWT is not found in headers');

  //   try {
  //     const payload = await this.validateToken(auth.split(' ')[1]);
  //     req.user = payload;

  //     await this.userService.getUserById(payload.id);
  //   } catch {
  //     throw new UnauthorizedException('JWT is expired or not valid');
  //   }

  //   if (isAdminOnly && req.user.role !== 'admin')
  //     throw new ForbiddenException('No access');

  //   if (
  //     isAdminOwnerOnly &&
  //     !(req.user.role === 'admin' || req.user.role === 'owner')
  //   )
  //     throw new ForbiddenException('No access');

  //   return true;
  // }

  // private async wsValidation(client: Socket) {
  //   const { authorization } = client.handshake.headers;
  //   const token: string = authorization.split(' ')[1];

  //   const payload = await this.validateToken(token);
  //   client.data.user = payload;

  //   return true;
  // }

  // async validateToken(token: string) {
  //   try {
  //     return await this.jwtService.verifyAsync(token, {
  //       secret: this.configService.get('JWT_SECRET'),
  //     });
  //   } catch (err) {
  //     throw new BadRequestException(err);
  //   }
  // }
}

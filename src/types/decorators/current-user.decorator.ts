import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import User from '../entity/user.entity';
import RequestType from '../RequestType';

export type CurrentUserType = Omit<User, 'password'>;

export const CurrentUser = createParamDecorator(
  (
    data: keyof CurrentUserType | undefined,
    ctx: ExecutionContext,
  ): CurrentUserType => {
    const request: RequestType = ctx.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new Error('User not found in request');
    }

    return (data ? user?.[data] : user) as CurrentUserType;
  },
);

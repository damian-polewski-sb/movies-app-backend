import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetRefreshToken = createParamDecorator(
  (data: undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    return request.cookies['refreshToken'];
  },
);

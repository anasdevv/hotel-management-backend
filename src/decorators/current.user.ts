import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';

const getCurrentUserByContext = (context: ExecutionContext) =>
  context.switchToHttp().getRequest()?.user?.user ??
  context.switchToHttp().getRequest()?.user;

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) =>
    getCurrentUserByContext(context),
);

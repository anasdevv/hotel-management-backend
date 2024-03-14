import {
  Controller,
  Post,
  UseGuards,
  Request,
  UseInterceptors,
  Res,
} from '@nestjs/common';
import { LocalAuthGuard } from './guards/local.guard';
import { RemovePasswordInterceptor } from 'src/interceptors/remove.passwprd';
import { CurrentUser } from 'src/decorators/current.user';
import { User } from '@prisma/client';
import { AuthService } from './auth.service';
import { Response } from 'express';
@UseInterceptors(RemovePasswordInterceptor)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@CurrentUser() user: Omit<User, 'password'>) {
    return this.authService.login(user);
  }
}

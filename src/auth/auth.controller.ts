import {
  Controller,
  Post,
  UseGuards,
  Request,
  UseInterceptors,
  Res,
  HttpCode,
  Body,
} from '@nestjs/common';
import { LocalAuthGuard } from './guards/local.guard';
import { RemovePasswordInterceptor } from 'src/interceptors/remove.passwprd';
import { CurrentUser } from 'src/decorators/current.user';
import { User } from '@prisma/client';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { HTTP_CODE_METADATA } from '@nestjs/common/constants';
import { SignupUserDto } from './dto/signup.dto';
@UseInterceptors(RemovePasswordInterceptor)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@CurrentUser() user: Omit<User, 'password'>, response: Response) {
    return this.authService.login(user, response);
  }
  @Post('signup')
  create(@Body() signupUserDto: SignupUserDto) {
    return this.authService.signup(signupUserDto);
  }
  async logout(
    @Res({
      passthrough: true,
    })
    response: Response,
  ) {
    await this.authService.logout(response);
    return response.send({
      message: 'User logged out',
    });
  }
}

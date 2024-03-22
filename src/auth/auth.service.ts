import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { Response } from 'express';
import { TokenPayload } from './interface/token.payload';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}
  async login(user: Omit<User, 'password'>, response: Response) {
    const tokenPayload: TokenPayload = {
      email: user.email,
    };
    const expires = new Date();
    expires.setSeconds(
      expires.getSeconds() + this.configService.get('JWT_EXPIRATION'),
    );
    const token = await this.jwtService.signAsync(tokenPayload);
    response.cookie('Authentication', token, {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === 'production',
    });
  }
  async logout(response: Response) {
    console.log(response.cookie);
    response.cookie('Authentication', '', {
      expires: new Date(Date.now()),
    });
  }
}

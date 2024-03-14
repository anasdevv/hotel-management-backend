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
  async login(user: Omit<User, 'password'>) {
    const tokenPayload: TokenPayload = {
      email: user.email,
      role: user.role,
    };
    const expires = new Date();
    expires.setSeconds(
      expires.getSeconds() + this.configService.get('JWT_EXPIRATION'),
    );
    const token = await this.jwtService.signAsync(tokenPayload);
    return {
      ...user,
      token: {
        expiresIn: expires,
        access_token: token,
      },
    };
  }
}

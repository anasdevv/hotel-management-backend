import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { Response } from 'express';
import { TokenPayload } from './interface/token.payload';
import { SignupUserDto } from './dto/signup.dto';
import { UsersService } from 'src/users/users.service';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
    private usersService: UsersService,
    private prismaService: PrismaService,
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
      secure: false,
      // secure: this.configService.get('NODE_ENV') === 'production',
      sameSite: 'none',
    });
  }
  async signup({ password, ...res }: SignupUserDto) {
    await this.usersService.validateCreateUser(res.email);
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.prismaService.user.create({
      data: {
        ...res,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        phoneNumber: true,
      },
    });
  }
  async logout(response: Response) {
    console.log(response.cookie);
    response.cookie('Authentication', '', {
      expires: new Date(Date.now()),
    });
  }
}

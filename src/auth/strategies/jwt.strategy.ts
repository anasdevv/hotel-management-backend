import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/users/users.service';
import { TokenPayload } from '../interface/token.payload';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }
  async validate(payload: TokenPayload) {
    try {
      return this.usersService.getUser(payload);
    } catch (error) {
      throw new NotFoundException();
    }
  }
}

// jwtFromRequest: ExtractJwt.fromExtractors([
//   (request: any) => {
//     const [type, token] =
//       (
//         request.headers?.authorization ?? request?.headers.Authorization
//       )?.split(' ') ?? [];
//     return type === 'Bearer' ? token : undefined;
//   },
// ]),

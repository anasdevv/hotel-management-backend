import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UsersService } from 'src/users/users.service';
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      usernameField: 'email',
    });
  }
  async validate(email: string, password: string) {
    try {
      console.log('here');
      return await this.usersService.validateUser(email, password);
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException(error);
    }
  }
}

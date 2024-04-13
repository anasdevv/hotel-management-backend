import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';
@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}
  async create({ password, ...res }: CreateUserDto) {
    await this.validateCreateUser(res.email);
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.prisma.user.create({
      data: {
        ...res,
        password: hashedPassword,
      },
    });
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  findOne(id: string) {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: string) {
    return `This action removes a #${id} user`;
  }
  async validateCreateUser(email: string) {
    try {
      const res = await this.prisma.user.findUniqueOrThrow({
        where: {
          email,
        },
      });
    } catch (error) {
      return;
    }
    throw new UnprocessableEntityException('User already exists');
  }
  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found ! Try signing in');
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    delete user.password;
    return user;
  }
  async getUser({ email }: Prisma.UserWhereUniqueInput) {
    return this.prisma.user.findUniqueOrThrow({
      where: {
        email,
      },
    });
  }
}

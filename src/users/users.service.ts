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
import { BaseQuery } from 'src/utils/base.query';
import { UsersQuery } from './dto/query';
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

  async findAll({ pageNumber, pageSize, sort, orderBy, filter }: UsersQuery) {
    let query: Prisma.UserFindManyArgs = {
      where: {
        isDeleted: false,
      },
      orderBy: {
        [orderBy]: sort,
      },
    };
    const skip = pageNumber > 0 ? (pageNumber - 1) * pageSize : 0;
    if (orderBy) {
      if (orderBy === 'bookings') {
        query = {
          ...query,
          orderBy: {
            bookings: {
              _count: sort,
            },
          },
        };
      }
    }
    if (filter) {
      if (filter === 'with-booking')
        query = {
          ...query,
          where: {
            ...query.where,
            bookings: {
              some: {},
            },
          },
        };
      else if (filter === 'without-booking')
        query = {
          ...query,
          where: {
            ...query.where,
            bookings: {
              none: {},
            },
          },
        };
    }
    const [users, count] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        ...query,
        skip,
        take: pageSize,

        select: {
          id: true,
          name: true,
          country: true,
          email: true,
          bookings: {
            select: {
              totalPrice: true,
            },
          },
          _count: {
            select: {
              bookings: true,
            },
          },
        },
      }),

      this.prisma.user.count({
        where: query.where,
      }),
    ]);
    console.log(users);
    return {
      users: users.map((u) => ({
        ...u,
        fullName: u.name,
        totalSpending: u.bookings.reduce((acc, b) => acc + b.totalPrice, 0),
        // @ts-ignore
        totalBookings: u._count?.bookings || 0,
      })),
      count,
    };
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
      await this.prisma.user.findUniqueOrThrow({
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

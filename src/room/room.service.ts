import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { RoomFilter } from './dto/filter';

interface RoomQuery {
  orderBy: Prisma.RoomOrderByWithRelationInput;
  where: Prisma.RoomWhereInput;
}
@Injectable()
export class RoomService {
  private readonly sortOptions = {
    default: {}, // Default sorting order
    bookings: {
      orderBy: {
        bookings: {
          _count: 'desc',
        },
      },
    },
    name: {
      orderBy: {
        name: 'asc',
      },
    },
  };
  constructor(private readonly prisma: PrismaService) {}
  create({ features, ...room }: CreateRoomDto) {
    return this.prisma.room.create({
      data: {
        ...room,
        features: {
          connect: features.map((featureId) => ({ id: featureId })),
        },
      },
    });
  }

  // todo select relevant fields only
  async findAll({ pageNumber, pageSize, ...filter }: RoomFilter) {
    console.log(pageNumber);
    console.log(pageSize);
    const skip = pageNumber > 0 ? (pageNumber - 1) * pageSize : 0;
    let query: Prisma.RoomFindManyArgs = {
      orderBy: {},
      where: {
        isDeleted: false,
      },
    };
    if (filter.orderBy) {
      if (filter.orderBy === 'bookings') {
        query['orderBy'] = {
          Booking: {
            _count: filter.sort ?? 'desc',
          },
        };
      } else if (filter.orderBy === 'rating') {
        query['orderBy'] = {
          reviews: {
            _count: filter.sort ?? 'desc',
          },
        };
      } else {
        query['orderBy'] = {
          [filter.orderBy]: filter.sort,
        };
      }
    }
    if (filter.minPrice !== undefined && filter.maxPrice !== undefined) {
      query = {
        ...query,
        where: {
          ...query.where,
          AND: [
            { regularPrice: { gte: filter.minPrice } },
            { regularPrice: { lte: filter.maxPrice } },
          ],
        },
      };
    } else if (filter.minPrice !== undefined) {
      query = {
        ...query,
        where: {
          ...query.where,
          regularPrice: { gte: filter.minPrice },
        },
      };
    } else if (filter.maxPrice !== undefined) {
      query = {
        ...query,
        where: {
          ...query.where,
          regularPrice: { lte: filter.maxPrice },
        },
      };
    }
    if (filter.isBooked) {
      query = {
        ...query,
        where: {
          ...query.where,
          Booking: {
            some: {},
          },
        },
      };
    }
    const [rooms, count] = await this.prisma.$transaction([
      this.prisma.room.findMany({
        include: {
          features: true,
        },
        ...query,
        skip,
        take: pageSize,
      }),
      this.prisma.room.count({
        where: query.where,
      }),
    ]);
    return { rooms, count };
  }

  findOne(id: string) {
    try {
      return this.prisma.room.findFirstOrThrow({
        where: {
          AND: {
            id,
            isDeleted: false,
          },
        },
      });
    } catch (error) {
      throw new NotFoundException();
    }
  }

  async update(id: string, updateRoomDto: UpdateRoomDto) {
    try {
      await this.prisma.room.findFirstOrThrow({
        where: {
          AND: {
            id,
            isDeleted: false,
          },
        },
      });
      return this.prisma.room.update({
        where: { id },
        data: {
          ...updateRoomDto,
          features: {
            connect: updateRoomDto.features.map(
              (f) => f,
            ) as unknown as Prisma.FeatureWhereUniqueInput[],
          },
        },
      });
    } catch (error) {
      throw new NotFoundException();
    }
    // return `This action updates a #${id} room`;
  }

  async remove(id: string) {
    try {
      await this.prisma.room.findFirstOrThrow({
        where: { id },
      });
      return this.prisma.room.update({
        where: { id },
        data: {
          isDeleted: true,
        },
      });
    } catch (error) {
      throw new NotFoundException();
    }
  }
}

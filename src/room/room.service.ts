import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { RoomQuery } from './dto/query';

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
  async findAll({ pageNumber, pageSize, ...filter }: RoomQuery) {
    console.log('room query ', filter);
    // console.log(pageSize);
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
          booking: {
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
    if (filter.caps && filter.caps.length > 0) {
      console.log('filter . caps', filter.caps);
      query = {
        ...query,
        where: {
          maxCapacity: {
            in: filter.caps,
          },
        },
      };
    }
    if (filter.features && filter.features.length > 0) {
      console.log('filter . features', filter.features);
      query = {
        ...query,
        where: {
          features: {
            some: {
              id: {
                in: filter.features,
              },
            },
          },
        },
      };
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
    if (filter.discount && filter.discount !== 'all') {
      if (filter.discount === 'no-discount') {
        query = {
          ...query,
          where: {
            ...query.where,
            discount: {
              equals: 0,
            },
          },
        };
      } else if (filter.discount === 'with-discount') {
        query = {
          ...query,
          where: {
            ...query.where,
            discount: {
              gt: 0,
            },
          },
        };
      }
    }
    if (filter.isBooked) {
      query = {
        ...query,
        where: {
          ...query.where,
          booking: {
            some: {},
          },
        },
      };
    }
    console.log(query);
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

  async findOne(id: string, userId?: string) {
    try {
      // todo after authorization
      // const canAddOrUpdateReview = this.prisma.room.findFirst({
      //   where: {
      //     AND: {
      //       id,
      //       isDeleted: false,
      //     },
      //     booking: {
      //       some: {
      //         userId,
      //       },
      //     },
      //   },
      //   select: {
      //     reviews: {
      //       where: {
      //         userId,
      //       },
      //       select: {
      //         comment: true,
      //         rating: true,
      //         userId: true,
      //       },
      //     },
      //   },
      // });
      const [room, ratingAggregation] = await this.prisma.$transaction([
        this.prisma.room.findFirstOrThrow({
          where: {
            AND: {
              id,
              isDeleted: false,
            },
          },
          select: {
            maxCapacity: true,
            regularPrice: true,
            id: true,
            description: true,
            roomImage: true,
            title: true,
            discount: true,
            features: {
              select: {
                featureName: true,
                id: true,
              },
            },
            // reviews: {},
          },
        }),
        this.prisma.review.aggregate({
          where: {
            roomId: id,
          },
          _avg: {
            rating: true,
          },
          _count: true,
        }),
      ]);
      room['reviews'] = {
        count: ratingAggregation._count,
        rating: ratingAggregation?._avg?.rating ?? 0,
      };
      console.log('rating aggregation ', ratingAggregation);
      // await this.prisma.review.aggregate({
      //   where: {
      //     roomId: id,
      //   },
      //   _avg: {
      //     rating: true,
      //   },
      //   _count: true,
      // });
      // const room = await this.prisma.room.findFirstOrThrow({
      //   where: {
      //     AND: {
      //       id,
      //       isDeleted: false,
      //     },
      //   },
      //   select: {
      //     maxCapacity: true,
      //     regularPrice: true,
      //     id: true,
      //     description: true,
      //     roomImage: true,
      //     title: true,
      //     discount: true,
      //     features: {
      //       select: {
      //         featureName: true,
      //         id: true,
      //       },
      //     },
      //     reviews: {},
      //   },
      // });
      console.log('room ', room);
      return room;
    } catch (error) {
      throw new NotFoundException();
    }
  }
  findAllPreview() {
    return this.prisma.room.findMany({
      select: {
        title: true,
        id: true,
      },
      where: {
        isDeleted: false,
      },
    });
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
            connect: updateRoomDto.features.map((f) => ({
              id: f,
            })) as unknown as Prisma.FeatureWhereUniqueInput[],
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

  async count() {
    const c = await this.prisma.room.count();
    console.log('c ', c);
    return c;
  }
}

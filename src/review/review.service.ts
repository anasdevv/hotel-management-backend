import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ReviewService {
  // private readonly logger: Logger;
  constructor(private readonly prisma: PrismaService) {}
  create(userId: string, roomId: string, createReviewDto: CreateReviewDto) {
    return this.prisma.review.create({
      data: {
        ...createReviewDto,
        room: {
          connect: {
            id: roomId,
          },
        },
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  findAll(id: string, type: 'user' | 'room' = 'user') {
    let query = {};
    if (type === 'user') {
      query = {
        userId: id,
      };
    } else {
      query = {
        roomId: id,
      };
    }
    return this.prisma.review.findMany({
      select: {
        comment: true,
        id: true,
        rating: true,
        user: {
          select: {
            name: true,
          },
        },
      },
      where: {
        AND: [
          {
            isDeleted: false,
          },
          query,
        ],
      },
    });
  }

  async update(id: string, updateReviewDto: UpdateReviewDto) {
    try {
      await this.prisma.review.findFirstOrThrow({
        where: {
          AND: [
            {
              id,
            },
            {
              isDeleted: false,
            },
          ],
        },
      });
      return this.prisma.review.update({
        where: {
          id,
        },
        data: updateReviewDto,
      });
    } catch (error) {
      // this.logger.error(JSON.stringify(error));
      throw new NotFoundException();
    }
  }

  remove(id: string) {
    return this.prisma.review.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
      },
    });
  }
}

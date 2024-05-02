import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateFoodItemDto } from './dto/create-food-item.dto';
import { UpdateFoodItemDto } from './dto/update-food-item.dto';
import { Prisma, PrismaClient } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { FoodItemQuery } from './dto/FoodItem.query';

@Injectable()
export class FoodItemService {
  private readonly logger: Logger;
  constructor(private readonly prisma: PrismaService) {}
  create(createFoodItemDto: CreateFoodItemDto) {
    return this.prisma.foodItem.create({
      data: createFoodItemDto,
    });
  }

  async findAll({
    pageNumber,
    pageSize,
    orderBy,
    sort,
    search,
  }: FoodItemQuery) {
    const skip = pageNumber > 0 ? (pageNumber - 1) * pageSize : 0;
    let query: Prisma.FoodItemFindManyArgs = {
      orderBy: {
        createdAt: 'desc',
      },
      where: {
        isDeleted: false,
      },
    };
    if (orderBy && orderBy === 'price') {
      query = {
        ...query,
        orderBy: {
          price: sort,
        },
      };
    }
    if (search) {
      query = {
        ...query,
        where: {
          ...query.where,
          name: {
            contains: search,
            mode: 'insensitive',
          },
        },
      };
    }
    const [foodItems, count] = await this.prisma.$transaction([
      this.prisma.foodItem.findMany({
        ...query,
        skip,
        take: pageSize,
      }),
      this.prisma.foodItem.count({
        where: query.where,
      }),
    ]);
    return { foodItems, count };
  }

  findOne(id: string) {
    try {
      return this.prisma.foodItem.findFirstOrThrow({
        where: {
          AND: [{ id }, { isDeleted: false }],
        },
      });
    } catch (error) {
      console.log(error);
      throw new NotFoundException();
    }
  }

  async update(id: string, updateFoodItemDto: UpdateFoodItemDto) {
    try {
      await this.prisma.foodItem.findFirstOrThrow({
        where: {
          AND: [{ id }, { isDeleted: false }],
        },
      });
      return this.prisma.foodItem.update({
        where: {
          id: id,
        },
        data: updateFoodItemDto,
      });
    } catch (error) {
      this.logger.error(JSON.stringify(error));
      throw new NotFoundException();
    }
  }

  remove(id: string) {
    return this.prisma.foodItem.update({
      where: { id },
      data: {
        isDeleted: false,
      },
    });
  }
}

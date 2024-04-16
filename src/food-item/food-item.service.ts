import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateFoodItemDto } from './dto/create-food-item.dto';
import { UpdateFoodItemDto } from './dto/update-food-item.dto';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FoodItemService {
  private readonly logger: Logger;
  constructor(private readonly prisma: PrismaService) {}
  create(createFoodItemDto: CreateFoodItemDto) {
    return this.prisma.foodItem.create({
      data: createFoodItemDto,
    });
  }

  findAll() {
    return this.prisma.foodItem.findMany({
      where: {
        isDeleted: false,
      },
    });
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

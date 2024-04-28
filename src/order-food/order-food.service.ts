import { Injectable } from '@nestjs/common';
import { CreateOrderFoodDto } from './dto/create-order-food.dto';
import { UpdateOrderFoodDto } from './dto/update-order-food.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OrderFoodService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createOrderFoodDto: CreateOrderFoodDto) {
    const totalPrice = await this.prisma.foodItem.aggregate({
      _sum: { price: true },
      where: {
        id: {
          in: createOrderFoodDto.orders.map((o) => o.id),
        },
      },
    });

    return this.prisma.order.create({
      data: {
        Booking: {
          connect: {
            id: createOrderFoodDto.bookingId,
          },
        },
        User: {
          connect: {
            id: '123', //fetch id from jwt
          },
        },

        totalPrice: totalPrice._sum?.price || 0,
        items: {
          createMany: {
            data: createOrderFoodDto.orders.map((o) => ({
              quantity: o.quantity,
              foodItem: {
                connect: { id: o.id },
              },
            })),
          },
        },
      },
    });
  }

  findAll() {
    return this.prisma.order.findMany({});
  }

  findOne(id: string) {
    return `This action returns a #${id} orderFood`;
  }

  update(id: string, updateOrderFoodDto: UpdateOrderFoodDto) {
    return this.prisma.order.update({
      where: { id },
      data: {
        ...updateOrderFoodDto,
      },
    });
  }

  remove(id: string) {
    return `This action removes a #${id} orderFood`;
  }
}

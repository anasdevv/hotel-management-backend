import { Injectable } from '@nestjs/common';
import { CreateOrderFoodDto } from './dto/create-order-food.dto';
import { UpdateOrderFoodDto } from './dto/update-order-food.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OrderFoodService {
  constructor(private readonly prisma: PrismaService) {}
  async create(userId: string, createOrderFoodDto: CreateOrderFoodDto) {
    const items = await this.prisma.foodItem.findMany({
      where: {
        AND: [
          {
            id: {
              in: createOrderFoodDto.orders.map((o) => o.id),
            },
          },
          {
            isDeleted: false,
          },
        ],
      },
      select: {
        id: true,
        price: true,
      },
    });
    const booking = await this.prisma.booking.findFirst({
      where: {
        id: createOrderFoodDto.bookingId,
      },
      select: {
        totalPrice: true,
      },
    });
    let totalPrice = 0;

    for (const order of createOrderFoodDto.orders) {
      const item = items.find((item) => item.id === order.id);
      if (item) {
        totalPrice += item.price * order.quantity;
      }
    }
    await this.prisma.order.create({
      data: {
        Booking: {
          connect: {
            id: createOrderFoodDto.bookingId,
          },
        },
        User: {
          connect: {
            id: userId, //fetch id from jwt
          },
        },

        totalPrice,
        items: {
          createMany: {
            data: createOrderFoodDto.orders.map((o) => ({
              quantity: o.quantity,
              foodItemId: o.id, // Fix: Assign the foodItemId directly to o.id
            })),
          },
        },
      },
    });
    return this.prisma.booking.update({
      where: {
        id: createOrderFoodDto.bookingId,
      },
      data: {
        totalPrice: booking.totalPrice + totalPrice,
      },
      select: {
        id: true,
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

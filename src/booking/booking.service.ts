// import { Injectable } from '@nestjs/common';
// import { CreateBookingDto } from './dto/create-booking.dto';
// import { UpdateBookingDto } from './dto/update-booking.dto';

// @Injectable()
// export class BookingService {
//   create(createBookingDto: CreateBookingDto) {
//     return 'This action addss a new booking';
//   }

//   findAll() {
//     return `This action returns all booking`;
//   }

//   findOne(id: number) {
//     return `This action returns a #${id} booking`;
//   }

//   update(id: number, updateBookingDto: UpdateBookingDto) {
//     return `This action updates a #${id} booking`;
//   }

//   remove(id: number) {
//     return `This action removes a #${id} booking`;
//   }
// }
import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';

@Injectable()
export class BookingService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createBookingDto: CreateBookingDto) {
    await this.validateCreateBooking(
      createBookingDto.startDate,
      createBookingDto.endDate,
      createBookingDto.cabinId,
    );
    return this.prisma.booking.create({ data: createBookingDto });
  }

  findAll() {
    return this.prisma.booking.findMany();
  }

  findOne(id: number) {
    return this.prisma.booking.findUnique({ where: { id } });
  }

  async update(id: number, updateBookingDto: UpdateBookingDto) {
    const booking = await this.prisma.booking.findUnique({ where: { id } });
    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }

    return this.prisma.booking
      .update({
        where: { id },
        data: updateBookingDto,
      })
      .catch((error) => {
        throw new BadRequestException(error.message);
      });
  }

  async remove(id: number) {
    const booking = await this.prisma.booking.findUnique({ where: { id } });
    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }

    return this.prisma.booking
      .delete({ where: { id } })
      .then(() => `Booking with ID ${id} deleted successfully`)
      .catch((error) => {
        throw new BadRequestException(error.message);
      });
  }

  async validateCreateBooking(startDate: Date, endDate: Date, cabinId: number) {
    const existingBooking = await this.prisma.booking.findFirst({
      where: {
        AND: [
          { cabinId: cabinId },
          {
            OR: [
              { startDate: { lte: startDate }, endDate: { gte: startDate } },
              { startDate: { lte: endDate }, endDate: { gte: endDate } },
              { startDate: { gte: startDate }, endDate: { lte: endDate } },
            ],
          },
        ],
      },
    });
    if (existingBooking) {
      throw new UnprocessableEntityException('Booking conflict');
    }
  }
}

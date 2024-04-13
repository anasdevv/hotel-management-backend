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
      createBookingDto.roomId,
    );
    return this.prisma.booking.create({ data: createBookingDto });
  }

  findAll() {
    return this.prisma.booking.findMany();
  }

  findOne(id: string) {
    try {
      return this.prisma.booking.findUniqueOrThrow({ where: { id } });
    } catch (error) {
      throw new NotFoundException('User not found !');
    }
  }

  async update(id: string, updateBookingDto: UpdateBookingDto) {
    try {
      const booking = await this.prisma.booking.findUnique({ where: { id } });
      if (!booking) {
        throw new NotFoundException(`Booking with ID ${id} not found`);
      }
      if (updateBookingDto.startDate && updateBookingDto.endDate) {
        await this.validateCreateBooking(
          updateBookingDto.startDate,
          updateBookingDto.endDate,
          updateBookingDto.roomId,
        );
      }
      return this.prisma.booking.update({
        where: { id },
        data: updateBookingDto,
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: string) {
    try {
      const booking = await this.prisma.booking.findUnique({ where: { id } });
      if (!booking) {
        throw new NotFoundException(`Booking with ID ${id} not found`);
      }

      await this.prisma.booking.update({
        where: { id },
        data: {
          isDeleted: true,
        },
      });
      return `Booking with ID ${id} deleted successfully`;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async validateCreateBooking(startDate: Date, endDate: Date, roomId: string) {
    const existingBooking = await this.prisma.booking.findFirst({
      where: {
        AND: [
          { roomId },
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

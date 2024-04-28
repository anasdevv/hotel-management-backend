import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { BookingQuery } from './dto/query';
import { Prisma } from '@prisma/client';

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
  async recentBooking(days: number) {
    const currentDate = new Date();

    const startDateRange = new Date();
    startDateRange.setDate(currentDate.getDate() - days);
    const query: Prisma.BookingFindManyArgs = {
      where: {
        createdAt: {
          gte: startDateRange.toISOString(),
          lte: currentDate.toISOString(),
        },
      },
    };
    const [bookings, count] = await this.prisma.$transaction([
      this.prisma.booking.findMany({
        ...query,
        select: {
          createdAt: true,
          totalPrice: true,
          orders: {
            select: {
              totalPrice: true,
            },
          },
        },
      }),
      this.prisma.booking.count({
        where: query.where,
      }),
    ]);
    for (let i = 0; i < bookings.length; i++) {
      bookings[i]['extrasPrice'] = bookings[i]['orders'].reduce(
        (acc, o) => acc + o.totalPrice,
        0,
      );
    }
    console.log(bookings);

    return { bookings, count };
  }
  recentStays(days: number) {
    const currentDate = new Date();

    const startDateRange = new Date();
    startDateRange.setDate(currentDate.getDate() - days);
    return this.prisma.booking.findMany({
      where: {
        startDate: {
          gte: startDateRange.toISOString(),
          lte: currentDate.toISOString(),
        },
      },
      select: {
        numNights: true,
        status: true,
        user: {
          select: {
            name: true,
          },
        },
      },
    });
  }
  async findAll({
    pageNumber,
    pageSize,
    orderBy,
    sort,
    status,
    search,
  }: BookingQuery) {
    const skip = pageNumber > 0 ? (pageNumber - 1) * pageSize : 0;
    let query: Prisma.BookingFindManyArgs = {
      orderBy: {
        [orderBy]: sort,
      },
      where: {
        isDeleted: false,
      },
    };
    if (status && status !== 'all') {
      query = {
        ...query,
        where: {
          ...query.where,
          status: {
            contains: status,
            mode: 'insensitive',
          },
        },
      };
    }
    if (search) {
      query = {
        ...query,
        where: {
          ...query.where,
          OR: [
            {
              user: {
                name: {
                  contains: search,
                  mode: 'insensitive',
                },
              },
            },
            {
              user: {
                email: {
                  contains: search,
                  mode: 'insensitive',
                },
              },
            },
          ],
        },
      };
    }
    const [bookings, count] = await this.prisma.$transaction([
      this.prisma.booking.findMany({
        ...query,
        take: pageSize,
        skip,
        select: {
          status: true,
          startDate: true,
          endDate: true,
          numNights: true,
          totalPrice: true,
          checkinDate: true,
          checkoutDate: true,
          id: true,
          room: {
            select: {
              title: true,
            },
          },
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      }),
      this.prisma.booking.count({
        where: {
          ...query.where,
        },
      }),
    ]);
    console.log(query);
    // console.log(bookings);
    console.log('count', count);
    for (let i = 0; i < bookings.length; i++) {
      bookings[i]['roomName'] = bookings[i]['room']['title'];
      bookings[i]['guestName'] = bookings[i]['user']['name'];
      bookings[i]['guestEmail'] = bookings[i]['user']['email'];
    }
    return {
      bookings: bookings,
      count,
    };
  }

  async findOne(id: string) {
    try {
      const booking = await this.prisma.booking.findUniqueOrThrow({
        where: {
          id,
          isDeleted: false,
        },
        select: {
          createdAt: true,
          checkinDate: true,
          checkoutDate: true,
          endDate: true,
          orders: true,
          startDate: true,
          observations: true,
          hasBreakfast: true,
          id: true,
          numNights: true,
          amountPaid: true,
          room: {
            select: {
              title: true,
              regularPrice: true,
              discount: true,
            },
          },
          user: {
            select: {
              country: true,
              name: true,
              email: true,
              phoneNumber: true,
            },
          },
        },
      });
      const roomPrice =
        (booking.room.regularPrice - booking.room.discount) * booking.numNights;
      const extrasPrice = booking.orders.reduce((sum, acc) => {
        return sum + acc.totalPrice;
      }, 0);
      console.log(booking);
      return {
        ...booking,
        roomTitle: booking.room.title,
        roomPrice,
        totalPrice: roomPrice + extrasPrice,
        extrasPrice,
        orders: booking.orders,
        guestEmail: booking.user.email,
        guestName: booking.user.name,
        guestCountry: booking.user.country,
        guestPhoneNumber: booking.user.phoneNumber,
      };
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

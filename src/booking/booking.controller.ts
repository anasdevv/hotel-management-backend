import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { BookingQuery } from './dto/query';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { CurrentUser } from 'src/decorators/current.user';
import { User } from '@prisma/client';
@UseGuards(JwtAuthGuard)
@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  create(
    @CurrentUser() user: User,
    @Body() createBookingDto: CreateBookingDto,
  ) {
    console.log('ccc   ', createBookingDto);
    return this.bookingService.create(user.id, createBookingDto);
  }
  @Get('/user/:userId')
  findOneByUserid(@Param('userId') id: string) {
    return this.bookingService.findOneByUserId(id);
  }
  @Get('can-order-food')
  canOrderFood(@CurrentUser() user: User) {
    return this.bookingService.canOrderFood(user.id);
  }
  @Get('can-add-review/:roomId')
  canAddReview(@Param('roomid') roomId: string, @CurrentUser() user: User) {
    return this.bookingService.canAddReview(user.id, roomId);
  }

  @Get()
  findAll(@Query() query: BookingQuery) {
    return this.bookingService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookingService.findOne(id);
  }

  @Get('unavailable-date/:id')
  findUnavailableDates(@Param('id') roomId: string) {
    return this.bookingService.findUnavailableDates(roomId);
  }

  @Get('recent/:days')
  recentBookings(@Param('days') days: string) {
    return this.bookingService.recentBooking(+days);
  }
  @Get('recent-stays/:days')
  recentStays(@Param('days') days: string) {
    return this.bookingService.recentStays(+days);
  }
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookingDto: UpdateBookingDto) {
    console.log('update booking ', updateBookingDto);

    return this.bookingService.update(id, updateBookingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookingService.remove(id);
  }
}

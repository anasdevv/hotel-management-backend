import { PartialType } from '@nestjs/mapped-types';
import { CreateBookingDto } from './create-booking.dto';
import { Transform, TransformFnParams } from 'class-transformer';

export class UpdateBookingDto extends PartialType(CreateBookingDto) {
  @Transform(({ value }) => new Date(value))
  checkinDate: Date;
  @Transform(({ value }) => new Date(value))
  checkoutDate: Date;
}

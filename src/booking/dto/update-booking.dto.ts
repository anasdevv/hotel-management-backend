import { PartialType } from '@nestjs/mapped-types';
import { CreateBookingDto } from './create-booking.dto';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class UpdateBookingDto extends PartialType(CreateBookingDto) {
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  checkinDate: Date;
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  checkoutDate: Date;
}

import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  Validate,
} from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';
class BookingDates {
  startDate: Date;
  endDate: Date;
}
export class CreateBookingDto {
  @Transform(({ value }) => {
    console.log('start date ', value);
    return new Date(value);
  })
  @IsNotEmpty()
  startDate: Date;

  @Transform(({ value }) => new Date(value))
  @IsNotEmpty()
  endDate: Date;

  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  numNights: number;

  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(0)
  totalPrice: number;

  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  numGuests: number = 1;

  @IsString()
  status: string = 'not-confirmed';

  @IsString()
  roomId: string;

  @IsBoolean()
  hasBreakfast: boolean;

  @IsOptional()
  @IsString()
  observations: string;

  @Validate(BookingDatesValidator)
  bookingDates: BookingDates;
}

function BookingDatesValidator({ value }: TransformFnParams): boolean {
  const startDate: Date = value.startDate;
  const endDate: Date = value.endDate;

  // Check if startDate and endDate are valid Date objects
  if (!(startDate instanceof Date) || !(endDate instanceof Date)) {
    return false;
  }

  // Check if endDate is greater than startDate
  return endDate > startDate;
}

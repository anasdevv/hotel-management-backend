import { IsBoolean, IsInt, IsString, Min, Validate } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';
class BookingDates {
  startDate: Date;
  endDate: Date;
}
export class CreateBookingDto {
  @Transform(({ value }) => new Date(value))
  startDate: Date;

  @Transform(({ value }) => new Date(value))
  endDate: Date;

  @IsInt()
  @Min(1)
  numNights: number;

  @IsInt()
  @Min(0)
  totalPrice: number;

  @IsString()
  status: string;

  @IsString()
  userId: string;

  @IsString()
  roomId: string;

  @IsBoolean()
  hasBreakfast: boolean;

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

import { IsDate, IsInt, IsString } from 'class-validator';

export class CreateBookingDto {
  @IsDate()
  startDate: Date;

  @IsDate()
  endDate: Date;

  @IsInt()
  numNights: number;

  @IsInt()
  totalPrice: number;

  @IsString()
  status: string;

  @IsDate()
  checkinDate: Date;

  @IsDate()
  checkoutDate: Date;

  @IsInt()
  userId: number;

  @IsInt()
  roomId: number;
}

import { IsDate, IsInt, IsBoolean, IsString, IsNumber } from 'class-validator';

export class CreateBookingDto {
  @IsDate()
  created_at: Date;

  @IsDate()
  startDate: Date;

  @IsDate()
  endDate: Date;

  @IsInt()
  numNights: number;

  @IsInt()
  numGuests: number;

  @IsNumber()
  cabinPrice: number;

  @IsNumber()
  extrasPrice: number;

  @IsNumber()
  totalPrice: number;

  @IsString()
  status: string;

  @IsString()
  observations: string;

  @IsInt()
  cabinId: number;

  @IsInt()
  guestId: number;

  @IsBoolean()
  hasBreakfast: boolean;

  @IsDate()
  checkInDate: Date | null;

  @IsDate()
  checkOutDate: Date | null;

  @IsInt()
  dealId: number;

  @IsBoolean()
  hasSmoking: boolean;
}

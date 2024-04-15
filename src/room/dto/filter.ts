import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsIn,
  IsNumber,
  IsOptional,
  IsPositive,
} from 'class-validator';

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export class RoomFilter {
  @Transform(({ value }) => Number(value))
  @IsNumber({}, { message: ' "page" atrribute should be a number' })
  public pageNumber: number = 1;

  @Transform(({ value }) => Number(value))
  @IsNumber({}, { message: ' "pageSize" attribute should be a number ' })
  public pageSize: number = 5;

  @IsOptional()
  @IsIn(['bookings', 'price', 'rating', 'maxCapacity'])
  public orderBy?: 'bookings' | 'price' | 'rating' | 'maxCapacity';

  @IsEnum(SortOrder)
  @IsOptional()
  public sort?: SortOrder = SortOrder.DESC;

  @IsOptional()
  @IsBoolean()
  isBooked: Boolean;
  @Transform(({ value }) => Number(value))
  @IsOptional()
  @IsNumber()
  @IsPositive()
  minPrice?: number;
  @Transform(({ value }) => Number(value))
  @IsOptional()
  @IsNumber()
  @IsPositive()
  maxPrice?: number;
  //   price: PriceRange;
  //   @IsOptional()
  //   status: 'checked-in' | 'checked-out' | 'unconfirmed';
}

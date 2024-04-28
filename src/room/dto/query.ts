import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsIn,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { BaseQuery } from 'src/utils/base.query';

export class RoomQuery extends BaseQuery {
  @IsOptional()
  @IsIn(['bookings', 'regularPrice', 'rating', 'maxCapacity', 'createdAt'])
  public orderBy?: 'bookings' | 'regularPrice' | 'rating' | 'maxCapacity';

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
  @IsOptional()
  @IsString()
  discount: 'all' | 'with-discount' | 'no-discount';
  //   price: PriceRange;
  //   @IsOptional()
  //   status: 'checked-in' | 'checked-out' | 'unconfirmed';
}

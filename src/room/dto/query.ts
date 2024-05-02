import { Transform } from 'class-transformer';
import {
  IsArray,
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
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Transform(({ value }) => Number(value))
  maxPrice?: number;
  @IsOptional()
  @IsString()
  discount: 'all' | 'with-discount' | 'no-discount' = 'all';
  @IsOptional()
  @Transform((params) => {
    console.log('val ', params.value);
    if (params.value === '') return [];
    if (typeof params.value === 'string') return params.value.split(',');
    return params.value;
  })
  features: string[];
  @IsOptional()
  @Transform((params) => {
    console.log('val ', params.value);
    if (params.value === '') return [];
    if (typeof params.value === 'string')
      return params.value.split(',').map(Number);
    return params.value;
  })
  caps: number[];
}

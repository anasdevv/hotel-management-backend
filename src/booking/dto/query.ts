import { IsIn, IsOptional, IsString, isString } from 'class-validator';
import { BaseQuery } from 'src/utils/base.query';

export class BookingQuery extends BaseQuery {
  @IsOptional()
  @IsIn(['startDate', 'totalPrice'])
  orderBy: 'startDate' | 'totalPrice' | 'createdAt' = 'createdAt';
  @IsOptional()
  @IsIn(['all', 'checked-out', 'checked-in', 'unconfirmed'])
  status: 'all' | 'checked-out' | 'checked-in' | 'unconfirmed';

  @IsOptional()
  @IsString()
  search: string;
}

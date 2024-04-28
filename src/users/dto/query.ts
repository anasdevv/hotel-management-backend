import { IsIn, IsOptional } from 'class-validator';
import { BaseQuery } from 'src/utils/base.query';

export class UsersQuery extends BaseQuery {
  @IsOptional()
  @IsIn(['bookings', 'createdAt'])
  public orderBy?: 'bookings' | 'createdAt' = 'createdAt';

  @IsOptional()
  @IsIn(['all', 'with-booking', 'without-booking'])
  filter: string;
}

import { IsIn, IsOptional, IsString } from 'class-validator';
import { BaseQuery } from 'src/utils/base.query';

export class FoodItemQuery extends BaseQuery {
  @IsOptional()
  @IsIn(['price', 'createdAt'])
  public orderBy?: 'price' | 'createdAt' = 'createdAt';

  @IsOptional()
  @IsString()
  search: string;
}

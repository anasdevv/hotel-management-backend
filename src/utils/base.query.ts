import { Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';
export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}
export class BaseQuery {
  @Transform(({ value }) => Number(value))
  @IsNumber({}, { message: ' "page" atrribute should be a number' })
  public pageNumber: number = 1;

  @Transform(({ value }) => Number(value))
  @IsNumber({}, { message: ' "pageSize" attribute should be a number ' })
  public pageSize: number = 5;
  @IsEnum(SortOrder)
  @IsOptional()
  public sort?: SortOrder = SortOrder.DESC;
}
